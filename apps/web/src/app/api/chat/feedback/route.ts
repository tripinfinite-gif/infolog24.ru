import { db } from "@/lib/db";
import { chatFeedback } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/chat/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messageId?: string;
      rating?: string;
      conversationId?: string;
    };

    const messageId = typeof body.messageId === "string" ? body.messageId.slice(0, 128) : null;
    const rating = body.rating === "up" || body.rating === "down" ? body.rating : null;

    if (!messageId || !rating) {
      return new Response(
        JSON.stringify({ error: "messageId and rating (up|down) required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await getSession();
    const userId = session?.user?.id ?? null;
    const ip = getClientIp(req);
    const conversationId =
      typeof body.conversationId === "string"
        ? body.conversationId.slice(0, 64)
        : null;

    await db.insert(chatFeedback).values({
      messageId,
      rating,
      conversationId,
      userId,
      ip,
    });

    logger.info(
      { messageId, rating, userId, ip },
      "Chat feedback received",
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error({ error }, "Chat feedback error");
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
