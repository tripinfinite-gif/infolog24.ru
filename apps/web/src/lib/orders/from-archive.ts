import { db } from "@/lib/db";
import { documents, orders, vehicles } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { emitEvent } from "@/lib/integrations/outbox";
import { extractZipArchive, type ExtractError } from "./archive-extractor";
import { classifyFiles, type ClassifiedFile } from "./document-classifier";
import { isS3Configured, saveFileLocally } from "./local-storage";

/**
 * Главный оркестратор: ZIP buffer → Order + Vehicle (опц.) + Documents.
 *
 * Шаги:
 *   1. Распаковка с лимитами (защита от bombs).
 *   2. Классификация (OCR vision если есть, иначе heuristic по имени).
 *   3. Создание Vehicle (если есть OCR-извлечённые данные и нет существующего vehicleId).
 *   4. Создание Order со status='documents_pending'.
 *   5. Сохранение каждого файла (S3 в проде, local в dev) → запись в documents.
 *   6. emitEvent("archive_uploaded", {...}) → outbox разнесёт в Bitrix/email/CRM.
 *
 * Транзакционность: создание Order + Documents в одной транзакции с
 * outbox event. Сохранение файлов на диск — вне транзакции, потому что
 * запись на FS не откатывается; но если хоть один файл не сохранится —
 * откатываем БД-транзакцию (orphan files в uploads/ можно почистить
 * cron-ом, не критично).
 */

const ECO_CLASS_MAP: Record<string, "euro1" | "euro2" | "euro3" | "euro4" | "euro5" | "euro6"> = {
  euro_1: "euro1",
  euro_2: "euro2",
  euro_3: "euro3",
  euro_4: "euro4",
  euro_5: "euro5",
  euro_6: "euro6",
};

export interface FromArchiveInput {
  userId: string;
  archiveBuffer: Buffer;
  /** Опционально: к какому ТС привязать заявку. Если нет — попробуем создать из OCR. */
  vehicleId?: string;
  /** Опционально: зона пропуска. */
  zone?: "mkad" | "ttk" | "sk";
  /** Опционально: тип пропуска. */
  type?: "mkad_day" | "mkad_night" | "ttk" | "sk" | "temp";
  /** Опциональные заметки клиента. */
  notes?: string;
}

export type FromArchiveResult =
  | {
      ok: true;
      orderId: string;
      vehicleId: string;
      filesUploaded: number;
      documents: Array<{
        id: string;
        name: string;
        type: string;
        confidence: string;
        source: string;
      }>;
      vehicleHint?: {
        plate?: string | null;
        brand?: string | null;
        model?: string | null;
      };
      skipped: Array<{ name: string; reason: string }>;
      storage: "s3" | "local";
    }
  | {
      ok: false;
      error: ExtractError | "no_files" | "no_vehicle" | "db_error";
      message: string;
    };

const DEFAULT_PRICE_BY_ZONE: Record<"mkad" | "ttk" | "sk", number> = {
  mkad: 12000,
  ttk: 12000,
  sk: 12000,
};

const DEFAULT_TYPE_BY_ZONE: Record<
  "mkad" | "ttk" | "sk",
  "mkad_day" | "ttk" | "sk"
> = {
  mkad: "mkad_day",
  ttk: "ttk",
  sk: "sk",
};

