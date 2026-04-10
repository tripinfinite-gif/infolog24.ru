"use client";

import { motion } from "framer-motion";
import { CheckCircle, ClipboardCheck, FileText, Send } from "lucide-react";

import { cn } from "@/lib/utils";

interface HowItWorksProps {
  className?: string;
}

const steps = [
  {
    number: "01",
    title: "Заявка",
    description: "Оставьте заявку на сайте или в мессенджер. Перезвоним за 15 минут.",
    duration: "15 мин",
    icon: Send,
  },
  {
    number: "02",
    title: "Документы",
    description: "Отправьте фото документов — email, WhatsApp или Telegram. Мы всё проверим.",
    duration: "1 день",
    icon: FileText,
  },
  {
    number: "03",
    title: "Оформляем",
    description: "Подаём заявку в Дептранс, сопровождаем процесс. Вы получаете временный пропуск.",
    duration: "1-3 дня",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Готово!",
    description: "Получаете готовый пропуск и уведомление. Можно выезжать на маршрут.",
    duration: "",
    icon: CheckCircle,
  },
];

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl bg-card p-6 sm:p-8 lg:p-10",
        className
      )}
    >
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Как это работает
        </h2>
        <p className="mt-2 text-muted-foreground">
          4 простых шага — и пропуск у вас
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.12 }}
            className="relative"
          >
            {/* Connector line (desktop) */}
            {index < steps.length - 1 && (
              <div
                className="absolute top-8 left-[calc(50%+32px)] hidden h-px w-[calc(100%-64px)] bg-border lg:block"
                aria-hidden="true"
              />
            )}

            <div className="flex flex-col items-center text-center lg:items-center">
              {/* Large step number */}
              <div className="font-heading text-5xl font-bold tracking-tighter text-foreground/10 sm:text-6xl">
                {step.number}
              </div>

              <div className="-mt-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="size-5 text-primary" />
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
