import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { blogArticles } from "@/content/blog-articles";

export const metadata: Metadata = {
  title: "Блог | Инфологистик-24",
  description:
    "Полезные статьи о пропусках в Москву, штрафах за проезд без пропуска, документах и требованиях.",
  openGraph: {
    title: "Блог | Инфологистик-24",
    description:
      "Полезные статьи о пропусках в Москву для грузового транспорта.",
    type: "website",
  },
};

const categoryLabels: Record<string, string> = {
  permits: "Пропуска",
  fines: "Штрафы",
  transport: "Транспорт",
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
              className="flex flex-col transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {categoryLabels[article.category]}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="hover:text-primary"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
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
