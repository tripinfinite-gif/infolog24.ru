import { and, eq, gte, lte, or, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { promoCodes, orders } from "@/lib/db/schema";
import type { NewPromoCode, PromoCode } from "@/lib/types";
import { logger } from "@/lib/logger";

export interface PromoValidation {
  valid: boolean;
  discount?: { type: "percent" | "fixed"; value: number };
  reason?: string;
}

export async function validatePromoCode(code: string): Promise<PromoValidation> {
  const today = new Date().toISOString().split("T")[0]!;

  const promo = await db.query.promoCodes.findFirst({
    where: and(
      eq(promoCodes.code, code.toUpperCase()),
      eq(promoCodes.isActive, true),
    ),
  });

  if (!promo) {
    return { valid: false, reason: "Промокод не найден" };
  }

  if (promo.validFrom > today) {
    return { valid: false, reason: "Промокод ещё не активен" };
  }

  if (promo.validUntil && promo.validUntil < today) {
    return { valid: false, reason: "Промокод истёк" };
  }

  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return { valid: false, reason: "Промокод использован максимальное число раз" };
  }

  return {
    valid: true,
    discount: {
      type: promo.discountType,
      value: promo.discountValue,
    },
  };
}

export async function applyPromoCode(
  code: string,
  orderId: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    const promo = await tx.query.promoCodes.findFirst({
      where: and(
        eq(promoCodes.code, code.toUpperCase()),
        eq(promoCodes.isActive, true),
      ),
    });

    if (!promo) throw new Error("Promo code not found");

    await tx
      .update(promoCodes)
      .set({ usedCount: sql`${promoCodes.usedCount} + 1` })
      .where(eq(promoCodes.id, promo.id));

    const discount =
      promo.discountType === "percent" ? promo.discountValue : promo.discountValue;

    await tx
      .update(orders)
      .set({ promoCode: code.toUpperCase(), discount })
      .where(eq(orders.id, orderId));

    logger.info({ code, orderId }, "Promo code applied");
  });
}

export async function createPromoCode(
  data: Omit<NewPromoCode, "id" | "createdAt" | "usedCount">,
): Promise<PromoCode> {
  const [promo] = await db
    .insert(promoCodes)
    .values({ ...data, code: data.code.toUpperCase() })
    .returning();

  if (!promo) throw new Error("Failed to create promo code");

  logger.info({ promoId: promo.id, code: promo.code }, "Promo code created");
  return promo;
}
