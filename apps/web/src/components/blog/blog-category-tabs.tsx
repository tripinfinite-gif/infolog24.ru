import Link from "next/link";

import { BLOG_CATEGORIES, type BlogCategory } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface BlogCategoryTabsProps {
  active?: BlogCategory | "all";
}

export function BlogCategoryTabs({ active = "all" }: BlogCategoryTabsProps) {
  const baseClass =
    "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";
  const activeClass = "border-primary bg-primary text-primary-foreground";
  const inactiveClass =
    "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground";

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Категории блога">
      <Link
        href="/blog"
        role="tab"
        aria-selected={active === "all"}
        className={cn(baseClass, active === "all" ? activeClass : inactiveClass)}
      >
        Все
      </Link>
      {BLOG_CATEGORIES.map((cat) => (
        <Link
          key={cat.key}
          href={`/blog/kategoriya/${cat.slug}`}
          role="tab"
          aria-selected={active === cat.key}
          className={cn(
            baseClass,
            active === cat.key ? activeClass : inactiveClass
          )}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
