import { and, count, desc, eq, gte, lte, sql, like, or, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  users,
  payments,
  permits,
  documents,
  vehicles,
  auditLog,
  sessions,
} from "@/lib/db/schema";

// ── Client tiers (T1–T5) ──────────────────────────────────────────────────
//
// Сегментация клиентов по совокупному доходу (LTV в копейках/рублях).
// Менеджеры используют тир, чтобы понимать кому уделять внимание.
// Пороги подобраны под текущую среднюю стоимость пропуска (~6 000 ₽).

export type ClientTier = "T1" | "T2" | "T3" | "T4" | "T5";

export interface ClientTierInfo {
  tier: ClientTier;
  label: string;
  description: string;
}

export function classifyClientTier(totalRevenue: number): ClientTierInfo {
  if (totalRevenue >= 500_000) {
    return { tier: "T5", label: "VIP", description: "≥ 500 000 ₽" };
  }
  if (totalRevenue >= 150_000) {
    return { tier: "T4", label: "Постоянный", description: "≥ 150 000 ₽" };
  }
  if (totalRevenue >= 50_000) {
    return { tier: "T3", label: "Активный", description: "≥ 50 000 ₽" };
  }
  if (totalRevenue >= 10_000) {
    return { tier: "T2", label: "Развивающийся", description: "≥ 10 000 ₽" };
  }
  return { tier: "T1", label: "Новичок", description: "< 10 000 ₽" };
}

// ── Dashboard Stats ───────────────────────────────────────────────────────

export async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    todayOrders,
    weekOrders,
    monthOrders,
    byStatusResult,
    revenueToday,
    revenueWeek,
    revenueMonth,
    activePermits,
    newClientsMonth,
    pendingOrders,
  ] = await Promise.all([
    db.select({ count: count() }).from(orders),
    db
      .select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, todayStart)),
    db
      .select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, weekStart)),
    db
      .select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, monthStart)),
    db
      .select({ status: orders.status, count: count() })
      .from(orders)
      .groupBy(orders.status),
    db
      .select({ sum: sql<number>`coalesce(sum(${payments.amount}), 0)` })
      .from(payments)
      .where(
        and(
          eq(payments.status, "succeeded"),
          gte(payments.paidAt, todayStart),
        ),
      ),
    db
      .select({ sum: sql<number>`coalesce(sum(${payments.amount}), 0)` })
      .from(payments)
      .where(
        and(
          eq(payments.status, "succeeded"),
          gte(payments.paidAt, weekStart),
        ),
      ),
    db
      .select({ sum: sql<number>`coalesce(sum(${payments.amount}), 0)` })
      .from(payments)
      .where(
        and(
          eq(payments.status, "succeeded"),
          gte(payments.paidAt, monthStart),
        ),
      ),
    db
      .select({ count: count() })
      .from(permits)
      .where(eq(permits.status, "active")),
    db
      .select({ count: count() })
      .from(users)
      .where(
        and(eq(users.role, "client"), gte(users.createdAt, monthStart)),
      ),
    db
      .select({ count: count() })
      .from(orders)
      .where(
        or(
          eq(orders.status, "documents_pending"),
          eq(orders.status, "payment_pending"),
        ),
      ),
  ]);

  return {
    totalOrders: totalOrders[0]?.count ?? 0,
    todayOrders: todayOrders[0]?.count ?? 0,
    weekOrders: weekOrders[0]?.count ?? 0,
    monthOrders: monthOrders[0]?.count ?? 0,
    byStatus: Object.fromEntries(
      byStatusResult.map((r) => [r.status, r.count]),
    ) as Record<string, number>,
    revenueToday: revenueToday[0]?.sum ?? 0,
    revenueWeek: revenueWeek[0]?.sum ?? 0,
    revenueMonth: revenueMonth[0]?.sum ?? 0,
    activePermits: activePermits[0]?.count ?? 0,
    newClientsMonth: newClientsMonth[0]?.count ?? 0,
    pendingOrders: pendingOrders[0]?.count ?? 0,
  };
}

