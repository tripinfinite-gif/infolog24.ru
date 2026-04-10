import { logger } from "@/lib/logger";
import { notificationService } from "@/lib/notifications/service";

/**
 * Handle side effects when an order changes status.
 *
 * Called after the status has been persisted. Triggers notifications
 * and (in the future) integrations like Bitrix24.
 */
export async function onOrderStatusChange(
  orderId: string,
  fromStatus: string,
  toStatus: string,
  changedBy: string,
  orderData: {
    userId: string;
    orderNumber: string;
    passType: string;
    zone: string;
  },
): Promise<void> {
  // Map target status to notification event name
  const eventMap: Record<string, string> = {
    documents_pending: "order_documents_needed",
    payment_pending: "order_payment_needed",
    processing: "order_processing",
    submitted: "order_submitted",
    approved: "order_approved",
    rejected: "order_rejected",
    cancelled: "order_cancelled",
  };

  const event = eventMap[toStatus];
  if (event) {
    await notificationService.send({
      userId: orderData.userId,
      event,
      data: {
        orderNumber: orderData.orderNumber,
        passType: orderData.passType,
        zone: orderData.zone,
        fromStatus,
        toStatus,
      },
    });
  }

  logger.info(
    { orderId, fromStatus, toStatus, changedBy },
    "Order status changed — side effects processed",
  );
}
