"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Calendar } from "lucide-react";
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

function formatCountdown(days: number): string {
  if (days === 0) return "Сегодня";
  if (days > 0) return `Через ${days} ${pluralDays(days)}`;
  const absDays = Math.abs(days);
  return `${absDays} ${pluralDays(absDays)} назад`;
}

function MilestoneCard({
  milestone,
  index,
}: {
  milestone: RegulatoryMilestone;
  index: number;
}) {
  // Hydration-safe: считаем дни только на клиенте, чтобы избежать рассинхрона
  // SSR/CSR на границе суток (UTC vs локальный TZ).
  const [countdown, setCountdown] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setCountdown(formatCountdown(getDaysUntil(milestone.date)));
  }, [milestone.date]);

  const isUrgent = milestone.status === "urgent";
  const isModal = milestone.ctaType === "modal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg",
        isUrgent ? "border-destructive shadow-md" : "border-border"
      )}
    >
      {isUrgent && (
        <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
          <AlertTriangle className="size-3.5" />
          Дедлайн горит
        </div>
      )}

      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Calendar className="size-4" />
        <span>{milestone.displayDate}</span>
      </div>

      <div
        className={cn(
          "mt-1 min-h-[1rem] text-xs font-semibold",
          isUrgent ? "text-destructive" : "text-accent"
        )}
        suppressHydrationWarning
      >
        {countdown ?? "\u00A0"}
      </div>

      <h3 className="mt-3 text-lg font-bold text-foreground">
        {milestone.name}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {milestone.who}
      </p>

      <p className="mt-3 text-xs font-medium leading-relaxed text-destructive">
        {milestone.penalty}
      </p>

      {isModal ? (
        <>
          <Button
            size="sm"
            variant={isUrgent ? "default" : "outline"}
            onClick={() => setModalOpen(true)}
            className={cn(
              "mt-5 w-full rounded-xl",
              isUrgent &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
          >
            <span className="truncate">{milestone.ctaLabel}</span>
            <ArrowRight className="ml-2 size-4 shrink-0" />
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
          variant={isUrgent ? "default" : "outline"}
          className={cn(
            "mt-5 w-full rounded-xl",
            isUrgent &&
              "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          )}
        >
          <Link href={milestone.ctaHref ?? "#"}>
            <span className="truncate">{milestone.ctaLabel}</span>
            <ArrowRight className="ml-2 size-4 shrink-0" />
          </Link>
        </Button>
      )}
    </motion.div>
  );
}

export function RegulatoryTimeline({ className }: RegulatoryTimelineProps) {
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
          Регуляторика — сроки, которые могут остановить бизнес
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Четыре регуляторных дедлайна до 2028 года. Мы закроем каждый.
        </p>
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="relative mt-12 hidden lg:block">
        <div
          className="absolute left-0 right-0 top-8 h-0.5 bg-border"
          aria-hidden="true"
        />
        <div className="relative grid grid-cols-4 gap-6">
          {regulatoryTimeline.map((milestone, index) => (
            <div key={milestone.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 mb-6 flex size-16 items-center justify-center rounded-full border-4 border-card shadow-md",
                  milestone.status === "urgent"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-accent text-accent-foreground"
                )}
              >
                <Calendar className="size-6" />
              </div>
              <div className="w-full">
                <MilestoneCard milestone={milestone} index={index} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/tablet: vertical list */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:hidden">
        {regulatoryTimeline.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            index={index}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          asChild
          size="lg"
          className="h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
        >
          <Link href="#zayavka">
            Обсудить ваш случай с юристом
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
