import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import {
  consumeLinkingCode,
  generateLinkingCode,
  getLinkedTelegramId,
  linkTelegramAccount,
} from "@/lib/telegram/account-linking";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * GET — generate a linking code for the current authenticated user.
 * The user copies the code and sends it via the Telegram bot (/link CODE).
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const linked = await getLinkedTelegramId(session.user.id);
    const code = await generateLinkingCode(session.user.id);
    return NextResponse.json({
      code: code.code,
      expiresAt: code.expiresAt,
      alreadyLinked: Boolean(linked),
    });
  } catch (error) {
    logger.error({ error }, "Failed to generate linking code");
    return NextResponse.json(
      { error: "Failed to generate linking code" },
      { status: 500 },
    );
  }
}

const postSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
  telegramUserId: z
    .number()
    .int()
    .positive()
    .or(z.string().regex(/^\d+$/).transform(Number)),
});

/**
 * POST — consume a linking code and link telegram user to internal user.
 *
 * This endpoint is called from two places:
 *   1. The Telegram bot handler after a user sends /link CODE.
 *   2. A confirmation UI in the dashboard (not yet built).
 *
 * When called from the Telegram bot, authentication is provided by a
 * shared secret header `x-telegram-bot-secret` matching `TELEGRAM_BOT_TOKEN`.
 */
export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-telegram-bot-secret");
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // Allow either (a) authenticated session or (b) bot secret
    const session = await getSession();
    const isBotCall = Boolean(botToken && secret && secret === botToken);
    if (!session && !isBotCall) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const userId = await consumeLinkingCode(parsed.data.code);
    if (!userId) {
      return NextResponse.json(
        { error: "Код недействителен или устарел" },
        { status: 404 },
      );
    }

    await linkTelegramAccount(parsed.data.telegramUserId, userId);

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    logger.error({ error }, "Telegram link endpoint error");
    return NextResponse.json(
      { error: "Failed to link account" },
      { status: 500 },
    );
  }
}
