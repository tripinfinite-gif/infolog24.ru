import {
  AlertTriangle,
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

function LavenderBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[12px] font-semibold text-secondary-foreground">
      {children}
    </span>
  );
}

const iconMap: Record<string, LucideIcon> = {
  FileCheck,
  Satellite,
  FileText,
  Building,
  Clock,
  Stethoscope,
};

const tintMap: Record<string, { tint: string; fg: string }> = {
  propusk:  { tint: "#FFE6E0", fg: "#D32F2F" },
  rnis:     { tint: "#E8ECFF", fg: "var(--accent)" },
  etrn:     { tint: "#E8ECFF", fg: "var(--accent)" },
  goslog:   { tint: "#FFEDD5", fg: "#F97316" },
  tahograf: { tint: "#EEF2FF", fg: "var(--accent)" },
  dk:       { tint: "#DBEAFE", fg: "var(--accent)" },
};

export function PainSystems({ className }: PainSystemsProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex justify-center">
          <LavenderBadge>
            <AlertTriangle className="size-3.5" />
            6 систем регуляторики
          </LavenderBadge>
        </div>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          6 систем вместо одной
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Сегодня грузоперевозчик держит в голове 6 систем регуляторики
          и&nbsp;15 контактов. Один сбой — простой, штраф и потерянный заказ.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {painSystems.map((system) => {
          const Icon = iconMap[system.iconName];
          const colors = tintMap[system.id] ?? { tint: "#E8ECFF", fg: "var(--accent)" };
          return (
            <div
              key={system.id}
              className="group relative flex flex-col rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
            >
              <div
                className="mb-4 flex size-12 items-center justify-center rounded-full"
                style={{ background: colors.tint }}
              >
                {Icon ? (
                  <Icon className="size-6" style={{ color: colors.fg }} />
                ) : null}
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {system.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {system.pain}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl bg-primary p-6 text-center text-primary-foreground">
        <p className="text-base font-medium text-primary-foreground/85 sm:text-lg">
          Мы собрали всё в одно окно. Плюс добавили то, чего ни у кого нет —{" "}
          <span className="text-primary-foreground font-semibold">ИИ-диспетчера</span>, который решает проблемы на трассе за водителя.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-5 h-12 rounded-full border border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-all hover:bg-white/10"
        >
          <Link href="#packages">
            Посмотреть, как это работает
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
