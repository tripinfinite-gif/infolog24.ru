import { CheckCircle, Clock, FileText, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/content/services";

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: `${service.title} | Инфологистик-24`,
    description: service.description,
    openGraph: {
      title: `${service.title} | Инфологистик-24`,
      description: service.description,
      type: "website",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.description,
            provider: {
              "@type": "Organization",
              name: "Инфологистик-24",
            },
            areaServed: "Москва",
            offers: {
              "@type": "Offer",
              price: service.price,
              priceCurrency: "RUB",
            },
          }),
        }}
      />

      {/* Header Section */}
      <section className="bg-primary px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-primary-foreground/20 text-primary-foreground">
              <MapPin className="mr-1 size-3" />
              {zoneLabels[service.zone]}
            </Badge>
            <Badge className="bg-primary-foreground/20 text-primary-foreground">
              <Clock className="mr-1 size-3" />
              Оформление за {service.processingDays} дн.
            </Badge>
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            {service.title}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {service.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="text-3xl font-bold text-accent">
              {service.price.toLocaleString("ru-RU")} руб.
            </div>
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/contacts">Оформить</Link>
            </Button>
          </div>
          {service.priceNote && (
            <p className="mt-2 text-sm text-primary-foreground/60">
              {service.priceNote}
            </p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {service.longDescription}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Что включено
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Requirements & Documents */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardContent>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CheckCircle className="size-5 text-primary" />
                  Требования
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="size-5 text-primary" />
                  Необходимые документы
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.documents.map((doc) => (
                    <li
                      key={doc}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service FAQ */}
      {service.faq.length > 0 && (
        <FaqSection items={service.faq} />
      )}

      <CtaSection
        heading={`Оформить ${service.shortTitle}?`}
        description="Оставьте заявку, и мы свяжемся с вами в течение 15 минут. Бесплатная консультация."
        ctaText="Оставить заявку"
        ctaHref="/contacts"
      />
    </>
  );
}
