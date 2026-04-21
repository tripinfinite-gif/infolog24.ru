import {
  ArrowDownRight,
  Building,
  Clock,
  FileCheck,
  FileText,
  Satellite,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

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
    <div className={cn("relative mx-auto w-full max-w-7xl", className)}>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* LEFT: big headline + metric */}
        <div>
          <span className="eyebrow eyebrow-amber">fragmentation · market reality</span>
          <h2 className="section-title mt-6 text-foreground">
            Шесть{" "}
            <span className="display-italic gradient-text">разобщённых</span>
            <br />
            систем вместо одной.
          </h2>
          <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
            Сегодня грузоперевозчик держит в голове 6 систем регуляторики
            и&nbsp;15 контактов. Один сбой — простой, штраф и потерянный
            заказ.
          </p>

          {/* Metric comparison — mono, high-contrast */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="glass px-5 py-6">
              <div className="mono-label">сейчас</div>
              <div className="stat-number mt-2 text-foreground">
                15<span className="text-muted-foreground">×</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                контактов в рейсе
              </div>
            </div>
            <div className="glass px-5 py-6 ring-neon">
              <div className="mono-label">с нами</div>
              <div className="stat-number mt-2 gradient-text">
                1
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                окно · AI-диспетчер
              </div>
            </div>
          </div>

          <Link
            href="#packages"
            className="mt-10 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:text-[var(--violet)]"
          >
            → посмотреть платформу
          </Link>
        </div>

        {/* RIGHT: numbered list with mono indices */}
        <ol className="relative space-y-0 divide-y divide-border/60 border-y border-border/60">
          {painSystems.map((system, index) => {
            const Icon = iconMap[system.iconName];
            const num = String(index + 1).padStart(2, "0");
            return (
              <li
                key={system.id}
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-5 py-6 transition-colors hover:bg-foreground/[0.03] sm:py-7"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="font-mono text-xs font-medium tracking-[0.15em] text-muted-foreground">
                    {num}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/5 text-[var(--cyan)] ring-1 ring-border/80">
                    {Icon ? <Icon className="size-5" /> : null}
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-xl font-medium text-foreground sm:text-2xl">
                    {system.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {system.pain}
                  </p>
                </div>

                <ArrowDownRight className="mt-1.5 size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-[var(--violet)]" />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
