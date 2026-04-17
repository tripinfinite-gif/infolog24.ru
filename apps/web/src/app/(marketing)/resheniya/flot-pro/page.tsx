import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CheckCircle2, Cable, Clock, Users } from "lucide-react";

import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { packages } from "@/content/packages";
import { absoluteUrl } from "@/lib/utils/base-url";

export const metadata: Metadata = {
  title: "Флот Про — корпоративный пакет от 900 ₽/мес за ТС | Инфолог24",
  description:
    "«Флот Про» — корпоративная платформа для парков от 10 машин: API-интеграция с TMS/ERP, SLA 4 часа, выделенный аккаунт-менеджер 24/7, корпоративный ЛК с дашбордом парка. Индивидуальный прайс от 900 ₽/мес за ТС.",
  keywords: [
    "Флот Про",
    "корпоративный пакет пропусков",
    "API пропуска в Москву",
    "пропуска для парка 10+ машин",
    "SLA 4 часа пропуск",
  ],
  openGraph: {
    title: "Флот Про — корпоративный пакет | Инфолог24",
    description:
      "API, SLA 4 часа, выделенный аккаунт-менеджер 24/7 и корпоративный ЛК для парка от 10 машин.",
    type: "website",
    url: absoluteUrl("/resheniya/flot-pro"),
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: absoluteUrl("/resheniya/flot-pro"),
  },
};

const flotPro = packages.find((p) => p.id === "flot-pro")!;

const faq = [
  {
    question: "Что такое API-интеграция с TMS/ERP?",
    answer:
      "Мы предоставляем REST API для подачи заявок на пропуска, получения статусов, выгрузки штрафов и синхронизации парка. API можно подключить к 1С, вашей TMS или собственной ERP — документация и тестовый стенд предоставляются.",
  },
  {
    question: "Как работает SLA 4 часа?",
    answer:
      "Любая заявка, поступившая в рабочее время, обрабатывается в течение 4 часов: проверка, запуск оформления или ответ менеджера. В нерабочее время — реакция в первый рабочий час следующего дня. Нарушение SLA — компенсация по договору.",
  },
  {
    question: "Доступен ли выделенный аккаунт-менеджер 24/7?",
    answer:
      "Да, «Флот Про» включает поддержку 24/7 для критических инцидентов: проблема с ЭТрН при загрузке, аннуляция пропуска на трассе, срочная консультация юриста. Обычные задачи — в рабочие часы менеджера.",
  },
  {
    question: "Можно ли подключить всех юристов пакета?",
    answer:
      "Да, «Флот Про» включает полный тариф «Юрист-перевозчик» с расширенным пакетом: неограниченные консультации, обжалование штрафов парка, проверка договоров, представительство в судах первой инстанции.",
  },
  {
    question: "Как формируется индивидуальный прайс?",
    answer:
      "Базовая ставка — 900 ₽/мес за ТС при парке от 10 машин. Финальная цена зависит от размера парка, зон пропусков, объёма API-запросов и перечня дополнительных сервисов. Минимальный контракт — 12 месяцев.",
  },
];

const corporateFeatures = [
  {
    icon: Cable,
    title: "API-интеграция",
    description:
      "REST API для подачи пропусков, получения статусов и выгрузки отчётности. Интеграция с 1С, TMS, ERP.",
  },
  {
    icon: Clock,
    title: "SLA 4 часа",
    description:
      "Гарантия реакции на заявку в рабочие часы. При нарушении SLA — компенсация по договору.",
  },
  {
    icon: Users,
    title: "Аккаунт-менеджер 24/7",
    description:
      "Выделенный специалист для критических инцидентов: проблема с ЭТрН, аннуляция пропуска, срочный юрист.",
  },
  {
    icon: Building2,
    title: "Корпоративный ЛК",
    description:
      "Дашборд парка, ролевая модель, пакетная подача заявок (10 пропусков за раз), выгрузка отчётов.",
  },
];

const cases = [
  {
    title: "Сеть строймагазинов в Московской области",
    fleet: "45 ТС",
    result:
      "Полная миграция на ЭТрН за 3 недели, API-интеграция с 1С:УТ для автоматической подачи пропусков. Экономия ~800 тыс. ₽/год на штрафах.",
  },
  {
    title: "Производственная компания пищевой индустрии",
    fleet: "120 ТС",
    result:
      "Годовой контракт «Флот Про», аккаунт-менеджер 24/7, юрист в штате. Сократили время простоя из-за регуляторики с 40 до 4 часов в месяц.",
  },
];

export default function FlotProPage() {
  return (
    <>
      <ServiceJsonLd
        name="Пакет «Флот Про»"
        description="Корпоративная платформа для парков от 10 машин: API, SLA 4 часа, аккаунт-менеджер 24/7, корпоративный ЛК. От 900 ₽/мес за ТС."
        price={900}
        priceUnit="₽/мес за ТС"
        url="/resheniya/flot-pro"
      />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Решения", href: "/resheniya" },
          { name: "Флот Про", href: "/resheniya/flot-pro" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            Корпоративный продукт
          </Badge>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Building2 className="size-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Флот Про
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Корпоративная платформа для парков от 10 машин. API, SLA 4 часа,
            выделенный аккаунт-менеджер 24/7, юрист в штате и корпоративный ЛК
            с дашбордом парка.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {flotPro.targetAudience}
          </p>

          <div className="mt-8 inline-flex flex-col items-center rounded-2xl bg-primary/5 px-8 py-5">
            <span className="text-3xl font-bold text-primary sm:text-4xl">
              индивидуально
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              от 900 ₽/мес за ТС при парке от 10 машин
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#zayavka"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Запросить КП
            </Link>
            <Link
              href="/resheniya"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Сравнить с другими пакетами
            </Link>
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Что входит в «Флот Про»
            </h2>
            <p className="mt-4 text-muted-foreground">
              Всё из пакета «Транзит Москва» + корпоративные опции
            </p>
          </div>
          <Card className="mt-10 rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <ul className="space-y-4">
                {flotPro.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground">
                      {feature.replace(/^✓\s*/, "")}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Corporate features grid */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Чем отличается от «Транзит Москва»
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Корпоративные опции для парков, где регуляторика должна работать
              как часть IT-инфраструктуры
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {corporateFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Кейсы «Флот Про»
            </h2>
            <p className="mt-4 text-muted-foreground">
              Что мы уже сделали для корпоративных клиентов
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {cases.map((item) => (
              <Card
                key={item.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <Badge variant="secondary">{item.fleet}</Badge>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.result}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о «Флот Про»
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

      {/* Final CTA */}
      <section
        id="zayavka"
        className="px-4 pb-20 pt-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Запросить коммерческое предложение
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Расскажите о парке — пришлём КП с индивидуальным прайсом, SLA и
            вариантами API-интеграции в течение рабочего дня.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Запросить КП
            </Link>
            <Link
              href="/resheniya/tranzit-moskva"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Посмотреть «Транзит Москва»
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
