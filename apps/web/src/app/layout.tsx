import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
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

// Distinctive display serif — used only for hero/section h1-h2
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "700", "900"],
  style: ["normal", "italic"],
});

// Technical mono for numeric accents, eyebrows, timestamps
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Инфолог24 — Пропуска в Москву для грузового транспорта",
  description:
    "Помогаем оформить пропуск на МКАД, ТТК и Садовое кольцо. Быстро, надёжно, с гарантией результата.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Инфолог24",
  },
  verification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
    ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`dark ${inter.variable} ${manrope.variable} ${playfair.variable} ${mono.variable}`}
    >
      <body className={inter.className}>
        {children}
        <Toaster />
        <AnalyticsProvider />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
