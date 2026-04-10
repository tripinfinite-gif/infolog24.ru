import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Phone,
  Shield,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

import { serviceZones } from "@/content/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ── Static params для ISR ───────────────────────────────────────────────────

export function generateStaticParams() {
  return serviceZones.map((zone) => ({ slug: zone.slug }));
}

// ── SEO метаданные ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const zone = serviceZones.find((z) => z.slug === slug);

  if (!zone) return { title: "Услуга не найдена" };

  const title = `${zone.fullName} — оформление за ${zone.processingDays} дн. | Инфологистик-24`;
  const description = `${zone.zoneDescription} Оформляем ${zone.fullName.toLowerCase()} за ${zone.processingDays} рабочих дня. Цена ${zone.priceLabel} ${zone.priceUnit}. Гарантия результата. Бесплатный временный пропуск.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/services/${slug}`,
    },
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

// ── Страница ────────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const zone = serviceZones.find((z) => z.slug === slug);

  if (!zone) notFound();

  // Другие зоны для блока "Другие услуги"
  const otherZones = serviceZones.filter((z) => z.slug !== slug);

  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-primary/5 to-background pb-12 pt-24">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Главная
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" />
              <li>
                <Link href="/services" className="hover:text-foreground transition-colors">
                  Услуги
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" />
              <li className="font-medium text-foreground">{zone.fullName}</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                {zone.badge && (
                  <Badge variant="secondary" className="text-sm">
                    {zone.badge}
                  </Badge>
                )}
                {zone.popular && (
                  <Badge className="bg-accent text-white text-sm">
                    Популярный
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {zone.fullName}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {zone.zoneDescription}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>
                    Оформление за{" "}
                    <strong className="text-foreground">
                      {zone.processingDays} {zone.processingDays === 1 ? "день" : zone.processingDays < 5 ? "дня" : "дней"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>Гарантия результата</span>
                </div>
              </div>
            </div>

            {/* Ценовая карточка */}
            <Card className="w-full shrink-0 lg:w-80 border-2 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-sm font-medium text-muted-foreground">
                  Стоимость
                </CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">
                    {zone.priceLabel}
                  </span>
                  <span className="block text-sm text-muted-foreground mt-1">
                    {zone.priceUnit}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/contacts">
                    <Phone className="mr-2 h-4 w-4" />
                    Оставить заявку
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href="tel:+74951234567">
                    Позвонить
                  </a>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Скидки: от 2 машин — 5%, от 6 — 10%, от 11 — 15%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Что входит ────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Что входит в услугу</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {zone.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Документы ─────────────────────────────────────────────────────── */}
      <section className="border-t py-16 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold sm:text-3xl">
              Необходимые документы
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {zone.documents.map((doc, i) => (
              <Card key={doc} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm">{doc}</span>
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Не знаете, какие документы нужны?{" "}
            <Link href="/contacts" className="text-primary underline">
              Проконсультируем бесплатно
            </Link>
          </p>
        </div>
      </section>

      {/* ── Требования ────────────────────────────────────────────────────── */}
      <section className="border-t py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold sm:text-3xl">
              Требования к транспорту
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {zone.requirements.map((req) => (
              <div key={req} className="flex items-start gap-3 rounded-lg border p-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Штраф ─────────────────────────────────────────────────────────── */}
      <section className="border-t py-16 bg-destructive/5">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Штраф за проезд без пропуска — от 7 500 ₽
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Камеры фиксируют каждый проезд. За повторное нарушение —
                  10 000 ₽. За месяц без пропуска штрафы могут превысить
                  500 000 ₽. Пропуск окупается за одну поездку.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      {zone.faq.length > 0 && (
        <section className="border-t py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold sm:text-3xl mb-8">
              Вопросы и ответы
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {zone.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="border-t bg-primary/5 py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Оформим {zone.fullName.toLowerCase()} за {zone.processingDays}{" "}
            {zone.processingDays === 1 ? "день" : zone.processingDays < 5 ? "дня" : "дней"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            Передайте документы — мы сделаем всё остальное. Гарантия результата
            или возврат денег.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/contacts">Оставить заявку</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">Все тарифы и цены</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Другие услуги ─────────────────────────────────────────────────── */}
      <section className="border-t py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold mb-6">Другие услуги</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {otherZones.map((z) => (
              <Link
                key={z.slug}
                href={`/services/${z.slug}`}
                className="group rounded-lg border p-5 transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {z.fullName}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {z.priceLabel} · {z.processingDays}{" "}
                  {z.processingDays === 1 ? "день" : z.processingDays < 5 ? "дня" : "дней"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── JSON-LD structured data ───────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: zone.fullName,
            description: zone.zoneDescription,
            provider: {
              "@type": "Organization",
              name: "Инфологистик-24",
              url: "https://infolog24.ru",
            },
            areaServed: {
              "@type": "City",
              name: "Москва",
            },
            offers: {
              "@type": "Offer",
              price: zone.price,
              priceCurrency: "RUB",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: zone.price,
                priceCurrency: "RUB",
                unitText: zone.priceUnit,
              },
            },
          }),
        }}
      />

      {/* FAQ structured data */}
      {zone.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: zone.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      )}
    </main>
  );
}
