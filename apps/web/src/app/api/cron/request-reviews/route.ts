import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { requestReviewsForIssuedPermits } from "@/lib/automation/review-requests";

/**
 * GET /api/cron/request-reviews
 *
 * Автозапрос отзывов: находит permits, выданные 2–4 дня назад, для которых
 * ещё нет review, создаёт pending-запись с токеном и шлёт клиенту email
 * со ссылкой на форму.
 *
 * Запускается внешним cron'ом раз в сутки. Окно 2–4 дня гарантирует,
 * что один пропущенный прогон cron'а не потеряет клиента — его подхватят
 * в следующий день.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Running review request cron...");

  try {
    const result = await requestReviewsForIssuedPermits();
    return NextResponse.json(result);
  } catch (error) {
    logger.error({ error }, "Review request cron failed");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
