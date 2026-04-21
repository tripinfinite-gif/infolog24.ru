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
    "Пропуска в Москву + регуляторика + ИИ-диспетчер — Инфолог24",
  description:
    "Пропуск в Москву за день (МКАД, ТТК, Садовое) + РНИС, ЭТрН, ГосЛог в одном кабинете. ИнфоПилот помогает водителю прямо на трассе 24/7. С 2016 года — 50 000+ пропусков.",
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
      "Вся операционная работа перевозчика в одном окне. Пакеты «Пропуск+», «Транзит Москва», «Флот Про» + ИнфоПилот — ИИ-диспетчер на трассе 24/7.",
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
        description="Комплексная платформа для грузоперевозчика: помощь с пропусками на МКАД/ТТК/СК, РНИС, ЭТрН, ГосЛог, мониторинг штрафов и ИИ-диспетчер на трассе 24/7"
        price={4500}
        url="/"
      />
      <BreadcrumbJsonLd items={[{ name: "Главная", href: "/" }]} />

      {/* === HOMEPAGE v4 · AI OPERATIONS CENTER · full-viewport scenes === */}
      {/* Глобальная атмосфера: grid + gradient blobs behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="atmosphere atmosphere-dim absolute inset-0" />
        <div className="glow glow-violet left-[-20%] top-[10%] size-[40vw]" />
        <div className="glow glow-cyan right-[-15%] top-[40%] size-[35vw]" style={{ animationDelay: "-3s" }} />
        <div className="glow glow-amber left-[30%] bottom-[-10%] size-[35vw]" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative z-10">
        {/* 01 */}
        <section className="scene" data-scene="01">
          <div className="scene-index">01 / 11</div>
          <Hero />
        </section>

        {/* 02 · Mini-calculator */}
        <section className="scene" data-scene="02">
          <div className="scene-index">02 / 11</div>
          <MiniCalculator />
        </section>

        {/* 03 · Pain */}
        <section className="scene" data-scene="03">
          <div className="scene-index">03 / 11</div>
          <PainSystems />
        </section>

        {/* 04 · Packages */}
        <section className="scene" data-scene="04">
          <div className="scene-index">04 / 11</div>
          <PackagesGrid />
        </section>

        {/* 05 · InfoPilot */}
        <section className="scene" data-scene="05">
          <div className="scene-index">05 / 11</div>
          <InfopilotShowcase />
        </section>

        {/* 06 · Regulatory timeline */}
        <section className="scene" data-scene="06">
          <div className="scene-index">06 / 11</div>
          <RegulatoryTimeline />
        </section>

        {/* 07 · Simple pass */}
        <section className="scene" data-scene="07">
          <div className="scene-index">07 / 11</div>
          <SimplePass />
        </section>

        {/* 08 · How it works */}
        <section className="scene" data-scene="08">
          <div className="scene-index">08 / 11</div>
          <HowItWorks />
        </section>

        {/* 09 · Why us */}
        <section className="scene" data-scene="09">
          <div className="scene-index">09 / 11</div>
          <WhyUsTiles />
        </section>

        {/* 10 · Testimonials */}
        <section className="scene" data-scene="10">
          <div className="scene-index">10 / 11</div>
          <Testimonials testimonials={testimonialsData} />
        </section>

        {/* 11 · FAQ + Final CTA — оставляем вместе, но как отдельная scene */}
        <section className="scene" data-scene="11">
          <div className="scene-index">11 / 11</div>
          <FaqMini items={faqData} />
        </section>

        <section className="scene" data-scene="12">
          <div className="scene-index">CTA</div>
          <FinalCtaForm />
        </section>
      </div>
    </>
  );
}
