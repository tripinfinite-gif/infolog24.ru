import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Базовый путь без query (например "/blog"). Страница = ?page=N, 1-я страница — без query. */
  basePath: string;
}

/**
 * Возвращает массив «страниц» с учётом многоточий.
 * Пример для 10 страниц, активная 5: [1, '...', 4, 5, 6, '...', 10].
 */
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export function BlogPagination({
  currentPage,
  totalPages,
  basePath,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  const baseBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";
  const inactiveBtn =
    "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground";
  const activeBtn =
    "border-primary bg-primary text-primary-foreground pointer-events-none";
  const disabledBtn =
    "pointer-events-none border-border bg-muted text-muted-foreground/50";

  return (
    <nav
      aria-label="Пагинация статей блога"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={pageHref(basePath, currentPage - 1)}
        aria-label="Предыдущая страница"
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        className={cn(
          baseBtn,
          currentPage <= 1 ? disabledBtn : inactiveBtn,
          "gap-1 px-3"
        )}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only sm:not-sr-only">Назад</span>
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            className="px-2 text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            aria-label={`Страница ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(baseBtn, p === currentPage ? activeBtn : inactiveBtn)}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={pageHref(basePath, currentPage + 1)}
        aria-label="Следующая страница"
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        className={cn(
          baseBtn,
          currentPage >= totalPages ? disabledBtn : inactiveBtn,
          "gap-1 px-3"
        )}
      >
        <span className="sr-only sm:not-sr-only">Вперёд</span>
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
