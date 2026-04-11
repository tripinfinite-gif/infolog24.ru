"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  vehicles,
  orders,
  documents,
  permits,
} from "@/lib/db/schema";
import { parseArchive, type DocumentType } from "@/lib/documents/zip-parser";
import {
  findMissingDocuments,
  DOCUMENT_TYPE_LABELS,
  type OrderType,
  type OrderZone,
} from "@/lib/documents/required-docs";
import { calculatePartnerCommission } from "@/lib/partner/commission";
import { putObject, isError } from "@/lib/integrations/s3";
import * as partnersDAL from "@/lib/dal/partners";
import { logger } from "@/lib/logger";

// ── Входная схема (всё, кроме файла) ──────────────────────────────────────

const submitSchema = z.object({
  vehiclePlate: z.string().min(3).max(20),
  vehicleBrand: z.string().min(1).max(100),
  vehicleModel: z.string().min(1).max(100),
  vehicleVin: z.string().max(17).optional(),
  orderType: z.enum(["mkad_day", "mkad_night", "ttk", "sk", "temp"]),
  zone: z.enum(["mkad", "ttk", "sk"]),
  validFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).optional(),
});

// ── Результат ─────────────────────────────────────────────────────────────

export type SubmitPartnerArchiveResult =
  | {
      ok: true;
      orderId: string;
      status: "processing" | "documents_pending";
      missing: DocumentType[];
      missingLabels: string[];
      uploaded: number;
      rejected: { name: string; reason: string }[];
      commission: { basePrice: number; rate: number; commission: number };
    }
  | { ok: false; error: string; details?: unknown };

// ── Server Action ─────────────────────────────────────────────────────────

export async function submitPartnerArchive(
  formData: FormData,
): Promise<SubmitPartnerArchiveResult> {
  // 1) Авторизация
  let session;
  try {
    session = await requireRole("partner");
  } catch {
    return { ok: false, error: "Доступ только для партнёров" };
  }
  const partnerId = session.user.id;

  // 2) Парсинг полей формы
  const raw = Object.fromEntries(formData.entries());
  const archive = formData.get("archive");
  const parsed = submitSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Некорректные данные формы",
      details: parsed.error.flatten(),
    };
  }
  if (!(archive instanceof File) || archive.size === 0) {
    return { ok: false, error: "Архив с документами не загружен" };
  }
  if (archive.size > 50 * 1024 * 1024) {
    return { ok: false, error: "Размер архива превышает 50 МБ" };
  }
  const lowerName = archive.name.toLowerCase();
  if (!lowerName.endsWith(".zip")) {
    return { ok: false, error: "Поддерживаются только ZIP-архивы" };
  }

  // 3) Распаковка
  const buffer = Buffer.from(await archive.arrayBuffer());
  let parseResult;
  try {
    parseResult = await parseArchive(buffer);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Не удалось разобрать архив";
    return { ok: false, error: msg };
  }

  if (parseResult.files.length === 0) {
    return {
      ok: false,
      error: "В архиве не найдено подходящих файлов (PDF/JPG/PNG)",
    };
  }

  // 4) Поиск/создание ТС у партнёра
  const plate = parsed.data.vehiclePlate.trim().toUpperCase();
  const existing = await db.query.vehicles.findFirst({
    where: and(
      eq(vehicles.userId, partnerId),
      eq(vehicles.licensePlate, plate),
    ),
  });

  let vehicleId: string;
  if (existing) {
    vehicleId = existing.id;
  } else {
    const [created] = await db
      .insert(vehicles)
      .values({
        userId: partnerId,
        brand: parsed.data.vehicleBrand,
        model: parsed.data.vehicleModel,
        licensePlate: plate,
        vin: parsed.data.vehicleVin || null,
      })
      .returning();
    if (!created) return { ok: false, error: "Не удалось сохранить ТС" };
    vehicleId = created.id;
  }

  // 5) Расчёт комиссии и определение статуса заявки
  const orderType = parsed.data.orderType as OrderType;
  const zone = parsed.data.zone as OrderZone;
  const presentTypes = Array.from(
    new Set(parseResult.files.map((f) => f.type)),
  ).filter((t) => t !== "other") as DocumentType[];
  const missingReport = findMissingDocuments(presentTypes, orderType);
  const commissionResult = calculatePartnerCommission({ orderType, zone });
  const orderStatus: "processing" | "documents_pending" =
    missingReport.isComplete ? "processing" : "documents_pending";

  // 6) Транзакция: создать order + draft permit
  let orderId: string;
  try {
    orderId = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          userId: partnerId,
          vehicleId,
          type: orderType,
          zone,
          status: orderStatus,
          price: commissionResult.basePrice,
          notes: parsed.data.notes ?? null,
        })
        .returning();
      if (!order) throw new Error("Failed to create order");

      await tx.insert(permits).values({
        orderId: order.id,
        userId: partnerId,
        permitNumber: `DRAFT-${order.id.slice(0, 8).toUpperCase()}`,
        zone,
        type: orderType,
        validFrom: parsed.data.validFrom,
        validUntil: parsed.data.validUntil,
        status: "active",
      });

      return order.id;
    });
  } catch (err) {
    logger.error({ err, partnerId }, "Failed to create partner order");
    return { ok: false, error: "Не удалось создать заявку" };
  }

  // 7) Загрузка файлов на S3 и создание documents (вне транзакции)
  let uploaded = 0;
  const uploadFailures: { name: string; reason: string }[] = [];
  for (const file of parseResult.files) {
    const result = await putObject({
      userId: partnerId,
      fileName: file.name,
      body: file.content,
      contentType: file.mimeType,
    });
    if (isError(result)) {
      uploadFailures.push({ name: file.name, reason: result.error });
      continue;
    }
    try {
      await db.insert(documents).values({
        orderId,
        userId: partnerId,
        vehicleId,
        type: file.type,
        fileName: file.name,
        fileUrl: result.fileUrl,
        fileSize: result.size,
        mimeType: file.mimeType,
        status: "pending",
      });
      uploaded++;
    } catch (e) {
      logger.error({ err: e, file: file.name }, "Failed to insert document row");
      uploadFailures.push({
        name: file.name,
        reason: "Не удалось сохранить запись",
      });
    }
  }

  // 8) Создаём partner_referrals (pending-комиссия)
  try {
    await partnersDAL.createPartnerSubmission({
      partnerId,
      orderId,
      commission: commissionResult.commission,
      status: "pending",
    });
  } catch (err) {
    logger.error(
      { err, partnerId, orderId },
      "Failed to create partner submission referral",
    );
  }

  logger.info(
    {
      partnerId,
      orderId,
      status: orderStatus,
      uploaded,
      missing: missingReport.missing,
    },
    "Partner archive submitted",
  );
  revalidatePath("/partner/passes");
  revalidatePath("/partner");

  return {
    ok: true,
    orderId,
    status: orderStatus,
    missing: missingReport.missing,
    missingLabels: missingReport.missing.map((t) => DOCUMENT_TYPE_LABELS[t]),
    uploaded,
    rejected: [...parseResult.rejected, ...uploadFailures],
    commission: commissionResult,
  };
}
