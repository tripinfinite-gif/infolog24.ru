import type { Metadata } from "next";

import { BreadcrumbJsonLd, ReviewsJsonLd } from "@/components/seo/json-ld";
import { testimonials } from "@/content/testimonials";

import { ReviewsClient } from "./reviews-client";

export const metadata: Metadata = {
  title: "Отзывы клиентов | Инфологистик-24 — 150+ отзывов, рейтинг 4.9",
  description:
    "Отзывы клиентов о работе Инфологистик-24. Средняя оценка 4.9 из 5. 150+ отзывов на Яндекс Картах, 2ГИС и сайте. 70% клиентов возвращаются ежегодно.",
  keywords: [
    "отзывы Инфологистик-24",
    "отзывы пропуска Москва",
    "рейтинг оформления пропусков",
  ],
  openGraph: {
    title: "Отзывы клиентов | Инфологистик-24",
    description:
      "150+ отзывов. Средняя оценка 4.9. 70% клиентов продлевают пропуска ежегодно.",
    type: "website",
    url: "https://inlog24.ru/reviews",
    siteName: "Инфологистик-24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Отзывы клиентов | Инфологистик-24",
    description:
      "150+ отзывов. Средняя оценка 4.9. 70% клиентов продлевают пропуска ежегодно.",
  },
  alternates: {
    canonical: "https://inlog24.ru/reviews",
  },
};

export default function ReviewsPage() {
  return (
    <>
      <ReviewsJsonLd
        reviews={testimonials.map((t) => ({
          name: t.name,
          text: t.text,
          rating: t.rating,
          date: t.date,
        }))}
        ratingValue="4.9"
        reviewCount="150"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Отзывы", href: "/reviews" },
        ]}
      />
      <ReviewsClient />
    </>
  );
}
