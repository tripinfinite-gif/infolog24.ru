import type { Metadata } from "next";
import Link from "next/link";
import {
  BellRing,
  CheckCircle2,
  Radar,
  ShieldCheck,
} from "lucide-react";

import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

export const metadata: Metadata = {
  title: "Антиштраф — мониторинг пропусков парка | Инфолог24",
  description:
    "Сервис «Антиштраф»: мониторинг всех пропусков парка с алертами до аннуляции. Отслеживает нарушения РНИС, просрочки карт, изменения реестра ТС. Уведомления в Telegram и email. От 800 ₽/мес за ТС.",
  keywords: [
    "антиштраф",
    "мониторинг пропусков",
    "алерт аннуляция пропуска",
    "защита от штрафов перевозчика",
    "контроль парка грузовиков",
  ],
  openGraph: {
    title: "Антиштраф — мониторинг парка от Инфолог24",
    description:
      "Алерты о риске аннуляции пропуска и нарушениях РНИС — до того, как штрафы начнут сыпаться.",
    type: "website",
    url: absoluteUrl("/regulatorika/antishraf"),
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: absoluteUrl("/regulatorika/antishraf"),
  },
};

const whatTracks = [
  {
    title: "Просрочка диагностических карт",
    description:
      "Напомнит за 30 дней до истечения ДК и сразу предложит забронировать слот в ближайшем ПТО.",
  },
  {
    title: "Нарушения РНИС",
    description:
      "Разрыв связи, выход трекера из строя, отсутствие передачи данных более 4 часов — всё алертится в Telegram.",
  },
  {
    title: "Изменения статуса пропуска",
    description:
      "Малейшие изменения в реестре пропусков Мосавтотранса — от «в процессе проверки» до «действует» — видны в ЛК.",
  },
  {
    title: "Ожидание аннуляции",
    description:
      "ИИ анализирует паттерны (превышение скорости по РНИС, выход за зону) и предупреждает о риске аннуляции ДО того, как она случилась.",
  },
  {
    title: "Просрочка страховок",
    description:
      "ОСАГО, КАСКО, ОСГОП — за 30 и 7 дней напоминает о продлении и показывает свежий расчёт от партнёров.",
  },
  {
    title: "Штрафы парка",
    description:
      "Автоматически подтягивает все новые штрафы ТС с Госуслуг и МАДИ. Передаёт юристу для оценки шансов на обжалование.",
  },
];

const faq = [
  {
    question: "Что такое Антиштраф и как он работает?",
    answer:
      "Это сервис автоматического мониторинга регуляторных рисков вашего парка. Антиштраф ежедневно (а для РНИС и статусов пропусков — каждый час) проверяет состояние каждого ТС по открытым и закрытым базам данных и шлёт алерт, если что-то не в порядке.",
  },
  {
    question: "Чем алерт отличается от обычного уведомления?",
    answer:
      "Алерт — это структурированное сообщение с конкретной проблемой, её причиной и готовым действием: «у ТС X1234RT разрыв связи с РНИС уже 3 часа, рекомендуем проверить антенну». Вы получаете не «что-то не так», а «сделай Y, чтобы избежать Z».",
  },
  {
    question: "Как Антиштраф предсказывает аннуляцию пропуска?",
    answer:
      "ИИ анализирует паттерны предыдущих аннуляций: какие нарушения РНИС, какие выходы за зону, какие превышения скорости приводили к аннуляции в прошлом. Если текущее поведение ТС похоже на рискованное — приходит предупреждение «вероятность аннуляции в ближайшие 48 часов».",
  },
  {
    question: "Сколько стоит сервис?",
    answer:
      "800 ₽/мес за одно ТС при подключении 1–4 машин, 650 ₽/мес за ТС при подключении 5–19 машин, 500 ₽/мес за ТС при парке от 20 машин. В пакете «Транзит Москва» и «Флот Про» Антиштраф уже включён без доплат.",
  },
  {
    question: "Можно ли получать алерты в вашем корпоративном Telegram?",
    answer:
      "Да, алерты можно направлять в приватный Telegram-канал или группу вашей компании — с ограничением доступа по ролям (диспетчер получает всё, финансы только просрочки, директор — критические инциденты).",
  },
];

export default function AntishrafPage() {
  return (
    <>
      <ServiceJsonLd
        name="Антиштраф — мониторинг парка"
        description="Сервис мониторинга пропусков, РНИС, штрафов и страховок с алертами в Telegram. От 800 ₽/мес за ТС."
        price={800}
        priceUnit="₽/мес за ТС"
        url="/regulatorika/antishraf"
      />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Регуляторика", href: "/regulatorika" },
          { name: "Антиштраф", href: "/regulatorika/antishraf" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <ShieldCheck className="mr-1.5 size-3.5" />
            Превентивный мониторинг
          </Badge>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <BellRing className="size-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Антиштраф
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Мониторинг всех пропусков парка с алертами до аннуляции.
            Отслеживаем нарушения РНИС, просрочки карт, изменения в реестре ТС
            — и шлём уведомления в Telegram, пока ситуация не превратилась в
            штраф.
          </p>
          <div className="mt-8 inline-flex flex-col items-center rounded-2xl bg-primary/5 px-8 py-5">
            <span className="text-3xl font-bold text-primary">
              от 800 ₽/мес
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              за ТС, скидки от 5 и 20 машин
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#zayavka"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Подключить Антиштраф
            </Link>
            <Link
              href="/resheniya/tranzit-moskva"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              В составе «Транзит Москва»
            </Link>
          </div>
        </div>
      </section>

      {/* What tracks */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Что отслеживает Антиштраф
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              6 видов регуляторных рисков — автоматически, 24/7
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whatTracks.map((item) => (
              <Card
                key={item.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <Radar className="size-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
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

      {/* Notifications */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как приходят уведомления
            </h2>
          </div>
          <ul className="mt-10 space-y-4">
            {[
              "Telegram-бот с алертами — подключается за 30 секунд, можно направлять в группу",
              "Email-уведомления о критических инцидентах (аннуляция, штрафы выше 50 000 ₽)",
              "Пуш-уведомления в корпоративном ЛК Инфолог24",
              "Ежедневный дайджест для диспетчера: всё новое за сутки в одном письме",
              "API-вебхуки для интеграции с вашей системой (для «Флот Про»)",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-card p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-base text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы об Антиштрафе
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

      {/* CTA */}
      <section
        id="zayavka"
        className="px-4 pb-20 pt-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Подключить Антиштраф
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — настроим мониторинг вашего парка за 1 рабочий
            день. Первые 14 дней — бесплатно для оценки эффективности.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Подключить бесплатный тест
            </Link>
            <Link
              href="/regulatorika/yurist"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Юрист-перевозчик
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
