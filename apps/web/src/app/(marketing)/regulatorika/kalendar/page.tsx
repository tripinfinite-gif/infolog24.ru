import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getDaysUntil,
  regulatoryTimeline,
} from "@/content/regulatory-timeline";

import { SubscribeForm } from "./_components/subscribe-form";
import { absoluteUrl } from "@/lib/utils/base-url";

export const metadata: Metadata = {
  title:
    "Календарь регуляторных дедлайнов 2026–2028 для перевозчиков | Инфолог24",
  description:
    "Все дедлайны грузоперевозчика в одном календаре: ГосЛог, ЭТрН, РНИС, экокласс. Что касается, какой штраф, как подготовиться. Подписка на напоминания — бесплатно.",
  keywords: [
    "календарь дедлайнов перевозчика",
    "регуляторный календарь 2026",
    "ГосЛог даты",
    "ЭТрН сроки",
    "дедлайны грузоперевозчика",
  ],
  openGraph: {
    title: "Календарь регуляторных дедлайнов 2026–2028",
    description:
      "ГосЛог, ЭТрН, РНИС и экокласс — все важные даты в одном календаре.",
    type: "website",
    url: absoluteUrl("/regulatorika/kalendar"),
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: absoluteUrl("/regulatorika/kalendar"),
  },
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  urgent: {
    label: "Срочно — дедлайн близко",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  upcoming: {
    label: "Предстоит — есть время подготовиться",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  active: {
    label: "Уже действует",
    className: "bg-primary/10 text-primary border-primary/30",
  },
};

const faq = [
  {
    question: "Зачем нужен отдельный календарь регуляторных дедлайнов?",
    answer:
      "За 2026–2028 годы перевозчиков ждёт больше регуляторных изменений, чем за предыдущие 10 лет: ГосЛог, ЭТрН, ужесточение РНИС, новые требования к экоклассу. Пропустить хоть один дедлайн — штраф до 1 млн ₽ или остановка работы. Календарь помогает планировать подготовку заранее.",
  },
  {
    question: "Как работает подписка на напоминания?",
    answer:
      "Вы указываете email и телефон — мы присылаем уведомления за 60, 30 и 7 дней до каждого важного события. Бесплатно, без спама, можно отписаться в любой момент. Уведомления уходят только по реально важным датам — около 4–6 раз в год.",
  },
  {
    question: "Что делать прямо сейчас, если до дедлайна 2 недели?",
    answer:
      "Оставьте заявку — наш менеджер проведёт срочный аудит и запустит процедуру по ускоренному тарифу. Для ГосЛог мы умеем регистрировать за 1 рабочий день, для ЭТрН — за 3 рабочих дня с УКЭП.",
  },
];

export default function KalendarPage() {
  return (
    <>
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Регуляторика", href: "/regulatorika" },
          { name: "Календарь дедлайнов", href: "/regulatorika/kalendar" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <CalendarClock className="mr-1.5 size-3.5" />
            Бесплатный сервис
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Календарь регуляторных дедлайнов 2026–2028
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Все важные даты грузоперевозчика в одном месте. Что касается
            вашего бизнеса, какой штраф, как подготовиться заранее — с
            напоминаниями в email и Telegram.
          </p>
        </div>
      </section>

      {/* Detailed timeline */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Ключевые даты 2026–2028
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              4 вехи, которые нужно знать каждому перевозчику и экспедитору
            </p>
          </div>
          <div className="mt-12 space-y-6">
            {regulatoryTimeline.map((milestone, index) => {
              const status = statusConfig[milestone.status];
              const daysLeft = getDaysUntil(milestone.date);
              return (
                <Card
                  key={milestone.id}
                  className="rounded-2xl border-0 bg-card shadow-sm"
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
                      <div className="flex flex-col items-start gap-2 md:items-center md:border-r md:border-border md:pr-6">
                        <span className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {milestone.displayDate}
                        </span>
                        {daysLeft > 0 && (
                          <span className="text-xs font-medium text-accent">
                            осталось {daysLeft} дн.
                          </span>
                        )}
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={status.className}
                        >
                          {status.label}
                        </Badge>
                        <h3 className="mt-3 text-xl font-bold text-foreground">
                          {milestone.name}
                        </h3>
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
                              Штраф / последствия:{" "}
                            </span>
                            <span className="text-destructive">
                              {milestone.penalty}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">
                              Что мы делаем:{" "}
                            </span>
                            <span className="text-muted-foreground">
                              Готовим пакет документов, подаём заявление от
                              вашего имени, сопровождаем до результата. Срок
                              — от 1 до 5 рабочих дней.
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscribe form */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <SubscribeForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о календаре
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
      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Подготовиться ко всем дедлайнам сразу
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Возьмите пакет «Транзит Москва» — в нём уже закрыты все
            регуляторные требования 2026–2027 годов. Один договор вместо
            пяти.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/resheniya/tranzit-moskva"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Открыть «Транзит Москва»
            </Link>
            <Link
              href="/regulatorika"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Все продукты регуляторики
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
