import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkExpiringPermits } from "@/lib/automation/permit-expiration";

/**
 * GET /api/cron/expiring-permits
 *
 * Check for permits expiring within 30/14/7/0 days and send notifications.
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

    logger.info(result, "Expiring permits check complete");
    return NextResponse.json(result);
  } catch (error) {
    logger.error({ error }, "Error checking expiring permits");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
