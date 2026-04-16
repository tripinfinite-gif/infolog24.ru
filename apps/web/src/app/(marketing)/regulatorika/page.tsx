import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CalendarClock,
  FileCheck,
  Gavel,
  Radar,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { regulatoryTimeline } from "@/content/regulatory-timeline";

// ISR: revalidate every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Регуляторика грузоперевозчика — ГосЛог, ЭТрН, РНИС, Антиштраф | Инфолог24",
  description:
    "Сроки, которые могут остановить бизнес: ГосЛог 30 апреля 2026, ЭТрН 1 сентября 2026, перевозчики 1 марта 2027. Обзор всей регуляторики, календарь дедлайнов и 6 продуктов под ключ.",
  keywords: [
    "регуляторика перевозчика",
    "ГосЛог ЭТрН РНИС",
    "антиштраф мониторинг",
    "дедлайны перевозчика 2026",
    "календарь регуляторики",
  ],
  openGraph: {
    title: "Регуляторика грузоперевозчика 2026–2028",
    description:
      "ГосЛог, ЭТрН, РНИС, Антиштраф, юрист и календарь дедлайнов — всё, что нужно перевозчику для соответствия закону.",
    type: "website",
    url: "https://inlog24.ru/regulatorika",
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: "https://inlog24.ru/regulatorika",
  },
};

const regulatoryProducts = [
  {
    icon: FileCheck,
    title: "ГосЛог",
    description:
      "Регистрация в реестре экспедиторов и перевозчиков. Обязательно с 30 апреля 2026 (экспедиторы) и 1 марта 2027 (перевозчики).",
    href: "/goslog",
    badge: "Дедлайн близко",
  },
  {
    icon: FileCheck,
    title: "ЭТрН",
    description:
      "Перевод на электронную транспортную накладную: УКЭП, подключение ЭДО, обучение водителя и диспетчера.",
    href: "/etrn",
    badge: null,
  },
  {
    icon: Radar,
    title: "РНИС",
    description:
      "Региональная навигационная информационная система. Обязательно для перевозок по регионам.",
    href: "/regulatorika/rnis",
    badge: null,
  },
  {
    icon: ShieldCheck,
    title: "Антиштраф",
    description:
      "Мониторинг всех пропусков парка с алертами до аннуляции. Не пропустите ни одного риска.",
    href: "/regulatorika/antishraf",
    badge: null,
  },
  {
    icon: Gavel,
    title: "Юрист-перевозчик",
    description:
      "Подписочная юридическая поддержка: консультации, обжалование, договоры, представительство.",
    href: "/regulatorika/yurist",
    badge: null,
  },
  {
    icon: CalendarClock,
    title: "Календарь дедлайнов",
    description:
      "Полный таймлайн регуляторных событий 2026–2028 с напоминаниями по email и Telegram.",
    href: "/regulatorika/kalendar",
    badge: null,
  },
];

const hubFaq = [
  {
    question: "Что такое ГосЛог и кому он нужен?",
    answer:
      "ГосЛог — государственная информационная система в сфере автомобильного транспорта. В неё должны быть внесены все экспедиторы (дедлайн 30 апреля 2026) и все перевозчики грузов (дедлайн 1 марта 2027). Без записи в реестре коммерческие перевозки запрещены, штраф до 1 млн ₽.",
  },
  {
    question: "Чем ЭТрН отличается от обычной ТрН?",
    answer:
      "Электронная транспортная накладная (ЭТрН) — цифровой аналог бумажной транспортной накладной. Оформляется через операторов ЭДО, подписывается УКЭП сторон. С 1 сентября 2026 без ЭДО возить нельзя — бумажная ТрН будет недействительна для коммерческих перевозок.",
  },
  {
    question: "Кому обязателен РНИС?",
    answer:
      "Региональная навигационная информационная система обязательна для перевозчиков, работающих по региональным маршрутам (в том числе транзит через регионы). Каждое ТС должно быть оснащено трекером, данные передаются в РНИС автоматически. Без подключения — штрафы и запрет на пропуска.",
  },
  {
    question: "Что делает Антиштраф?",
    answer:
      "Антиштраф — наш сервис мониторинга, который отслеживает статус всех пропусков парка и предупреждает об ожидаемой аннуляции до того, как она произошла. Отслеживает нарушения РНИС, изменения в реестре ТС, истечение карт — и присылает алерт в Telegram.",
  },
  {
    question: "Как подписаться на обновления дедлайнов?",
    answer:
      "На странице «Календарь дедлайнов» можно оформить подписку по email и Telegram — мы будем присылать напоминания за 60, 30 и 7 дней до каждого важного события. Бесплатно для всех посетителей сайта.",
  },
];

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  urgent: {
    label: "Срочно",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  upcoming: {
    label: "Предстоит",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  active: {
    label: "Действует",
    className: "bg-primary/10 text-primary border-primary/30",
  },
};

export default function RegulatorikaHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Регуляторика", href: "/regulatorika" },
        ]}
      />
      <FaqJsonLd items={hubFaq} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="destructive" className="mb-6">
            <AlertTriangle className="mr-1.5 size-3.5" />
            Сроки, которые могут остановить бизнес
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Регуляторика грузоперевозчика 2026–2028
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            ГосЛог, ЭТрН, РНИС и ужесточение экокласса — за ближайшие 2 года
            перевозчиков ждёт больше регуляторных изменений, чем за
            предыдущие 10. Мы закрываем каждое из них под ключ.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Таймлайн дедлайнов
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              4 ключевых события ближайших 2 лет, к которым нужно готовиться
              заранее
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {regulatoryTimeline.map((milestone) => {
              const status = statusConfig[milestone.status];
              return (
                <Card
                  key={milestone.id}
                  className="rounded-2xl border-0 bg-card shadow-sm"
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge
                          variant="outline"
                          className={status.className}
                        >
                          {status.label}
                        </Badge>
                        <p className="mt-3 text-sm font-semibold text-muted-foreground">
                          {milestone.displayDate}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-foreground">
                          {milestone.name}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">
                          Кого касается:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {milestone.who}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          Штраф:{" "}
                        </span>
                        <span className="text-destructive">
                          {milestone.penalty}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={milestone.ctaHref}
                      className="mt-5 inline-flex items-center text-sm font-semibold text-primary hover:underline"
                    >
                      {milestone.ctaLabel}
                      <ArrowRight className="ml-1 size-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              6 продуктов регуляторики
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Каждый продукт закрывает одно регуляторное требование. Все
              продукты входят в пакеты решений.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regulatoryProducts.map((product) => (
              <Link
                key={product.title}
                href={product.href}
                className="group block"
              >
                <Card className="h-full rounded-2xl border-0 bg-card shadow-sm transition-shadow group-hover:shadow-md">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                        <product.icon className="size-6 text-primary" />
                      </div>
                      {product.badge && (
                        <Badge variant="destructive" className="text-xs">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                      Подробнее
                      <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о регуляторике
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
          <BellRing className="mx-auto size-10 text-primary-foreground" />
          <h2 className="mt-4 font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Получить персональный чек-лист регуляторики
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — наш менеджер подготовит персональный чек-лист
            регуляторных требований под ваш парк, с датами и штрафами. Бесплатно.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Получить чек-лист
            </Link>
            <Link
              href="/regulatorika/kalendar"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <Scale className="mr-2 size-4" />
              Открыть календарь
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
