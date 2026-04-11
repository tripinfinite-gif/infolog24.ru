import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications, permits } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { dispatchNotification } from "@/lib/notifications/dispatcher";

/**
 * Thresholds (in days) for permit expiration notifications.
 * Each threshold maps to a notification event template.
 *
 * Расширили с 30/7/1 до 45/30/14/7/3/1 в рамках P1.5 (анти-аннуляционные
 * алерты) — чтобы клиенты получали сигнал раньше и могли спокойно
 * запланировать продление, а не «срочно сегодня».
 */
const EXPIRATION_THRESHOLDS = [
  { days: 45, event: "permit_expiring_45days" },
  { days: 30, event: "permit_expiring_30days" },
  { days: 14, event: "permit_expiring_14days" },
  { days: 7, event: "permit_expiring_7days" },
  { days: 3, event: "permit_expiring_3days" },
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
 * Дедупликация: если за последние 22 часа уже было создано уведомление
 * того же типа для того же пропуска — пропускаем. Защищает от двойного
 * запуска cron в один день и от повторных алертов на ту же дату.
 *
 * Используем 22 часа (а не 24), чтобы при ежедневном cron в 8:00 не
 * пропустить алерт следующего дня из-за edge case timezone.
 */
async function alreadyNotifiedRecently(
  userId: string,
  type: string,
  permitId: string,
): Promise<boolean> {
  try {
    const result = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.type, type),
          gte(
            notifications.createdAt,
            sql`NOW() - INTERVAL '22 hours'`,
          ),
          sql`${notifications.metadata} ->> 'permitId' = ${permitId}`,
        ),
      )
      .limit(1);
    return result.length > 0;
  } catch (error) {
    logger.warn(
      { error, userId, type, permitId },
      "Dedup check failed — proceeding with dispatch (better duplicate than miss)",
    );
    return false;
  }
}

/**
 * Check for expiring permits and send notifications.
 *
 * Intended to be called by a daily cron job (`/api/cron/expiring-permits`).
 *
 * For each threshold, query permits that expire on that exact day and
 * dispatch the matching notification. Дедуплицируем через проверку
 * предыдущих уведомлений того же типа для того же пропуска.
 *
 * Если БД недоступна, функция логирует ошибку и возвращает нули —
 * никогда не падает, чтобы cron endpoint оставался стабильным.
 */
export async function checkExpiringPermits(): Promise<{
  checked: number;
  notified: number;
  skippedDuplicates: number;
}> {
  logger.info("Checking for expiring permits (P1.5 thresholds 45/30/14/7/3/1)...");

  let checked = 0;
  let notified = 0;
  let skippedDuplicates = 0;

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
        const isDuplicate = await alreadyNotifiedRecently(
          permit.userId,
          threshold.event,
          permit.id,
        );
        if (isDuplicate) {
          skippedDuplicates++;
          continue;
        }

        const result = await dispatchNotification({
          userId: permit.userId,
          type: threshold.event,
          data: {
            permitId: permit.id,
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

  logger.info(
    { checked, notified, skippedDuplicates },
    "Expiring permits check complete",
  );
  return { checked, notified, skippedDuplicates };
}
