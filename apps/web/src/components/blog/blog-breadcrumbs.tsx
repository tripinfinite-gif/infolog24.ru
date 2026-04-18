import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbCrumb {
  name: string;
  href?: string;
}

export function BlogBreadcrumbs({ items }: { items: BreadcrumbCrumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-foreground" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  aria-hidden="true"
                  className="size-3.5 text-muted-foreground/60"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
