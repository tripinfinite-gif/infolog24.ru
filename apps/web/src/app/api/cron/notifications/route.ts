import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getPendingNotifications } from "@/lib/dal/notifications";
import { sendToChannel, type NotificationChannel } from "@/lib/notifications/channels";

/**
 * GET /api/cron/notifications
 *
 * Process pending notifications from the queue.
 * Called by an external cron service every 5 minutes.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Processing notification queue...");

  let processed = 0;
  let failed = 0;

  try {
    const pending = await getPendingNotifications(100);

    for (const notification of pending) {
      try {
        const channel = notification.channel as NotificationChannel;
        // In production: resolve userId to actual email/phone/chatId
        const recipient = notification.userId;

        await sendToChannel(channel, recipient, notification.title, notification.body);
        processed++;
      } catch (error) {
        failed++;
        logger.error(
          { notificationId: notification.id, error },
          "Failed to process notification",
        );
      }
    }
  } catch (error) {
    logger.error({ error }, "Error processing notification queue");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  logger.info({ processed, failed }, "Notification queue processing complete");
  return NextResponse.json({ processed, failed });
}
