import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import {
  endHandover,
  isHandoverActive,
  startHandover,
} from "@/lib/dal/chat-handover";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const startSchema = z.object({
  reason: z.string().max(500).optional(),
});

/**
 * P2.5 — Manual override менеджером.
 *
 * POST /api/admin/chat/{conversationId}/handover  → активировать перехват
 * DELETE /api/admin/chat/{conversationId}/handover → завершить перехват
 * GET /api/admin/chat/{conversationId}/handover    → проверить статус
 *
 * Доступ только менеджерам и админам.
 */

interface RouteContext {
  params: Promise<{ conversationId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireRole("admin", "manager");
    const { conversationId } = await params;
    const body = await req.json().catch(() => ({}));
    const parsed = startSchema.safeParse(body);
    const reason = parsed.success ? parsed.data.reason : undefined;

    const row = await startHandover(conversationId, session.user.id, reason);
    if (!row) {
      return NextResponse.json(
        { error: "Не удалось активировать handover" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, handoverId: row.id });
  } catch (error) {
    const message = (error as Error)?.message ?? "Unknown error";
    if (message === "Unauthorized" || message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    logger.error({ error }, "POST handover failed");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireRole("admin", "manager");
    const { conversationId } = await params;
    const ended = await endHandover(conversationId);
    return NextResponse.json({ success: true, ended });
  } catch (error) {
    const message = (error as Error)?.message ?? "Unknown error";
    if (message === "Unauthorized" || message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    logger.error({ error }, "DELETE handover failed");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireRole("admin", "manager");
    const { conversationId } = await params;
    const active = await isHandoverActive(conversationId);
    return NextResponse.json({ active });
  } catch (error) {
    const message = (error as Error)?.message ?? "Unknown error";
    if (message === "Unauthorized" || message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    logger.error({ error }, "GET handover failed");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
