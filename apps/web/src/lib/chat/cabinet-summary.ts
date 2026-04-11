import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  notifications,
  orders,
  permits,
  users,
  vehicles,
} from "@/lib/db/schema";
import { logger } from "@/lib/logger";

const ZONE_LABELS: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

function formatDate(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function daysUntil(target: Date | string): number {
  const t = typeof target === "string" ? new Date(target) : target;
  return Math.ceil((t.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export type CabinetSummary =
  | {
      authenticated: false;
      message: string;
    }
  | {
      authenticated: true;
      user: {
        name: string | null;
        company: string | null;
        email: string | null;
        phone: string | null;
      };
      counts: {
        vehicles: number;
        activeOrders: number;
        activePermits: number;
        expiringInNext30Days: number;
        unreadAlerts: number;
      };
      vehiclesPreview: Array<{
        id: string;
        plate: string;
        model: string;
        ecoClass: string | null;
        year: number | null;
      }>;
      activeOrdersPreview: Array<{
        id: string;
        zone: string;
        status: string;
        estimatedReadyDate: string | null;
      }>;
      expiringSoon: Array<{
        permitNumber: string;
        zone: string;
        validUntil: string | null;
        daysLeft: number;
      }>;
      /**
       * Последние непрочитанные алерты клиента (P1.5).
       * Топ-5 по дате создания. Ассистент использует это, чтобы
       * проактивно упомянуть свежие предупреждения в начале диалога.
       */
      recentAlerts: Array<{
        id: string;
        type: string;
        title: string;
        body: string;
        createdAt: string;
      }>;
    };

/**
 * Загружает краткую сводку личного кабинета клиента.
 * Используется и tool'ом getMyContext (для in-conversation запросов),
 * и /api/chat/welcome (для генерации приветствия при открытии чата).
 *
 * Все запросы строго scoped по userId — никаких чужих данных.
 */
export async function loadCabinetSummary(
  userId: string | null,
): Promise<CabinetSummary> {
  if (!userId) {
    return {
      authenticated: false,
      message:
        "Пользователь не авторизован — отвечаю в публичном режиме без доступа к личным данным.",
    };
  }

  try {
    const [user, vehicleList, activeOrders, activePermits, recentAlertsRaw] =
      await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          name: true,
          email: true,
          phone: true,
          company: true,
        },
      }),
      db.query.vehicles.findMany({
        where: eq(vehicles.userId, userId),
        columns: {
          id: true,
          brand: true,
          model: true,
          licensePlate: true,
          ecoClass: true,
          year: true,
        },
        limit: 50,
      }),
      db
        .select({
          id: orders.id,
          zone: orders.zone,
          type: orders.type,
          status: orders.status,
          estimatedReadyDate: orders.estimatedReadyDate,
        })
        .from(orders)
        .where(
          and(
            eq(orders.userId, userId),
            inArray(orders.status, [
              "draft",
              "documents_pending",
              "payment_pending",
              "processing",
              "submitted",
            ]),
          ),
        )
        .orderBy(desc(orders.createdAt))
        .limit(20),
      db
        .select({
          id: permits.id,
          zone: permits.zone,
          permitNumber: permits.permitNumber,
          validUntil: permits.validUntil,
          status: permits.status,
        })
        .from(permits)
        .where(
          and(eq(permits.userId, userId), eq(permits.status, "active")),
        )
        .orderBy(asc(permits.validUntil))
        .limit(20),
      // Топ-5 непрочитанных уведомлений для проактивности ассистента (P1.5).
      db
        .select({
          id: notifications.id,
          type: notifications.type,
          title: notifications.title,
          body: notifications.body,
          createdAt: notifications.createdAt,
        })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            isNull(notifications.readAt),
          ),
        )
        .orderBy(desc(notifications.createdAt))
        .limit(5),
    ]);

    // Полный счётчик непрочитанных (для counts.unreadAlerts).
    const unreadCountRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
        ),
      );
    const unreadAlerts = unreadCountRows[0]?.count ?? 0;

    const expiringSoon = activePermits
      .filter((p) => {
        const days = daysUntil(p.validUntil);
        return days >= 0 && days <= 30;
      })
      .map((p) => ({
        permitNumber: p.permitNumber,
        zone: ZONE_LABELS[p.zone] ?? p.zone,
        validUntil: formatDate(p.validUntil),
        daysLeft: daysUntil(p.validUntil),
      }));

    return {
      authenticated: true,
      user: {
        name: user?.name ?? null,
        company: user?.company ?? null,
        email: user?.email ?? null,
        phone: user?.phone ?? null,
      },
      counts: {
        vehicles: vehicleList.length,
        activeOrders: activeOrders.length,
        activePermits: activePermits.length,
        expiringInNext30Days: expiringSoon.length,
        unreadAlerts,
      },
      vehiclesPreview: vehicleList.slice(0, 5).map((v) => ({
        id: v.id,
        plate: v.licensePlate,
        model: `${v.brand} ${v.model}`.trim(),
        ecoClass: v.ecoClass,
        year: v.year,
      })),
      activeOrdersPreview: activeOrders.slice(0, 5).map((o) => ({
        id: o.id,
        zone: ZONE_LABELS[o.zone] ?? o.zone,
        status: o.status,
        estimatedReadyDate: formatDate(o.estimatedReadyDate),
      })),
      expiringSoon,
      recentAlerts: recentAlertsRaw.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    logger.warn({ error, userId }, "loadCabinetSummary failed");
    return {
      authenticated: false,
      message: "Не удалось загрузить данные кабинета.",
    };
  }
}
