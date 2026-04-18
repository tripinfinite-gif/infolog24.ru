import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/utils/base-url";

import { Calculator } from "../calculator";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Калькулятор стоимости пропуска в Москву — Инфолог24",
  description:
    "Рассчитайте стоимость оформления пропуска на МКАД, ТТК или Садовое кольцо. Годовой от 12 000 ₽, временный от 3 500 ₽. Скидки от 5 ТС.",
  keywords: [
    "калькулятор пропуска москва",
    "стоимость пропуска мкад",
    "цена пропуска грузовик",
    "расчёт пропуска в москву",
  ],
  alternates: { canonical: absoluteUrl("/calculator") },
  openGraph: {
    title: "Калькулятор стоимости пропуска — Инфолог24",
    description:
      "Точный расчёт стоимости пропуска в Москву за 10 секунд. МКАД, ТТК, Садовое.",
    url: absoluteUrl("/calculator"),
    type: "website",
  },
};

export default function CalculatorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: absoluteUrl("/") },
          { name: "Калькулятор", href: absoluteUrl("/calculator") },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <header className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Калькулятор стоимости пропуска
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Выберите зону, тип пропуска и количество ТС — получите точную цену с
            учётом всех скидок.
          </p>
        </header>
        <Calculator />
      </div>
    </>
  );
}
