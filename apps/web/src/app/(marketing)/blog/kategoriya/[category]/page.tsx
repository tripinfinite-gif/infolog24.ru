import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogCategoryTabs } from "@/components/blog/blog-category-tabs";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogSearch } from "@/components/blog/blog-search";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  BLOG_CATEGORIES,
  BLOG_PAGE_SIZE,
  getArticlesByCategory,
  getCategoryBySlug,
  paginate,
} from "@/lib/blog";
import { absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};

  const title = `Статьи о ${cat.label.toLowerCase()} — блог Инфолог24`;
  const url = absoluteUrl(`/blog/kategoriya/${cat.slug}`);
  return {
    title,
    description: cat.description,
    openGraph: {
      title,
      description: cat.description,
      type: "website",
      url,
      siteName: "Инфолог24",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cat.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ category: slug }, sp] = await Promise.all([params, searchParams]);
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const requestedPage = Number(sp.page ?? "1");
  if (sp.page && (!Number.isInteger(requestedPage) || requestedPage < 1)) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(cat.key);
  const { items, page, totalPages, total } = paginate(
    categoryArticles,
    requestedPage,
    BLOG_PAGE_SIZE
  );

  if (sp.page && requestedPage > totalPages) notFound();

  const basePath = `/blog/kategoriya/${cat.slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Блог", href: "/blog" },
          { name: cat.label, href: basePath },
        ]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <BlogBreadcrumbs
            items={[
              { name: "Главная", href: "/" },
              { name: "Блог", href: "/blog" },
              { name: cat.label },
            ]}
          />

          <div className="mt-6">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Статьи о {cat.label.toLowerCase()}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              {cat.description}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Всего в категории: {total}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <BlogCategoryTabs active={cat.key} />

            {total === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                В этой категории пока нет статей.
              </p>
            ) : (
              <BlogSearch articles={categoryArticles}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((article) => (
                    <BlogCard key={article.slug} article={article} />
                  ))}
                </div>
                <BlogPagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={basePath}
                />
              </BlogSearch>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
