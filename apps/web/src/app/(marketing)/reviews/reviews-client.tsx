"use client";

import { ExternalLink, MessageSquareQuote, Star, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/content/testimonials";

const platformBadges = [
  { id: "yandex", name: "Яндекс Карты", rating: "4.9", color: "bg-red-500" },
  { id: "2gis", name: "2ГИС", rating: "4.8", color: "bg-green-600" },
  { id: "site", name: "Сайт", rating: "4.5", color: "bg-accent" },
];

const filterTabs = [
  { id: "all", label: "Все отзывы" },
  { id: "yandex", label: "Яндекс Карты" },
  { id: "2gis", label: "2ГИС" },
  { id: "site", label: "Сайт" },
] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating ? "fill-accent text-accent" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source?: string }) {
  const sourceLabels: Record<string, string> = {
    yandex: "Яндекс Карты",
    "2gis": "2ГИС",
    site: "Сайт",
  };
  const sourceColors: Record<string, string> = {
    yandex: "bg-red-500/10 text-red-600",
    "2gis": "bg-green-500/10 text-green-700",
    site: "bg-blue-500/10 text-blue-600",
  };

  if (!source) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceColors[source] ?? ""}`}
    >
      {sourceLabels[source] ?? source}
    </span>
  );
}

export function ReviewsClient() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "all") return testimonials;
    return testimonials.filter((t) => t.source === activeFilter);
  }, [activeFilter]);

  const avgRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-primary p-6 sm:p-8 lg:p-12 text-center">
            <h1 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
              Что говорят наши клиенты
            </h1>

            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-7 ${
                      i < Math.round(avgRating)
                        ? "fill-accent text-accent"
                        : "fill-primary-foreground/20 text-primary-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-primary-foreground/70">
                  150+ отзывов на всех площадках
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Badges */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <StaggerChildren className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {platformBadges.map((platform) => (
              <StaggerItem key={platform.id}>
                <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${platform.color} text-white`}
                  >
                    <Star className="size-5 fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {platform.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-foreground">
                        {platform.rating}
                      </span>
                      <Star className="size-4 fill-accent text-accent" />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeFilter === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
                {tab.id !== "all" && (
                  <span className="ml-1 text-xs opacity-70">
                    (
                    {testimonials.filter((t) => t.source === tab.id).length}
                    )
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Grid */}
      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTestimonials.map((testimonial, index) => {
              const isDark = index % 5 === 0;
              return (
                <FadeIn key={testimonial.id} delay={index * 0.05}>
                  <Card className={`group h-full rounded-2xl border-0 shadow-sm transition-shadow hover:shadow-md ${isDark ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <CardContent className="flex h-full flex-col gap-4 p-6 sm:p-8">
                      {/* Quote icon */}
                      <MessageSquareQuote className={`size-8 ${isDark ? "text-primary-foreground/20" : "text-primary/20"}`} />

                      {/* Rating */}
                      <StarRating rating={testimonial.rating} />

                      {/* Text */}
                      <p className={`flex-1 text-sm leading-relaxed ${isDark ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        &laquo;{testimonial.text}&raquo;
                      </p>

                      {/* Footer */}
                      <div className={`mt-auto flex items-end justify-between pt-4 ${isDark ? "border-t border-primary-foreground/10" : "border-t"}`}>
                        <div>
                          <p className={`text-sm font-semibold ${isDark ? "text-primary-foreground" : "text-foreground"}`}>
                            {testimonial.name}
                          </p>
                          <p className={`text-xs ${isDark ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {testimonial.company}
                          </p>
                          {testimonial.role && (
                            <p className={`text-xs ${isDark ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                              {testimonial.role}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <SourceBadge source={testimonial.source} />
                          {testimonial.date && (
                            <span className={`text-xs ${isDark ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                              {new Date(testimonial.date).toLocaleDateString(
                                "ru-RU",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>

          {filteredTestimonials.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              В этой категории пока нет отзывов.
            </p>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-6 sm:p-8">
          <FadeIn>
            <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:divide-x sm:divide-primary-foreground/10">
              <div>
                <p className="text-4xl font-bold text-primary-foreground">150+</p>
                <p className="mt-1 text-sm text-primary-foreground/60">
                  отзывов на всех площадках
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-foreground">70%</p>
                <p className="mt-1 text-sm text-primary-foreground/60">
                  клиентов возвращаются ежегодно
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-foreground">98%</p>
                <p className="mt-1 text-sm text-primary-foreground/60">
                  довольны результатом
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Leave Review */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              Оставьте свой отзыв
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ваш опыт поможет другим перевозчикам сделать правильный выбор
            </p>
          </div>
          <Button asChild variant="outline">
            <a
              href="https://yandex.ru/maps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 size-4" />
              Оставить отзыв
            </a>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-primary p-6 sm:p-8 lg:p-12 text-center">
          <ThumbsUp className="mx-auto size-12 text-primary-foreground/30" />
          <h2 className="mt-6 font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
            Присоединяйтесь к 50 000+ довольных клиентов
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
            Оформите пропуск быстро и без проблем. 98% наших клиентов получают
            пропуск с первого раза.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="h-12 bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/contacts">Оформить пропуск</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
