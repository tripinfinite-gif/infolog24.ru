// Helper functions to track custom events

declare global {
  interface Window {
    ym: (...args: unknown[]) => void;
    gtag: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number>,
) {
  // Yandex Metrika
  if (typeof window !== "undefined" && window.ym) {
    const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
    if (ymId) {
      window.ym(Number(ymId), "reachGoal", eventName, params);
    }
  }

  // GA4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Pre-defined events
export const analytics = {
  orderStarted: () => trackEvent("order_started"),
  orderCompleted: (orderId: string) =>
    trackEvent("order_completed", { order_id: orderId }),
  calculatorUsed: (zone: string, price: number) =>
    trackEvent("calculator_used", { zone, price }),
  callbackRequested: () => trackEvent("callback_requested"),
  documentUploaded: (type: string) =>
    trackEvent("document_uploaded", { doc_type: type }),
  chatOpened: () => trackEvent("chat_opened"),
  paymentStarted: (amount: number) =>
    trackEvent("payment_started", { amount }),
  promoCodeApplied: (code: string) => trackEvent("promo_applied", { code }),
  leadModalOpened: (source: string) =>
    trackEvent("lead_modal_opened", { source }),
  leadModalSubmitted: (source: string) =>
    trackEvent("lead_modal_submitted", { source }),
  leadModalClosed: (source: string, submitted: boolean) =>
    trackEvent("lead_modal_closed", { source, submitted: submitted ? 1 : 0 }),
};
