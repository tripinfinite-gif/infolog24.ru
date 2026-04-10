import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { FloatingActions } from "@/components/floating-actions";
import { PopupProvider } from "@/components/popups/popup-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { JivoChat } from "@/components/integrations/jivochat";
import { Calltouch } from "@/components/integrations/calltouch";

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
    </>
  );
}
