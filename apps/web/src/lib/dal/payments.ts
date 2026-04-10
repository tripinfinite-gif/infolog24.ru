import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import type { Payment } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function createPayment(
  orderId: string,
  userId: string,
  amount: number,
): Promise<Payment> {
  const [payment] = await db
    .insert(payments)
    .values({ orderId, userId, amount })
    .returning();

  if (!payment) throw new Error("Failed to create payment");

  logger.info({ paymentId: payment.id, orderId, amount }, "Payment created");
  return payment;
}

export async function updatePaymentStatus(
  id: string,
  status: Payment["status"],
  externalId?: string,
): Promise<Payment> {
  const updates: Record<string, unknown> = { status };
  if (externalId) updates.externalId = externalId;
  if (status === "succeeded") updates.paidAt = new Date();

  const [updated] = await db
    .update(payments)
    .set(updates)
    .where(eq(payments.id, id))
    .returning();

  if (!updated) throw new Error("Payment not found");

  logger.info({ paymentId: id, status }, "Payment status updated");
  return updated;
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  return db.query.payments.findMany({
    where: eq(payments.userId, userId),
  });
}

export async function getPaymentsByOrder(orderId: string): Promise<Payment[]> {
  return db.query.payments.findMany({
    where: eq(payments.orderId, orderId),
  });
}
