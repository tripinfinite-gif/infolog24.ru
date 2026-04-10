"use client";

import { motion } from "framer-motion";
import { Ban, Camera, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

interface PainPointsProps {
  className?: string;
}

const painPoints = [
  {
    icon: Camera,
    title: "215 000 ₽ штрафов",
    subtitle: "за один рейс по МКАД",
    description:
      "43 камеры фиксируют проезд без пропуска. Штраф 7 500 ₽ за каждую.",
    dark: false,
  },
  {
    icon: Ban,
    title: "70% отказов",
    subtitle: "при самостоятельной подаче",
    description:
      "7 из 10 заявок получают отказ из-за ошибок. Каждый отказ — потерянное время.",
    dark: true,
  },
  {
    icon: Clock,
    title: "Простой = убытки",
    subtitle: "каждый день без пропуска",
    description:
      "Грузовик стоит, водитель сидит, конкуренты забирают ваших клиентов.",
    dark: false,
  },
];

export function PainPoints({ className }: PainPointsProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3", className)}>
      {painPoints.map((point, index) => (
        <motion.div
          key={point.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "group relative overflow-hidden rounded-2xl p-6 sm:p-8 transition-shadow hover:shadow-lg",
            point.dark
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          )}
        >
          {/* Warning accent line */}
          <div className="absolute top-0 left-0 h-1 w-full bg-destructive/60" />

          <div
            className={cn(
              "mb-4 flex size-12 items-center justify-center rounded-xl",
              point.dark
                ? "bg-destructive/20"
                : "bg-destructive/10"
            )}
          >
            <point.icon
              className={cn(
                "size-6",
                point.dark ? "text-destructive-foreground" : "text-destructive"
              )}
            />
          </div>

          <h3 className="text-xl font-bold sm:text-2xl">{point.title}</h3>
          <p
            className={cn(
              "mt-1 text-sm font-medium",
              point.dark ? "text-primary-foreground/60" : "text-muted-foreground"
            )}
          >
            {point.subtitle}
          </p>
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed",
              point.dark ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {point.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
