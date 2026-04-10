"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-primary p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary via-primary to-foreground/80 opacity-90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-accent/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        {/* Left: text content */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/80"
          >
            <span className="size-2 rounded-full bg-accent" />
            10 лет на рынке — 50 000+ пропусков
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-7xl"
          >
            Один рейс без пропуска{" "}
            <span className="text-accent">=&nbsp;штраф 215&nbsp;000&nbsp;₽</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-primary-foreground/70 sm:text-lg"
          >
            Оформим пропуск на МКАД, ТТК и Садовое кольцо за&nbsp;3&nbsp;дня.
            Вы отдаёте документы — мы делаем всё остальное.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-13 px-8 text-base font-semibold bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-xl transition-all rounded-xl"
            >
              <Link href="/contacts">
                Получить расчёт за 2 минуты
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 border-primary-foreground/20 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-xl"
            >
              <Link href="#calculator">
                <Calculator className="mr-2 size-4" />
                Рассчитать стоимость
              </Link>
            </Button>
          </motion.div>

          {/* Mini stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-8"
          >
            {[
              { value: "10+", label: "лет опыта" },
              { value: "50K+", label: "пропусков" },
              { value: "98%", label: "одобрение" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary-foreground sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs text-primary-foreground/50 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: hero image */}
        <div className="hidden lg:block">
          <div className="relative h-[400px] w-[340px] overflow-hidden rounded-2xl">
            <Image
              src="/images/moscow-city-truck.jpg"
              alt="Грузовик на фоне Москва-Сити"
              fill
              className="object-cover"
              sizes="340px"
              priority
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
