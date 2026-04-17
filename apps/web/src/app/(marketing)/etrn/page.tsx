import type { Metadata } from "next";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  FileKey,
  Headphones,
  MonitorSmartphone,
  Network,
  Plug,
  Settings,
  Shield,
} from "lucide-react";

import { CtaSection } from "@/components/sections/cta-section";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EtrnForm } from "./etrn-form";
import { absoluteUrl } from "@/lib/utils/base-url";

// ISR: revalidate every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Переход на электронные накладные (ЭТрН) под ключ — Инфолог24",
  description:
    "Поможем перейти на электронные транспортные накладные до 1 сентября 2026. УКЭП, подключение к ЭДО, обучение. От 25 000 руб. Поддержка 3 месяца.",
  keywords: [
    "ЭТрН переход",
    "электронная транспортная накладная",
    "подключение ЭДО перевозчик",
    "УКЭП для перевозчика",
    "ЭТрН обязательна 2026",
  ],
  openGraph: {
    title:
      "Переход на электронные накладные (ЭТрН) под ключ — Инфолог24",
    description:
      "Поможем перейти на ЭТрН до дедлайна. УКЭП, подключение к ЭДО, обучение персонала.",
    type: "website",
    url: absoluteUrl("/etrn"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Переход на ЭТрН под ключ — Инфолог24",
    description:
      "Поможем перейти на ЭТрН до дедлайна. УКЭП, ЭДО, обучение.",
  },
  alternates: {
    canonical: absoluteUrl("/etrn"),
  },
};

const steps = [
  {
    icon: MonitorSmartphone,
    title: "Консультация",
    description:
      "Определяем ваши потребности, выбираем оператора ЭДО (Контур, Астрал или СБИС)",
    time: "30 мин",
  },
  {
    icon: FileKey,
    title: "Выпуск УКЭП",
    description:
      "Помогаем получить квалифицированную электронную подпись для руководителя",
    time: "1-3 дня",
  },
  {
    icon: Plug,
    title: "Подключение к ЭДО",
    description:
      "Заключаем соглашение с оператором электронного документооборота",
    time: "1-2 дня",
  },
  {
    icon: Settings,
    title: "Настройка",
    description:
      "Настраиваем личный кабинет оператора, создаём шаблоны накладных",
    time: "1 день",
  },
  {
    icon: BookOpen,
    title: "Обучение",
    description:
      "Обучаем сотрудников формировать и отправлять электронные накладные",
    time: "1-2 часа",
  },
  {
    icon: Headphones,
    title: "Поддержка 3 месяца",
    description:
      "Сопровождаем после подключения: отвечаем на вопросы, помогаем с документами",
    time: "Ongoing",
  },
];

const packages = [
  {
    name: "Только УКЭП",
    price: "от 5 000 ₽",
    features: [
      "Выпуск квалифицированной электронной подписи",
      "Консультация по использованию",
    ],
    recommended: false,
  },
  {
    name: "Полное подключение",
    price: "от 25 000 ₽",
    features: [
      "УКЭП для руководителя",
      "Подключение к оператору ЭДО",
      "Настройка личного кабинета",
      "Шаблоны ЭТрН",
      "Обучение сотрудников",
      "Поддержка 3 месяца",
    ],
    recommended: true,
  },
];

const faqItems = [
  {
    question: "Что такое ЭТрН?",
    answer:
      "ЭТрН — электронная транспортная накладная. Это цифровой аналог бумажной транспортной накладной (ТТН), который подписывается квалифицированной электронной подписью и передаётся через оператора ЭДО.",
  },
  {
    question: "Когда ЭТрН станет обязательной?",
    answer:
      "С 1 сентября 2026 года использование электронных транспортных накладных станет обязательным для всех участников грузоперевозок. Рекомендуем подключиться заранее — ближе к дедлайну очереди на подключение растут.",
  },
  {
    question: "Что такое УКЭП и зачем она нужна?",
    answer:
      "УКЭП — усиленная квалифицированная электронная подпись. Она нужна для подписания электронных накладных с юридической силой. Без УКЭП использовать ЭТрН невозможно.",
  },
  {
    question: "Какую связь ЭТрН имеет с пропусками?",
    answer:
      "Наличие оформленной ЭТрН освобождает от необходимости предоставлять бумажный договор перевозки при оформлении пропуска. Это упрощает процесс и ускоряет получение пропуска.",
  },
  {
    question: "Сколько времени занимает полное подключение?",
    answer:
      "От 3 до 7 рабочих дней в стандартном режиме. Основное время уходит на выпуск УКЭП (1-3 дня) и подключение к оператору ЭДО (1-2 дня). Мы параллелим процессы, чтобы сэкономить время.",
  },
  {
    question: "Можно ли подключиться самостоятельно?",
    answer:
      "Да, но придётся разбираться в выборе оператора ЭДО, получении УКЭП, настройке личного кабинета и формировании накладных. «Перейти на ЭПД за три дня не получится» — это занимает время. Мы берём всё на себя.",
  },
];

