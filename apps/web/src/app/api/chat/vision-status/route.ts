import { NextResponse } from "next/server";

import { isVisionEnabled } from "@/lib/chat/vision";

/**
 * P4.1 — публичный статус vision-функции.
 *
 * Чат-виджет дёргает при монтировании, чтобы понять, показывать ли
 * кнопку прикрепления фото документа. Если ключа нет или фичефлаг
 * выключен — кнопка скрыта, никаких серверных 503 в UX не всплывает.
 */

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ enabled: isVisionEnabled() });
}
