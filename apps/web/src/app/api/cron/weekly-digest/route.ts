import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { runWeeklyDigest } from "@/lib/automation/weekly-digest";

/**
 * GET /api/cron/weekly-digest
 *
 * P2.4 — еженедельная сводка для активных клиентов.
 * Запускается раз в неделю (например, понедельник 9:00).
 * Cron-сервис должен передавать заголовок Authorization: Bearer ${CRON_SECRET}.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Running weekly digest cron...");

  try {
    const result = await runWeeklyDigest();
    return NextResponse.json(result);
  } catch (error) {
    logger.error({ error }, "Weekly digest cron failed");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