export async function getRecentOrders(limit = 10) {
  return db.query.orders.findMany({
    with: {
      user: true,
      manager: true,
      vehicle: true,
    },
    orderBy: [desc(orders.createdAt)],
    limit,
  });
}

export async function getManagerWorkload() {
  const managers = await db.query.users.findMany({
    where: eq(users.role, "manager"),
  });

  const result = [];
  for (const manager of managers) {
    const [activeResult, totalResult] = await Promise.all([
      db
        .select({ count: count() })
        .from(orders)
        .where(
          and(
            eq(orders.managerId, manager.id),
            or(
              eq(orders.status, "processing"),
              eq(orders.status, "submitted"),
              eq(orders.status, "documents_pending"),
              eq(orders.status, "payment_pending"),
            ),
          ),
        ),
      db
        .select({ count: count() })
        .from(orders)
        .where(eq(orders.managerId, manager.id)),
    ]);

    result.push({
      id: manager.id,
      name: manager.name ?? manager.email,
      activeOrders: activeResult[0]?.count ?? 0,
      totalOrders: totalResult[0]?.count ?? 0,
    });
  }

  return result;
}

export async function getStaleOrders(hoursThreshold = 24) {
  const threshold = new Date();
  threshold.setHours(threshold.getHours() - hoursThreshold);

  return db.query.orders.findMany({
    where: and(
      lte(orders.updatedAt, threshold),
      or(
        eq(orders.status, "processing"),
        eq(orders.status, "submitted"),
        eq(orders.status, "documents_pending"),
        eq(orders.status, "payment_pending"),
      ),
    ),
    with: { user: true },
    orderBy: [asc(orders.updatedAt)],
    limit: 20,
  });
}

// ── Orders (admin) ────────────────────────────────────────────────────────

export interface AdminOrderFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  zone?: string;
  search?: string;
  managerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function getAdminOrders(filters: AdminOrderFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (filters.status)
    conditions.push(eq(orders.status, filters.status as typeof orders.status.enumValues[number]));
  if (filters.zone)
    conditions.push(eq(orders.zone, filters.zone as typeof orders.zone.enumValues[number]));
  if (filters.managerId)
    conditions.push(eq(orders.managerId, filters.managerId));
  if (filters.dateFrom)
    conditions.push(gte(orders.createdAt, filters.dateFrom));
  if (filters.dateTo)
    conditions.push(lte(orders.createdAt, filters.dateTo));

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db.query.orders.findMany({
      where: whereClause,
      with: {
        user: true,
        manager: true,
        vehicle: true,
      },
      orderBy: [desc(orders.createdAt)],
      limit: pageSize,
      offset,
    }),
    db.select({ count: count() }).from(orders).where(whereClause),
  ]);

  // If search filter, filter in JS (for name/phone partial match across joins)
  let filteredData = data;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filteredData = data.filter((o) => {
      const userName = (o.user?.name ?? "").toLowerCase();
      const userPhone = (o.user?.phone ?? "").toLowerCase();
      const userCompany = (o.user?.company ?? "").toLowerCase();
      const userEmail = (o.user?.email ?? "").toLowerCase();
      return (
        userName.includes(q) ||
        userPhone.includes(q) ||
        userCompany.includes(q) ||
        userEmail.includes(q) ||
        o.id.includes(q)
      );
    });
  }

  const total = filters.search ? filteredData.length : (totalResult[0]?.count ?? 0);

  return {
    data: filteredData,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ── Clients (admin) ───────────────────────────────────────────────────────

export interface AdminClientFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getAdminClients(filters: AdminClientFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const conditions = [eq(users.role, "client")];

  if (filters.search) {
    const q = `%${filters.search}%`;
    conditions.push(
      or(
        like(users.name, q),
        like(users.email, q),
        like(users.phone, q),
        like(users.company, q),
        like(users.inn, q),
      )!,
    );
  }

  const whereClause = and(...conditions);

  const [data, totalResult] = await Promise.all([
    db.query.users.findMany({
      where: whereClause,
      orderBy: [desc(users.createdAt)],
      limit: pageSize,
      offset,
    }),
    db.select({ count: count() }).from(users).where(whereClause),
  ]);

  // For each client, get order count, total revenue, last order, last login
  const clientsWithStats = await Promise.all(
    data.map(async (client) => {
      const [orderCount, revenueResult, lastOrder, lastSession] =
        await Promise.all([
          db
            .select({ count: count() })
            .from(orders)
            .where(eq(orders.userId, client.id)),
          db
            .select({
              sum: sql<number>`coalesce(sum(${payments.amount}), 0)`,
            })
            .from(payments)
            .where(
              and(
                eq(payments.userId, client.id),
                eq(payments.status, "succeeded"),
              ),
            ),
          db.query.orders.findFirst({
            where: eq(orders.userId, client.id),
            orderBy: [desc(orders.createdAt)],
            columns: { createdAt: true },
          }),
          db.query.sessions.findFirst({
            where: eq(sessions.userId, client.id),
            orderBy: [desc(sessions.updatedAt)],
            columns: { updatedAt: true },
          }),
        ]);

      const totalRevenue = revenueResult[0]?.sum ?? 0;

      return {
        ...client,
        orderCount: orderCount[0]?.count ?? 0,
        totalRevenue,
        lastOrderAt: lastOrder?.createdAt ?? null,
        lastLoginAt: lastSession?.updatedAt ?? null,
        tier: classifyClientTier(totalRevenue),
      };
    }),
  );

  return {
    data: clientsWithStats,
    total: totalResult[0]?.count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / pageSize),
  };
}

