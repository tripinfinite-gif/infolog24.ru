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

function LavenderBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[12px] font-semibold text-secondary-foreground">
      {children}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating
              ? "fill-[#FFB648] text-[#FFB648]"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function Testimonials({ testimonials, className }: TestimonialsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-baseline justify-between gap-4"
      >
        <div>
          <div className="mb-3">
            <LavenderBadge>
              <Star className="size-3.5 fill-[#FFB648] text-[#FFB648]" />
              150+ отзывов
            </LavenderBadge>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Отзывы клиентов
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-[#FFB648] text-[#FFB648]" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">4.9</span>
            <span className="text-sm text-muted-foreground">150+ отзывов</span>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-4 sm:gap-6 snap-x snap-mandatory scrollbar-hide">
        {testimonials.map((testimonial, index) => {
          const isDark = index % 3 === 1;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={cn(
                "flex min-w-[300px] max-w-[360px] flex-shrink-0 flex-col rounded-2xl p-6 sm:p-8 snap-start",
                isDark
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground"
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <Quote
                  className={cn(
                    "size-8",
                    isDark ? "text-primary-foreground/20" : "text-accent/20"
                  )}
                />
                {testimonial.source && sourceLabels[testimonial.source] && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                      isDark
                        ? "bg-primary-foreground/10 text-primary-foreground/70"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {sourceLabels[testimonial.source]}
                  </span>
                )}
              </div>

              <p
                className={cn(
                  "flex-1 text-sm leading-relaxed",
                  isDark ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                &laquo;{testimonial.text}&raquo;
              </p>

              <div className={cn("mt-6 border-t pt-4", isDark ? "border-primary-foreground/10" : "border-border/50")}>
                <StarRating rating={testimonial.rating} />
                <p className={cn("mt-2 text-sm font-semibold", isDark ? "text-primary-foreground" : "text-foreground")}>
                  {testimonial.name}
                </p>
                <p className={cn("text-xs", isDark ? "text-primary-foreground/50" : "text-muted-foreground")}>
                  {testimonial.company}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
