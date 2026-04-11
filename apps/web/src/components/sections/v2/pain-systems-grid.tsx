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

interface PainSystemsGridProps {
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

const accentPalette = [
  "bg-red-500/10 text-red-600 dark:text-red-400",
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-pink-500/10 text-pink-600 dark:text-pink-400",
];

export function PainSystemsGrid({ className }: PainSystemsGridProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Сегодня грузоперевозчик держит в голове 6 систем и&nbsp;15 контактов
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Один сбой — простой, штраф и потерянный заказ. Мы собрали всё в одно
          окно — и добавили ИИ-диспетчера, который решает проблемы на трассе
          за водителя.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {painSystems.map((system, index) => {
          const Icon = iconMap[system.iconName];
          const palette = accentPalette[index % accentPalette.length];
          return (
            <div
              key={system.id}
              className="group relative flex flex-col rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
            >
              <div
                className={cn(
                  "mb-4 flex size-12 items-center justify-center rounded-full",
                  palette
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

      <div className="mt-10 text-center">
        <Button
          asChild
          size="lg"
          className="h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
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
