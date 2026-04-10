import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CtaSection } from "@/components/sections/cta-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Услуги | Инфологистик-24",
  description:
    "Оформление пропусков на МКАД, ТТК и Садовое кольцо для грузового транспорта. Годовые, ночные и временные пропуска.",
  openGraph: {
    title: "Услуги | Инфологистик-24",
    description:
      "Оформление пропусков на МКАД, ТТК и Садовое кольцо для грузового транспорта.",
    type: "website",
  },
};

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

export default function ServicesPage() {
  return (
    <>
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Наши услуги
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Оформляем все виды пропусков для грузового транспорта в Москву.
              Выберите нужную услугу и оставьте заявку.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="flex flex-col transition-shadow hover:shadow-md"
              >
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <MapPin className="mr-1 size-3" />
                      {zoneLabels[service.zone]}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="mr-1 size-3" />
                      {service.processingDays} дн.
                    </Badge>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {service.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <p className="text-2xl font-bold text-primary">
                      {service.price.toLocaleString("ru-RU")} руб.
                    </p>
                    {service.priceNote && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {service.priceNote}
                      </p>
                    )}
                    <Button asChild className="mt-4 w-full" variant="outline">
                      <Link href={`/services/${service.slug}`}>
                        Подробнее
                        <ArrowRight className="ml-1 size-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        heading="Не нашли нужную услугу?"
        description="Свяжитесь с нами — мы подберём оптимальное решение для вашего транспорта."
        ctaText="Получить консультацию"
        ctaHref="/contacts"
      />
    </>
  );
}
