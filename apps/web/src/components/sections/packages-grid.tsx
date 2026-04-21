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

import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
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
  const [modalState, setModalState] = useState<{
    open: boolean;
    pkg: ServicePackage | null;
  }>({
    open: false,
    pkg: null,
  });
  const highlightedPackageId = selectedFleet
    ? fleetToPackage[selectedFleet]
    : null;

  return (
    <motion.section
      id="packages"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative mx-auto w-full max-w-7xl scroll-mt-24",
        className
      )}
    >
      {/* Header row: 2-col — eyebrow+title LEFT, fleet selector RIGHT */}
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <span className="eyebrow eyebrow-cyan">pricing · 03 tiers</span>
          <h2 className="section-title mt-6 text-foreground">
            Три пакета —{" "}
            <span className="display-italic gradient-text">
              под размер парка.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
            Всё, что нужно, чтобы возить грузы в Москву и не думать
            о&nbsp;регуляторике. Внутри пакета — дешевле, чем по отдельности.
          </p>
        </div>

        {/* Inline fleet selector — mono pill group */}
        <div className="lg:justify-self-end">
          <div className="mono-label">your fleet</div>
          <div className="mt-3 inline-flex gap-1 rounded-full bg-foreground/[0.04] p-1 ring-1 ring-border/80 backdrop-blur">
            {fleetOptions.map((option) => {
              const active = selectedFleet === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedFleet(option.value)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all sm:px-4",
                    active
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Packages — 3 cards, featured center raised & larger */}
      <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-5">
        {packages.map((pkg, index) => {
          const Icon = iconMap[pkg.iconName];
          const isSelected = highlightedPackageId === pkg.id;
          const isHighlighted = pkg.highlighted;

          // Col widths: outer 4/12, center 4/12 but raised; keeps equal
          const colClass = "lg:col-span-4";

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-[24px] p-7 transition-all sm:p-8",
                colClass,
                isHighlighted
                  ? "bg-gradient-to-br from-[oklch(0.20_0.06_290)] via-[oklch(0.18_0.04_280)] to-[oklch(0.15_0.02_280)] ring-neon text-foreground lg:-my-4 lg:p-10"
                  : "glass hover:-translate-y-1 hover:ring-neon-cyan",
                isSelected && !isHighlighted && "ring-neon-cyan",
                isSelected && isHighlighted && "ring-neon-amber"
              )}
            >
              {isHighlighted && (
                <div className="absolute -top-3 left-7 flex items-center gap-1.5 rounded-full bg-[var(--amber)] px-4 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[oklch(0.15_0.02_280)] shadow-lg shadow-[var(--amber)]/30">
                  <span className="size-1.5 rounded-full bg-[oklch(0.15_0.02_280)]" />
                  recommended
                </div>
              )}

              {/* Header row: icon + tier name */}
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl ring-1",
                    isHighlighted
                      ? "bg-[var(--amber)]/15 text-[var(--amber)] ring-[var(--amber)]/30"
                      : "bg-foreground/5 text-[var(--violet)] ring-border/80"
                  )}
                >
                  {Icon ? <Icon className="size-6" /> : null}
                </div>
                <span className="mono-label">
                  pkg · {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3
                className={cn(
                  "mt-6 font-display font-medium tracking-tight",
                  isHighlighted ? "text-3xl lg:text-4xl" : "text-2xl"
                )}
              >
                {pkg.name}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm",
                  isHighlighted
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {pkg.tagline}
              </p>

              {/* Audience strip */}
              <div className="mt-5 rounded-xl bg-foreground/[0.04] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/90 ring-1 ring-border/80">
                → {pkg.targetAudience}
              </div>

              {/* Price block */}
              <div className="mt-6 flex items-baseline justify-between gap-3">
                <div>
                  <div className="mono-label">cost</div>
                  <div className="stat-number mt-1 text-foreground">
                    {pkg.priceFrom}
                  </div>
                </div>
                {pkg.savingsLabel && (
                  <span
                    className={cn(
                      "chip",
                      isHighlighted ? "chip-amber" : "chip-cyan"
                    )}
                  >
                    {pkg.savingsLabel}
                  </span>
                )}
              </div>

              {/* Feature list */}
              <ul className="mt-6 flex-1 space-y-3 border-t border-border/60 pt-5">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                        isHighlighted
                          ? "bg-[var(--amber)]/20 text-[var(--amber)]"
                          : "bg-[var(--cyan)]/15 text-[var(--cyan)]"
                      )}
                    >
                      <CheckCircle2 className="size-3" />
                    </span>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={() => setModalState({ open: true, pkg })}
                variant={isHighlighted ? "highlight" : "default"}
                className="mt-7 w-full shadow-md"
              >
                {pkg.ctaLabel}
                <ArrowRight className="ml-1 size-4" />
              </Button>
              <Link
                href={pkg.ctaHref}
                className={cn(
                  "mt-3 block text-center text-xs underline-offset-4 hover:underline",
                  isHighlighted
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                Подробнее о пакете →
              </Link>
            </motion.div>
          );
        })}
      </div>

      <QuickLeadModal
        open={modalState.open}
        onOpenChange={(o) => setModalState((s) => ({ ...s, open: o }))}
        title={
          modalState.pkg
            ? `Оформить пакет «${modalState.pkg.name}»`
            : "Оставить заявку"
        }
        description={
          modalState.pkg
            ? `От ${modalState.pkg.priceFrom}. ${modalState.pkg.tagline}`
            : undefined
        }
        source={
          modalState.pkg ? `package_${modalState.pkg.id}` : "package_unknown"
        }
        context={
          modalState.pkg
            ? {
                package: modalState.pkg.name,
                fleetSize: selectedFleet ?? "не указан",
                priceFrom: modalState.pkg.priceFrom,
              }
            : undefined
        }
      />
    </motion.section>
  );
}
