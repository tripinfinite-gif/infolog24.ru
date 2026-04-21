import type { Metadata } from "next";

import { BreadcrumbJsonLd, ReviewsJsonLd } from "@/components/seo/json-ld";
import { testimonials, type Testimonial } from "@/content/testimonials";
import {
  getApprovedReviewsSummary,
  listApprovedReviews,
} from "@/lib/dal/reviews";
import { absoluteUrl } from "@/lib/utils/base-url";
import { logger } from "@/lib/logger";

import { ReviewsClient } from "./reviews-client";

// ISR: revalidate every 1 hour. Точечные invalidate'ы на approve/reject
// уже делаются через revalidatePath в server action'е модерации.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Отзывы клиентов — 150+ историй · Инфолог24",
  description:
    "Отзывы клиентов о работе Инфолог24. Средняя оценка 4.9 из 5. 150+ отзывов на Яндекс Картах, 2ГИС и сайте. 70% клиентов возвращаются ежегодно.",
  keywords: [
    "отзывы Инфолог24",
    "отзывы пропуска Москва",
    "рейтинг оформления пропусков",
  ],
  openGraph: {
    title: "Отзывы клиентов | Инфолог24",
    description:
      "150+ отзывов. Средняя оценка 4.9. 70% клиентов продлевают пропуска ежегодно.",
    type: "website",
    url: absoluteUrl("/reviews"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Отзывы клиентов | Инфолог24",
    description:
      "150+ отзывов. Средняя оценка 4.9. 70% клиентов продлевают пропуска ежегодно.",
  },
  alternates: {
    canonical: absoluteUrl("/reviews"),
  },
};

/**
 * Грузим одобренные DB-отзывы, а также aggregateRating.
 * Если БД упала — возвращаемся к хардкод-отзывам (исторический fallback).
 */
async function loadDbReviews(): Promise<{
  dbReviews: Testimonial[];
  ratingValue: string;
  reviewCount: string;
}> {
  try {
    const [rows, summary] = await Promise.all([
      listApprovedReviews({ limit: 60 }),
      getApprovedReviewsSummary(),
    ]);

    const dbReviews: Testimonial[] = rows.map((r) => ({
      id: `db-${r.id}`,
      name: r.authorName,
      company: r.company ?? "",
      text: r.content,
      rating: r.rating,
      source: "site" as const,
      date: (r.submittedAt ?? r.createdAt).toISOString().split("T")[0],
    }));

    // Если в БД пока ничего нет — используем хардкод-значения (так было исторически).
    const count = summary.count;
    const ratingValue =
      count > 0 ? summary.averageRating.toFixed(1) : "4.9";
    const reviewCount = count > 0 ? String(count + 150) : "150";
    return { dbReviews, ratingValue, reviewCount };
  } catch (err) {
    logger.warn(
      { err },
      "Failed to load DB reviews, falling back to hardcoded testimonials",
    );
    return { dbReviews: [], ratingValue: "4.9", reviewCount: "150" };
  }
}

export default async function ReviewsPage() {
  const { dbReviews, ratingValue, reviewCount } = await loadDbReviews();

  // Для JSON-LD берём объединённый список (DB + хардкод) — чтобы Google видел всё.
  const jsonLdReviews = [...dbReviews, ...testimonials].map((t) => ({
    name: t.name,
    text: t.text,
    rating: t.rating,
    date: t.date,
  }));

  return (
    <>
      <ReviewsJsonLd
        reviews={jsonLdReviews}
        ratingValue={ratingValue}
        reviewCount={reviewCount}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Отзывы", href: "/reviews" },
        ]}
      />
      <ReviewsClient dbReviews={dbReviews} />
    </>
  );
}
