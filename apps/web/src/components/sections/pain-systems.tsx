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

// Шесть тонов на основе токенов проекта (без хардкода Tailwind-цветов).
// Дают визуальную дифференциацию 6 систем, оставаясь внутри дизайн-системы.
const tonePalette = [
  "bg-destructive/10 text-destructive",
  "bg-primary/10 text-primary",
  "bg-accent/15 text-accent",
  "bg-foreground/10 text-foreground",
  "bg-primary/15 text-primary",
  "bg-destructive/15 text-destructive",
];

export function PainSystems({ className }: PainSystemsProps) {
  return (
    <section
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
          const tone = tonePalette[index % tonePalette.length];
          return (
            <div
              key={system.id}
              className="group relative flex flex-col rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
            >
              <div
                className={cn(
                  "mb-4 flex size-12 items-center justify-center rounded-full",
                  tone
                )}
              >
                {Icon ? <Icon className="size-6" /> : null}
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

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
        <p className="text-base font-medium text-foreground sm:text-lg">
          Мы собрали всё в одно окно. Плюс добавили то, чего ни у кого нет —
          ИИ-диспетчера, который решает проблемы на трассе за водителя.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-5 h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
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
