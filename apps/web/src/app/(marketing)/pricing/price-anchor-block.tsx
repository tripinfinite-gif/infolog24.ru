"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Shield, TrendingDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { FineData } from "@/content/pricing";

interface PriceAnchorBlockProps {
  fineData: FineData;
  permitPrice: number;
}

export function PriceAnchorBlock({
  fineData,
  permitPrice,
}: PriceAnchorBlockProps) {
  const savings = (
    ((fineData.totalPerTrip - permitPrice) / fineData.totalPerTrip) *
    100
  ).toFixed(1);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl"
        >
          Один рейс без пропуска дороже,{" "}
          <span className="text-destructive">чем пропуск на год</span>
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — Without permit (red/destructive) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-destructive/5 p-6 sm:p-8"
          >
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-destructive/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                <span className="text-sm font-bold uppercase tracking-wide">
                  Без пропуска
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-baseline justify-between border-b border-destructive/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Штраф за проезд
                  </span>
                  <span className="text-lg font-bold text-destructive">
                    {fineData.finePerCamera.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-destructive/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Камер на МКАД
                  </span>
                  <span className="text-lg font-bold text-destructive">
                    {fineData.camerasOnMkad}+
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-destructive/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Повторное нарушение
                  </span>
                  <span className="text-lg font-bold text-destructive">
                    {fineData.fineRepeat.toLocaleString("ru-RU")} ₽ / камера
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-destructive/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Скидка за ранн. оплату
                  </span>
                  <span className="text-lg font-bold text-destructive">
                    снижена до {fineData.earlyPaymentDiscount}%
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-destructive/10 p-4">
                <div className="text-sm font-medium text-foreground/70">
                  Итого за ОДИН рейс по МКАД
                </div>
                <div className="mt-1 text-3xl font-bold text-destructive sm:text-4xl">
                  {fineData.totalPerTrip.toLocaleString("ru-RU")} ₽
                </div>
                <div className="mt-2 text-sm text-foreground/60">
                  {fineData.finePerCamera.toLocaleString("ru-RU")} ₽ x{" "}
                  {fineData.camerasOnMkad} камер
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-destructive/10 p-4">
                <div className="text-sm font-medium text-foreground/70">
                  Потери за месяц
                </div>
                <div className="mt-1 text-2xl font-bold text-destructive sm:text-3xl">
                  {fineData.totalPerMonth.toLocaleString("ru-RU")}+ ₽
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — With permit (green/success) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-green-50 p-6 dark:bg-green-950/20 sm:p-8"
          >
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-green-500/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-500">
                <Shield className="size-5" />
                <span className="text-sm font-bold uppercase tracking-wide">
                  С пропуском
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-baseline justify-between border-b border-green-600/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Годовой пропуск
                  </span>
                  <span className="text-lg font-bold text-green-700 dark:text-green-500">
                    от {permitPrice.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-green-600/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Штрафы
                  </span>
                  <span className="text-lg font-bold text-green-700 dark:text-green-500">
                    0 ₽
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-green-600/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Временный пропуск
                  </span>
                  <span className="text-lg font-bold text-green-700 dark:text-green-500">
                    Бесплатно
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-green-600/15 pb-3">
                  <span className="text-sm text-foreground/70">
                    Повторная подача
                  </span>
                  <span className="text-lg font-bold text-green-700 dark:text-green-500">
                    Бесплатно
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-green-100 p-4 dark:bg-green-900/30">
                <div className="text-sm font-medium text-foreground/70">
                  Стоимость за ГОД
                </div>
                <div className="mt-1 text-3xl font-bold text-green-700 dark:text-green-500 sm:text-4xl">
                  от {permitPrice.toLocaleString("ru-RU")} ₽
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-500">
                  <TrendingDown className="size-4" />
                  Экономия: {savings}%
                </div>
              </div>

              <div className="mt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
                >
                  <Link href="/contacts">
                    Оформить пропуск
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary line */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Один рейс без пропуска стоит в{" "}
          <span className="font-bold text-destructive">
            {Math.round(fineData.totalPerTrip / permitPrice)} раз дороже
          </span>
          , чем пропуск на целый год.
          Штрафы фиксируются камерами автоматически — каждая камера = отдельный штраф.
        </motion.p>
      </div>
    </section>
  );
}
