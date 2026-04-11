import type { Metadata } from "next";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
  FileSearch,
  FileText,
  Send,
  Shield,
  Users,
} from "lucide-react";

import { CtaSection } from "@/components/sections/cta-section";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { GoslogForm } from "./goslog-form";

export const metadata: Metadata = {
  title:
    "Регистрация в реестре ГосЛог под ключ — Инфологистик-24",
  description:
    "Поможем зарегистрироваться в реестрах ГосЛог до дедлайна 30 апреля 2026. Штраф до 300 000 руб. за работу без регистрации. От 15 000 руб., срок 1-3 дня.",
  keywords: [
    "ГосЛог регистрация",
    "реестр экспедиторов ГосЛог",
    "реестр перевозчиков ГосЛог",
    "регистрация в ГосЛог под ключ",
    "штраф ГосЛог",
  ],
  openGraph: {
    title: "Регистрация в реестре ГосЛог под ключ — Инфологистик-24",
    description:
      "Поможем зарегистрироваться в ГосЛог до дедлайна. Штраф до 300 000 руб. за работу без регистрации.",
    type: "website",
    url: "https://inlog24.ru/goslog",
    siteName: "Инфологистик-24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Регистрация в реестре ГосЛог под ключ — Инфологистик-24",
    description:
      "Поможем зарегистрироваться в ГосЛог до дедлайна. Штраф до 300 000 руб.",
  },
  alternates: {
    canonical: "https://inlog24.ru/goslog",
  },
};

const steps = [
  {
    icon: FileSearch,
    title: "Аудит документов",
    description:
      "Проверяем пакет документов вашей компании на соответствие требовани��м реестра",
  },
  {
    icon: FileText,
    title: "Подготовка пакета",
    description:
      "Собираем и оформляем все необходимые документы для подачи заявления",
  },
  {
    icon: Send,
    title: "Подача заявления",
    description:
      "Подаём заявление на goslog.ru / Госуслугах от имени вашей компании",
  },
  {
    icon: Clock,
    title: "Сопровождение",
    description:
      "Отслеживаем статус, отвечаем на запросы регулятора, решаем вопросы",
  },
  {
    icon: FileCheck,
    title: "Получение записи",
    description:
      "Подтверждаем запись в реестре и передаём результат вам",
  },
];

const faqItems = [
  {
    question: "Что такое ГосЛог?",
    answer:
      "ГосЛог — государственная информационная система в сфере автомобильного транспорта. Включает реестры экспедиторов и перевозчиков. Регистрация в реестре обязательна для осуществления коммерческих перевозок.",
  },
  {
    question: "Кому нужна регистрация в ГосЛог?",
    answer:
      "Всем экспедиторам (с 1 марта 2026) и перевозчикам грузовым транспортом свыше 3,5 тонн (с 1 марта 2027). Дедлайн для действующих экспедиторов — 30 апреля 2026 года.",
  },
  {
    question: "Какие документы нужны дл�� регистрации?",
    answer:
      "Учредительные документы (ЕГРЮЛ/ЕГРИП), сведения о транспортных средствах, квалифицированная электронная подпись (УКЭП), договоры перевозки. Полный перечень зависит от типа реестра. Мы проверим ваш пакет и подскажем, чего не хватает.",
  },
  {
    question: "Сколько времени занимает регистрация?",
    answer:
      "В стандартном режиме — 3-5 рабочих дней с момента подачи документов. В срочном режиме — от 1 рабочего дня. Мы рекомендуем не откладывать — ближе к дедлайну очереди растут.",
  },
  {
    question: "Что будет, если не зарегистрироваться?",
    answer:
      "Штраф до 300 000 рублей за первое нарушение и до 1 000 000 рублей за повторное. Без регистрации коммерческие перевозки запрещены — вас могут остановить на контроле.",
  },
  {
    question: "Могу ли я зарегистрироваться самостоятельно?",
    answer:
      "Да, через goslog.ru или Госуслуги. Но потребуется УКЭП, правильно заполненные формы и соответствие всем требованиям. Ошибки приводят к отказу и потере времени. Мы берём всё на себя — вам не нужно разбираться в системе.",
  },
];

