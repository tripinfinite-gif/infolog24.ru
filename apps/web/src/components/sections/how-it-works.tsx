import {
  Bell,
  ClipboardCheck,
  FileText,
  Send,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface HowItWorksProps {
  className?: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  duration?: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Заявка",
    description: "Оставьте номер или напишите в чат. Перезвоним за 15 минут.",
    duration: "15 минут",
    icon: Send,
  },
  {
    number: "02",
    title: "Документы",
    description:
      "Отправляете что есть — мы сами докомплектуем и проверим за вас.",
    duration: "1 день",
    icon: FileText,
  },
  {
    number: "03",
    title: "С 1-го дня — уже едете",
    description:
      "Временный пропуск выдаём в день подачи. Параллельно готовим годовой — обычно за 10 рабочих дней. Простоев нет.",
    duration: "10 рабочих дней",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Контроль",
    description:
      "ЛК с мониторингом, уведомления об истечении, ИнфоПилот на трассе 24/7.",
    duration: "24/7",
    icon: Bell,
  },
];

// Vertical two-column layout: sticky header слева, numbered timeline справа.
// Каждый шаг — ряд с огромной outlined-цифрой, carding body и chip-длительностью.

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section className={cn("relative mx-auto w-full max-w-7xl", className)}>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* LEFT: sticky header */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="eyebrow eyebrow-cyan">process · 04 steps</span>
          <h2 className="section-title mt-6 text-foreground">
            Как это{" "}
            <span className="display-italic gradient-text">работает</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            4 простых шага — и вы можете спокойно возить грузы. Никакого
            бюрократического квеста и бесконечных созвонов с разными
            людьми.
          </p>

          <div className="glass mt-8 rounded-2xl p-6">
            <div className="flex items-baseline gap-3">
              <span className="stat-number text-[var(--violet)]">11</span>
              <span className="text-sm font-semibold text-foreground">
                рабочих дней
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              от заявки до готового пропуска — под ключ, включая временный
              на период оформления.
            </p>
          </div>
        </div>

        {/* RIGHT: numbered timeline */}
        <ol className="relative space-y-6">
          {/* Vertical rail */}
          <div
            className="absolute left-[30px] top-12 bottom-12 w-px bg-gradient-to-b from-accent/40 via-border to-accent/40 sm:left-[38px]"
            aria-hidden="true"
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <li
                key={step.number}
                className="relative grid grid-cols-[60px_1fr] items-start gap-4 sm:grid-cols-[76px_1fr] sm:gap-6"
              >
                {/* Big number + icon below */}
                <div className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      "font-heading text-5xl font-bold leading-none tracking-tighter sm:text-6xl",
                      idx === 0
                        ? "text-accent"
                        : "text-transparent"
                    )}
                    style={
                      idx === 0
                        ? undefined
                        : {
                            WebkitTextStroke: "1.5px oklch(0.56 0.22 260 / 0.5)",
                          }
                    }
                  >
                    {step.number}
                  </span>
                  <div className="relative z-10 mt-3 flex size-11 items-center justify-center rounded-xl bg-foreground/5 text-[var(--cyan)] ring-1 ring-border/80 sm:size-12">
                    <Icon className="size-5" />
                  </div>
                </div>

                {/* Content card */}
                <div className="soft-card">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">
                      {step.title}
                    </h3>
                    {step.duration && (
                      <span className="chip chip-highlight">
                        {step.duration}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
