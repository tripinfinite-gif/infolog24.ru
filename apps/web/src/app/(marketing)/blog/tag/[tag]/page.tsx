import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogCategoryTabs } from "@/components/blog/blog-category-tabs";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogSearch } from "@/components/blog/blog-search";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  BLOG_PAGE_SIZE,
  getAllTagSlugs,
  getArticlesByTagSlug,
  paginate,
} from "@/lib/blog";
import { absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllTagSlugs().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const data = getArticlesByTagSlug(tagSlug);
  if (!data) return {};

  const title = `Статьи по теме «${data.tag}» — Инфолог24`;
  const description = `Подборка материалов блога Инфолог24 по теме «${data.tag}». Всего статей: ${data.articles.length}.`;
  const url = absoluteUrl(`/blog/tag/${tagSlug}`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "Инфолог24",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ tag: tagSlug }, sp] = await Promise.all([params, searchParams]);
  const data = getArticlesByTagSlug(tagSlug);
  if (!data) notFound();

  const requestedPage = Number(sp.page ?? "1");
  if (sp.page && (!Number.isInteger(requestedPage) || requestedPage < 1)) {
    notFound();
  }

  const { items, page, totalPages, total } = paginate(
    data.articles,
    requestedPage,
    BLOG_PAGE_SIZE
  );

  if (sp.page && requestedPage > totalPages) notFound();

  const basePath = `/blog/tag/${tagSlug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Блог", href: "/blog" },
          { name: `Тег: ${data.tag}`, href: basePath },
        ]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <BlogBreadcrumbs
            items={[
              { name: "Главная", href: "/" },
              { name: "Блог", href: "/blog" },
              { name: `Тег: ${data.tag}` },
            ]}
          />

          <div className="mt-6">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Статьи по теме «{data.tag}»
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Всего статей: {total}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <BlogCategoryTabs active="all" />

            <BlogSearch articles={data.articles}>
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
          </div>
        </div>
      </section>
    </>
  );
}
