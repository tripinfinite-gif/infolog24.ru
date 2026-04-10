"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsProps {
  stats: Stat[];
  className?: string;
}

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest.toLocaleString("ru-RU")}${suffix ?? ""}`;
      }
    });
    return unsubscribe;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix ?? ""}</span>;
}

export function Stats({ stats, className }: StatsProps) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
