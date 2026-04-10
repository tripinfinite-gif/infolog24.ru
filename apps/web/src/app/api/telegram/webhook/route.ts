import { type NextRequest, NextResponse } from "next/server";
import { webhookCallback } from "grammy/web";

import { createBot } from "@/lib/telegram/bot";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    logger.warn("Telegram bot token not configured");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    const bot = createBot(token);
    const handler = webhookCallback(bot, "std/http");
    return handler(req);
  } catch (error) {
    logger.error({ error }, "Telegram webhook error");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export const runtime = "nodejs";
