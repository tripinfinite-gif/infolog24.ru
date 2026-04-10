import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * GET /api/cron/cleanup
 *
 * Clean up old data:
 * - Notifications older than 90 days
 * - Expired sessions
 * - Stale audit log entries (optional)
 *
 * Called by an external cron service weekly.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Running weekly cleanup...");

  const results = {
    deletedNotifications: 0,
    deletedSessions: 0,
    deletedAuditLogs: 0,
  };

  try {
    // TODO: Uncomment when database is running
    //
    // const cutoff90d = new Date();
    // cutoff90d.setDate(cutoff90d.getDate() - 90);
    //
    // // Delete old read notifications
    // const notifResult = await db
    //   .delete(notifications)
    //   .where(
    //     and(
    //       eq(notifications.status, "read"),
    //       lt(notifications.createdAt, cutoff90d),
    //     ),
    //   );
    // results.deletedNotifications = notifResult.rowCount ?? 0;
    //
    // // Delete expired sessions
    // const sessResult = await db
    //   .delete(sessions)
    //   .where(lt(sessions.expiresAt, new Date()));
    // results.deletedSessions = sessResult.rowCount ?? 0;

    logger.info(results, "Weekly cleanup complete");
    return NextResponse.json(results);
  } catch (error) {
    logger.error({ error }, "Error during weekly cleanup");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
