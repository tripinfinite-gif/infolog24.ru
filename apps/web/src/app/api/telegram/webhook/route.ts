import { type NextRequest, NextResponse } from "next/server";
import { webhookCallback } from "grammy/web";

import { createBot } from "@/lib/telegram/bot";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

// Cache the bot instance across warm invocations so we don't
// re-initialise middleware for every update.
let cachedBot: ReturnType<typeof createBot> | null = null;
let cachedHandler:
  | ((req: NextRequest) => Promise<Response>)
  | null = null;

function getHandler(): ((req: NextRequest) => Promise<Response>) | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;
  if (!cachedBot) {
    cachedBot = createBot(token);
    cachedHandler = webhookCallback(cachedBot, "std/http") as unknown as (
      req: NextRequest,
    ) => Promise<Response>;
  }
  return cachedHandler;
}

export async function POST(req: NextRequest) {
  const handler = getHandler();
  if (!handler) {
    logger.warn("Telegram webhook received but TELEGRAM_BOT_TOKEN is not set");
    return NextResponse.json(
      { ok: false, error: "Telegram bot not configured" },
      { status: 503 },
    );
  }

  try {
    return await handler(req);
  } catch (error) {
    logger.error({ error }, "Telegram webhook error");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
