import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, permits, users } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { dispatchNotification } from "@/lib/notifications/dispatcher";

const ZONE_LABELS: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  documents_pending: "Ждёт документов",
  payment_pending: "Ждёт оплаты",
  processing: "В работе",
  submitted: "Подано в Дептранс",
  approved: "Готов",
  rejected: "Отклонено",
  cancelled: "Отменено",
};

/**
 * P2.4 — Weekly digest для активных клиентов.
 *
 * Собирает для каждого юзера, у которого есть active permits или
 * недавние orders, компактную сводку за неделю и шлёт её через
 * dispatchNotification (event: weekly_digest, каналы — email/telegram).
 *
 * Сводка содержит:
 *  - истекающие пропуска в ближайшие 30 дней
 *  - заявки с изменением статуса за последние 7 дней
 *  - count активных пропусков и заявок
 *
 * Запускается раз в неделю через cron.
 */
export async function runWeeklyDigest(): Promise<{
  processed: number;
  sent: number;
}> {
  logger.info("Running weekly digest...");

  let processed = 0;
  let sent = 0;

  try {
    // Берём всех клиентов, у которых есть хотя бы 1 active permit
    // или хотя бы 1 order за последние 30 дней.
    const usersWithActivity = await db
      .selectDistinct({ id: users.id, name: users.name })
      .from(users)
      .innerJoin(permits, eq(permits.userId, users.id))
      .where(eq(permits.status, "active"))
      .limit(5000);

    for (const u of usersWithActivity) {
      processed++;

      try {
        // Истекающие в ближайшие 30 дней
        const expiring = await db
          .select({
            permitNumber: permits.permitNumber,
            zone: permits.zone,
            validUntil: permits.validUntil,
          })
          .from(permits)
          .where(
            and(
              eq(permits.userId, u.id),
              eq(permits.status, "active"),
              sql`${permits.validUntil} <= CURRENT_DATE + INTERVAL '30 days'`,
              sql`${permits.validUntil} >= CURRENT_DATE`,
            ),
          )
          .orderBy(asc(permits.validUntil))
          .limit(20);

        // Недавние заявки за неделю
        const recentOrders = await db
          .select({
            id: orders.id,
            zone: orders.zone,
            status: orders.status,
            updatedAt: orders.updatedAt,
          })
          .from(orders)
          .where(
            and(
              eq(orders.userId, u.id),
              gte(
                orders.updatedAt,
                sql`NOW() - INTERVAL '7 days'`,
              ),
            ),
          )
          .orderBy(desc(orders.updatedAt))
          .limit(10);

        // Если нечего сообщить — пропускаем юзера
        if (expiring.length === 0 && recentOrders.length === 0) {
          continue;
        }

        const lines: string[] = [];
        lines.push(`Здравствуйте${u.name ? `, ${u.name}` : ""}!`);
        lines.push("");
        lines.push("Сводка по вашим пропускам за неделю:");

        if (expiring.length > 0) {
          lines.push("");
          lines.push(`Истекают в ближайшие 30 дней (${expiring.length} шт.):`);
          for (const p of expiring.slice(0, 5)) {
            lines.push(
              `  • ${p.permitNumber} (${ZONE_LABELS[p.zone] ?? p.zone}) — до ${p.validUntil}`,
            );
          }
          if (expiring.length > 5) {
            lines.push(`  • и ещё ${expiring.length - 5}…`);
          }
        }

        if (recentOrders.length > 0) {
          lines.push("");
          lines.push(`Изменения по заявкам за последние 7 дней (${recentOrders.length}):`);
          for (const o of recentOrders.slice(0, 5)) {
            lines.push(
              `  • ${ZONE_LABELS[o.zone] ?? o.zone}: ${STATUS_LABELS[o.status] ?? o.status}`,
            );
          }
        }

        lines.push("");
        lines.push(
          "Открыть кабинет: https://infolog24.ru/dashboard\nСкачать дедлайны в календарь: https://infolog24.ru/api/dashboard/calendar",
        );

        const summary = lines.join("\n");

        const result = await dispatchNotification({
          userId: u.id,
          type: "weekly_digest",
          data: { summary },
        });

        if (result.succeeded.length > 0) sent++;
      } catch (error) {
        logger.warn(
          { error, userId: u.id },
          "Weekly digest failed for user — continuing",
        );
      }
    }
  } catch (error) {
    logger.error({ error }, "Weekly digest run failed");
  }

  logger.info({ processed, sent }, "Weekly digest complete");
  return { processed, sent };
}
