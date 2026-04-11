import { NextResponse, type NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import {
  extractFinePostanovlenie,
  extractVehicleDoc,
  isVisionEnabled,
} from "@/lib/chat/vision";
import { logger } from "@/lib/logger";

/**
 * P4.1 — OCR endpoint.
 *
 * Принимает multipart/form-data с полями:
 *   - image: File (jpeg/png/webp/heic, до 5 MB)
 *   - type:  "auto" | "vehicle" | "fine" (по умолчанию "auto")
 *
 * Ответ:
 *   200 { enabled: true, result: VehicleDoc | FinePostanovlenie }
 *   503 { enabled: false, message }   — фичефлаг выключен
 *   401 { error }                     — не авторизован
 *   400 { error }                     — битый запрос
 *   500 { error }                     — внутренняя ошибка
 *
 * Vision дорогой, поэтому endpoint строго:
 *  - проверяет фичефлаг (OPENAI_VISION_ENABLED === "true")
 *  - требует авторизацию (анонимам OCR не даём)
 *  - ограничивает размер до 5 MB и белый список MIME
 *
 * runtime: nodejs — нужен Buffer для base64-конвертации.
 */

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const;

export async function POST(req: NextRequest) {
  if (!isVisionEnabled()) {
    return NextResponse.json(
      {
        enabled: false,
        message:
          "OCR временно недоступен. Свяжитесь с менеджером для обработки документа: +7 (499) 110-55-49.",
      },
      { status: 503 },
    );
  }

  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Нужна авторизация для загрузки документа." },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");
    const docTypeRaw = formData.get("type");
    const docType =
      typeof docTypeRaw === "string" ? docTypeRaw : "auto";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Файл не найден в поле 'image'." },
        { status: 400 },
      );
    }
    if (file.size === 0) {
      return NextResponse.json(
        { error: "Пустой файл." },
        { status: 400 },
      );
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Файл больше 5 MB. Сожмите изображение и попробуйте снова." },
        { status: 400 },
      );
    }
    if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
      return NextResponse.json(
        { error: "Допустимые форматы: JPEG, PNG, WebP, HEIC." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64DataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    // auto: сначала пробуем как vehicle (СТС/ПТС — самый частый кейс).
    // Если модель говорит "unknown" либо низкая уверенность, пробуем
    // как постановление о штрафе. Это стоит 2 вызова gpt-4o в худшем
    // случае — терпимо, учитывая что клиент явно загрузил документ.
    let result;
    if (docType === "fine") {
      result = await extractFinePostanovlenie(base64DataUrl);
    } else if (docType === "vehicle") {
      result = await extractVehicleDoc(base64DataUrl);
    } else {
      const v = await extractVehicleDoc(base64DataUrl);
      if (v.documentType !== "unknown" && v.confidence !== "low") {
        result = v;
      } else {
        result = await extractFinePostanovlenie(base64DataUrl);
      }
    }

    logger.info(
      {
        userId: session.user.id,
        docType,
        resultType: result.documentType,
        confidence: result.confidence,
        fileSize: file.size,
      },
      "OCR extraction completed",
    );

    return NextResponse.json({ enabled: true, result });
  } catch (error) {
    logger.error({ error }, "OCR endpoint failed");
    return NextResponse.json(
      { error: "Не удалось обработать изображение. Попробуйте ещё раз." },
      { status: 500 },
    );
  }
}
