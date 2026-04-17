import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  partnerReferrals,
  promoCodes,
  users,
  orders,
} from "@/lib/db/schema";
import type { PartnerReferral, User } from "@/lib/types";
import { logger } from "@/lib/logger";

/**
 * Реферальная программа "клиент приводит клиента".
 *
 * Таблица partnerReferrals повторно используется для обеих программ:
 *   • Партнёрская (роль partner, комиссия деньгами) — см. dal/partners.ts
 *   • Клиентская (обычный юзер приводит друга, награда — промокод 1000 ₽)
 *
 * Различать программы не требуется на уровне схемы: если у partnerId роль =
 * "client", это запись клиентской программы. commission хранит сумму будущего
 * промокода в рублях.
 */

export const CLIENT_REFERRAL_COMMISSION_RUB = 1000;
export const CLIENT_REFERRAL_PROMO_VALID_DAYS = 90;

export interface ClientReferralView {
  id: string;
  createdAt: Date;
  status: PartnerReferral["status"];
  commission: number | null;
  referredUserName: string | null;
  referredUserEmail: string | null;
}

/**
 * Создать pending-запись в реферальной таблице по факту регистрации друга.
 * Не падает, если реферер не найден или пытается привести сам себя —
 * просто возвращает null, чтобы не блокировать регистрацию.
 */
export async function claimReferralForNewUser(input: {
  referrerCode: string;
  referredUserId: string;
}): Promise<PartnerReferral | null> {
  const code = input.referrerCode.trim().toUpperCase();
  if (!code) return null;

  const referrer = await db.query.users.findFirst({
    where: eq(users.referralCode, code),
    columns: { id: true },
  });

  if (!referrer) {
    logger.info({ code }, "Referral claim skipped: referrer not found");
    return null;
  }

  if (referrer.id === input.referredUserId) {
    logger.info(
      { userId: input.referredUserId },
      "Referral claim skipped: self-referral",
    );
    return null;
  }

  // Защита от дубля: один и тот же друг не создаёт двух записей.
  const existing = await db.query.partnerReferrals.findFirst({
    where: eq(partnerReferrals.referredUserId, input.referredUserId),
  });
  if (existing) {
    return existing;
  }

  const [row] = await db
    .insert(partnerReferrals)
    .values({
      partnerId: referrer.id,
      referredUserId: input.referredUserId,
      referralCode: code,
      status: "pending",
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create referral claim");
  }

  logger.info(
    { referrerId: referrer.id, referredUserId: input.referredUserId, code },
    "Referral claimed for new user",
  );
  return row;
}

/**
 * Вызывается из YooKassa-вебхука при успешной оплате.
 *
 * Если у владельца заказа есть pending-реферал → переводим в confirmed,
 * начисляем промокод рефереру и создаём уведомление.
 * Возвращает true, если что-то реально начислено.
 */
export async function confirmReferralForOrder(
  orderId: string,
): Promise<boolean> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    columns: { id: true, userId: true },
  });

  if (!order?.userId) return false;

  const pending = await db.query.partnerReferrals.findFirst({
    where: and(
      eq(partnerReferrals.referredUserId, order.userId),
      eq(partnerReferrals.status, "pending"),
    ),
  });

  if (!pending) return false;

  // 1. Обновляем реферал: confirmed, фиксируем orderId и сумму.
  await db
    .update(partnerReferrals)
    .set({
      status: "confirmed",
      orderId: order.id,
      commission: CLIENT_REFERRAL_COMMISSION_RUB,
    })
    .where(eq(partnerReferrals.id, pending.id));

  // 2. Выдаём рефереру промокод на 1000 ₽. Код = REF + 6 символов из id реферала.
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + CLIENT_REFERRAL_PROMO_VALID_DAYS);

  const promoCode = `REF${pending.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
  try {
    await db.insert(promoCodes).values({
      code: promoCode,
      discountType: "fixed",
      discountValue: CLIENT_REFERRAL_COMMISSION_RUB,
      maxUses: 1,
      validFrom: today.toISOString().split("T")[0]!,
      validUntil: validUntil.toISOString().split("T")[0]!,
      isActive: true,
    });
  } catch (err) {
    logger.warn(
      { err, promoCode, referralId: pending.id },
      "Failed to create referral promo code (may already exist)",
    );
  }

  logger.info(
    {
      referralId: pending.id,
      referrerId: pending.partnerId,
      orderId: order.id,
      promoCode,
    },
    "Client referral confirmed, promo code issued",
  );

  return true;
}

/**
 * Получить данные реферала, чтобы сформировать уведомление рефереру
 * ("твой друг оформил заказ"). Возвращает реферал + промокод, если confirmed.
 */
export async function getReferralWithPromo(referralId: string): Promise<{
  referral: PartnerReferral;
  referrer: User | null;
  promoCode: string;
} | null> {
  const referral = await db.query.partnerReferrals.findFirst({
    where: eq(partnerReferrals.id, referralId),
  });
  if (!referral) return null;

  const referrer = await db.query.users.findFirst({
    where: eq(users.id, referral.partnerId),
  });

  const promoCode = `REF${referral.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
  return { referral, referrer: referrer ?? null, promoCode };
}

/**
 * Список рефералов текущего клиента для страницы /dashboard/referral.
 * В отличие от партнёрского DAL, возвращаем упрощённый view — имя друга
 * или заглушку "Ожидает регистрации".
 */
export async function listClientReferrals(
  userId: string,
): Promise<ClientReferralView[]> {
  const rows = await db.query.partnerReferrals.findMany({
    where: eq(partnerReferrals.partnerId, userId),
    orderBy: [desc(partnerReferrals.createdAt)],
    with: { referredUser: true },
  });

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    status: row.status,
    commission: row.commission,
    referredUserName: row.referredUser?.name ?? null,
    referredUserEmail: row.referredUser?.email ?? null,
  }));
}
