import { CATEGORY_LABELS, getSortedArticles } from "@/lib/blog";
import { SITE_URL, absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getSortedArticles();
  const lastBuildDate = new Date(
    articles[0]?.publishDate ?? Date.now()
  ).toUTCString();

  const items = articles
    .map((article) => {
      const url = absoluteUrl(`/blog/${article.slug}`);
      const pubDate = new Date(article.publishDate).toUTCString();
      const categoryLabel = CATEGORY_LABELS[article.category];
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
      <category>${escapeXml(categoryLabel)}</category>
${article.tags
  .map((tag) => `      <category>${escapeXml(tag)}</category>`)
  .join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Блог Инфолог24 — пропуска и грузоперевозки в Москве</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Полезные статьи о пропусках в Москву, штрафах, документах и требованиях к грузовому транспорту.</description>
    <language>ru</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>60</ttl>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

