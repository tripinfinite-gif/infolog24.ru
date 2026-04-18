import {
  type BlogArticle,
  blogArticles,
} from "@/content/blog-articles";

/* ── Категории ─────────────────────────────────────────────────────────────── */

export type BlogCategory = BlogArticle["category"];

export interface BlogCategoryInfo {
  key: BlogCategory;
  slug: string;
  label: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategoryInfo[] = [
  {
    key: "permits",
    slug: "propuska",
    label: "Пропуска",
    description:
      "Всё о пропусках для грузового транспорта в Москву: оформление, сроки, документы, зоны действия.",
  },
  {
    key: "fines",
    slug: "shtrafy",
    label: "Штрафы",
    description:
      "Штрафы за проезд без пропуска, камеры на МКАД, обжалование постановлений.",
  },
  {
    key: "transport",
    slug: "transport",
    label: "Транспорт",
    description:
      "Грузовой транспорт в Москве: требования, экокласс, РНИС, Платон, весовой контроль.",
  },
];

export const CATEGORY_LABELS: Record<BlogCategory, string> = BLOG_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.key] = c.label;
    return acc;
  },
  {} as Record<BlogCategory, string>
);

export function getCategoryBySlug(slug: string): BlogCategoryInfo | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryInfo(
  key: BlogCategory
): BlogCategoryInfo | undefined {
  return BLOG_CATEGORIES.find((c) => c.key === key);
}

/* ── Slug для тегов (транслит) ─────────────────────────────────────────────── */

const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya",
};

/**
 * Транслитерирует и слагифицирует строку (тег) в ASCII URL-slug.
 * Сохраняет цифры, буквы переводит в латиницу, всё прочее — в дефис.
 */
export function slugifyTag(tag: string): string {
  const lower = tag.toLowerCase();
  let out = "";
  for (const ch of lower) {
    if (TRANSLIT_MAP[ch] !== undefined) {
      out += TRANSLIT_MAP[ch];
    } else if (/[a-z0-9]/.test(ch)) {
      out += ch;
    } else {
      out += "-";
    }
  }
  return out
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ── Операции над статьями ─────────────────────────────────────────────────── */

export function getSortedArticles(): BlogArticle[] {
  return [...blogArticles].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getArticlesByCategory(category: BlogCategory): BlogArticle[] {
  return getSortedArticles().filter((a) => a.category === category);
}

/**
 * Собирает все уникальные теги, привязанные к slug-у.
 * Если два тега дают один slug (конфликт транслита) — выбирается первый.
 */
export function getAllTagSlugs(): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, { tag: string; count: number }>();
  for (const article of blogArticles) {
    for (const tag of article.tags) {
      const slug = slugifyTag(tag);
      if (!slug) continue;
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { tag, count: 1 });
      }
    }
  }
  return Array.from(map.entries())
    .map(([slug, v]) => ({ slug, tag: v.tag, count: v.count }))
    .sort((a, b) => b.count - a.count);
}

export function getArticlesByTagSlug(tagSlug: string): {
  tag: string;
  articles: BlogArticle[];
} | null {
  const matched = getAllTagSlugs().find((t) => t.slug === tagSlug);
  if (!matched) return null;
  const articles = getSortedArticles().filter((article) =>
    article.tags.some((t) => slugifyTag(t) === tagSlug)
  );
  return { tag: matched.tag, articles };
}

/* ── Пагинация ─────────────────────────────────────────────────────────────── */

export const BLOG_PAGE_SIZE = 10;

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number = BLOG_PAGE_SIZE
): {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
    pageSize,
  };
}

/* ── Related articles ──────────────────────────────────────────────────────── */

/**
 * Подбирает до 3 связанных статей:
 * 1) из той же категории (кроме текущей), отсортированных по числу пересечений тегов;
 * 2) если не хватает — добираем из всех статей по совпадению тегов.
 */
export function getRelatedArticles(
  current: BlogArticle,
  limit = 3
): BlogArticle[] {
  const tagSet = new Set(current.tags);

  const scored = (article: BlogArticle) => {
    let score = 0;
    for (const t of article.tags) if (tagSet.has(t)) score += 1;
    return score;
  };

  const sameCategory = blogArticles
    .filter((a) => a.slug !== current.slug && a.category === current.category)
    .map((a) => ({ a, s: scored(a) }))
    .sort((x, y) => {
      if (y.s !== x.s) return y.s - x.s;
      return (
        new Date(y.a.publishDate).getTime() -
        new Date(x.a.publishDate).getTime()
      );
    })
    .map((x) => x.a);

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const taken = new Set([current.slug, ...sameCategory.map((a) => a.slug)]);
  const fillers = blogArticles
    .filter((a) => !taken.has(a.slug))
    .map((a) => ({ a, s: scored(a) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => {
      if (y.s !== x.s) return y.s - x.s;
      return (
        new Date(y.a.publishDate).getTime() -
        new Date(x.a.publishDate).getTime()
      );
    })
    .map((x) => x.a);

  const combined = [...sameCategory, ...fillers];

  // Если совсем мало — добиваем просто свежими статьями
  if (combined.length < limit) {
    const rest = getSortedArticles().filter(
      (a) => a.slug !== current.slug && !combined.some((c) => c.slug === a.slug)
    );
    combined.push(...rest);
  }

  return combined.slice(0, limit);
}
