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
    description: "Оставляете контакт или открываете чат. Перезвоним за 15 минут.",
    duration: "15 минут",
    icon: Send,
  },
  {
    number: "02",
    title: "Документы",
    description: "Отправляете что есть — мы сами докомплектуем и проверим за вас.",
    duration: "1 день",
    icon: FileText,
  },
  {
    number: "03",
    title: "Работа",
    description: "Мы оформляем, сопровождаем Дептранс, решаем регуляторику. Вы работаете.",
    duration: "1–3 дня",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Контроль",
    description: "ЛК с мониторингом, уведомления об истечении, ИнфоПилот на трассе 24/7.",
    icon: Bell,
  },
];

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section
      className={cn(
        "rounded-3xl bg-card p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Как это работает
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          4 простых шага — и вы можете спокойно возить грузы
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div
                  className="absolute left-[calc(50%+32px)] top-8 hidden h-px w-[calc(100%-64px)] bg-border lg:block"
                  aria-hidden="true"
                />
              )}

              <div className="flex flex-col items-center text-center">
                <div className="font-heading text-5xl font-bold tracking-tighter text-foreground/10 sm:text-6xl">
                  {step.number}
                </div>

                <div className="-mt-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {step.title}
                </h3>

                {step.duration && (
                  <span className="mt-1 inline-block rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
                    {step.duration}
                  </span>
                )}

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
