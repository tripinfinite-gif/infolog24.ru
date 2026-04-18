import { BlogCard } from "@/components/blog/blog-card";
import type { BlogArticle } from "@/content/blog-articles";

interface RelatedArticlesProps {
  articles: BlogArticle[];
  heading?: string;
}

export function RelatedArticles({
  articles,
  heading = "Читайте также",
}: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="border-t bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="related-articles-heading"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogCard key={article.slug} article={article} showTags={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
