import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, orders, vehicles, permits } from "@/lib/db/schema";
import type { NewUser, User } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function getUserById(id: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user ?? null;
}

export async function updateUserProfile(
  id: string,
  data: Partial<
    Omit<NewUser, "id" | "email" | "role" | "createdAt" | "updatedAt">
  >,
): Promise<User> {
  const [updated] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();

  if (!updated) throw new Error("User not found");

  logger.info({ userId: id }, "User profile updated");
  return updated;
}

export async function getUserStats(id: string) {
  const [orderCount, vehicleCount, permitCount] = await Promise.all([
    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.userId, id)),
    db
      .select({ count: count() })
      .from(vehicles)
      .where(eq(vehicles.userId, id)),
    db
      .select({ count: count() })
      .from(permits)
      .where(eq(permits.userId, id)),
  ]);

  return {
    orders: orderCount[0]?.count ?? 0,
    vehicles: vehicleCount[0]?.count ?? 0,
    permits: permitCount[0]?.count ?? 0,
  };
}
