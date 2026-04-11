"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Crown,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { packages, type ServicePackage } from "@/content/packages";
import { cn } from "@/lib/utils";

interface PackagesGridProps {
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Crown,
  Building2,
};

type FleetSize = "1" | "2-4" | "5-20" | "20+";

const fleetToPackage: Record<FleetSize, ServicePackage["id"]> = {
  "1": "propusk-plus",
  "2-4": "propusk-plus",
  "5-20": "tranzit-moskva",
  "20+": "flot-pro",
};

const fleetOptions: { value: FleetSize; label: string }[] = [
  { value: "1", label: "1 машина" },
  { value: "2-4", label: "2–4" },
  { value: "5-20", label: "5–20" },
  { value: "20+", label: "20+" },
];

export function PackagesGrid({ className }: PackagesGridProps) {
  const [selectedFleet, setSelectedFleet] = useState<FleetSize | null>(null);
  const highlightedPackageId = selectedFleet
    ? fleetToPackage[selectedFleet]
    : null;

  return (
    <motion.section
      id="packages"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative scroll-mt-24 overflow-hidden rounded-3xl border bg-card p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Три пакета — под размер вашего парка
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Всё, что нужно, чтобы возить грузы в Москву и не думать
          о&nbsp;регуляторике. Внутри пакета — дешевле, чем по отдельности.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {packages.map((pkg, index) => {
          const Icon = iconMap[pkg.iconName];
          const isSelected = highlightedPackageId === pkg.id;
          const isHighlighted = pkg.highlighted;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-background p-6 transition-all sm:p-8",
                isHighlighted
                  ? "border-accent shadow-xl"
                  : "border-border hover:shadow-lg",
                isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-card"
              )}
            >
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground shadow-md">
                  Рекомендуем
                </div>
              )}

              <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                {Icon ? <Icon className="size-7" /> : null}
              </div>

              <h3 className="text-2xl font-bold text-foreground">{pkg.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{pkg.tagline}</p>
              <p className="mt-3 text-sm font-medium text-foreground">
                {pkg.targetAudience}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-3">
                <p className="text-lg font-bold text-foreground">
                  {pkg.priceFrom}
                </p>
                {pkg.savingsLabel && (
                  <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {pkg.savingsLabel}
                  </span>
                )}
              </div>

              <Button
                asChild
                size="lg"
                className={cn(
                  "mt-6 h-12 w-full rounded-xl text-base font-semibold",
                  isHighlighted
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Link href={pkg.ctaHref}>
                  {pkg.ctaLabel}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Мини-калькулятор подбора */}
      <div className="mt-12 rounded-2xl border bg-background p-6 sm:p-8">
        <div className="text-center">
          <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Какой пакет мне подходит?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Выберите размер парка — подсветим подходящий пакет
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          {fleetOptions.map((option) => {
            const active = selectedFleet === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedFleet(option.value)}
                className={cn(
                  "rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "border-accent bg-accent text-accent-foreground shadow-md"
                    : "border-border bg-card text-foreground hover:border-accent hover:text-accent"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
