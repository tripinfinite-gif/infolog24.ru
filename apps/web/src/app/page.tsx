import { Award, Bell, Gift, Percent, ShieldCheck, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { companyInfo } from "@/content/company";
import { faqItems } from "@/content/faq";
import { steps } from "@/content/how-it-works";
import { stats } from "@/content/stats";
import { testimonials } from "@/content/testimonials";

import { Calculator } from "./calculator";

const iconMap: Record<string, React.ElementType> = {
  Award,
  TrendingUp,
  ShieldCheck,
  Gift,
  Percent,
  Bell,
};

export const metadata: Metadata = {
  title: "Пропуска в Москву для грузового транспорта | Инфологистик-24",
  description:
    "Оформим пропуск на МКАД, ТТК и Садовое кольцо за 3 дня. Быстро, надёжно, с гарантией результата. 10+ лет опыта, 50 000+ оформленных пропусков.",
  openGraph: {
    title: "Пропуска в Москву для грузового транспорта | Инфологистик-24",
    description:
      "Оформим пропуск на МКАД, ТТК и Садовое кольцо за 3 дня. Быстро, надёжно, с гарантией результата.",
    type: "website",
  },
};

export default function HomePage() {
  const featuresData = companyInfo.advantages.map((adv) => ({
    icon: iconMap[adv.icon] || Award,
    title: adv.title,
    description: adv.description,
  }));

  const howItWorksSteps = steps.map((step) => ({
    number: step.number,
    title: step.title,
    description: step.description,
  }));

  const testimonialsData = testimonials.slice(0, 6).map((t) => ({
    name: t.name,
    company: t.company,
    text: t.text,
    rating: t.rating,
  }));

  const faqData = faqItems.slice(0, 8).map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <>
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
          }),
        }}
      />
      <Hero
        title="Пропуска в Москву для грузового транспорта"
        subtitle="Оформим пропуск на МКАД, ТТК и Садовое кольцо за 3 дня. Быстро, надёжно, с гарантией результата."
        ctaText="Оформить пропуск"
        ctaHref="/services"
        secondaryCtaText="Рассчитать стоимость"
        secondaryCtaHref="/pricing"
      />
      <Stats stats={stats} />
      <Features features={featuresData} />
      <HowItWorks steps={howItWorksSteps} />
      <Calculator />
      <Testimonials testimonials={testimonialsData} />
      <FaqSection items={faqData} />
      <CtaSection
        heading="Готовы оформить пропуск?"
        description="Оставьте заявку, и мы свяжемся с вами в течение 15 минут. Бесплатная консультация по документам и стоимости."
        ctaText="Оставить заявку"
        ctaHref="/contacts"
      />
    </>
  );
}