export async function getClientDetail(clientId: string) {
  const client = await db.query.users.findFirst({
    where: and(eq(users.id, clientId), eq(users.role, "client")),
  });

  if (!client) return null;

  const [
    clientOrders,
    clientVehicles,
    clientPayments,
    clientDocuments,
    clientPermits,
    lastSession,
  ] = await Promise.all([
    db.query.orders.findMany({
      where: eq(orders.userId, clientId),
      with: { vehicle: true },
      orderBy: [desc(orders.createdAt)],
    }),
    db.query.vehicles.findMany({
      where: eq(vehicles.userId, clientId),
    }),
    db.query.payments.findMany({
      where: eq(payments.userId, clientId),
      orderBy: [desc(payments.createdAt)],
    }),
    db.query.documents.findMany({
      where: eq(documents.userId, clientId),
      orderBy: [desc(documents.createdAt)],
    }),
    db.query.permits.findMany({
      where: eq(permits.userId, clientId),
      orderBy: [desc(permits.createdAt)],
    }),
    db.query.sessions.findFirst({
      where: eq(sessions.userId, clientId),
      orderBy: [desc(sessions.updatedAt)],
    }),
  ]);

  const totalSpend = clientPayments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  // ── Insights ─────────────────────────────────────────────────────────────

  const tier = classifyClientTier(totalSpend);

  const lastLoginAt = lastSession?.updatedAt ?? null;
  const lastOrderAt = clientOrders[0]?.createdAt ?? null;

  const now = Date.now();
  const daysSince = (date: Date | null) =>
    date ? Math.floor((now - new Date(date).getTime()) / 86_400_000) : null;

  const daysSinceLastLogin = daysSince(lastLoginAt);
  const daysSinceLastOrder = daysSince(lastOrderAt);

  const approvedOrders = clientOrders.filter((o) => o.status === "approved");
  const finishedOrders = clientOrders.filter((o) =>
    ["approved", "rejected", "cancelled"].includes(o.status),
  );
  const successRate =
    finishedOrders.length > 0
      ? Math.round((approvedOrders.length / finishedOrders.length) * 100)
      : null;

  // Среднее время от создания заявки до её обновления (approved/rejected).
  // Берём updatedAt как прокси к фактической дате завершения.
  const avgCycleHours =
    approvedOrders.length > 0
      ? Math.round(
          approvedOrders.reduce((sum, o) => {
            const created = new Date(o.createdAt).getTime();
            const updated = new Date(o.updatedAt).getTime();
            return sum + Math.max(0, (updated - created) / 3_600_000);
          }, 0) / approvedOrders.length,
        )
      : null;

  // Risk score: 0 (норм) — 3 (под угрозой ухода)
  let riskScore = 0;
  if ((daysSinceLastOrder ?? 0) > 60) riskScore++;
  if ((daysSinceLastLogin ?? 0) > 30) riskScore++;
  const stuckOrders = clientOrders.filter((o) =>
    ["documents_pending", "payment_pending"].includes(o.status),
  );
  if (stuckOrders.length > 0) riskScore++;

  return {
    client,
    orders: clientOrders,
    vehicles: clientVehicles,
    payments: clientPayments,
    documents: clientDocuments,
    permits: clientPermits,
    totalSpend,
    insights: {
      tier,
      lastLoginAt,
      lastOrderAt,
      daysSinceLastLogin,
      daysSinceLastOrder,
      successRate,
      avgCycleHours,
      riskScore,
      stuckOrdersCount: stuckOrders.length,
      ordersTotalCount: clientOrders.length,
      approvedOrdersCount: approvedOrders.length,
    },
  };
}

