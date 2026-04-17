import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Crown,
  Layers,
  PiggyBank,
  Shield,
  Sparkles,
} from "lucide-react";

import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { packages } from "@/content/packages";

import { CalculatorPicker } from "./_components/calculator-picker";
import { absoluteUrl } from "@/lib/utils/base-url";

// ISR: revalidate every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Пакеты решений для перевозчиков — Инфолог24",
  description:
    "Три пакета под размер парка: Пропуск+ для 1–4 машин от 12 500 ₽, Транзит Москва для 5–20 машин от 52 000 ₽, Флот Про для 10+ машин от 900 ₽/мес за ТС. Всё, чтобы возить грузы в Москву легально.",
  keywords: [
    "пакеты пропусков в Москву",
    "пакеты услуг для перевозчиков",
    "пропуск плюс",
    "Транзит Москва",
    "Флот Про",
    "тарифы пропусков",
  ],
  openGraph: {
    title: "Пакеты решений для перевозчиков — Инфолог24",
    description:
      "Три пакета под размер парка: от частника до корпоративного клиента. Пропуск, РНИС, ЭТрН, ГосЛог, Антиштраф и юрист — в одной подписке.",
    type: "website",
    url: absoluteUrl("/resheniya"),
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: absoluteUrl("/resheniya"),
  },
};

const iconMap: Record<string, typeof Sparkles> = {
  Sparkles,
  Crown,
  Building2,
};

const hubFaq = [
  {
    question: "Чем пакет лучше, чем покупка услуг по отдельности?",
    answer:
      "Пакет включает сразу несколько продуктов — пропуск, РНИС, ЭТрН, мониторинг штрафов, ИнфоПилот — со скидкой 15–22% по сравнению с отдельной покупкой. Плюс единый договор, один менеджер и сквозной учёт в личном кабинете.",
  },
  {
    question: "Можно ли поменять пакет после подключения?",
    answer:
      "Да, вы можете перейти с «Пропуск+» на «Транзит Москва» в любой момент — доплачиваете только разницу. Переход на «Флот Про» оформляется индивидуальным договором с выделенным аккаунт-менеджером.",
  },
  {
    question: "Как быстро подключается пакет?",
    answer:
      "Базовое подключение — 1 рабочий день после получения документов. Оформление пропуска — от 1 до 3 рабочих дней в зависимости от зоны. Подключение РНИС, ЭТрН, ГосЛог — в составе пакета, без переплат.",
  },
  {
    question: "Что делать, если у меня нестандартный случай?",
    answer:
      "Позвоните или оставьте заявку — мы проработаем индивидуальное решение. Для парков от 10 ТС с API-интеграцией есть пакет «Флот Про» с индивидуальным прайсом.",
  },
  {
    question: "Какой пакет рекомендуете для начинающего перевозчика?",
    answer:
      "Если у вас 1–4 машины и вы только начинаете работать в Москве — берите «Пропуск+». В нём всё базовое, что нужно для легальной работы: пропуск, РНИС, ЭТрН, мониторинг штрафов и доступ к ИнфоПилоту на трассе.",
  },
];

export default function ResheniyaHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Решения", href: "/resheniya" },
        ]}
      />
      <FaqJsonLd items={hubFaq} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Layers className="mr-1.5 size-3.5" />
            Пакетные решения
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Три пакета — под размер вашего парка
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Всё, что нужно, чтобы возить грузы в Москву легально: пропуск, РНИС,
            ЭТрН, мониторинг штрафов, ГосЛог и ИнфоПилот — в одной подписке. Под
            частника, среднюю ТК и корпоративный парк.
          </p>
        </div>
      </section>

      {/* Packages grid */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {packages.map((pkg) => {
              const Icon = iconMap[pkg.iconName] ?? Sparkles;
              return (
                <Card
                  key={pkg.id}
                  className={
                    pkg.highlighted
                      ? "relative rounded-3xl border-2 border-accent bg-card shadow-lg"
                      : "rounded-3xl border-0 bg-card shadow-sm"
                  }
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground">
                        Рекомендуем
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="size-7 text-primary" />
                    </div>
                    <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
                      {pkg.name}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {pkg.tagline}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pkg.targetAudience}
                    </p>

                    <div className="mt-5 rounded-2xl bg-primary/5 p-4">
                      <div className="text-2xl font-bold text-primary">
                        {pkg.priceFrom}
                      </div>
                      {pkg.savingsLabel && (
                        <p className="mt-1 text-xs font-semibold text-accent">
                          {pkg.savingsLabel}
                        </p>
                      )}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {pkg.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{feature.replace(/^✓\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={pkg.ctaHref}
                      className={
                        pkg.highlighted
                          ? "mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                          : "mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-background text-base font-semibold text-foreground transition-colors hover:bg-muted"
                      }
                    >
                      Подробнее
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <CalculatorPicker />
        </div>
      </section>

      {/* Why packages */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Почему пакет выгоднее, чем по отдельности
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Платить за каждый сервис отдельно — дорого и неудобно. Мы собрали
              всё, что нужно перевозчику, в один продукт.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-2xl border-0 bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <PiggyBank className="size-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Дешевле на 15–22%
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Пакетная цена за пропуск, РНИС, ЭТрН и мониторинг ниже суммы
                  каждого сервиса по отдельности. Экономия — до 10 000 ₽ в год
                  на одну машину.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="size-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Один договор — одна ответственность
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Не нужно подписывать 5 договоров с 5 подрядчиками. Один
                  договор с нами закрывает всю регуляторику — от пропуска до
                  ЭТрН.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Layers className="size-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Всё в одном ЛК
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Пропуска, штрафы, статус РНИС, уведомления о дедлайнах и
                  история вызовов ИнфоПилота — в одном личном кабинете, без
                  переключения между сайтами.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о пакетах
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {hubFaq.map((item) => (
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

      {/* Final CTA */}
      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Не знаете, какой пакет выбрать?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — менеджер изучит ваш парк и предложит оптимальное
            решение. Бесплатная консультация, расчёт за 2 минуты.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Получить консультацию
            </Link>
            <Link
              href="/infopilot"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Узнать про ИнфоПилота
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
