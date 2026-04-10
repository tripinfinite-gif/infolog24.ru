import type { Metadata } from "next";

import { faqItems } from "@/content/faq";

import { FaqClient } from "./faq-client";

export const metadata: Metadata = {
  title: "Частые вопросы (FAQ) | Инфологистик-24",
  description:
    "Ответы на 30+ вопросов о пропусках в Москву: документы, сроки, цены, штрафы, требования к транспорту.",
  openGraph: {
    title: "Частые вопросы (FAQ) | Инфологистик-24",
    description: "Ответы на вопросы о пропусках в Москву для грузового транспорта.",
    type: "website",
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