// ── Payments (admin) ──────────────────────────────────────────────────────

export interface AdminPaymentFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getAdminPayments(filters: AdminPaymentFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (filters.status)
    conditions.push(eq(payments.status, filters.status as typeof payments.status.enumValues[number]));
  if (filters.dateFrom)
    conditions.push(gte(payments.createdAt, filters.dateFrom));
  if (filters.dateTo)
    conditions.push(lte(payments.createdAt, filters.dateTo));

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult, summaryResult] = await Promise.all([
    db.query.payments.findMany({
      where: whereClause,
      with: {
        user: true,
        order: true,
      },
      orderBy: [desc(payments.createdAt)],
      limit: pageSize,
      offset,
    }),
    db.select({ count: count() }).from(payments).where(whereClause),
    db
      .select({
        status: payments.status,
        total: sql<number>`coalesce(sum(${payments.amount}), 0)`,
        count: count(),
      })
      .from(payments)
      .groupBy(payments.status),
  ]);

  const summary = {
    totalCount: 0,
    succeededAmount: 0,
    pendingAmount: 0,
    refundedAmount: 0,
  };
  for (const row of summaryResult) {
    summary.totalCount += row.count;
    if (row.status === "succeeded") summary.succeededAmount = row.total;
    if (row.status === "pending") summary.pendingAmount = row.total;
    if (row.status === "refunded") summary.refundedAmount = row.total;
  }

  return {
    data,
    total: totalResult[0]?.count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / pageSize),
    summary,
  };
}

// ── Permits (admin) ───────────────────────────────────────────────────────

export async function getAdminPermits() {
  const data = await db.query.permits.findMany({
    with: {
      user: true,
      order: {
        with: {
          vehicle: true,
        },
      },
    },
    orderBy: [desc(permits.createdAt)],
  });

  const [activeCount, expiredCount, totalCount] = await Promise.all([
    db.select({ count: count() }).from(permits).where(eq(permits.status, "active")),
    db.select({ count: count() }).from(permits).where(eq(permits.status, "expired")),
    db.select({ count: count() }).from(permits),
  ]);

  return {
    data,
    stats: {
      active: activeCount[0]?.count ?? 0,
      expired: expiredCount[0]?.count ?? 0,
      total: totalCount[0]?.count ?? 0,
    },
  };
}

export async function createPermit(data: {
  orderId: string;
  userId: string;
  permitNumber: string;
  zone: typeof permits.zone.enumValues[number];
  type: typeof permits.type.enumValues[number];
  validFrom: string;
  validUntil: string;
}) {
  const [permit] = await db
    .insert(permits)
    .values({
      orderId: data.orderId,
      userId: data.userId,
      permitNumber: data.permitNumber,
      zone: data.zone,
      type: data.type,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
    })
    .returning();

  return permit;
}

export async function revokePermit(permitId: string) {
  const [updated] = await db
    .update(permits)
    .set({ status: "revoked" })
    .where(eq(permits.id, permitId))
    .returning();

  return updated;
}

