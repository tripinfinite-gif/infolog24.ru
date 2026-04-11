import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title:
    "Инфологистик-24 — платформа для грузоперевозчиков. Пропуска, регуляторика, ИИ-диспетчер 24/7",
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
      "Инфологистик-24 — платформа для грузоперевозчиков. Пропуска + регуляторика + ИИ-диспетчер",
    description:
      "Вся операционка перевозчика в одном окне. Пакеты «Пропуск+», «Транзит Москва», «Флот Про» + ИнфоПилот — ИИ-диспетчер на трассе 24/7.",
    type: "website",
    url: "https://inlog24.ru",
    siteName: "Инфологистик-24",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Инфологистик-24 — платформа для грузоперевозчиков. Пропуска + регуляторика + ИИ-диспетчер",
    description:
      "Больше чем пропуск. 6 систем регуляторики в одном окне + ИИ-диспетчер на трассе 24/7.",
  },
  alternates: {
    canonical: "https://inlog24.ru",
  },
};

const HOMEPAGE_FAQ_IDS = [
  "what-is-pass",
  "zones-difference",
  "who-needs-pass",
  "pass-validity",
  "payment-methods",
];

export default function HomePage() {
  const testimonialsData = testimonials.slice(0, 6).map((t) => ({
    name: t.name,
    company: t.company,
    text: t.text,
    rating: t.rating,
    source: t.source,
  }));

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
