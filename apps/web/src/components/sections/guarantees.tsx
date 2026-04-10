"use client";

import { motion } from "framer-motion";
import { FileText, RefreshCcw, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

interface GuaranteesProps {
  className?: string;
}

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Вернём деньги",
    description:
      "Если не сможем оформить — возвращаем оплату в полном объёме. Без скрытых условий.",
    dark: true,
  },
  {
    icon: RefreshCcw,
    title: "Повторная подача бесплатно",
    description:
      "Отклонили? Устраняем причину и подаём заново за наш счёт. Столько раз, сколько нужно.",
    dark: false,
  },
  {
    icon: FileText,
    title: "Работаем официально",
    description:
      "Договор, акт, чеки — всё как положено. Зарегистрированная компания с 2016 года.",
    dark: false,
  },
];

export function Guarantees({ className }: GuaranteesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-4 sm:space-y-6", className)}
    >
      <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Гарантии
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {guarantees.map((g, index) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
              "rounded-2xl p-6 sm:p-8",
              g.dark
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground"
            )}
          >
            <div
              className={cn(
                "mb-4 flex size-11 items-center justify-center rounded-xl",
                g.dark ? "bg-green-500/20" : "bg-green-100"
              )}
            >
              <g.icon
                className={cn(
                  "size-5",
                  g.dark ? "text-green-400" : "text-green-700"
                )}
              />
            </div>
            <h3 className="text-lg font-semibold">{g.title}</h3>
            <p
              className={cn(
                "mt-2 text-sm leading-relaxed",
                g.dark ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {g.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
