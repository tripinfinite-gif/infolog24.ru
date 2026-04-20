import type { Metadata } from "next";
import type { ReactNode } from "react";

// ISR: revalidate every 1 hour — services data changes infrequently
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Пропуска в Москву — МКАД, ТТК, Садовое кольцо | Инфолог24",
  description:
    "Помогаем оформить пропуск для грузового транспорта в Москву. МКАД, ТТК, Садовое кольцо — все зоны по 12 000 ₽. Регламент — 10 рабочих дней. Временный пропуск бесплатно при заказе годового.",
  openGraph: {
    title: "Пропуска в Москву — МКАД, ТТК, Садовое кольцо | Инфолог24",
    description:
      "Помогаем оформить пропуск для грузового транспорта в Москву. Годовой на любую зону — 12 000 ₽, временный — 4 500 ₽.",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
