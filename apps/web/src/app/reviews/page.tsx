import { ExternalLink, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CtaSection } from "@/components/sections/cta-section";
import { Testimonials } from "@/components/sections/testimonials";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Отзывы клиентов | Инфологистик-24",
  description:
    "Отзывы клиентов о работе Инфологистик-24. Средняя оценка 4.8 из 5. Более 50 000 довольных клиентов.",
  openGraph: {
    title: "Отзывы клиентов | Инфологистик-24",
    description: "Отзывы клиентов о работе Инфологистик-24.",
    type: "website",
  },
};

export default function ReviewsPage() {
  const avgRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  const testimonialsData = testimonials.map((t) => ({
    name: t.name,
    company: t.company,
    text: t.text,
    rating: t.rating,
  }));

  return (
    <>
      {/* Header */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Отзывы наших клиентов
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-6 ${
                    i < Math.round(avgRating)
                      ? "fill-accent text-accent"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              из 5 ({testimonials.length} отзывов)
            </span>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline">
              <a
                href="https://yandex.ru/maps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 size-4" />
                Оставить отзыв на Яндекс Картах
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <Testimonials testimonials={testimonialsData} />

      <CtaSection
        heading="Хотите стать нашим клиентом?"
        description="Присоединяйтесь к тысячам довольных перевозчиков. Оставьте заявку прямо сейчас."
        ctaText="Оформить пропуск"
        ctaHref="/contacts"
      />
    </>
  );
}
