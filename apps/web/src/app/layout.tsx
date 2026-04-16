import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Инфолог24 — Пропуска в Москву для грузового транспорта",
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
        {children}
        <Toaster />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
