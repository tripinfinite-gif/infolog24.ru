"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServicesOverviewProps {
  className?: string;
}

const services = [
  {
    zone: "МКАД",
    price: "12 000",
    period: "за машину / год",
    features: [
      "Годовой пропуск",
      "Временный пропуск — в подарок",
      "Повторная подача бесплатно",
      "Средний срок — 3 дня",
    ],
    popular: false,
    dark: false,
    icon: MapPin,
  },
  {
    zone: "ТТК",
    price: "12 000",
    period: "за машину / год",
    features: [
      "Годовой пропуск",
      "Временный пропуск — в подарок",
      "Экокласс от Евро-3",
      "Средний срок — 5 дней",
    ],
    popular: true,
    dark: true,
    icon: MapPin,
  },
  {
    zone: "Садовое",
    price: "12 000",
    period: "за машину / год",
    features: [
      "Годовой пропуск",
      "Временный пропуск — в подарок",
      "Помощь с РНИС",
      "Средний срок — 7 дней",
    ],
    popular: false,
    dark: false,
    icon: MapPin,
  },
  {
    zone: "Временный",
    price: "3 500",
    period: "до 5 суток",
    features: [
      "Любая зона: МКАД, ТТК, СК",
      "Оформление за 1 день",
      "Срочная доставка",
      "Без ЭЦП и РНИС",
    ],
    popular: false,
    dark: false,
    icon: Zap,
  },
];

export function ServicesOverview({ className }: ServicesOverviewProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Стоимость пропусков
        </h2>
        <p className="mt-2 text-muted-foreground">
          Фиксированная цена. Никаких скрытых платежей.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.zone}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "relative flex flex-col rounded-2xl p-6 sm:p-8 transition-shadow hover:shadow-lg",
              service.dark
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground"
            )}
          >
            {service.popular && (
              <div className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Популярное
              </div>
            )}

            <div className="flex items-center gap-2">
              <service.icon className={cn("size-4", service.dark ? "text-accent" : "text-primary")} />
              <span className="text-sm font-medium opacity-70">{service.zone}</span>
            </div>

            <div className="mt-4">
              <span className={cn("text-4xl font-bold tracking-tight", service.dark ? "text-primary-foreground" : "text-foreground")}>
                {service.price}
              </span>
              <span className={cn("ml-1 text-lg", service.dark ? "text-primary-foreground/60" : "text-muted-foreground")}> ₽</span>
            </div>
            <p className={cn("mt-1 text-xs", service.dark ? "text-primary-foreground/50" : "text-muted-foreground")}>
              {service.period}
            </p>

            <ul className="mt-6 flex-1 space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className={cn("mt-0.5 size-4 shrink-0", service.dark ? "text-accent" : "text-primary")} />
                  <span className={service.dark ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className={cn(
                "mt-6 w-full rounded-xl",
                service.dark
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Link href="/contacts">
                Оформить
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Discount note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-muted-foreground"
      >
        Скидки от 5% при оформлении от 2 машин.{" "}
        <Link href="/services" className="font-medium text-foreground underline-offset-4 hover:underline">
          Подробнее об услугах →
        </Link>
      </motion.p>
    </div>
  );
}
