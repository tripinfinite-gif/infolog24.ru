import { logger } from "@/lib/logger";
import { dispatchNotification } from "@/lib/notifications/dispatcher";
import type { OrderStatus } from "./order-state-machine";

export interface OrderContext {
  userId: string;
  orderNumber: string;
  passType: string;
  zone: string;
  amount?: number;
  reason?: string;
  permitNumber?: string;
  validUntil?: string;
}

/**
 * Map a `from → to` transition to the notification events that should fire.
 *
 * Most transitions fire a single event, but some (payment_pending →
 * processing) fire two (payment succeeded + processing started).
 */
function eventsForTransition(
  from: OrderStatus | string,
  to: OrderStatus | string,
): string[] {
  // Terminal reject from any state.
  if (to === "rejected") return ["order_rejected"];
  if (to === "cancelled") return ["order_cancelled"];

  // Happy-path transitions.
  if (from === "draft" && to === "documents_pending") {
    return ["order_documents_required"];
  }
  if (from === "documents_pending" && to === "payment_pending") {
    return ["order_payment_required"];
  }
  if (from === "payment_pending" && to === "processing") {
    return ["payment_succeeded", "order_processing"];
  }
  if (from === "processing" && to === "submitted") {
    return ["order_submitted"];
  }
  if (from === "submitted" && to === "approved") {
    return ["order_approved", "permit_issued"];
  }

  // Fallback — still notify the user of a status change.
  return ["order_status_changed"];
}

/**
 * Hook: called from the order DAL after a status transition is persisted.
 *
 * Dispatches the appropriate notification(s) for the transition.
 * Failures are logged but never thrown — automation must not block the
 * primary write path.
 */
export async function onOrderStatusChange(
  order: { id: string } & OrderContext,
  oldStatus: string,
  newStatus: string,
  comment?: string,
): Promise<void> {
  const events = eventsForTransition(oldStatus, newStatus);

  const data: Record<string, string> = {
    orderNumber: order.orderNumber,
    passType: order.passType,
    zone: order.zone,
    fromStatus: oldStatus,
    toStatus: newStatus,
  };
  if (order.amount != null) data.amount = String(order.amount);
  if (order.reason) data.reason = order.reason;
  if (order.permitNumber) data.permitNumber = order.permitNumber;
  if (order.validUntil) data.validUntil = order.validUntil;
  if (comment) data.comment = comment;

  for (const event of events) {
    try {
      await dispatchNotification({
        userId: order.userId,
        type: event,
        data,
      });
    } catch (error) {
      logger.error(
        { error, orderId: order.id, event },
        "Failed to dispatch status-change notification",
      );
    }
  }

  logger.info(
    {
      orderId: order.id,
      fromStatus: oldStatus,
      toStatus: newStatus,
      events,
    },
    "Order status changed — side effects processed",
  );
}
