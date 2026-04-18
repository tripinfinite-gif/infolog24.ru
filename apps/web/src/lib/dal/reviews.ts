import { randomBytes } from "crypto";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { reviews, permits, orders } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import type { Review } from "@/lib/types";

/**
 * DAL для таблицы reviews.
 *
 * Жизненный цикл:
 *  1. createReviewRequest(orderId) — создаёт пустую запись status='pending' + token.
 *  2. getReviewByToken(token) — отдаёт запись публичной форме.
 *  3. submitReview(token, data) — заполняет authorName/rating/content + submittedAt.
 *  4. moderateReview(id, 'approved'|'rejected', moderatorId) — админ решение.
 *  5. listApprovedReviews() — для /reviews и главной.
 *  6. listReviewsForAdmin() — для /admin/reviews с фильтром.
 */

const TOKEN_BYTES = 32; // 32 байта hex = 64 символа (влезает в varchar(64))

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

/**
 * Существует ли уже review для данного заказа (в любом статусе).
 * Используется cron'ом чтобы не дублировать запросы.
 */
export async function reviewExistsForOrder(orderId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(eq(reviews.orderId, orderId))
    .limit(1);
  return Boolean(row);
}

/**
 * Создать запрос на отзыв (pending, пустой, с уникальным токеном).
 * Возвращает созданную запись. При конфликте токена повторяет до 3 раз.
 */
export async function createReviewRequest(input: {
  orderId: string;
  userId: string | null;
}): Promise<Review> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const [row] = await db
        .insert(reviews)
        .values({
          orderId: input.orderId,
          userId: input.userId,
          token: generateToken(),
          status: "pending",
        })
        .returning();
      if (!row) throw new Error("Failed to create review request");
      logger.info(
        { reviewId: row.id, orderId: input.orderId },
        "Review request created",
      );
      return row;
    } catch (err) {
      if (attempt === 2) throw err;
      // Крайне маловероятная коллизия 32-байтного токена — пробуем ещё раз.
      logger.warn({ err, attempt }, "Review token collision, retrying");
    }
  }
  throw new Error("Failed to create review request after retries");
}

/**
 * Получить запись по публичному токену. Используется формой /review/[token].
 */
export async function getReviewByToken(
  token: string,
): Promise<Review | null> {
  if (!token || token.length > 64) return null;
  const row = await db.query.reviews.findFirst({
    where: eq(reviews.token, token),
  });
  return row ?? null;
}

/**
 * Заполнить pending-отзыв данными от клиента.
 * Возвращает обновлённую запись или null если токен не найден / не pending.
 */
export async function submitReview(
  token: string,
  data: {
    authorName: string;
    company?: string | null;
    rating: number;
    content: string;
  },
): Promise<Review | null> {
  const existing = await getReviewByToken(token);
  if (!existing) return null;
  // Разрешаем отправку только пока запись pending и submittedAt пустой —
  // защита от повторной отправки той же ссылки.
  if (existing.status !== "pending" || existing.submittedAt) {
    return null;
  }

  const [row] = await db
    .update(reviews)
    .set({
      authorName: data.authorName.slice(0, 255),
      company: data.company ? data.company.slice(0, 255) : null,
      rating: Math.max(1, Math.min(5, Math.round(data.rating))),
      content: data.content.slice(0, 5000),
      submittedAt: new Date(),
    })
    .where(eq(reviews.id, existing.id))
    .returning();

  return row ?? null;
}

/**
 * Модерация: approve / reject.
 * Работает только для submitted-отзывов (те, где есть authorName и content).
 */
export async function moderateReview(
  id: string,
  status: "approved" | "rejected",
  moderatorId: string,
): Promise<Review | null> {
  const [row] = await db
    .update(reviews)
    .set({
      status,
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    })
    .where(eq(reviews.id, id))
    .returning();
  return row ?? null;
}

/**
 * Список одобренных отзывов для публичной страницы /reviews.
 */
export async function listApprovedReviews(params?: {
  limit?: number;
  offset?: number;
}): Promise<Review[]> {
  return db.query.reviews.findMany({
    where: eq(reviews.status, "approved"),
    orderBy: [desc(reviews.submittedAt), desc(reviews.createdAt)],
    limit: params?.limit ?? 100,
    offset: params?.offset ?? 0,
  });
}

/**
 * Сводка (для aggregateRating в JSON-LD).
 */
export async function getApprovedReviewsSummary(): Promise<{
  count: number;
  averageRating: number;
}> {
  const [row] = await db
    .select({
      count: count(),
      avg: sql<string>`COALESCE(AVG(${reviews.rating})::numeric(3,2), 0)`,
    })
    .from(reviews)
    .where(eq(reviews.status, "approved"));
  const c = row?.count ?? 0;
  const avg = row?.avg ? Number(row.avg) : 0;
  return { count: c, averageRating: avg };
}

/**
 * Список всех отзывов для админки с фильтром по статусу.
 * Включает только submitted отзывы (authorName != '') чтобы пустые
 * pending-заготовки не засоряли экран модерации.
 */
export async function listReviewsForAdmin(params?: {
  status?: "pending" | "approved" | "rejected";
  includePendingUnsubmitted?: boolean;
  limit?: number;
}): Promise<Review[]> {
  const conditions = [];
  if (params?.status) {
    conditions.push(eq(reviews.status, params.status));
  }
  if (!params?.includePendingUnsubmitted) {
    conditions.push(sql`${reviews.submittedAt} IS NOT NULL`);
  }

  return db.query.reviews.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(reviews.createdAt)],
    limit: params?.limit ?? 200,
  });
}

/**
 * Для cron: permits, выданные в окне [daysAgoMax, daysAgoMin] дней назад,
 * для которых ещё не создан review. Возвращает orderId + userId.
 */
export async function findOrdersAwaitingReviewRequest(params: {
  daysAgoMin: number; // включительно, ближний край (например, 2)
  daysAgoMax: number; // включительно, дальний край (например, 4)
}): Promise<Array<{ orderId: string; userId: string }>> {
  const { daysAgoMin, daysAgoMax } = params;

  // Permit выдан (createdAt) в окне и сам active. Выбираем orders
  // по permit.orderId, где ещё нет review.
  const rows = await db
    .select({
      orderId: permits.orderId,
      userId: permits.userId,
    })
    .from(permits)
    .innerJoin(orders, eq(orders.id, permits.orderId))
    .where(
      and(
        eq(permits.status, "active"),
        gte(
          permits.createdAt,
          sql`NOW() - ${sql.raw(`INTERVAL '${daysAgoMax} days'`)}`,
        ),
        lte(
          permits.createdAt,
          sql`NOW() - ${sql.raw(`INTERVAL '${daysAgoMin} days'`)}`,
        ),
        sql`NOT EXISTS (
          SELECT 1 FROM reviews r
          WHERE r.order_id = ${permits.orderId}
        )`,
      ),
    )
    .limit(500);

  // Уникализируем по orderId (если на заказ 2 пропуска — всё равно 1 запрос).
  const seen = new Set<string>();
  const result: Array<{ orderId: string; userId: string }> = [];
  for (const r of rows) {
    if (seen.has(r.orderId)) continue;
    seen.add(r.orderId);
    result.push({ orderId: r.orderId, userId: r.userId });
  }
  return result;
}