// ── Audit Log ─────────────────────────────────────────────────────────────

export interface AdminAuditFilters {
  page?: number;
  pageSize?: number;
  action?: string;
  userId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getAdminAuditLog(filters: AdminAuditFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (filters.action) conditions.push(eq(auditLog.action, filters.action));
  if (filters.userId) conditions.push(eq(auditLog.userId, filters.userId));
  if (filters.dateFrom)
    conditions.push(gte(auditLog.createdAt, filters.dateFrom));
  if (filters.dateTo)
    conditions.push(lte(auditLog.createdAt, filters.dateTo));

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db.query.auditLog.findMany({
      where: whereClause,
      with: { user: true },
      orderBy: [desc(auditLog.createdAt)],
      limit: pageSize,
      offset,
    }),
    db.select({ count: count() }).from(auditLog).where(whereClause),
  ]);

  // Get unique actions and users for filters
  const [uniqueActions, uniqueUsers] = await Promise.all([
    db
      .selectDistinct({ action: auditLog.action })
      .from(auditLog),
    db
      .selectDistinct({ userId: auditLog.userId })
      .from(auditLog),
  ]);

  // Resolve user names for filter options
  const userIds = uniqueUsers.map((u) => u.userId);
  const userDetails =
    userIds.length > 0
      ? await db.query.users.findMany({
          where: or(...userIds.map((id) => eq(users.id, id))),
        })
      : [];

  return {
    data,
    total: totalResult[0]?.count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / pageSize),
    filterOptions: {
      actions: uniqueActions.map((a) => a.action),
      users: userDetails.map((u) => ({ id: u.id, name: u.name ?? u.email })),
    },
  };
}

// ── Analytics ─────────────────────────────────────────────────────────────

