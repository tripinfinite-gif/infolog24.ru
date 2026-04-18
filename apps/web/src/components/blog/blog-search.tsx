"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { BlogCard } from "@/components/blog/blog-card";
import { Input } from "@/components/ui/input";
import type { BlogArticle } from "@/content/blog-articles";
import { cn } from "@/lib/utils";

interface BlogSearchProps {
  /** Полный список статей, по которому ведётся поиск (уже отфильтрован по категории/тегу). */
  articles: BlogArticle[];
  /** Плейсхолдер инпута. */
  placeholder?: string;
  /** Слот с уже отрендеренным сервером списком (пагинированным), показывается когда поиск пустой. */
  children: React.ReactNode;
}

export function BlogSearch({
  articles,
  placeholder = "Поиск по заголовкам статей…",
  children,
}: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const hasQuery = trimmed.length > 0;

  const filtered = useMemo(() => {
    if (!hasQuery) return [];
    return articles.filter((article) =>
      article.title.toLowerCase().includes(trimmed)
    );
  }, [articles, trimmed, hasQuery]);

  return (
    <div>
      <div className="relative max-w-xl">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Поиск по блогу"
          className="pl-9 pr-9"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Очистить поиск"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className={cn("mt-8", hasQuery && "hidden")} aria-hidden={hasQuery}>
        {children}
      </div>

      {hasQuery && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted-foreground">
            Найдено: {filtered.length}{" "}
            {filtered.length === 1
              ? "статья"
              : filtered.length >= 2 && filtered.length <= 4
                ? "статьи"
                : "статей"}
          </p>
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
              Ничего не нашлось. Попробуйте другой запрос.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <BlogCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
