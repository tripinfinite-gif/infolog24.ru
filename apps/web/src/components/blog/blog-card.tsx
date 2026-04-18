import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogArticle } from "@/content/blog-articles";
import { CATEGORY_LABELS, getCategoryInfo, slugifyTag } from "@/lib/blog";
import { cn } from "@/lib/utils";

const categoryImages: Record<
  BlogArticle["category"],
  { src: string; alt: string }
> = {
  permits: { src: "/images/permit-documents.jpg", alt: "Документы на пропуск" },
  fines: { src: "/images/traffic-camera.jpg", alt: "Камера контроля на МКАД" },
  transport: { src: "/images/truck-closeup.jpg", alt: "Грузовой транспорт" },
};

const categoryBadgeClass: Record<BlogArticle["category"], string> = {
  permits:
    "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
  fines:
    "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
  transport:
    "bg-accent/10 text-accent border-accent/20 hover:bg-accent/15",
};

interface BlogCardProps {
  article: BlogArticle;
  showTags?: boolean;
}

export function BlogCard({ article, showTags = true }: BlogCardProps) {
  const categoryInfo = getCategoryInfo(article.category);
  const img = categoryImages[article.category];

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={`/blog/${article.slug}`}
        className="relative block h-40 overflow-hidden"
        aria-label={article.title}
      >
        <Image
          src={img?.src ?? "/images/hero-truck.jpg"}
          alt={img?.alt ?? "Грузоперевозки в Москве"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <CardContent className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          {categoryInfo ? (
            <Link href={`/blog/kategoriya/${categoryInfo.slug}`}>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium transition-colors",
                  categoryBadgeClass[article.category]
                )}
              >
                {CATEGORY_LABELS[article.category]}
              </Badge>
            </Link>
          ) : (
            <Badge variant="secondary">
              {CATEGORY_LABELS[article.category]}
            </Badge>
          )}
        </div>

        <h2 className="text-lg font-semibold text-foreground">
          <Link
            href={`/blog/${article.slug}`}
            className="transition-colors hover:text-accent"
          >
            {article.title}
          </Link>
        </h2>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

          {showTags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${slugifyTag(tag)}`}
                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-accent/15 hover:text-accent"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
