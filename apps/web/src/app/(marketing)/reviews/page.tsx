import type { Metadata } from "next";

import { ReviewsClient } from "./reviews-client";

export const metadata: Metadata = {
  title: "Отзывы клиентов | Инфологистик-24 — 150+ отзывов, рейтинг 4.9",
  description:
    "Отзывы клиентов о работе Инфологистик-24. Средняя оценка 4.9 из 5. 150+ отзывов на Яндекс Картах, 2ГИС и сайте. 70% клиентов возвращаются ежегодно.",
  openGraph: {
    title: "Отзывы клиентов | Инфологистик-24",
    description:
      "150+ отзывов. Средняя оценка 4.9. 70% клиентов продлевают пропуска ежегодно.",
    type: "website",
  },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
