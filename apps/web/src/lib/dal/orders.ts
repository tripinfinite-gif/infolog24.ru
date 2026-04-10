import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderStatusHistory,
  vehicles,
  users,
  documents,
  payments,
} from "@/lib/db/schema";
import type { NewOrder, OrderFilters, PaginatedResult, Order } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function createOrder(
  userId: string,
  data: Omit<NewOrder, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Order> {
  const [order] = await db
    .insert(orders)
    .values({ ...data, userId })
    .returning();

  if (!order) throw new Error("Failed to create order");

  logger.info({ orderId: order.id, userId }, "Order created");
  return order;
}

export async function getOrderById(id: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      user: true,
      manager: true,
      vehicle: true,
      documents: true,
      payments: true,
      statusHistory: {
        orderBy: [desc(orderStatusHistory.createdAt)],
      },
      permits: true,
    },
  });

  return order ?? null;
}

export async function getOrdersByUser(
  userId: string,
  filters: OrderFilters = {},
): Promise<PaginatedResult<Order>> {
  return getOrdersWithFilters({ ...filters, userId });
}

export async function getOrdersByManager(
  managerId: string,
  filters: OrderFilters = {},
): Promise<PaginatedResult<Order>> {
  return getOrdersWithFilters({ ...filters, managerId });
}

export async function getAllOrders(
  filters: OrderFilters = {},
): Promise<PaginatedResult<Order>> {
  return getOrdersWithFilters(filters);
}

async function getOrdersWithFilters(
  filters: OrderFilters & { userId?: string; managerId?: string } = {},
): Promise<PaginatedResult<Order>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (filters.userId) conditions.push(eq(orders.userId, filters.userId));
  if (filters.managerId)
    conditions.push(eq(orders.managerId, filters.managerId));
  if (filters.status) conditions.push(eq(orders.status, filters.status));
  if (filters.zone) conditions.push(eq(orders.zone, filters.zone));
  if (filters.type) conditions.push(eq(orders.type, filters.type));

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db.query.orders.findMany({
      where: whereClause,
      with: { user: true, vehicle: true },
      orderBy: [desc(orders.createdAt)],
      limit: pageSize,
      offset,
    }),
    db.select({ count: count() }).from(orders).where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  changedBy: string,
  comment?: string,
): Promise<Order> {
  return await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!existing) throw new Error("Order not found");

    const [updated] = await tx
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    if (!updated) throw new Error("Failed to update order");

    await tx.insert(orderStatusHistory).values({
      orderId: id,
      fromStatus: existing.status,
      toStatus: status,
      changedBy,
      comment,
    });

    logger.info(
      { orderId: id, from: existing.status, to: status, changedBy },
      "Order status changed",
    );

    return updated;
  });
}

export async function assignManager(
  orderId: string,
  managerId: string,
): Promise<void> {
  const result = await db
    .update(orders)
    .set({ managerId })
    .where(eq(orders.id, orderId))
    .returning({ id: orders.id });

  if (result.length === 0) throw new Error("Order not found");

  logger.info({ orderId, managerId }, "Manager assigned to order");
}

export async function getOrderStats() {
  const [totalResult, byStatusResult, byMonthResult] = await Promise.all([
    db.select({ count: count() }).from(orders),
    db
      .select({
        status: orders.status,
        count: count(),
      })
      .from(orders)
      .groupBy(orders.status),
    db
      .select({
        month: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(orders)
      .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`),
  ]);

  return {
    total: totalResult[0]?.count ?? 0,
    byStatus: Object.fromEntries(
      byStatusResult.map((r) => [r.status, r.count]),
    ),
    byMonth: byMonthResult.map((r) => ({
      month: r.month,
      count: r.count,
    })),
  };
}