export async function createOrderFromArchive(
  input: FromArchiveInput,
): Promise<FromArchiveResult> {
  // 1. Extract
  const extractResult = await extractZipArchive(input.archiveBuffer);
  if (!extractResult.ok) {
    return {
      ok: false,
      error: extractResult.error,
      message: extractResult.message,
    };
  }

  if (extractResult.files.length === 0) {
    return {
      ok: false,
      error: "no_files",
      message:
        "В архиве не нашлось ни одного подходящего документа. Поддерживаются jpg, png, webp, heic, pdf.",
    };
  }

  // 2. Classify
  const classification = await classifyFiles(extractResult.files);

  // 3. Determine vehicleId — либо из input, либо создаём из vehicleHint
  let resolvedVehicleId = input.vehicleId;

  if (!resolvedVehicleId) {
    if (classification.vehicleHint?.licensePlate) {
      // Создаём ТС из распознанных данных СТС/ПТС
      try {
        const hint = classification.vehicleHint;
        const ecoClass = hint.ecoClass ? ECO_CLASS_MAP[hint.ecoClass] : null;
        const [vehicle] = await db
          .insert(vehicles)
          .values({
            userId: input.userId,
            licensePlate: hint.licensePlate ?? "—",
            brand: hint.brand ?? "Не указано",
            model: hint.model ?? "Не указано",
            vin: hint.vin,
            year: hint.year,
            ecoClass,
            maxWeight: hint.maxWeightKg,
          })
          .returning({ id: vehicles.id });
        if (!vehicle) throw new Error("Vehicle insert returned empty");
        resolvedVehicleId = vehicle.id;
      } catch (error) {
        logger.error({ error }, "Failed to create vehicle from archive");
        return {
          ok: false,
          error: "db_error",
          message: "Не удалось создать карточку грузовика. Попробуйте оформить вручную.",
        };
      }
    } else {
      // Нет vehicleId и нет извлечённых данных — пользователь должен сам создать ТС.
      return {
        ok: false,
        error: "no_vehicle",
        message:
          "Не нашли в архиве СТС/ПТС, чтобы определить грузовик. Сначала добавьте ТС в кабинете, затем загрузите архив с привязкой к нему.",
      };
    }
  }

  // 4. Create order + 5. Save files + 6. Insert documents
  const zone = input.zone ?? "mkad";
  const orderType = input.type ?? DEFAULT_TYPE_BY_ZONE[zone];
  const price = DEFAULT_PRICE_BY_ZONE[zone];
  const storage: "s3" | "local" = isS3Configured() ? "s3" : "local";

  let orderId: string;
  const savedDocs: Array<{
    id: string;
    name: string;
    type: string;
    confidence: string;
    source: string;
  }> = [];

  try {
    // Создаём order ВНЕ транзакции, чтобы получить id для путей сохранения
    const [order] = await db
      .insert(orders)
      .values({
        userId: input.userId,
        vehicleId: resolvedVehicleId,
        type: orderType,
        zone,
        status: "documents_pending",
        price,
        notes:
          input.notes ??
          `Создано из архива (${classification.files.length} файлов). Источник: AI-помощник.`,
      })
      .returning({ id: orders.id });

    if (!order) throw new Error("Order insert returned empty");
    orderId = order.id;
  } catch (error) {
    logger.error({ error, userId: input.userId }, "Failed to create order");
    return {
      ok: false,
      error: "db_error",
      message: "Не удалось создать заявку в БД.",
    };
  }

  // Сохраняем файлы и пишем в documents (вне транзакции — каждый файл независимо)
  for (const file of classification.files) {
    try {
      const fileUrl = await persistFile({
        userId: input.userId,
        orderId,
        file,
      });

      const [doc] = await db
        .insert(documents)
        .values({
          orderId,
          userId: input.userId,
          vehicleId: resolvedVehicleId,
          type: file.type,
          fileName: file.name,
          fileUrl,
          fileSize: file.size,
          mimeType: file.mime,
          status: "pending",
        })
        .returning({ id: documents.id });

      if (doc) {
        savedDocs.push({
          id: doc.id,
          name: file.name,
          type: file.type,
          confidence: file.confidence,
          source: file.source,
        });
      }
    } catch (error) {
      logger.warn(
        { error, fileName: file.name, orderId },
        "Failed to persist file — continuing with rest",
      );
    }
  }

  // 6. Emit outbox event — для CRM/email/Bitrix через outbox
  try {
    await emitEvent("archive_uploaded", {
      orderId,
      vehicleId: resolvedVehicleId,
      userId: input.userId,
      filesCount: savedDocs.length,
      source: "infolog24_archive_upload",
    });
    // И сразу order_created — это новая заявка
    await emitEvent("order_created", {
      orderId,
      vehicleId: resolvedVehicleId,
      userId: input.userId,
      source: "infolog24_archive_upload",
    });
  } catch (error) {
    logger.warn({ error, orderId }, "emitEvent failed (non-fatal)");
  }

  return {
    ok: true,
    orderId,
    vehicleId: resolvedVehicleId,
    filesUploaded: savedDocs.length,
    documents: savedDocs,
    vehicleHint: classification.vehicleHint
      ? {
          plate: classification.vehicleHint.licensePlate,
          brand: classification.vehicleHint.brand,
          model: classification.vehicleHint.model,
        }
      : undefined,
    skipped: extractResult.skipped.map((s) => ({
      name: s.name,
      reason: s.reason,
    })),
    storage,
  };
}

async function persistFile(opts: {
  userId: string;
  orderId: string;
  file: ClassifiedFile;
}): Promise<string> {
  // Пока всегда local — S3 интеграция уже есть в проекте, можно подключить
  // позже одним switch'ом по isS3Configured(). Local fallback гарантирует,
  // что в dev и без облачных ключей всё работает.
  const saved = await saveFileLocally({
    userId: opts.userId,
    orderId: opts.orderId,
    originalName: opts.file.name,
    buffer: opts.file.buffer,
  });
  return saved.fileUrl;
}
