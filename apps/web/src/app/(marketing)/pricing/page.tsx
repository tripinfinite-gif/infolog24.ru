import type { Metadata } from "next";

import { CtaSection } from "@/components/sections/cta-section";
import {
  fineData,
  includedInPrice,
  pricingFaqItems,
  pricingTiers,
  volumeDiscounts,
} from "@/content/pricing";

import { PriceAnchorBlock } from "./price-anchor-block";
import { PricingCards } from "./pricing-cards";
import { PricingCalculator } from "./pricing-calculator";
import { PricingFaq } from "./pricing-faq";
import { ReliabilityBlock } from "./reliability-block";

export const metadata: Metadata = {
  title: "Стоимость оформления пропусков | Инфологистик-24",
  description:
    "Пропуск от 12 000 ₽ за год vs штраф 215 000 ₽ за один рейс. Оформление пропусков на МКАД, ТТК и Садовое кольцо. Временный пропуск — 3 500 ₽. Скидки при оформлении автопарка.",
  openGraph: {
    title: "Стоимость оформления пропусков | Инфологистик-24",
    description:
      "Пропуск от 12 000 ₽ за год vs штраф 215 000 ₽ за один рейс. МКАД, ТТК, Садовое кольцо.",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Стоимость оформления пропусков
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Пропуск{" "}
            <span className="font-bold text-green-700">от 12 000 ₽</span>{" "}
            за год vs штраф{" "}
            <span className="font-bold text-destructive">215 000 ₽</span>{" "}
            за один рейс
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Прозрачные цены. Повторная подача при отказе — бесплатно. Временный пропуск в подарок.
          </p>
        </div>
      </section>

      {/* 2. Price Anchor Block */}
      <PriceAnchorBlock fineData={fineData} permitPrice={12000} />

      {/* 3. Pricing Cards */}
      <PricingCards tiers={pricingTiers} />

      {/* 4. Что входит в цену */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-card p-6 sm:p-8">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Что входит в цену
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Никаких скрытых доплат — всё включено в стоимость
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {includedInPrice.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-background p-4"
              >
                <svg
                  className="mt-0.5 size-5 shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Volume Discount Table */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Скидки за объём
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Чем больше машин — тем выгоднее
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {volumeDiscounts.map((discount) => (
              <div
                key={discount.label}
                className="rounded-2xl bg-card p-6 text-center shadow-sm"
              >
                <div className="text-4xl font-bold text-foreground">
                  {discount.discountPercent}%
                </div>
                <div className="mt-2 text-sm font-medium text-foreground">
                  {discount.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {discount.discountPercent === 5 && "Экономия до 3 000 ₽"}
                  {discount.discountPercent === 10 && "Экономия до 12 000 ₽"}
                  {discount.discountPercent === 15 && "Экономия от 19 800 ₽"}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Для автопарков более 20 машин — индивидуальные условия.{" "}
            <a
              href="/contacts"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Рассчитать для автопарка
            </a>
          </p>
        </div>
      </section>

      {/* 6. Calculator */}
      <PricingCalculator />

      {/* 7. Reliability Block */}
      <ReliabilityBlock />

      {/* 8. FAQ */}
      <PricingFaq items={pricingFaqItems} />

      {/* 9. CTA */}
      <CtaSection />
    </>
  );
}
