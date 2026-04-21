"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Calendar, Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
import {
  getDaysUntil,
  regulatoryTimeline,
  type RegulatoryMilestone,
} from "@/content/regulatory-timeline";
import { cn } from "@/lib/utils";

interface RegulatoryTimelineProps {
  className?: string;
}

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дня";
  return "дней";
}

function pluralMonths(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "месяц";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "месяца";
  return "месяцев";
}

function pluralYears(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "год";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "года";
  return "лет";
}

function formatCountdown(days: number): string {
  if (days === 0) return "Сегодня";
  if (days > 0) {
    if (days <= 60) return `Осталось ${days} ${pluralDays(days)}`;
    if (days <= 365) {
      const months = Math.round(days / 30);
      return `Через ~${months} ${pluralMonths(months)}`;
    }
    const years = Math.round((days / 365) * 2) / 2;
    const yearsLabel =
      years % 1 === 0 ? `${years}` : years.toFixed(1).replace(".", ",");
    const wholeYears = Math.floor(years);
    return `Через ~${yearsLabel} ${pluralYears(wholeYears === years ? wholeYears : 2)}`;
  }
  const absDays = Math.abs(days);
  return `${absDays} ${pluralDays(absDays)} назад`;
}

// Вертикальный timeline: слева "year/date" rail, справа карточка.
// Урочные дедлайны — оранжево-красная подсветка, стандартные — blue.

function MilestoneRow({
  milestone,
  index,
  total,
}: {
  milestone: RegulatoryMilestone;
  index: number;
  total: number;
}) {
  const [countdown, setCountdown] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setCountdown(formatCountdown(getDaysUntil(milestone.date)));
  }, [milestone.date]);

  const isUrgent = milestone.status === "urgent";
  const isModal = milestone.ctaType === "modal";
  const isLast = index === total - 1;

  // Пытаемся вытащить только год из displayDate — для большого стат-числа
  const yearMatch = milestone.displayDate.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : milestone.displayDate;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative grid grid-cols-[auto_1fr] gap-4 sm:grid-cols-[140px_1fr] sm:gap-6"
    >
      {/* LEFT rail: date + dot */}
      <div className="relative flex flex-col items-center sm:items-end sm:pt-2">
        <div className="stat-number hidden text-3xl text-muted-foreground/40 sm:block">
          {year}
        </div>
        <div className="mt-2 hidden text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:block">
          {milestone.displayDate.replace(year, "").trim() || "—"}
        </div>

        {/* Timeline dot */}
        <div
          className={cn(
            "absolute left-0 top-0 flex size-10 items-center justify-center rounded-full shadow-md ring-4 ring-card sm:-right-5 sm:left-auto sm:top-2 sm:size-12",
            isUrgent
              ? "bg-destructive text-destructive-foreground"
              : "bg-accent text-accent-foreground"
          )}
        >
          {isUrgent ? (
            <Flame className="size-4 sm:size-5" />
          ) : (
            <Calendar className="size-4 sm:size-5" />
          )}
        </div>

        {/* Connecting vertical line */}
        {!isLast && (
          <div
            className="absolute left-5 top-10 h-[calc(100%+2rem)] w-px bg-border sm:-right-[1px] sm:left-auto sm:top-14"
            aria-hidden="true"
          />
        )}
      </div>

      {/* RIGHT: card */}
      <div
        className={cn(
          "ml-14 flex flex-col rounded-2xl p-5 transition-all sm:ml-0 sm:p-6",
          isUrgent
            ? "bg-[oklch(0.65_0.23_22_/_0.08)] ring-1 ring-[oklch(0.65_0.23_22_/_0.3)]"
            : "glass hover:ring-neon-cyan"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground sm:hidden">
            {milestone.displayDate}
          </span>
          <span
            className={cn(
              "text-xs font-semibold",
              isUrgent ? "text-destructive" : "text-accent"
            )}
            suppressHydrationWarning
          >
            {countdown ?? "\u00A0"}
          </span>
          {isUrgent && (
            <span className="chip chip-danger">
              <AlertTriangle className="size-3" />
              Дедлайн горит
            </span>
          )}
        </div>

        <h3 className="mt-2 text-lg font-bold text-foreground sm:text-xl">
          {milestone.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {milestone.who}
        </p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-destructive">
          {milestone.penalty}
        </p>

        {isModal ? (
          <>
            <Button
              size="sm"
              variant={isUrgent ? "destructive" : "outline"}
              onClick={() => setModalOpen(true)}
              className="mt-4 w-fit"
            >
              <span className="truncate">{milestone.ctaLabel}</span>
              <ArrowRight className="ml-1 size-4 shrink-0" />
            </Button>
            <QuickLeadModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              title={milestone.modalTitle ?? milestone.name}
              description={milestone.modalDescription}
              source={milestone.modalSource ?? `reg_${milestone.id}`}
              context={milestone.modalContext}
              submitLabel="Получить расчёт"
            />
          </>
        ) : (
          <Button
            asChild
            size="sm"
            variant={isUrgent ? "destructive" : "outline"}
            className="mt-4 w-fit"
          >
            <Link href={milestone.ctaHref ?? "#"}>
              <span className="truncate">{milestone.ctaLabel}</span>
              <ArrowRight className="ml-1 size-4 shrink-0" />
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function RegulatoryTimeline({ className }: RegulatoryTimelineProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6 }}
      className={cn("relative mx-auto w-full max-w-7xl", className)}
    >
      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <span className="eyebrow eyebrow-amber">
            <AlertTriangle className="size-3" />
            regulatory · countdown
          </span>
          <h2 className="section-title mt-6 text-foreground">
            Сроки, которые могут{" "}
            <span className="display-italic text-[var(--amber)]">
              остановить
            </span>{" "}
            бизнес
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
            Четыре регуляторных дедлайна до 2028 года. Мы закроем каждый.
          </p>
        </div>
        <Button asChild size="lg" className="shadow-md shadow-accent/25">
          <Link href="#zayavka">
            Обсудить с юристом
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>

      {/* Vertical timeline */}
      <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-10">
        {regulatoryTimeline.map((milestone, index) => (
          <MilestoneRow
            key={milestone.id}
            milestone={milestone}
            index={index}
            total={regulatoryTimeline.length}
          />
        ))}
      </div>
    </motion.section>
  );
}
