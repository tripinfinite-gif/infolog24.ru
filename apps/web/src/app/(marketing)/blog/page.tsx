import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogCategoryTabs } from "@/components/blog/blog-category-tabs";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogSearch } from "@/components/blog/blog-search";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { BLOG_PAGE_SIZE, getSortedArticles, paginate } from "@/lib/blog";
import { absoluteUrl } from "@/lib/utils/base-url";

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
    url: absoluteUrl("/blog"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог о грузоперевозках в Москве — Инфолог24",
    description:
      "Полезные статьи о пропусках в Москву для грузового транспорта.",
  },
  alternates: {
    canonical: absoluteUrl("/blog"),
    types: {
      "application/rss+xml": [
        { url: absoluteUrl("/blog/rss.xml"), title: "Блог Инфолог24 — RSS" },
      ],
    },
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");
  if (params.page && (!Number.isInteger(requestedPage) || requestedPage < 1)) {
    notFound();
  }

  const sortedArticles = getSortedArticles();
  const { items, page, totalPages, total } = paginate(
    sortedArticles,
    requestedPage,
    BLOG_PAGE_SIZE
  );

  // Если запросили страницу за пределами — 404 (только если явно передан page)
  if (params.page && requestedPage > totalPages) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Блог", href: "/blog" },
        ]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <BlogBreadcrumbs
            items={[
              { name: "Главная", href: "/" },
              { name: "Блог" },
            ]}
          />

          <div className="mt-6 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Блог
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Полезные статьи о пропусках, штрафах и грузоперевозках в Москве
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Всего материалов: {total}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <BlogCategoryTabs active="all" />

            <BlogSearch articles={sortedArticles}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((article) => (
                  <BlogCard key={article.slug} article={article} />
                ))}
              </div>
              <BlogPagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/blog"
              />
            </BlogSearch>
          </div>
        </div>
      </section>
    </>
  );
}
