import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, payments, partnerReferrals } from "@/lib/db/schema";
import * as paymentsDAL from "@/lib/dal/payments";
import { validatePromoCode, applyPromoCode } from "@/lib/dal/promo-codes";
import { createNotification } from "@/lib/dal/notifications";
import {
  confirmReferralForOrder,
  getReferralWithPromo,
} from "@/lib/dal/referrals";
import { getYooKassaClient } from "./yookassa";
import { pricingTiers } from "@/content/pricing";
import { logger } from "@/lib/logger";

/**
 * Безопасность: серверный расчёт базовой цены по типу и зоне заказа.
 * Никогда не доверяем цене, переданной клиентом или сохранённой из клиентского запроса.
 */
function calculateServerSidePrice(
  orderType: string,
  orderZone: string,
): number {
  // Временный пропуск — фиксированная цена, зона не влияет
  if (orderType === "temp") {
    const tempTier = pricingTiers.find((t) => t.type === "temp");
    if (!tempTier) {
      throw new Error("Тариф для временного пропуска не найден");
    }
    return tempTier.price;
  }

  // Годовой пропуск — ищем по зоне
  const tier = pricingTiers.find(
    (t) => t.zone === orderZone && t.type === "annual",
  );
  if (!tier) {
    throw new Error(
      `Тариф не найден для зоны "${orderZone}" и типа "${orderType}"`,
    );
  }

  return tier.price;
}

interface InitiatePaymentResult {
  paymentUrl: string;
  paymentId: string;
}

