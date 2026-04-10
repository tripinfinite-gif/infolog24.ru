import { Check, X } from "lucide-react";
import type { Metadata } from "next";

import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { faqItems } from "@/content/faq";
import { pricingTiers, volumeDiscounts } from "@/content/pricing";

import { Calculator } from "../calculator";

export const metadata: Metadata = {
  title: "Тарифы | Инфологистик-24",
  description:
    "Стоимость оформления пропусков в Москву. Пропуск на МКАД от 3 500 руб., ТТК от 5 000 руб., Садовое кольцо от 7 000 руб. Скидки при оформлении нескольких машин.",
  openGraph: {
    title: "Тарифы | Инфологистик-24",
    description:
      "Стоимость оформления пропусков в Москву для грузового транспорта.",
    type: "website",
  },
};

const comparisonData = [
  {
    feature: "Время на оформление",
    self: "2-4 часа + ожидание",
    us: "5 минут на заявку",
  },
  {
    feature: "Вероятность отказа",
    self: "30-40% при первой подаче",
    us: "Менее 2%",
  },
  {
    feature: "Повторная подача",
    self: "Заново всё делать самому",
    us: "Бесплатно, мы сами",
  },
  {
    feature: "Временный пропуск",
    self: "Отдельная заявка",
    us: "Бесплатно при годовом",
  },
  {
    feature: "Напоминание о продлении",
    self: "Нет",
    us: "За 30 дней",
  },
  {
    feature: "Консультации",
    self: "Нет",
    us: "24/7 по телефону и в мессенджерах",
  },
  {
    feature: "Знание актуальных требований",
    self: "Нужно разбираться самому",
    us: "Мы следим за изменениями",
  },
];

export default function PricingPage() {
  const pricingFaq = faqItems
    .filter((item) => item.category === "pricing")
    .map((item) => ({ question: item.question, answer: item.answer }));

  return (
    <>
      {/* Header */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Тарифы
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Прозрачные цены без скрытых доплат. Повторная подача при отказе —
              бесплатно.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <Card
                key={`${tier.zone}-${tier.type}`}
                className={`flex flex-col ${tier.popular ? "border-primary shadow-lg" : ""}`}
              >
                <CardContent className="flex flex-1 flex-col gap-4">
                  {tier.popular && (
                    <Badge className="w-fit bg-primary text-primary-foreground">
                      Популярный
                    </Badge>
                  )}
                  <h3 className="text-lg font-semibold text-foreground">
                    {tier.title}
                  </h3>
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      {tier.price.toLocaleString("ru-RU")}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {tier.priceUnit}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.processingDays}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volume Discounts */}
      <section className="bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Скидки за объём
          </h2>
          <div className="mt-8 overflow-hidden rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Количество машин</TableHead>
                  <TableHead className="text-right">Скидка</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volumeDiscounts.map((discount) => (
                  <TableRow key={discount.label}>
                    <TableCell>{discount.label}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {discount.discountPercent}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Для автопарков более 20 машин условия обсуждаются индивидуально
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Сам vs через нас
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Сравните самостоятельное оформление и работу с нами
          </p>
          <div className="mt-8 overflow-hidden rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Параметр</TableHead>
                  <TableHead>Самостоятельно</TableHead>
                  <TableHead>Через нас</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <X className="size-4 shrink-0 text-destructive" />
                        {row.self}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-foreground">
                        <Check className="size-4 shrink-0 text-primary" />
                        {row.us}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <Calculator />

      {/* Pricing FAQ */}
      {pricingFaq.length > 0 && <FaqSection items={pricingFaq} />}

      <CtaSection
        heading="Готовы оформить пропуск?"
        description="Оставьте заявку, и мы рассчитаем точную стоимость для вашего транспорта."
        ctaText="Рассчитать стоимость"
        ctaHref="/contacts"
      />
    </>
  );
}
