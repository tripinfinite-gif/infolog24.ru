import type { Metadata } from "next";
import Image from "next/image";

import { ComparisonTable } from "@/components/sections/comparison-table";
import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Guarantees } from "@/components/sections/guarantees";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PainPoints } from "@/components/sections/pain-points";
import { ServicesOverview } from "@/components/sections/services-overview";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { companyInfo } from "@/content/company";
import { faqItems } from "@/content/faq";
import { stats } from "@/content/stats";
import { testimonials } from "@/content/testimonials";

import { Calculator } from "./calculator";

export const metadata: Metadata = {
  title: "Пропуска в Москву для грузового транспорта — от 3 500 ₽ | Инфологистик-24",
  description:
    "Оформим пропуск на МКАД, ТТК и Садовое кольцо за 3 дня. 98% одобрение, 50 000+ пропусков, гарантия результата. Временный пропуск — бесплатно при заказе годового.",
  openGraph: {
    title: "Пропуска в Москву для грузового транспорта | Инфологистик-24",
    description:
      "Оформим пропуск на МКАД, ТТК и Садовое кольцо за 3 дня. 98% одобрение, гарантия результата или возврат денег.",
    type: "website",
  },
};

export default function HomePage() {
  const testimonialsData = testimonials.slice(0, 6).map((t) => ({
    name: t.name,
    company: t.company,
    text: t.text,
    rating: t.rating,
    source: t.source,
  }));

  const faqData = faqItems.slice(0, 8).map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: companyInfo.name,
            description: companyInfo.description,
            telephone: companyInfo.contacts.phone,
            email: companyInfo.contacts.email,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Москва",
              addressCountry: "RU",
            },
            url: "https://infolog24.ru",
            foundingDate: "2016",
            areaServed: "Москва",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "150",
              bestRating: "5",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Оформление пропусков для грузового транспорта",
            provider: {
              "@type": "Organization",
              name: companyInfo.name,
            },
            areaServed: "Москва",
            offers: [
              {
                "@type": "Offer",
                name: "Пропуск на МКАД",
                price: "12000",
                priceCurrency: "RUB",
              },
              {
                "@type": "Offer",
                name: "Пропуск на ТТК",
                price: "12000",
                priceCurrency: "RUB",
              },
              {
                "@type": "Offer",
                name: "Пропуск на Садовое кольцо",
                price: "12000",
                priceCurrency: "RUB",
              },
              {
                "@type": "Offer",
                name: "Временный пропуск",
                price: "3500",
                priceCurrency: "RUB",
              },
            ],
          }),
        }}
      />

      {/* === BENTO GRID LAYOUT === */}
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Row 1: Hero — full width dark card */}
        <Hero />

        {/* Row 2: Stats (2/3) + MKAD photo (1/3) */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <Stats stats={stats} className="lg:col-span-2" />
          <div className="relative overflow-hidden rounded-3xl aspect-[4/3] lg:aspect-auto lg:min-h-[250px]">
            <Image
              src="/images/mkad-aerial.jpg"
              alt="МКАД с высоты птичьего полёта"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
        </div>

        {/* Row 3: Pain points — 3 equal cards */}
        <PainPoints />

        {/* Row 4: Photo (1/3) + How it works (2/3) */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl aspect-[4/3] lg:aspect-auto lg:min-h-[250px]">
            <Image
              src="/images/permit-documents.jpg"
              alt="Документы на оформление пропуска"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
          <HowItWorks className="lg:col-span-2" />
        </div>

        {/* Row 5: Services — 4 cards */}
        <ServicesOverview />

        {/* Row 6: Calculator (standalone section) */}
        <Calculator />

        {/* Row 7: Comparison table (2/3) + Guarantees (1/3) */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <ComparisonTable className="lg:col-span-2" />
          <Guarantees />
        </div>

        {/* Row 8: Testimonials — horizontal scroll */}
        <Testimonials testimonials={testimonialsData} />

        {/* Row 9: FAQ (1/2) + Team photo (1/2) */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <FaqSection items={faqData} />
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="relative flex-1 overflow-hidden rounded-3xl min-h-[200px]">
              <Image
                src="/images/team-office.jpg"
                alt="Команда Инфологистик-24 в офисе"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Row 10: Final CTA — full width dark card */}
        <CtaSection />
      </div>
    </>
  );
}
