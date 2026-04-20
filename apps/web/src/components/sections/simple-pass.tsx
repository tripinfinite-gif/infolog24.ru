import { ArrowRight, Check, MapPin, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Calculator } from "@/app/(marketing)/calculator";
import { SimplePassButton } from "@/components/sections/simple-pass-button";

interface SimplePassProps {
  className?: string;
}

interface SimplePassCard {
  zone: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  dark: boolean;
  icon: LucideIcon;
  href: string;
}

const services: SimplePassCard[] = [
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
    dark: false,
    icon: MapPin,
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
    dark: true,
    icon: MapPin,
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
    dark: false,
    icon: MapPin,
    href: "/services/propusk-sk",
  },
  {
    zone: "Временный",
    price: "4 500",
    period: "до 10 суток",
    features: [
      "Любая зона: МКАД, ТТК, СК",
      "Оформление за 1 день",
      "Срочная доставка",
      "Без ЭЦП и РНИС",
    ],
    popular: false,
    dark: false,
    icon: Zap,
    href: "/services/vremennyj-propusk",
  },
];

export function SimplePass({ className }: SimplePassProps) {
  return (
    <section
      id="passes"
      className={cn("scroll-mt-24 space-y-10", className)}
    >
      <div>
        <div className="mb-6 sm:mb-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Нужен только пропуск? Без проблем.
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Для тех, кому не нужен комплексный пакет — работаем как и раньше:
            быстро, с гарантией результата.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.zone}
                className={cn(
                  "relative flex flex-col rounded-2xl p-6 transition-shadow hover:shadow-lg sm:p-8",
                  service.dark
                    ? "bg-primary text-primary-foreground"
                    : "border bg-card text-card-foreground"
                )}
              >
                {service.popular && (
                  <div className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-md">
                    Популярное
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "size-4",
                      service.dark ? "text-accent" : "text-primary"
                    )}
                  />
                  <span className="text-sm font-medium opacity-70">
                    {service.zone}
                  </span>
                </div>

                <div className="mt-4">
                  <span
                    className={cn(
                      "text-4xl font-bold tracking-tight",
                      service.dark
                        ? "text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {service.price}
                  </span>
                  <span
                    className={cn(
                      "ml-1 text-lg",
                      service.dark
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    )}
                  >
                    {" "}
                    ₽
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    service.dark
                      ? "text-primary-foreground/50"
                      : "text-muted-foreground"
                  )}
                >
                  {service.period}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          service.dark ? "text-accent" : "text-primary"
                        )}
                      />
                      <span
                        className={
                          service.dark
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
                  zone={service.zone}
                  price={service.price}
                  period={service.period}
                  dark={service.dark}
                />
                <Link
                  href={service.href}
                  className="mt-2 block text-center text-xs text-muted-foreground hover:underline"
                >
                  Подробнее →
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Existing calculator */}
      <Calculator />

      {/* Dual CTAs after calculator */}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
        >
          <Link href="#zayavka">
            Оформить пропуск
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 rounded-xl px-8 text-base font-semibold"
        >
          <Link href="#packages">А может быть пакет дешевле?</Link>
        </Button>
      </div>
    </section>
  );
}