export async function getAnalyticsData() {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    monthlyRevenue,
    monthlyOrders,
    totalOrders,
    approvedOrders,
    totalClients,
    recentClients,
    succeededPayments,
    zoneStats,
    managerStats,
    topClients,
  ] = await Promise.all([
    // Monthly revenue (last 12 months)
    db
      .select({
        month: sql<string>`to_char(${payments.paidAt}, 'YYYY-MM')`,
        amount: sql<number>`coalesce(sum(${payments.amount}), 0)`,
      })
      .from(payments)
      .where(
        and(
          eq(payments.status, "succeeded"),
          gte(payments.paidAt, twelveMonthsAgo),
        ),
      )
      .groupBy(sql`to_char(${payments.paidAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${payments.paidAt}, 'YYYY-MM')`),

    // Monthly orders (last 12 months)
    db
      .select({
        month: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(orders)
      .where(gte(orders.createdAt, twelveMonthsAgo))
      .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`),

    // Total orders
    db.select({ count: count() }).from(orders),

    // Approved orders
    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "approved")),

    // Total clients
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "client")),

    // Recent clients (this month)
    db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.role, "client"),
          gte(users.createdAt, new Date(now.getFullYear(), now.getMonth(), 1)),
        ),
      ),

    // Succeeded payments total
    db
      .select({
        count: count(),
        sum: sql<number>`coalesce(sum(${payments.amount}), 0)`,
      })
      .from(payments)
      .where(eq(payments.status, "succeeded")),

    // Zone distribution
    db
      .select({ zone: orders.zone, count: count() })
      .from(orders)
      .groupBy(orders.zone),

    // Manager performance
    db
      .select({
        managerId: orders.managerId,
        total: count(),
        approved: sql<number>`count(*) filter (where ${orders.status} = 'approved')`,
      })
      .from(orders)
      .where(sql`${orders.managerId} is not null`)
      .groupBy(orders.managerId),

    // Top clients by revenue
    db
      .select({
        userId: payments.userId,
        totalAmount: sql<number>`coalesce(sum(${payments.amount}), 0)`,
        paymentCount: count(),
      })
      .from(payments)
      .where(eq(payments.status, "succeeded"))
      .groupBy(payments.userId)
      .orderBy(sql`sum(${payments.amount}) desc`)
      .limit(10),
  ]);

  // Resolve manager names
  const managerIds = managerStats
    .map((m) => m.managerId)
    .filter(Boolean) as string[];
  const managerDetails =
    managerIds.length > 0
      ? await db.query.users.findMany({
          where: or(...managerIds.map((id) => eq(users.id, id))),
        })
      : [];
  const managerMap = new Map(managerDetails.map((m) => [m.id, m.name ?? m.email]));

  // Resolve top client names
  const topClientIds = topClients.map((c) => c.userId);
  const clientDetails =
    topClientIds.length > 0
      ? await db.query.users.findMany({
          where: or(...topClientIds.map((id) => eq(users.id, id))),
        })
      : [];
  const clientMap = new Map(
    clientDetails.map((c) => [c.id, { name: c.name ?? c.email, company: c.company }]),
  );

  const total = totalOrders[0]?.count ?? 0;
  const approved = approvedOrders[0]?.count ?? 0;
  const sp = succeededPayments[0];

  return {
    kpi: {
      totalOrders: total,
      conversion: total > 0 ? Math.round((approved / total) * 100) : 0,
      totalRevenue: sp?.sum ?? 0,
      avgCheck: (sp?.count ?? 0) > 0 ? Math.round((sp?.sum ?? 0) / (sp?.count ?? 1)) : 0,
      totalClients: totalClients[0]?.count ?? 0,
      newClients: recentClients[0]?.count ?? 0,
    },
    monthlyRevenue: monthlyRevenue.map((r) => ({
      month: r.month,
      amount: r.amount,
    })),
    monthlyOrders: monthlyOrders.map((r) => ({
      month: r.month,
      count: r.count,
    })),
    zoneStats: zoneStats.map((z) => ({
      zone: z.zone,
      count: z.count,
    })),
    managerPerformance: managerStats.map((m) => ({
      name: managerMap.get(m.managerId ?? "") ?? "Неизвестно",
      completed: m.approved,
      total: m.total,
    })),
    topClients: topClients.map((c) => {
      const info = clientMap.get(c.userId);
      return {
        name: info?.name ?? "Неизвестно",
        company: info?.company ?? "",
        totalAmount: c.totalAmount,
        paymentCount: c.paymentCount,
      };
    }),
  };
}

// ── Managers list ─────────────────────────────────────────────────────────

export async function getManagers() {
  return db.query.users.findMany({
    where: or(eq(users.role, "manager"), eq(users.role, "admin")),
    orderBy: [asc(users.name)],
  });
}

// ── Bulk operations ───────────────────────────────────────────────────────

export async function bulkAssignManager(orderIds: string[], managerId: string) {
  const results = [];
  for (const orderId of orderIds) {
    const [updated] = await db
      .update(orders)
      .set({ managerId })
      .where(eq(orders.id, orderId))
      .returning();
    if (updated) results.push(updated);
  }
  return results;
}

// ── Export ─────────────────────────────────────────────────────────────────

export async function getExportData(entity: "orders" | "clients" | "payments", dateFrom?: Date, dateTo?: Date) {
  if (entity === "orders") {
    const conditions = [];
    if (dateFrom) conditions.push(gte(orders.createdAt, dateFrom));
    if (dateTo) conditions.push(lte(orders.createdAt, dateTo));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return db.query.orders.findMany({
      where: whereClause,
      with: { user: true, vehicle: true, manager: true },
      orderBy: [desc(orders.createdAt)],
    });
  }

  if (entity === "clients") {
    return db.query.users.findMany({
      where: eq(users.role, "client"),
      orderBy: [desc(users.createdAt)],
    });
  }

  if (entity === "payments") {
    const conditions = [];
    if (dateFrom) conditions.push(gte(payments.createdAt, dateFrom));
    if (dateTo) conditions.push(lte(payments.createdAt, dateTo));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return db.query.payments.findMany({
      where: whereClause,
      with: { user: true, order: true },
      orderBy: [desc(payments.createdAt)],
    });
  }

  return [];
}
