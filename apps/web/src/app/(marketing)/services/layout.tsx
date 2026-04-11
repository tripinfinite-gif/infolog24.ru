import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Пропуска в Москву — МКАД, ТТК, Садовое кольцо | Инфолог24",
  description:
    "Оформим пропуск для грузового транспорта в Москву за 3 дня. МКАД от 12 000 ₽, ТТК, Садовое кольцо. Временный пропуск бесплатно при заказе годового.",
  openGraph: {
    title: "Пропуска в Москву — МКАД, ТТК, Садовое кольцо | Инфолог24",
    description:
      "Оформим пропуск для грузового транспорта в Москву за 3 дня. Годовой от 12 000 ₽, временный — 3 500 ₽.",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
