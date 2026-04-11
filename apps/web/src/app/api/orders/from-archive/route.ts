import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { createOrderFromArchive } from "@/lib/orders/from-archive";
import { ARCHIVE_LIMITS } from "@/lib/orders/archive-extractor";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * POST /api/orders/from-archive
 *
 * multipart/form-data поля:
 *   archive    — ZIP файл (обязательно)
 *   vehicleId  — UUID существующего ТС (опционально)
 *   zone       — mkad | ttk | sk (опционально, default mkad)
 *   type       — mkad_day | mkad_night | ttk | sk | temp (опционально)
 *   notes      — текст (опционально, до 1000 символов)
 *
 * Создаёт:
 *   1. Vehicle (если нет vehicleId, но есть OCR-данные из СТС/ПТС)
 *   2. Order со status='documents_pending'
 *   3. N документов в documents с привязкой к order
 *   4. Outbox события order_created + archive_uploaded для CRM/email/Bitrix
 *
 * Ответ:
 *   { ok: true, orderId, redirectTo, ... }
 *   { ok: false, error, message }
 */

const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal("").transform(() => undefined));

const inputSchema = z.object({
  vehicleId: optionalUuid,
  zone: z.enum(["mkad", "ttk", "sk"]).optional(),
  type: z
    .enum(["mkad_day", "mkad_night", "ttk", "sk", "temp"])
    .optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "unauthorized", message: "Нужна авторизация в личном кабинете." },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const archiveFile = formData.get("archive");

    if (!(archiveFile instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "no_file", message: "Файл архива не передан." },
        { status: 400 },
      );
    }

    if (archiveFile.size === 0) {
      return NextResponse.json(
        { ok: false, error: "empty_file", message: "Файл архива пустой." },
        { status: 400 },
      );
    }

    if (archiveFile.size > ARCHIVE_LIMITS.MAX_ARCHIVE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          error: "archive_too_large",
          message: `Размер архива не больше ${ARCHIVE_LIMITS.MAX_ARCHIVE_SIZE / 1024 / 1024} МБ.`,
        },
        { status: 400 },
      );
    }

    // Только zip — на старте. RAR/7z можно добавить позже.
    const lowerName = archiveFile.name.toLowerCase();
    if (!lowerName.endsWith(".zip")) {
      return NextResponse.json(
        {
          ok: false,
          error: "bad_format",
          message: "Сейчас поддерживаются только ZIP архивы. Заархивируйте документы в .zip и повторите.",
        },
        { status: 400 },
      );
    }

    // Парсим опциональные параметры
    const params = {
      vehicleId: formData.get("vehicleId")?.toString(),
      zone: formData.get("zone")?.toString(),
      type: formData.get("type")?.toString(),
      notes: formData.get("notes")?.toString(),
    };
    const parsed = inputSchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "validation",
          message: "Ошибка валидации параметров.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await archiveFile.arrayBuffer());

    const result = await createOrderFromArchive({
      userId: session.user.id,
      archiveBuffer: buffer,
      vehicleId: parsed.data.vehicleId,
      zone: parsed.data.zone as "mkad" | "ttk" | "sk" | undefined,
      type: parsed.data.type as
        | "mkad_day"
        | "mkad_night"
        | "ttk"
        | "sk"
        | "temp"
        | undefined,
      notes: parsed.data.notes,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      ...result,
      redirectTo: `/dashboard/orders/${result.orderId}`,
    });
  } catch (error) {
    logger.error({ error }, "from-archive endpoint failed");
    return NextResponse.json(
      {
        ok: false,
        error: "internal",
        message: "Внутренняя ошибка сервера. Попробуйте ещё раз или свяжитесь с менеджером.",
      },
      { status: 500 },
    );
  }
}
