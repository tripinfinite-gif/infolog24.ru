import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { CtaSection } from "@/components/sections/cta-section";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { blogArticles } from "@/content/blog-articles";

const categoryLabels: Record<string, string> = {
  permits: "Пропуска",
  fines: "Штрафы",
  transport: "Транспорт",
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} | Инфологистик-24`,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://inlog24.ru/blog/${slug}`,
      siteName: "Инфологистик-24",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: `https://inlog24.ru/blog/${slug}`,
    },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="my-4 list-disc space-y-1 pl-6 text-muted-foreground">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function formatInline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-foreground'>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-primary underline'>$1</a>");
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="mt-8 mb-4 text-xl font-semibold text-foreground">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="mt-10 mb-4 text-2xl font-bold text-foreground">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
    } else if (trimmed.startsWith("|")) {
      // Table row - skip for simplicity, handled as text
      flushList();
      elements.push(
        <p key={key++} className="my-1 text-sm text-muted-foreground font-mono">
          {trimmed}
        </p>
      );
    } else if (trimmed === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={key++}
          className="my-4 leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    }
  }
  flushList();

  return elements;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd
        headline={article.title}
        description={article.excerpt}
        datePublished={article.publishDate}
        url={`/blog/${article.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Блог", href: "/blog" },
          { name: article.title, href: `/blog/${article.slug}` },
        ]}
      />

      <article className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Назад к блогу
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <Badge variant="secondary">
              {categoryLabels[article.category]}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="size-3" />
              {new Date(article.publishDate).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-3" />
              {article.readTime} мин
            </span>
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-8">{renderMarkdown(article.content)}</div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </article>

      <CtaSection
        heading="Нужна помощь с пропуском?"
        description="Оставьте заявку, и мы поможем оформить пропуск быстро и без ошибок."
        ctaText="Оформить пропуск"
        ctaHref="/contacts"
      />
    </>
  );
}
