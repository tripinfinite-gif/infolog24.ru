import { and, desc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { integrationOutbox } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import {
  DEFAULT_MAX_ATTEMPTS,
  EVENT_CHANNELS,
  type IntegrationChannel,
  type IntegrationEventType,
  type OutboxStatus,
} from "./registry";

/**
 * Записывает событие в outbox для всех каналов из реестра.
 * Возвращает количество созданных строк.
 *
 * Можно передать tx (Drizzle transaction) — тогда запись произойдёт
 * в той же транзакции, что и основное действие (создание заявки).
 * Это даёт ACID гарантию: либо и заявка, и outbox-события записаны,
 * либо ничего.
 *
 * Fail-safe: при любой ошибке БД (например миграция ещё не применена)
 * логируем warning, возвращаем 0. Бизнес-код продолжает работать.
 */
export async function emitEvent(
  eventType: IntegrationEventType,
  payload: Record<string, unknown>,
  options?: {
    /** Drizzle transaction для атомарной записи. */
    tx?: typeof db;
    /** Override channels (по умолчанию берём из реестра). */
    channels?: IntegrationChannel[];
    /** Max attempts override (default 5). */
    maxAttempts?: number;
  },
): Promise<number> {
  const channels = options?.channels ?? EVENT_CHANNELS[eventType];
  if (!channels || channels.length === 0) {
    logger.warn({ eventType }, "emitEvent: no channels configured");
    return 0;
  }

  const dbHandle = options?.tx ?? db;
  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;

  try {
    const rows = channels.map((channel) => ({
      eventType,
      payload,
      channel,
      status: "pending" as const,
      attempts: 0,
      maxAttempts,
      nextRetryAt: new Date(),
    }));

    const inserted = await dbHandle
      .insert(integrationOutbox)
      .values(rows)
      .returning({ id: integrationOutbox.id });

    logger.info(
      { eventType, channels, count: inserted.length },
      "Outbox event emitted",
    );
    return inserted.length;
  } catch (error) {
    logger.warn(
      { error, eventType },
      "emitEvent failed (likely missing migration) — event NOT scheduled",
    );
    return 0;
  }
}

/**
 * Загружает следующую партию событий, готовых к доставке.
 * Используется в cron-воркере.
 */
export async function fetchPendingEvents(limit = 50) {
  try {
    return await db
      .select()
      .from(integrationOutbox)
      .where(
        and(
          or(
            eq(integrationOutbox.status, "pending"),
            eq(integrationOutbox.status, "failed"),
          ),
          lte(integrationOutbox.nextRetryAt, new Date()),
        ),
      )
      .orderBy(integrationOutbox.createdAt)
      .limit(limit);
  } catch (error) {
    logger.warn({ error }, "fetchPendingEvents failed");
    return [];
  }
}

/**
 * Атомарно «забирает» событие в работу: переводит в in_progress,
 * только если оно ещё pending/failed. Это защита от двойной обработки
 * при параллельных воркерах.
 */
export async function claimEvent(id: string): Promise<boolean> {
  try {
    const result = await db
      .update(integrationOutbox)
      .set({
        status: "in_progress",
        attempts: sql`${integrationOutbox.attempts} + 1`,
      })
      .where(
        and(
          eq(integrationOutbox.id, id),
          or(
            eq(integrationOutbox.status, "pending"),
            eq(integrationOutbox.status, "failed"),
          ),
        ),
      )
      .returning({ id: integrationOutbox.id });
    return result.length > 0;
  } catch (error) {
    logger.warn({ error, id }, "claimEvent failed");
    return false;
  }
}

export async function markDelivered(id: string): Promise<void> {
  try {
    await db
      .update(integrationOutbox)
      .set({ status: "delivered", deliveredAt: new Date(), lastError: null })
      .where(eq(integrationOutbox.id, id));
  } catch (error) {
    logger.warn({ error, id }, "markDelivered failed");
  }
}

export async function markFailed(
  id: string,
  errorMessage: string,
  currentAttempts: number,
  maxAttempts: number,
  backoffMinutes: number[],
): Promise<void> {
  try {
    const isDead = currentAttempts >= maxAttempts;
    const status: OutboxStatus = isDead ? "dead" : "failed";
    const nextBackoff =
      backoffMinutes[Math.min(currentAttempts - 1, backoffMinutes.length - 1)] ?? 60;
    const nextRetryAt = new Date(Date.now() + nextBackoff * 60 * 1000);

    await db
      .update(integrationOutbox)
      .set({
        status,
        nextRetryAt,
        lastError: errorMessage.slice(0, 2000),
      })
      .where(eq(integrationOutbox.id, id));

    if (isDead) {
      logger.error(
        { id, errorMessage, attempts: currentAttempts },
        "Outbox event marked DEAD after max attempts",
      );
    }
  } catch (error) {
    logger.warn({ error, id }, "markFailed failed");
  }
}

/**
 * Для админ-панели: статистика по статусам.
 */
export async function getOutboxStats() {
  try {
    const result = await db
      .select({
        status: integrationOutbox.status,
        count: sql<number>`count(*)::int`,
      })
      .from(integrationOutbox)
      .groupBy(integrationOutbox.status);
    return result;
  } catch {
    return [];
  }
}

/**
 * Для админ-панели: последние мёртвые события (требуют ручного разбора).
 */
export async function getDeadEvents(limit = 50) {
  try {
    return await db
      .select()
      .from(integrationOutbox)
      .where(eq(integrationOutbox.status, "dead"))
      .orderBy(desc(integrationOutbox.updatedAt))
      .limit(limit);
  } catch {
    return [];
  }
}
