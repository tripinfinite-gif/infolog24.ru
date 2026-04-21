"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  company: string;
  text: string;
  rating: number;
  source?: "yandex" | "2gis" | "site";
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

const sourceLabels: Record<string, string> = {
  yandex: "Яндекс",
  "2gis": "2ГИС",
  site: "Сайт",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating ? "fill-highlight text-highlight" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

// Initials avatar (circular, gradient background).
function Avatar({ name, isDark }: { name: string; isDark: boolean }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        isDark
          ? "bg-primary-foreground/15 text-primary-foreground"
          : "bg-accent/15 text-accent"
      )}
    >
      {initials || "?"}
    </div>
  );
}

export function Testimonials({ testimonials, className }: TestimonialsProps) {
  return (
    <section className={cn("relative mx-auto w-full max-w-7xl", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <div>
          <span className="eyebrow">voices · 150+ reviews</span>
          <h2 className="section-title mt-6 text-foreground">
            Что говорят{" "}
            <span className="display-italic gradient-text">перевозчики</span>
          </h2>
        </div>

        {/* Aggregate block */}
        <div className="glass flex items-center gap-5 rounded-2xl px-6 py-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="stat-number text-3xl text-foreground">4.9</span>
              <span className="text-sm text-muted-foreground">/ 5</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-highlight text-highlight"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <div className="text-sm font-semibold text-foreground">
              150+ отзывов
            </div>
            <div className="text-xs text-muted-foreground">Яндекс · 2ГИС</div>
          </div>
        </div>
      </motion.div>

      {/* Horizontal scroll */}
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4 sm:gap-5 snap-x snap-mandatory scrollbar-hide">
        {testimonials.map((testimonial, index) => {
          const isDark = index === 0 || index % 4 === 1;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className={cn(
                "flex min-w-[320px] max-w-[380px] flex-shrink-0 flex-col rounded-2xl p-6 snap-start sm:p-7",
                isDark
                  ? "bg-gradient-to-br from-[oklch(0.22_0.06_290)] via-[oklch(0.18_0.04_280)] to-[oklch(0.15_0.02_280)] ring-neon text-foreground"
                  : "glass"
              )}
            >
              {/* Header: avatar + name + source */}
              <div className="flex items-center gap-3">
                <Avatar name={testimonial.name} isDark={isDark} />
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "truncate text-sm font-bold",
                      isDark ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    className={cn(
                      "truncate text-xs",
                      isDark
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    )}
                  >
                    {testimonial.company}
                  </div>
                </div>
                {testimonial.source && sourceLabels[testimonial.source] && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      isDark
                        ? "bg-primary-foreground/10 text-primary-foreground/70"
                        : "bg-card text-muted-foreground ring-1 ring-border"
                    )}
                  >
                    {sourceLabels[testimonial.source]}
                  </span>
                )}
              </div>

              {/* Big quote icon */}
              <Quote
                className={cn(
                  "mt-5 size-6",
                  isDark ? "text-highlight/80" : "text-accent/50"
                )}
              />

              {/* Body text */}
              <p
                className={cn(
                  "mt-3 flex-1 text-sm leading-relaxed",
                  isDark ? "text-primary-foreground/85" : "text-foreground/90"
                )}
              >
                {testimonial.text}
              </p>

              <div
                className={cn(
                  "mt-6 flex items-center justify-between border-t pt-4",
                  isDark ? "border-primary-foreground/10" : "border-border/50"
                )}
              >
                <StarRating rating={testimonial.rating} />
                <span
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-wider",
                    isDark
                      ? "text-primary-foreground/50"
                      : "text-muted-foreground"
                  )}
                >
                  Проверенный отзыв
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
