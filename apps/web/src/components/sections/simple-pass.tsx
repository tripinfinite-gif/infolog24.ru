import { ArrowRight, Check, MapPin, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Calculator } from "@/app/(marketing)/calculator";
import { SimplePassButton } from "@/components/sections/simple-pass-button";

interface SimplePassProps {
  className?: string;
}

interface ZoneCard {
  zone: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  href: string;
}

const zones: ZoneCard[] = [
  {
    zone: "МКАД",
    price: "12 000",
    period: "за машину / год",
    features: [
      "Годовой пропуск",
      "Временный пропуск — в подарок",
      "Повторная подача бесплатно",
      "Регламент Дептранса — 10 раб. дней",
    ],
    popular: false,
    href: "/services/propusk-mkad",
  },
  {
    zone: "ТТК",
    price: "12 000",
    period: "за машину / год",
    features: [
      "Годовой пропуск",
      "Временный пропуск — в подарок",
      "Экокласс от Евро-3",
      "Регламент Дептранса — 10 раб. дней",
    ],
    popular: true,
    href: "/services/propusk-ttk",
  },
  {
    zone: "Садовое",
    price: "12 000",
    period: "за машину / год",
    features: [
      "Годовой пропуск",
      "Временный пропуск — в подарок",
      "Помощь с РНИС",
      "Регламент Дептранса — 10 раб. дней",
    ],
    popular: false,
    href: "/services/propusk-sk",
  },
];

const temporaryFeatures = [
  "Любая зона: МКАД, ТТК, СК",
  "Оформление за 1 день",
  "Срочная доставка",
  "Без ЭЦП и РНИС",
];

export function SimplePass({ className }: SimplePassProps) {
  return (
    <section
      id="passes"
      className={cn("scroll-mt-24 space-y-10", className)}
    >
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="eyebrow">single · permits</span>
            <h2 className="section-title mt-6 text-foreground">
              Нужен{" "}
              <span className="display-italic gradient-text">
                только пропуск?
              </span>{" "}
              Без проблем.
            </h2>
            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              Для тех, кому не нужен комплексный пакет — работаем как
              и&nbsp;раньше: быстро, с&nbsp;гарантией результата.
            </p>
          </div>
        </div>

        {/* Bento layout: 3 zone cards (col-span-4 each on 12-col) + 1 big "Временный" (col-span-12 на мобиле / интегрирован снизу) */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {zones.map((zone) => (
            <div
              key={zone.zone}
              className={cn(
                "relative flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 sm:p-7",
                zone.popular
                  ? "bg-gradient-to-br from-[oklch(0.22_0.06_290)] via-[oklch(0.18_0.04_280)] to-[oklch(0.15_0.02_280)] ring-neon lg:-my-2 lg:p-8"
                  : "glass hover:ring-neon-cyan"
              )}
            >
              {zone.popular && (
                <div className="absolute -top-3 left-7 rounded-full bg-highlight px-4 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-highlight-foreground shadow-md">
                  Популярное
                </div>
              )}

              {/* Header: icon + zone code */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-2xl",
                    zone.popular
                      ? "bg-primary-foreground/10 text-highlight"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  <MapPin className="size-5" />
                </div>
                <div
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.12em]",
                    zone.popular
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  )}
                >
                  Зона · годовой
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold opacity-80">
                  {zone.zone}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="stat-number">{zone.price}</span>
                  <span
                    className={cn(
                      "text-lg",
                      zone.popular
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    ₽
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    zone.popular
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  )}
                >
                  {zone.period}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {zone.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        zone.popular ? "text-highlight" : "text-accent"
                      )}
                    />
                    <span
                      className={
                        zone.popular
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <SimplePassButton
                zone={zone.zone}
                price={zone.price}
                period={zone.period}
                dark={zone.popular}
              />
              <Link
                href={zone.href}
                className={cn(
                  "mt-2 block text-center text-xs underline-offset-4 hover:underline",
                  zone.popular
                    ? "text-primary-foreground/60"
                    : "text-muted-foreground"
                )}
              >
                Подробнее →
              </Link>
            </div>
          ))}
        </div>

        {/* Big «Временный» block */}
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--amber)] via-[oklch(0.68_0.17_50)] to-[oklch(0.55_0.20_30)] p-6 text-[oklch(0.15_0.02_280)] shadow-2xl shadow-[var(--amber)]/20 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-highlight-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] backdrop-blur">
                <Zap className="size-3.5" />
                Срочный режим
              </div>
              <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Временный пропуск — от 4 500 ₽ до 10 суток
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-highlight-foreground/85 sm:text-base">
                Любая зона: МКАД, ТТК, СК. Оформим за 1 день, без ЭЦП и РНИС.
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-x-6">
                {temporaryFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-1.5">
                    <Check className="size-4 shrink-0" />
                    <span className="text-highlight-foreground/90">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-stretch gap-3 lg:min-w-[220px]">
              <div className="text-right lg:text-left">
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-highlight-foreground/70">
                  Стоимость от
                </div>
                <div className="stat-number text-highlight-foreground">
                  4 500 ₽
                </div>
              </div>
              <SimplePassButton
                zone="Временный"
                price="4 500"
                period="до 10 суток"
                dark
              />
            </div>
          </div>
        </div>
      </div>

      {/* Existing calculator (already restyled) */}
      <Calculator />

      {/* Dual CTAs */}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="shadow-md shadow-accent/25">
          <Link href="#zayavka">
            Оформить пропуск
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="border border-primary/40">
          <Link href="#packages">Пакет может быть дешевле — сравнить</Link>
        </Button>
      </div>
    </section>
  );
}
