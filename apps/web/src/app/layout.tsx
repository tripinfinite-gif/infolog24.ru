import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { CallbackWidget } from "@/components/callback-widget";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { JivoChat } from "@/components/integrations/jivochat";
import { Calltouch } from "@/components/integrations/calltouch";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Инфологистик-24 — Пропуска в Москву для грузового транспорта",
  description:
    "Оформление пропусков на МКАД, ТТК и Садовое кольцо. Быстро, надёжно, с гарантией результата.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <StickyCTA />
        <CallbackWidget />
        <AnalyticsProvider />
        <CookieConsent />
        <JivoChat />
        <Calltouch />
      </body>
    </html>
  );
}
