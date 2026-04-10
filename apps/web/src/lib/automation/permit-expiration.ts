import { logger } from "@/lib/logger";
import { notificationService } from "@/lib/notifications/service";

/**
 * Thresholds (in days) for permit expiration notifications.
 * Each threshold maps to a notification event.
 */
const EXPIRATION_THRESHOLDS = [
  { days: 30, event: "permit_expiring_30d" },
  { days: 14, event: "permit_expiring_14d" },
  { days: 7, event: "permit_expiring_7d" },
  { days: 0, event: "permit_expired" },
] as const;

export interface ExpiringPermit {
  id: string;
  userId: string;
  permitNumber: string;
  zone: string;
  validUntil: string; // ISO date
}

/**
 * Check for expiring permits and send notifications.
 *
 * Intended to be called by a daily cron job (`/api/cron/expiring-permits`).
 *
 * In production this queries the `permits` table. For now, the DB query is
 * stubbed out — the notification dispatch logic is fully wired.
 */
export async function checkExpiringPermits(): Promise<{
  checked: number;
  notified: number;
}> {
  logger.info("Checking for expiring permits...");

  let notified = 0;

  // TODO: replace stubs with real DB queries once the database is running
  // Example query for each threshold:
  //
  // const expiring = await db
  //   .select()
  //   .from(permits)
  //   .where(
  //     and(
  //       eq(permits.status, "active"),
  //       between(
  //         permits.validUntil,
  //         sql`CURRENT_DATE`,
  //         sql`CURRENT_DATE + INTERVAL '${threshold.days} days'`,
  //       ),
  //     ),
  //   );

  for (const threshold of EXPIRATION_THRESHOLDS) {
    // Stub: in production, iterate over actual permits from DB
    const expiringPermits: ExpiringPermit[] = [];

    for (const permit of expiringPermits) {
      await notificationService.send({
        userId: permit.userId,
        event: threshold.event,
        data: {
          permitNumber: permit.permitNumber,
          zone: permit.zone,
          expiryDate: permit.validUntil,
        },
      });
      notified++;
    }
  }

  logger.info({ notified }, "Expiring permits check complete");
  return { checked: 0, notified };
}
