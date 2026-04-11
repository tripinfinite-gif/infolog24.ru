import { and, count, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { permits } from "@/lib/db/schema";
import type { Permit } from "@/lib/types";

export async function getPermitsByUser(userId: string): Promise<Permit[]> {
  return db.query.permits.findMany({
    where: eq(permits.userId, userId),
    orderBy: [desc(permits.createdAt)],
  });
}

export async function getPermitById(id: string): Promise<Permit | null> {
  const permit = await db.query.permits.findFirst({
    where: eq(permits.id, id),
  });
  return permit ?? null;
}

export async function getActivePermitsCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(permits)
    .where(
      and(
        eq(permits.userId, userId),
        eq(permits.status, "active"),
      ),
    );
  return result?.count ?? 0;
}

export async function getExpiringPermits(
  userId: string,
  withinDays = 30,
): Promise<Permit[]> {
  const now = new Date().toISOString().split("T")[0]!;
  const future = new Date(Date.now() + withinDays * 86400000)
    .toISOString()
    .split("T")[0]!;

  return db.query.permits.findMany({
    where: and(
      eq(permits.userId, userId),
      eq(permits.status, "active"),
      gte(permits.validUntil, now),
      lte(permits.validUntil, future),
    ),
    orderBy: [permits.validUntil],
  });
}
