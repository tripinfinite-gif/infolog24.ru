"use client";

import dynamic from "next/dynamic";

const StickyCTA = dynamic(
  () => import("@/components/sticky-cta").then((m) => m.StickyCTA),
  { ssr: false },
);
const FloatingActions = dynamic(
  () => import("@/components/floating-actions").then((m) => m.FloatingActions),
  { ssr: false },
);
const CookieConsent = dynamic(
  () => import("@/components/cookie-consent").then((m) => m.CookieConsent),
  { ssr: false },
);
const ChatWidget = dynamic(
  () => import("@/components/chat/chat-widget").then((m) => m.ChatWidget),
  { ssr: false },
);

export function ClientWidgets() {
  return (
    <>
      <StickyCTA />
      <FloatingActions />
      <CookieConsent />
      <ChatWidget />
    </>
  );
}
