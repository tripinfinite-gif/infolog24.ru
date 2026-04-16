import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { blogArticles } from "@/content/blog-articles";

// ISR: revalidate every 1 hour — blog updates infrequently
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Блог о грузоперевозках в Москве — Инфолог24",
  description:
    "Полезные статьи о пропусках в Москву, штрафах за проезд без пропуска, документах и требованиях к транспорту. Актуальные новости для грузоперевозчиков.",
  keywords: [
    "блог пропуска Москва",
    "штрафы грузовики МКАД",
    "статьи грузоперевозки",
    "новости пропуска Москва",
  ],
  openGraph: {
    title: "Блог о грузоперевозках в Москве — Инфолог24",
    description:
      "Полезные статьи о пропусках в Москву для грузового транспорта.",
    type: "website",
    url: "https://inlog24.ru/blog",
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог о грузоперевозках в Москве — Инфолог24",
    description:
      "Полезные статьи о пропусках в Москву для грузового транспорта.",
  },
  alternates: {
    canonical: "https://inlog24.ru/blog",
  },
};

const categoryLabels: Record<string, string> = {
  permits: "Пропуска",
  fines: "Штрафы",
  transport: "Транспорт",
};

const categoryImages: Record<string, { src: string; alt: string }> = {
  permits: { src: "/images/permit-documents.jpg", alt: "Документы на пропуск" },
  fines: { src: "/images/traffic-camera.jpg", alt: "Камера контроля на МКАД" },
  transport: { src: "/images/truck-closeup.jpg", alt: "Грузовой транспорт" },
};

export default function BlogPage() {
  const sortedArticles = [...blogArticles].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Блог
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Полезные статьи о пропусках, штрафах и грузоперевозках в Москве
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedArticles.map((article) => (
            <Card
              key={article.slug}
              className="flex flex-col rounded-2xl border-0 bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-40 overflow-hidden rounded-t-2xl">
                <Image
                  src={categoryImages[article.category]?.src ?? "/images/hero-truck.jpg"}
                  alt={categoryImages[article.category]?.alt ?? "Грузоперевозки в Москве"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <CardContent className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {categoryLabels[article.category]}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(article.publishDate).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {article.readTime} мин
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
