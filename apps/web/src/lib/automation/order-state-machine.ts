/**
 * Order State Machine
 *
 * Defines valid states and transitions for order lifecycle.
 * Used by the UI to show available actions and by the backend
 * to validate status changes.
 */

export const ORDER_STATES = {
  draft: { label: "Черновик", next: ["documents_pending", "cancelled"] },
  documents_pending: {
    label: "Ожидание документов",
    next: ["payment_pending", "draft", "cancelled"],
  },
  payment_pending: {
    label: "Ожидание оплаты",
    next: ["processing", "documents_pending", "cancelled"],
  },
  processing: {
    label: "В обработке",
    next: ["submitted", "documents_pending", "cancelled"],
  },
  submitted: { label: "Подана", next: ["approved", "rejected"] },
  approved: { label: "Одобрена", next: [] },
  rejected: { label: "Отклонена", next: ["draft"] },
  cancelled: { label: "Отменена", next: ["draft"] },
} as const;

export type OrderStatus = keyof typeof ORDER_STATES;

const STATUS_COLORS: Record<OrderStatus, string> = {
  draft: "text-gray-500 bg-gray-100",
  documents_pending: "text-amber-700 bg-amber-100",
  payment_pending: "text-orange-700 bg-orange-100",
  processing: "text-blue-700 bg-blue-100",
  submitted: "text-indigo-700 bg-indigo-100",
  approved: "text-green-700 bg-green-100",
  rejected: "text-red-700 bg-red-100",
  cancelled: "text-gray-700 bg-gray-200",
};

/**
 * Check whether a transition from one status to another is allowed.
 */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  const state = ORDER_STATES[from];
  return (state.next as readonly string[]).includes(to);
}

/**
 * Return the list of statuses reachable from the current one.
 */
export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return [...ORDER_STATES[current].next] as OrderStatus[];
}

/**
 * Human-readable label for a status (Russian).
 */
export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATES[status].label;
}

/**
 * Tailwind color classes for a status badge.
 */
export function getStatusColor(status: OrderStatus): string {
  return STATUS_COLORS[status];
}
