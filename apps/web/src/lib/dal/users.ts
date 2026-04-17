import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, orders, vehicles, permits } from "@/lib/db/schema";
import type { NewUser, User } from "@/lib/types";
import { logger } from "@/lib/logger";

/**
 * Алфавит без 0, O, 1, I/l — чтобы пользователи не путали код при диктовке.
 */
const REFERRAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REFERRAL_CODE_LENGTH = 6;

function generatePersonalReferralCode(): string {
  const cryptoObj =
    typeof globalThis !== "undefined" && "crypto" in globalThis
      ? (globalThis.crypto as Crypto)
      : null;

  let result = "";
  if (cryptoObj) {
    const bytes = new Uint8Array(REFERRAL_CODE_LENGTH);
    cryptoObj.getRandomValues(bytes);
    for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
      result += REFERRAL_ALPHABET[bytes[i]! % REFERRAL_ALPHABET.length];
    }
  } else {
    for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
      result +=
        REFERRAL_ALPHABET[
          Math.floor(Math.random() * REFERRAL_ALPHABET.length)
        ];
    }
  }
  return result;
}

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

/**
 * Вернуть уже существующий персональный реферальный код или создать новый.
 *
 * Код генерируется лениво: сам факт регистрации не требует уникальной строки
 * в базе, но как только клиент заходит на /dashboard/referral — код фиксируется.
 * Уникальность гарантируется UNIQUE constraint + ретраи при коллизии.
 */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const existing = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { referralCode: true },
  });

  if (!existing) {
    throw new Error("User not found");
  }

  if (existing.referralCode) {
    return existing.referralCode;
  }

  // Пытаемся вставить новый код, на конфликт — повторяем до 5 раз.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generatePersonalReferralCode();
    try {
      const [row] = await db
        .update(users)
        .set({ referralCode: code })
        .where(eq(users.id, userId))
        .returning({ referralCode: users.referralCode });

      if (row?.referralCode) {
        logger.info({ userId, referralCode: code }, "User referral code created");
        return row.referralCode;
      }
    } catch (err) {
      logger.warn(
        { userId, attempt, err },
        "Failed to set user referral code, retrying",
      );
    }
  }

  throw new Error("Failed to generate unique user referral code");
}

/**
 * Найти пользователя по его персональному реферальному коду.
 * Используется при регистрации нового клиента — чтобы понять, кто его привёл.
 */
export async function getUserByReferralCode(
  code: string,
): Promise<User | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const user = await db.query.users.findFirst({
    where: eq(users.referralCode, normalized),
  });
  return user ?? null;
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