const trustItems = [
  { value: "8+", label: "лет на рынке" },
  { value: "3 000+", label: "клиентов" },
  { value: "98%", label: "одобрение" },
  { value: "Гарантия", label: "результата" },
];

export default function GoslogPage() {
  return (
    <>
      <ServiceJsonLd
        name="Регистрация в реестре ГосЛог"
        description="Помощь с регистрацией в реестрах ГосЛог для экспедиторов и перевозчиков. Под ключ, от 15 000 руб."
        price={15000}
        url="/goslog"
      />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Регистрация в ГосЛог", href: "/goslog" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="destructive" className="mb-6 text-sm">
            <AlertTriangle className="mr-1.5 size-3.5" />
            Дедлайн 30 апреля 2026
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Регистрация в реестре ГосЛог — под ключ
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Не опоздайте с регистрацией. Штраф до 300 000 ₽ за работу без записи
            в реестре. Мы подготовим документы и подадим заявление за вас.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#goslog-form"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Оставить заявку
            </a>
            <a
              href="#pricing"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Смотреть цены
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-2xl border-destructive/20 bg-destructive/5 shadow-sm">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertTriangle className="size-7 text-destructive" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  до 300 000 ₽
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  штраф за работу б��з регистрации в ГосЛог (первое нарушение)
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-destructive/20 bg-destructive/5 shadow-sm">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertTriangle className="size-7 text-destructive" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  до 1 000 000 ₽
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  штраф за повторное нарушение — работу без регистрации
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5 shadow-sm">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10">
                  <Users className="size-7 text-amber-600" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  60% рынка
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  не готовы к регистрации — тысячи компаний рискуют штрафами
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как мы работаем
            </h2>
            <p className="mt-4 text-muted-foreground">
              5 шагов от заявки до записи в реестре ГосЛог
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="size-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      Шаг {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
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

      {/* Pricing */}
      <section
        id="pricing"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Стоимость регистрации
            </h2>
            <p className="mt-4 text-muted-foreground">
              Фиксированная цена, ни��аких скрытых доплат
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-0 bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <Badge variant="secondary" className="mb-4">
                  Экспедиторы
                </Badge>
                <div className="text-3xl font-bold text-primary">
                  от 15 000 ₽
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  разовый платёж
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Аудит документов",
                    "Подготовка пакета",
                    "Подача заявления",
                    "Сопровождение до результата",
                    "Повторная подача при отказе",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-primary/20 bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  Перевозчики
                </Badge>
                <div className="text-3xl font-bold text-primary">
                  от 20 000 ₽
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  разовый платёж
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Всё из пакета «Экспедиторы»",
                    "Работа с расширенным пакетом документов",
                    "Помощь с УКЭП (электронной подписью)",
                    "Консультация по ТС и маршрутам",
                    "Приоритетная поддержка",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 text-center">
            <p className="text-sm text-foreground">
              <strong>Срочная регистрация</strong> (от 1 рабочего дня) — +50% к
              базовой цене.{" "}
              <span className="text-muted-foreground">
                Пакет «ГосЛог + пропуск» — скидка 15%.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.value} className="text-center">
                <span className="block font-heading text-2xl font-extrabold text-primary-foreground sm:text-3xl">
                  {item.value}
                </span>
                <span className="text-sm text-primary-foreground/70">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о ГосЛог
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-card p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-foreground">
                  {item.question}
                  <Shield className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section id="goslog-form" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <GoslogForm />
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <CtaSection
          heading="Не рискуйте штрафом 300 000 ₽"
          description="Оставьте заявку сегодня — зарегистрируем в ГосЛог до дедлайна."
          ctaText="Оставить заявку"
          ctaHref="#goslog-form"
        />
      </div>
    </>
  );
}
