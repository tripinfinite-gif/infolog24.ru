import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { permits } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { dispatchNotification } from "@/lib/notifications/dispatcher";

/**
 * Thresholds (in days) for permit expiration notifications.
 * Each threshold maps to a notification event.
 */
const EXPIRATION_THRESHOLDS = [
  { days: 30, event: "permit_expiring_30days" },
  { days: 7, event: "permit_expiring_7days" },
  { days: 1, event: "permit_expiring_1day" },
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
 * For each threshold, query permits that expire on that exact day and
 * dispatch the matching notification. If the database is unavailable the
 * function logs a warning and returns zeros — it must never crash the cron
 * endpoint.
 */
export async function checkExpiringPermits(): Promise<{
  checked: number;
  notified: number;
}> {
  logger.info("Checking for expiring permits...");

  let checked = 0;
  let notified = 0;

  for (const threshold of EXPIRATION_THRESHOLDS) {
    try {
      // Permits whose validUntil falls on (today + threshold.days)
      // Using date arithmetic compatible with Postgres.
      const expiringPermits = await db
        .select({
          id: permits.id,
          userId: permits.userId,
          permitNumber: permits.permitNumber,
          zone: permits.zone,
          validUntil: permits.validUntil,
        })
        .from(permits)
        .where(
          and(
            eq(permits.status, "active"),
            sql`${permits.validUntil} = CURRENT_DATE + ${sql.raw(
              `INTERVAL '${threshold.days} days'`,
            )}`,
          ),
        );

      checked += expiringPermits.length;

      for (const permit of expiringPermits) {
        const result = await dispatchNotification({
          userId: permit.userId,
          type: threshold.event,
          data: {
            permitNumber: permit.permitNumber,
            zone: permit.zone,
            expiryDate: permit.validUntil,
          },
        });
        if (result.succeeded.length > 0) notified++;
      }
    } catch (error) {
      logger.warn(
        { error, threshold },
        "Expiring permits query failed — skipping threshold",
      );
    }
  }

  logger.info({ checked, notified }, "Expiring permits check complete");
  return { checked, notified };
}
