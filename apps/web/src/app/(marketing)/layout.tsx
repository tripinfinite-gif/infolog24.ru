import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JivoChat } from "@/components/integrations/jivochat";
import { Calltouch } from "@/components/integrations/calltouch";

import { PopupProvider } from "@/components/popups/popup-provider";
import { ClientWidgets } from "./client-widgets";

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
      <ClientWidgets />
      <JivoChat />
      <Calltouch />
    </>
  );
}
