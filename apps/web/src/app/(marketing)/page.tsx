import type { Metadata } from "next";

import { MiniCalculator } from "@/components/calculator/mini-calculator";
import { FaqMini } from "@/components/sections/faq-mini";
import { FinalCtaForm } from "@/components/sections/final-cta-form";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { InfopilotShowcase } from "@/components/sections/infopilot-showcase";
import { PackagesGrid } from "@/components/sections/packages-grid";
import { PainSystems } from "@/components/sections/pain-systems";
import { RegulatoryTimeline } from "@/components/sections/regulatory-timeline";
import { SimplePass } from "@/components/sections/simple-pass";
import { Testimonials } from "@/components/sections/testimonials";
import { WhyUsTiles } from "@/components/sections/why-us-tiles";
import {
  BreadcrumbJsonLd,
  LocalBusinessJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { faqItems } from "@/content/faq";
import { testimonials } from "@/content/testimonials";
import { listApprovedReviews } from "@/lib/dal/reviews";
import { logger } from "@/lib/logger";
import { absoluteUrl } from "@/lib/utils/base-url";

// ISR: revalidate every 1 hour — content changes infrequently
export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Инфолог24 — платформа для грузоперевозчиков. Пропуска, регуляторика, ИИ-диспетчер 24/7",
  description:
    "Больше чем пропуск. Пропуск + РНИС + ЭТрН + ГосЛог + мониторинг штрафов + ИИ-диспетчер 24/7 (эвакуация, ремонт, мойка, страхование). Пакеты «Пропуск+», «Транзит Москва», «Флот Про». С 2016 года, 15 000+ оформленных пропусков.",
  keywords: [
    "пропуск в Москву",
    "пропуск на МКАД",
    "пропуск на ТТК",
    "пропуск Садовое кольцо",
    "грузовой пропуск Москва",
    "платформа перевозчика",
    "ИИ-диспетчер для грузовиков",
    "ГосЛог регистрация",
    "ЭТрН переход",
    "РНИС подключение",
    "Пропуск+",
    "Транзит Москва",
    "Флот Про",
    "ИнфоПилот",
    "эвакуация грузовиков",
  ],
  openGraph: {
    title:
      "Инфолог24 — платформа для грузоперевозчиков. Пропуска + регуляторика + ИИ-диспетчер",
    description:
      "Вся операционка перевозчика в одном окне. Пакеты «Пропуск+», «Транзит Москва», «Флот Про» + ИнфоПилот — ИИ-диспетчер на трассе 24/7.",
    type: "website",
    url: absoluteUrl("/"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Инфолог24 — платформа для грузоперевозчиков. Пропуска + регуляторика + ИИ-диспетчер",
    description:
      "Больше чем пропуск. 6 систем регуляторики в одном окне + ИИ-диспетчер на трассе 24/7.",
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

const HOMEPAGE_FAQ_IDS = [
  "what-is-pass",
  "zones-difference",
  "who-needs-pass",
  "pass-validity",
  "payment-methods",
];

/**
 * Достаём 3 случайных одобренных DB-отзыва для главной. Если БД пустая
 * или упала — возвращаем пустой массив, и страница показывает только
 * хардкод-отзывы (исторический fallback).
 */
async function pickRandomDbReviews(): Promise<
  { name: string; company: string; text: string; rating: number; source?: "yandex" | "2gis" | "site" }[]
> {
  try {
    const rows = await listApprovedReviews({ limit: 30 });
    if (rows.length === 0) return [];
    // Простой shuffle через sort(random).
    const shuffled = [...rows].sort(() => Math.random() - 0.5).slice(0, 3);
    return shuffled.map((r) => ({
      name: r.authorName,
      company: r.company ?? "",
      text: r.content,
      rating: r.rating,
      source: "site" as const,
    }));
  } catch (err) {
    logger.warn({ err }, "Homepage: failed to load DB reviews, using hardcoded only");
    return [];
  }
}

export default async function HomePage() {
  const dbRandom = await pickRandomDbReviews();

  // DB-отзывы впереди, дополняем хардкодом до 6 штук.
  const hardcoded = testimonials.slice(0, Math.max(0, 6 - dbRandom.length)).map((t) => ({
    name: t.name,
    company: t.company,
    text: t.text,
    rating: t.rating,
    source: t.source,
  }));
  const testimonialsData = [...dbRandom, ...hardcoded];

  const faqItemsByPriority = HOMEPAGE_FAQ_IDS.map((id) =>
    faqItems.find((item) => item.id === id)
  ).filter((item): item is (typeof faqItems)[number] => Boolean(item));

  const faqData = (
    faqItemsByPriority.length >= 5 ? faqItemsByPriority : faqItems.slice(0, 5)
  )
    .slice(0, 5)
    .map((item) => ({
      question: item.question,
      answer: item.answer,
    }));

  return (
    <>
      {/* Structured data */}
      <LocalBusinessJsonLd />
      <ServiceJsonLd
        name="Платформа для грузоперевозчика: пропуска, регуляторика, ИИ-диспетчер"
        description="Комплексная платформа для управления операционкой грузоперевозчика: пропуска на МКАД/ТТК/СК, РНИС, ЭТрН, ГосЛог, мониторинг штрафов и ИИ-диспетчер на трассе 24/7"
        price={3500}
        url="/"
      />
      <BreadcrumbJsonLd items={[{ name: "Главная", href: "/" }]} />

      {/* === HOMEPAGE v2 — PLATFORM === */}
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:space-y-14 sm:px-6 sm:py-10 lg:px-8">
        {/* 1. Hero */}
        <Hero />

        {/* 1a. Mini-calculator — стоимость за 10 секунд, раскрывает конверсию для 80% посетителей, не доходящих до /calculator */}
        <MiniCalculator />

        {/* 2. Pain: 6 systems */}
        <PainSystems />

        {/* 3. Three packages — main conversion block */}
        <PackagesGrid />

        {/* 4. InfoPilot — flagship AI dispatcher */}
        <InfopilotShowcase />

        {/* 5. Regulatory timeline */}
        <RegulatoryTimeline />

        {/* 6. "Just a pass" door */}
        <SimplePass />

        {/* 7. How it works */}
        <HowItWorks />

        {/* 8. Why us */}
        <WhyUsTiles />

        {/* 9. Testimonials (existing) */}
        <Testimonials testimonials={testimonialsData} />

        {/* 10. FAQ mini */}
        <FaqMini items={faqData} />

        {/* 11. Final CTA with form */}
        <FinalCtaForm />
      </div>
    </>
  );
}
