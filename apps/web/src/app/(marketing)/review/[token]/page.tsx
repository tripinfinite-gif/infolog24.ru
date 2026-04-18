import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getReviewByToken } from "@/lib/dal/reviews";

import { ReviewForm } from "./review-form";

export const metadata: Metadata = {
  title: "Оставить отзыв — Инфолог24",
  description:
    "Поделитесь впечатлениями об оформлении пропуска через Инфолог24.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface Params {
  token: string;
}

export default async function ReviewByTokenPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;

  const review = await getReviewByToken(token);

  // Токен недействителен или отзыв уже отправлен / промодерирован → 404.
  if (!review) notFound();
  if (review.status !== "pending") notFound();
  if (review.submittedAt) notFound();

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            Оцените работу Инфолог24
          </h1>
          <p className="mt-3 text-muted-foreground">
            Пропуск оформлен — спасибо, что выбрали нас. Ваш отзыв
            поможет коллегам-перевозчикам, а нам — становиться лучше.
          </p>
        </div>

        <ReviewForm token={token} />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ссылка одноразовая — после отправки отзыва перестанет работать.
          Отзыв публикуется после проверки модератором.
        </p>
      </div>
    </section>
  );
}
