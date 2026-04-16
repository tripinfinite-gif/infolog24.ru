import dynamic from "next/dynamic";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JivoChat } from "@/components/integrations/jivochat";
import { Calltouch } from "@/components/integrations/calltouch";

import { PopupProvider } from "@/components/popups/popup-provider";

// Heavy client components — lazy-loaded, not needed for FCP/LCP
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

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <PopupProvider>
        <main className="min-h-screen">{children}</main>
      </PopupProvider>
      <Footer />
      <StickyCTA />
      <FloatingActions />
      <CookieConsent />
      <JivoChat />
      <Calltouch />
      <ChatWidget />
    </>
  );
}
