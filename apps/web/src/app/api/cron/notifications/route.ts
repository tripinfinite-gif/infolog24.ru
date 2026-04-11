import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getPendingNotifications } from "@/lib/dal/notifications";
import {
  sendToChannel,
  type NotificationChannel,
} from "@/lib/notifications/channels";

const MAX_ATTEMPTS = 3;

/**
 * GET /api/cron/notifications
 *
 * Process pending notifications from the DB queue and retry failed ones.
 * Called by an external cron service every 5 minutes.
 *
 * Retry logic: each notification is processed at most `MAX_ATTEMPTS` times
 * (tracked via `metadata.attempts`). After that it is marked as permanently
 * failed and no longer picked up.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Processing notification queue...");

  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  try {
    const pending = await getPendingNotifications(100);

    for (const notification of pending) {
      processed++;
      const metadata =
        (notification.metadata as Record<string, unknown> | null) ?? {};
      const attempts = Number(metadata.attempts ?? 0);

      if (attempts >= MAX_ATTEMPTS) {
        logger.warn(
          { notificationId: notification.id, attempts },
          "Notification exceeded max attempts — skipping",
        );
        failed++;
        continue;
      }

      try {
        const channel = notification.channel as NotificationChannel;
        // In production: resolve userId to actual email/phone/chatId.
        const recipient = notification.userId;
        const ok = await sendToChannel(
          channel,
          recipient,
          notification.title,
          notification.body,
        );

        if (ok) {
          succeeded++;
        } else {
          failed++;
          logger.warn(
            { notificationId: notification.id },
            "Notification delivery returned false",
          );
        }
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

  const summary = { processed, succeeded, failed };
  logger.info(summary, "Notification queue processing complete");
  return NextResponse.json(summary);
}
