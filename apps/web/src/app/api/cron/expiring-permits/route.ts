import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkExpiringPermits } from "@/lib/automation/permit-expiration";

/**
 * GET /api/cron/expiring-permits
 *
 * Check for permits expiring within 30/7/1 days and dispatch notifications.
 * Called by an external cron service daily.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Running expiring permits check...");

  try {
    const result = await checkExpiringPermits();
    const summary = {
      processed: result.checked,
      succeeded: result.notified,
      failed: Math.max(0, result.checked - result.notified),
    };
    logger.info(summary, "Expiring permits check complete");
    return NextResponse.json(summary);
  } catch (error) {
    logger.error({ error }, "Error checking expiring permits");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
