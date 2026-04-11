import { and, count, desc, eq, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { partnerReferrals, users } from "@/lib/db/schema";
import type {
  NewPartnerReferral,
  PaginatedResult,
  PartnerReferral,
  User,
} from "@/lib/types";
import { logger } from "@/lib/logger";

type UserRole = User["role"];

/**
 * Обновить роль пользователя.
 * Используется при превращении клиента в партнёра после signUp.
 */
export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<void> {
  const result = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  if (result.length === 0) {
    throw new Error("User not found");
  }

  logger.info({ userId, role }, "User role updated");
}

/**
 * Получить пользователя, если он партнёр. Иначе null.
 */
export async function getPartnerByUserId(
  userId: string,
): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.role, "partner")),
  });
  return user ?? null;
}

/**
 * Сгенерировать реферальный код из безопасного алфавита
 * (без 0, O, 1, I — чтобы не путать визуально).
 */
export function generateReferralCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const length = 8;
  let result = "";
  // crypto.getRandomValues доступен в Node 19+ и в Edge Runtime;
  // fallback на Math.random на всякий случай.
  const cryptoObj =
    typeof globalThis !== "undefined" && "crypto" in globalThis
      ? (globalThis.crypto as Crypto)
      : null;

  if (cryptoObj) {
    const bytes = new Uint8Array(length);
    cryptoObj.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      result += alphabet[bytes[i]! % alphabet.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }

  return result;
}

/**
 * Вернуть существующий реферальный код партнёра или создать новый.
 * Создаёт "заглушечную" запись в partner_referrals с нулевой комиссией и статусом pending,
 * чтобы зафиксировать код. Код уникален для партнёра.
 */
export async function ensurePartnerReferralCode(
  partnerId: string,
): Promise<string> {
  const existing = await db.query.partnerReferrals.findFirst({
    where: eq(partnerReferrals.partnerId, partnerId),
    orderBy: [desc(partnerReferrals.createdAt)],
  });

  if (existing) {
    return existing.referralCode;
  }

  // Пытаемся вставить новый код, на конфликт — повторяем до 5 раз.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateReferralCode();
    try {
      const [row] = await db
        .insert(partnerReferrals)
        .values({
          partnerId,
          referralCode: code,
          status: "pending",
        })
        .returning();

      if (!row) {
        throw new Error("Failed to insert referral code");
      }

      logger.info(
        { partnerId, referralCode: code },
        "Partner referral code created",
      );
      return row.referralCode;
    } catch (err) {
      logger.warn(
        { partnerId, attempt, err },
        "Failed to insert referral code, retrying",
      );
    }
  }

  throw new Error("Failed to generate unique referral code");
}

interface CreatePartnerSubmissionInput {
  partnerId: string;
  referredUserId?: string | null;
  orderId: string;
  commission: number;
  status?: PartnerReferral["status"];
  referralCode?: string;
}

/**
 * Создать реферальную запись по факту заявки/заказа, пришедшего от партнёра.
 */
export async function createPartnerSubmission(
  input: CreatePartnerSubmissionInput,
): Promise<PartnerReferral> {
  // Если referralCode не передан — пробуем взять действующий у партнёра.
  const referralCode =
    input.referralCode ?? (await ensurePartnerReferralCode(input.partnerId));

  const values: NewPartnerReferral = {
    partnerId: input.partnerId,
    referredUserId: input.referredUserId ?? null,
    orderId: input.orderId,
    commission: input.commission,
    referralCode,
    status: input.status ?? "pending",
  };

  const [row] = await db.insert(partnerReferrals).values(values).returning();

  if (!row) {
    throw new Error("Failed to create partner submission");
  }

  logger.info(
    { partnerId: input.partnerId, orderId: input.orderId, commission: input.commission },
    "Partner submission created",
  );
  return row;
}

/**
 * Пагинированный список заявок/заказов партнёра.
 */
export async function getPartnerSubmissions(
  partnerId: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<PaginatedResult<PartnerReferral>> {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const whereClause = eq(partnerReferrals.partnerId, partnerId);

  const [data, totalResult] = await Promise.all([
    db.query.partnerReferrals.findMany({
      where: whereClause,
      with: {
        order: {
          with: { vehicle: true },
        },
        referredUser: true,
      },
      orderBy: [desc(partnerReferrals.createdAt)],
      limit: pageSize,
      offset,
    }),
    db
      .select({ count: count() })
      .from(partnerReferrals)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    data: data as unknown as PartnerReferral[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export interface PartnerStats {
  total: number;
  pendingCommission: number;
  paidCommission: number;
  activeReferrals: number;
}

/**
 * Сводная статистика по партнёру: всего заявок, сумма pending/paid комиссий,
 * количество активных рефералов (status != 'paid').
 */
export async function getPartnerStats(
  partnerId: string,
): Promise<PartnerStats> {
  const [totalResult, pendingResult, paidResult, activeResult] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(partnerReferrals)
        .where(eq(partnerReferrals.partnerId, partnerId)),
      db
        .select({ sum: sum(partnerReferrals.commission) })
        .from(partnerReferrals)
        .where(
          and(
            eq(partnerReferrals.partnerId, partnerId),
            eq(partnerReferrals.status, "pending"),
          ),
        ),
      db
        .select({ sum: sum(partnerReferrals.commission) })
        .from(partnerReferrals)
        .where(
          and(
            eq(partnerReferrals.partnerId, partnerId),
            eq(partnerReferrals.status, "paid"),
          ),
        ),
      db
        .select({ count: count() })
        .from(partnerReferrals)
        .where(
          and(
            eq(partnerReferrals.partnerId, partnerId),
            eq(partnerReferrals.status, "pending"),
          ),
        ),
    ]);

  return {
    total: totalResult[0]?.count ?? 0,
    pendingCommission: Number(pendingResult[0]?.sum ?? 0),
    paidCommission: Number(paidResult[0]?.sum ?? 0),
    activeReferrals: activeResult[0]?.count ?? 0,
  };
}