const trustItems = [
  { value: "8+", label: "лет на рынке" },
  { value: "3 000+", label: "клиентов" },
  { value: "Договор", label: "с каждым клиентом" },
  { value: "3 мес", label: "поддержки" },
];

export default function EtrnPage() {
  return (
    <>
      <ServiceJsonLd
        name="Переход на электронные транспортные накладные (ЭТрН)"
        description="Помощь с переходом на ЭТрН: выпуск УКЭП, подключение к ЭДО, обучение. Под ключ, от 25 000 руб."
        price={25000}
        url="/etrn"
      />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Переход на ЭТрН", href: "/etrn" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="destructive" className="mb-6 text-sm">
            <AlertTriangle className="mr-1.5 size-3.5" />
            Обязательно с 1 сентября 2026
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Переход на электронные накладные (ЭТрН) — под ключ
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Подключим к ЭДО, выпустим электронную подпись, настроим и обучим ваших
            сотрудников. Поддержка 3 месяца после подключения.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#etrn-form"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Оставить заявку
            </a>
            <a
              href="#packages"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Сравнить пакеты
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-destructive/5 border border-destructive/20 p-6 sm:p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertTriangle className="size-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Почему нужно подключиться сейчас
                </h2>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                    Штрафы за работу без ЭТрН после 1 сентября 2026
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                    «Перейти на ЭПД за три дня не получится» — подключение
                    занимает от 3 до 7 дней
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                    Ближе к дедлайну очереди на выпуск УКЭП и подключение к ЭДО
                    растут
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                    Без ЭТрН невозможно воспользоваться льготами при оформлении
                    пропуска
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit — ЭТрН + passes link */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-3xl border-2 border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left sm:p-8">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Network className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  ЭТрН упрощает оформление пропуска
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Наличие ЭТрН освобождает от необходимости предоставлять
                  бумажный договор перевозки при получении пропуска. Одна система —
                  меньше бумажной работы, быстрее оформление.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как мы подключаем
            </h2>
            <p className="mt-4 text-muted-foreground">
              6 этапов от консультации до первой электронной накладной
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <step.icon className="size-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {step.time}
                    </span>
                  </div>
                  <div className="mt-3 text-xs font-bold text-primary">
                    Этап {index + 1}
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages comparison */}
      <section
        id="packages"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Пакеты услуг
            </h2>
            <p className="mt-4 text-muted-foreground">
              Выберите подходящий вариант
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`rounded-2xl shadow-sm ${
                  pkg.recommended
                    ? "border-2 border-primary/20"
                    : "border-0"
                }`}
              >
                <CardHeader className="pb-2">
                  {pkg.recommended && (
                    <Badge className="mb-2 w-fit bg-accent text-accent-foreground">
                      Рекомендуем
                    </Badge>
                  )}
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {pkg.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#etrn-form"
                    className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    Выбрать
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed comparison table */}
          <div className="mt-10 overflow-hidden rounded-2xl bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Услуга</TableHead>
                  <TableHead className="text-center">Только УКЭП</TableHead>
                  <TableHead className="text-center">
                    Полное подключение
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Выпуск УКЭП", true, true],
                  ["Подключение к ЭДО", false, true],
                  ["Настройка кабинета", false, true],
                  ["Шаблоны ЭТрН", false, true],
                  ["Обучение сотрудников", false, true],
                  ["Поддержка 3 мес", false, true],
                ].map(([feature, basic, full]) => (
                  <TableRow key={feature as string}>
                    <TableCell className="font-medium">
                      {feature as string}
                    </TableCell>
                    <TableCell className="text-center">
                      {basic ? (
                        <CheckCircle className="mx-auto size-4 text-primary" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {full ? (
                        <CheckCircle className="mx-auto size-4 text-primary" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold">Цена</TableCell>
                  <TableCell className="text-center font-bold text-primary">
                    от 5 000 ₽
                  </TableCell>
                  <TableCell className="text-center font-bold text-primary">
                    от 25 000 ₽
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-4 text-center">
            <p className="text-sm text-foreground">
              <strong>Пакет «ЭТрН + пропуск»</strong> — скидка 20%.{" "}
              <strong>Пакет «ЭТрН + ГосЛог + пропуск»</strong> — скидка 25%.
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
              Частые вопросы об ЭТрН
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
      <section
        id="etrn-form"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-2xl">
          <EtrnForm />
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <CtaSection
          heading="Не ждите дедлайна"
          description="Подключитесь к ЭТрН сейчас — избежите очередей и штрафов."
          ctaText="Оставить заявку"
          ctaHref="#etrn-form"
        />
      </div>
    </>
  );
}
