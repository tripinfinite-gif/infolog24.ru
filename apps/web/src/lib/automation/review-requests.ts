import { logger } from "@/lib/logger";
import {
  createReviewRequest,
  findOrdersAwaitingReviewRequest,
} from "@/lib/dal/reviews";
import { dispatchNotification } from "@/lib/notifications/dispatcher";
import { absoluteUrl } from "@/lib/utils/base-url";

/**
 * Автозапрос отзыва после выдачи пропуска.
 *
 * Алгоритм:
 *   1. Найти заказы, у которых permits.createdAt между 2 и 4 дня назад
 *      и для которых ещё нет записи в reviews.
 *   2. Для каждого создать review (pending + token) и отправить клиенту
 *      email «Как прошло оформление? Оцените нас» со ссылкой
 *      {SITE_URL}/review/{token}.
 *
 * Защита:
 *   - findOrdersAwaitingReviewRequest исключает заказы с существующим review,
 *     так что двойной запрос за 3 дня в одно и то же окно не создаст дублей.
 *   - Если dispatchNotification упал — запись review уже создана, повторный
 *     запуск cron не отправит второй email (т.к. reviewExistsForOrder вернёт true).
 *     Это осознанный trade-off: лучше не напомнить лишний раз, чем слать дубликат.
 */
export async function requestReviewsForIssuedPermits(): Promise<{
  candidates: number;
  created: number;
  notified: number;
  failed: number;
}> {
  logger.info("Running review request automation (permits 2–4 days ago)...");

  let created = 0;
  let notified = 0;
  let failed = 0;

  let candidates: Array<{ orderId: string; userId: string }> = [];
  try {
    candidates = await findOrdersAwaitingReviewRequest({
      daysAgoMin: 2,
      daysAgoMax: 4,
    });
  } catch (err) {
    logger.error({ err }, "Failed to find orders awaiting review request");
    return { candidates: 0, created: 0, notified: 0, failed: 0 };
  }

  logger.info(
    { candidates: candidates.length },
    "Review request candidates found",
  );

  for (const c of candidates) {
    try {
      const review = await createReviewRequest({
        orderId: c.orderId,
        userId: c.userId,
      });
      created++;

      const reviewUrl = absoluteUrl(`/review/${review.token}`);

      const result = await dispatchNotification({
        userId: c.userId,
        type: "review_request",
        data: {
          reviewUrl,
          orderId: c.orderId,
        },
      });

      if (result.succeeded.length > 0) {
        notified++;
      } else {
        logger.warn(
          { reviewId: review.id, userId: c.userId },
          "Review request created but notification dispatch produced no success",
        );
      }
    } catch (err) {
      failed++;
      logger.warn(
        { err, orderId: c.orderId },
        "Review request creation failed — continuing",
      );
    }
  }

  const summary = {
    candidates: candidates.length,
    created,
    notified,
    failed,
  };
  logger.info(summary, "Review request automation complete");
  return summary;
}
