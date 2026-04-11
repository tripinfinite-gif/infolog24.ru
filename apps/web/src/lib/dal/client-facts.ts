import { and, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/lib/db";
import { clientFacts } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

/**
 * P3.2 — Memory across sessions для AI-ассистента.
 *
 * Простой key-value memory store для фактов о клиенте, которые не вынесены
 * в основные таблицы кабинета. Например: «предпочитает звонить после 18»,
 * «лизинг через Газпромбанк», «фактический парк 27 машин», «всегда возит
 * сборные грузы».
 *
 * Все функции fail-safe: при ошибке БД (например, миграция ещё не
 * применена) логируют warning и возвращают пустое значение, чтобы чат
 * продолжал работать как обычно.
 */

export type ClientFact = {
  id: string;
  userId: string;
  key: string;
  value: string;
  source: string;
  updatedAt: Date;
};

export async function getFactsByUser(
  userId: string,
  limit = 100,
): Promise<ClientFact[]> {
  if (!userId) return [];
  try {
    const rows = await db
      .select({
        id: clientFacts.id,
        userId: clientFacts.userId,
        key: clientFacts.key,
        value: clientFacts.value,
        source: clientFacts.source,
        updatedAt: clientFacts.updatedAt,
      })
      .from(clientFacts)
      .where(eq(clientFacts.userId, userId))
      .orderBy(desc(clientFacts.updatedAt))
      .limit(limit);
    return rows;
  } catch (error) {
    logger.warn(
      { error, userId },
      "getFactsByUser failed (likely missing migration) — defaulting to []",
    );
    return [];
  }
}

export async function getFactByKey(
  userId: string,
  key: string,
): Promise<ClientFact | null> {
  if (!userId || !key) return null;
  try {
    const rows = await db
      .select({
        id: clientFacts.id,
        userId: clientFacts.userId,
        key: clientFacts.key,
        value: clientFacts.value,
        source: clientFacts.source,
        updatedAt: clientFacts.updatedAt,
      })
      .from(clientFacts)
      .where(and(eq(clientFacts.userId, userId), eq(clientFacts.key, key)))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    logger.warn(
      { error, userId, key },
      "getFactByKey failed (likely missing migration) — defaulting to null",
    );
    return null;
  }
}

export async function upsertFact(
  userId: string,
  key: string,
  value: string,
  source: string = "ai_chat",
): Promise<ClientFact | null> {
  if (!userId || !key) return null;
  try {
    const [row] = await db
      .insert(clientFacts)
      .values({
        userId,
        key,
        value,
        source,
      })
      .onConflictDoUpdate({
        target: [clientFacts.userId, clientFacts.key],
        set: {
          value,
          source,
          updatedAt: new Date(),
        },
      })
      .returning({
        id: clientFacts.id,
        userId: clientFacts.userId,
        key: clientFacts.key,
        value: clientFacts.value,
        source: clientFacts.source,
        updatedAt: clientFacts.updatedAt,
      });
    if (!row) return null;
    logger.info(
      { userId, key, source },
      "Client fact upserted",
    );
    return row;
  } catch (error) {
    logger.warn(
      { error, userId, key },
      "upsertFact failed (likely missing migration) — returning null",
    );
    return null;
  }
}

export async function deleteFact(
  userId: string,
  key: string,
): Promise<boolean> {
  if (!userId || !key) return false;
  try {
    const result = await db
      .delete(clientFacts)
      .where(and(eq(clientFacts.userId, userId), eq(clientFacts.key, key)))
      .returning({ id: clientFacts.id });
    const deleted = result.length > 0;
    if (deleted) {
      logger.info({ userId, key }, "Client fact deleted");
    }
    return deleted;
  } catch (error) {
    logger.warn(
      { error, userId, key },
      "deleteFact failed (likely missing migration) — returning false",
    );
    return false;
  }
}

export async function searchFacts(
  userId: string,
  query: string,
): Promise<ClientFact[]> {
  if (!userId || !query) return [];
  const pattern = `%${query}%`;
  try {
    const rows = await db
      .select({
        id: clientFacts.id,
        userId: clientFacts.userId,
        key: clientFacts.key,
        value: clientFacts.value,
        source: clientFacts.source,
        updatedAt: clientFacts.updatedAt,
      })
      .from(clientFacts)
      .where(
        and(
          eq(clientFacts.userId, userId),
          or(
            ilike(clientFacts.key, pattern),
            ilike(clientFacts.value, pattern),
          ),
        ),
      )
      .orderBy(desc(clientFacts.updatedAt))
      .limit(50);
    return rows;
  } catch (error) {
    logger.warn(
      { error, userId, query },
      "searchFacts failed (likely missing migration) — defaulting to []",
    );
    return [];
  }
}
