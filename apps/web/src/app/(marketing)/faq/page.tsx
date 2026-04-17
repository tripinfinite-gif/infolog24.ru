import type { Metadata } from "next";

import { faqItems } from "@/content/faq";

import { FaqClient } from "./faq-client";
import { absoluteUrl } from "@/lib/utils/base-url";

// ISR: revalidate every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Частые вопросы (FAQ) | Инфолог24 — ответы на 30+ вопросов",
  description:
    "Ответы на 30+ вопросов о пропусках в Москву: какие документы нужны, сколько стоит, сроки оформления, штрафы, требования к транспорту. Всё о пропусках на МКАД, ТТК и Садовое кольцо.",
  keywords: [
    "FAQ пропуска Москва",
    "частые вопросы пропуск МКАД",
    "документы для пропуска",
    "штрафы без пропуска",
    "сроки оформления пропуска",
  ],
  openGraph: {
    title: "Частые вопросы о пропусках в Москву | Инфолог24",
    description:
      "Ответы на 30+ вопросов: документы, сроки, цены, штрафы, требования к транспорту.",
    type: "website",
    url: absoluteUrl("/faq"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Частые вопросы о пропусках в Москву | Инфолог24",
    description:
      "Ответы на 30+ вопросов: документы, сроки, цены, штрафы, требования к транспорту.",
  },
  alternates: {
    canonical: absoluteUrl("/faq"),
  },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient />
    </>
  );
}