export class PaymentService {
  /**
   * Create a YooKassa payment for an order and return the redirect URL.
   */
  async initiatePayment(
    orderId: string,
    userId: string,
    options?: {
      promoCode?: string;
      returnUrl?: string;
      customerEmail?: string;
      customerPhone?: string;
      paymentMethod?: "sbp" | "bank_card" | "yoo_money";
    },
  ): Promise<InitiatePaymentResult> {
    // 1. Get order details
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { user: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("Order does not belong to user");
    }

    if (order.status !== "payment_pending" && order.status !== "draft") {
      throw new Error(`Cannot pay for order in status: ${order.status}`);
    }

    // 2. Безопасность: рассчитываем базовую цену на сервере по типу и зоне заказа.
    // Не используем order.price напрямую — он мог быть установлен из клиентского запроса.
    const serverPrice = calculateServerSidePrice(order.type, order.zone);

    if (order.price !== serverPrice) {
      logger.warn(
        {
          orderId,
          orderPrice: order.price,
          serverPrice,
          orderType: order.type,
          orderZone: order.zone,
        },
        "Цена в заказе не совпадает с серверным расчётом — используем серверную цену",
      );
    }

    // 3. Apply promo code discount if provided
    let finalAmount = serverPrice - order.discount;

    if (options?.promoCode) {
      const validation = await validatePromoCode(options.promoCode);
      if (!validation.valid || !validation.discount) {
        throw new Error(validation.reason ?? "Invalid promo code");
      }

      await applyPromoCode(options.promoCode, orderId);

      // Re-calculate with the new discount
      if (validation.discount.type === "percent") {
        const discountAmount = Math.round(
          (order.price * validation.discount.value) / 100,
        );
        finalAmount = order.price - discountAmount;
      } else {
        finalAmount = order.price - validation.discount.value;
      }
    }

    // Ensure amount is at least 1 ruble
    finalAmount = Math.max(finalAmount, 1);

    // 4. Create payment record in DB
    const payment = await paymentsDAL.createPayment(orderId, userId, finalAmount);

    // 5. Create YooKassa payment
    const yookassa = getYooKassaClient();
    const returnUrl =
      options?.returnUrl ??
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}`;

    const yookassaPayment = await yookassa.createPayment({
      amount: finalAmount,
      orderId,
      description: `Оплата заказа #${orderId.slice(0, 8)}`,
      returnUrl,
      customerEmail: options?.customerEmail ?? order.user.email,
      customerPhone: options?.customerPhone ?? order.user.phone ?? undefined,
      paymentMethod: options?.paymentMethod,
      itemType: "service",
    });

    // 6. Update payment with external ID
    await paymentsDAL.updatePaymentStatus(
      payment.id,
      "pending",
      yookassaPayment.id,
    );

    // 7. Update order status to payment_pending if it was draft
    if (order.status === "draft") {
      await db
        .update(orders)
        .set({ status: "payment_pending" })
        .where(eq(orders.id, orderId));
    }

    const paymentUrl = yookassaPayment.confirmation?.confirmation_url;
    if (!paymentUrl) {
      throw new Error("No confirmation URL returned from YooKassa");
    }

    logger.info(
      {
        paymentId: payment.id,
        externalId: yookassaPayment.id,
        orderId,
        amount: finalAmount,
      },
      "Payment initiated",
    );

    return { paymentUrl, paymentId: payment.id };
  }

  /**
   * Process a YooKassa webhook event.
   */
  async handleWebhook(event: {
    type: string;
    event: string;
    object: {
      id: string;
      status: string;
      amount?: { value: string; currency: string };
      metadata?: Record<string, string>;
      payment_id?: string; // present on refund events
    };
  }): Promise<void> {
    const { object } = event;
    const eventType = event.event;

    logger.info(
      { eventType, objectId: object.id, status: object.status },
      "Processing webhook event",
    );

    if (eventType === "payment.succeeded") {
      await this.handlePaymentSucceeded(object.id);
    } else if (eventType === "payment.canceled") {
      await this.handlePaymentCanceled(object.id);
    } else if (eventType === "refund.succeeded") {
      await this.handleRefundSucceeded(object.payment_id ?? object.id);
    } else {
      logger.warn({ eventType }, "Unknown webhook event type");
    }
  }

  private async handlePaymentSucceeded(externalId: string): Promise<void> {
    const payment = await this.findPaymentByExternalId(externalId);
    if (!payment) {
      logger.warn({ externalId }, "Payment not found for succeeded webhook");
      return;
    }

    await paymentsDAL.updatePaymentStatus(payment.id, "succeeded", externalId);

    // Update order status to "processing"
    await db
      .update(orders)
      .set({ status: "processing" })
      .where(eq(orders.id, payment.orderId));

    logger.info(
      { paymentId: payment.id, orderId: payment.orderId },
      "Payment succeeded, order moved to processing",
    );

    // Реферальная программа: если заказ — первый у приведённого друга,
    // начисляем рефереру промокод на 1000 ₽ и шлём уведомление.
    // Любая ошибка ловится внутри — webhook не должен падать из-за бонусов.
    try {
      const confirmed = await confirmReferralForOrder(payment.orderId);
      if (confirmed) {
        await this.notifyReferrerOnConfirm(payment.orderId);
      }
    } catch (err) {
      logger.error(
        { err, orderId: payment.orderId },
        "Referral processing failed (non-fatal)",
      );
    }
  }

  /**
   * Уведомить реферера о подтверждённом заказе друга и выданном промокоде.
   */
  private async notifyReferrerOnConfirm(orderId: string): Promise<void> {
    const referral = await db.query.partnerReferrals.findFirst({
      where: eq(partnerReferrals.orderId, orderId),
    });
    if (!referral) return;

    const bundle = await getReferralWithPromo(referral.id);
    if (!bundle?.referrer) return;

    await createNotification({
      userId: bundle.referrer.id,
      type: "referral_bonus",
      channel: "email",
      title: "Ваш друг оформил заказ — бонус 1000 ₽",
      body: `Поздравляем! Вы получили скидку 1000 ₽ на следующий заказ. Промокод: ${bundle.promoCode}`,
      metadata: {
        promoCode: bundle.promoCode,
        referralId: bundle.referral.id,
        orderId,
      },
      status: "pending",
    });

    logger.info(
      {
        referrerId: bundle.referrer.id,
        promoCode: bundle.promoCode,
        orderId,
      },
      "Referrer notified about bonus",
    );
  }

  private async handlePaymentCanceled(externalId: string): Promise<void> {
    const payment = await this.findPaymentByExternalId(externalId);
    if (!payment) {
      logger.warn({ externalId }, "Payment not found for canceled webhook");
      return;
    }

    await paymentsDAL.updatePaymentStatus(payment.id, "cancelled", externalId);

    logger.info(
      { paymentId: payment.id, orderId: payment.orderId },
      "Payment cancelled",
    );
  }

  private async handleRefundSucceeded(paymentExternalId: string): Promise<void> {
    const payment = await this.findPaymentByExternalId(paymentExternalId);
    if (!payment) {
      logger.warn(
        { paymentExternalId },
        "Payment not found for refund webhook",
      );
      return;
    }

    await paymentsDAL.updatePaymentStatus(payment.id, "refunded");

    logger.info(
      { paymentId: payment.id, orderId: payment.orderId },
      "Refund succeeded",
    );
  }

  /**
   * Get payment status by internal payment ID.
   */
  async getPaymentStatus(paymentId: string): Promise<string> {
    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, paymentId),
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // If pending, check with YooKassa for latest status
    if (payment.status === "pending" && payment.externalId) {
      const yookassa = getYooKassaClient();
      const yookassaPayment = await yookassa.getPayment(payment.externalId);

      if (yookassaPayment.status === "succeeded") {
        await this.handlePaymentSucceeded(payment.externalId);
        return "succeeded";
      } else if (yookassaPayment.status === "canceled") {
        await this.handlePaymentCanceled(payment.externalId);
        return "cancelled";
      }
    }

    return payment.status;
  }

  /**
   * Request a refund for a payment.
   */
  async requestRefund(
    paymentId: string,
    amount?: number,
  ): Promise<void> {
    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, paymentId),
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "succeeded") {
      throw new Error("Can only refund succeeded payments");
    }

    if (!payment.externalId) {
      throw new Error("Payment has no external ID");
    }

    const yookassa = getYooKassaClient();
    await yookassa.createRefund({
      paymentId: payment.externalId,
      amount,
      description: `Возврат по заказу #${payment.orderId.slice(0, 8)}`,
    });

    // Mark as refunded immediately (webhook will also confirm)
    await paymentsDAL.updatePaymentStatus(payment.id, "refunded");

    logger.info(
      { paymentId: payment.id, orderId: payment.orderId, amount },
      "Refund requested",
    );
  }

  private async findPaymentByExternalId(externalId: string) {
    return db.query.payments.findFirst({
      where: eq(payments.externalId, externalId),
    });
  }
}

// Singleton
let service: PaymentService | null = null;

export function getPaymentService(): PaymentService {
  if (!service) {
    service = new PaymentService();
  }
  return service;
}
