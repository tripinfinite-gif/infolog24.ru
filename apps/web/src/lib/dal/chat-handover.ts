import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { chatHandovers } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

/**
 * P2.5 — Manual override менеджером.
 *
 * DAL для управления «перехватом» чата живым менеджером.
 * Когда есть строка с ended_at IS NULL для conversationId — ассистент
 * молчит, отвечает только человек.
 *
 * Все функции fail-safe: при ошибке БД (например, миграция ещё не
 * применена) возвращают «handover не активен», чтобы чат продолжал
 * работать как обычно.
 */

export async function isHandoverActive(
  conversationId: string,
): Promise<boolean> {
  if (!conversationId) return false;
  try {
    const rows = await db
      .select({ id: chatHandovers.id })
      .from(chatHandovers)
      .where(
        and(
          eq(chatHandovers.conversationId, conversationId),
          isNull(chatHandovers.endedAt),
        ),
      )
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    logger.warn(
      { error, conversationId },
      "isHandoverActive query failed (likely missing migration) — defaulting to false",
    );
    return false;
  }
}

export async function startHandover(
  conversationId: string,
  managerId: string,
  reason?: string,
): Promise<{ id: string } | null> {
  try {
    // Закрываем все предыдущие активные handover для этого чата (на всякий случай)
    await db
      .update(chatHandovers)
      .set({ endedAt: new Date() })
      .where(
        and(
          eq(chatHandovers.conversationId, conversationId),
          isNull(chatHandovers.endedAt),
        ),
      );

    const [row] = await db
      .insert(chatHandovers)
      .values({
        conversationId,
        managerId,
        reason: reason ?? null,
      })
      .returning({ id: chatHandovers.id });

    logger.info(
      { conversationId, managerId, handoverId: row?.id },
      "Chat handover started",
    );
    return row ?? null;
  } catch (error) {
    logger.error({ error, conversationId, managerId }, "startHandover failed");
    return null;
  }
}

export async function endHandover(
  conversationId: string,
): Promise<boolean> {
  try {
    const result = await db
      .update(chatHandovers)
      .set({ endedAt: new Date() })
      .where(
        and(
          eq(chatHandovers.conversationId, conversationId),
          isNull(chatHandovers.endedAt),
        ),
      )
      .returning({ id: chatHandovers.id });

    logger.info(
      { conversationId, closed: result.length },
      "Chat handover ended",
    );
    return result.length > 0;
  } catch (error) {
    logger.error({ error, conversationId }, "endHandover failed");
    return false;
  }
}

export async function getActiveHandovers(limit = 50) {
  try {
    return await db
      .select()
      .from(chatHandovers)
      .where(isNull(chatHandovers.endedAt))
      .orderBy(desc(chatHandovers.startedAt))
      .limit(limit);
  } catch (error) {
    logger.warn({ error }, "getActiveHandovers failed");
    return [];
  }
}
