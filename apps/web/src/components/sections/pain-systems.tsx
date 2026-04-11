"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building,
  Clock,
  FileCheck,
  FileText,
  Satellite,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { painSystems } from "@/content/pain-systems";
import { cn } from "@/lib/utils";

interface PainSystemsProps {
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  FileCheck,
  Satellite,
  FileText,
  Building,
  Clock,
  Stethoscope,
};

export function PainSystems({ className }: PainSystemsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          6 систем вместо одной
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Сегодня грузоперевозчик держит в голове 6 систем регуляторики
          и&nbsp;15 контактов. Один сбой — простой, штраф и потерянный заказ.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {painSystems.map((system, index) => {
          const Icon = iconMap[system.iconName];
          return (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative flex flex-col rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                {Icon ? <Icon className="size-6" /> : null}
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {system.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {system.pain}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
          Мы собрали всё в одно окно. Плюс добавили то, чего ни у кого нет —
          ИИ-диспетчера, который решает проблемы на трассе за водителя.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
        >
          <Link href="#packages">
            Посмотреть, как это работает
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
