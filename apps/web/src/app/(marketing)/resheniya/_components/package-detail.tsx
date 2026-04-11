import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface PackageStep {
  title: string;
  description: string;
}

export interface PackageFaqItem {
  question: string;
  answer: string;
}

export interface PackageDetailProps {
  packageName: string;
  tagline: string;
  priceLabel: string;
  priceNote?: string;
  targetAudience: string;
  heroBadge?: string;
  heroHighlighted?: boolean;
  heroIcon: LucideIcon;
  features: string[];
  forWhom: { title: string; description: string }[];
  steps: PackageStep[];
  comparison: {
    item: string;
    separately: string;
    inPackage: string;
  }[];
  faq: PackageFaqItem[];
  nextPackage?: {
    href: string;
    label: string;
    description: string;
  };
}

export function PackageDetail({
  packageName,
  tagline,
  priceLabel,
  priceNote,
  targetAudience,
  heroBadge,
  heroHighlighted,
  heroIcon: HeroIcon,
  features,
  forWhom,
  steps,
  comparison,
  faq,
  nextPackage,
}: PackageDetailProps) {
  return (
    <>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {heroBadge && (
            <Badge
              className={
                heroHighlighted
                  ? "mb-6 bg-accent text-accent-foreground"
                  : "mb-6"
              }
              variant={heroHighlighted ? "default" : "secondary"}
            >
              {heroBadge}
            </Badge>
          )}
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <HeroIcon className="size-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {packageName}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {tagline}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{targetAudience}</p>

          <div className="mt-8 inline-flex flex-col items-center rounded-2xl bg-primary/5 px-8 py-5">
            <span className="text-3xl font-bold text-primary sm:text-4xl">
              {priceLabel}
            </span>
            {priceNote && (
              <span className="mt-1 text-sm text-muted-foreground">
                {priceNote}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#zayavka"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Оформить
            </Link>
            <Link
              href="/resheniya"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Калькулятор подбора
            </Link>
          </div>
        </div>
      </section>

      {/* Features / What's inside */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Что входит в пакет
            </h2>
            <p className="mt-4 text-muted-foreground">
              Всё, что нужно для легальной работы в московском транспортном узле
            </p>
          </div>

          <Card className="mt-10 rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* For whom */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Для кого пакет
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {forWhom.map((item) => (
              <Card
                key={item.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Сравнение: в пакете vs по отдельности
            </h2>
            <p className="mt-4 text-muted-foreground">
              Пакет дешевле, чем если покупать каждый сервис отдельно
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl bg-card shadow-sm">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-border bg-muted/40 p-4 text-sm font-semibold text-foreground sm:p-6">
              <div>Что получаете</div>
              <div className="text-right">Отдельно</div>
              <div className="text-right">В пакете</div>
            </div>
            {comparison.map((row) => (
              <div
                key={row.item}
                className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-border p-4 text-sm last:border-0 sm:p-6"
              >
                <div className="text-foreground">{row.item}</div>
                <div className="text-right text-muted-foreground line-through">
                  {row.separately}
                </div>
                <div className="text-right font-semibold text-primary">
                  {row.inPackage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как оформить
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о пакете
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-card p-5 shadow-sm"
              >
                <summary className="cursor-pointer text-base font-semibold text-foreground">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Next package */}
      {nextPackage && (
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Link
              href={nextPackage.href}
              className="block rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Следующий шаг
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {nextPackage.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {nextPackage.description}
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-primary" />
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section
        id="zayavka"
        className="px-4 pb-20 pt-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Оформить пакет «{packageName}»
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — менеджер свяжется в течение 15 минут, рассчитает
            точную стоимость и поможет с документами.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Оставить заявку
            </Link>
            <Link
              href="/resheniya"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Сравнить с другими пакетами
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
