import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Building,
  CheckCircle,
  Clock,
  FileSignature,
  Fingerprint,
  KeyRound,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

import { CtaSection } from "@/components/sections/cta-section";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "КЭП и МЧД для перевозчика под ключ — от 5 000 ₽ за 1–3 дня | Инфолог24",
  description:
    "Квалифицированная электронная подпись (КЭП/УКЭП) и машиночитаемая доверенность (МЧД) для перевозчиков. Нужно для ЭТрН, ГосЛог, Госуслуг бизнеса. Выпуск 1–3 дня.",
  keywords: [
    "КЭП для перевозчика",
    "УКЭП грузоперевозки",
    "МЧД машиночитаемая доверенность",
    "электронная подпись ЭТрН",
    "получить КЭП",
    "КЭП ГосЛог",
    "УКЭП Контур СБИС",
  ],
  openGraph: {
    title: "КЭП и МЧД для перевозчика — Инфолог24",
    description:
      "Электронная подпись и доверенность под ключ. Нужно для ЭТрН, ГосЛог, mos.ru. От 5 000 ₽, 1–3 дня.",
    type: "website",
    url: absoluteUrl("/kep"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "КЭП и МЧД для перевозчика — Инфолог24",
    description: "Электронная подпись под ключ, 1–3 дня. От 5 000 ₽.",
  },
  alternates: {
    canonical: absoluteUrl("/kep"),
  },
};

const whoNeeds = [
  {
    icon: FileSignature,
    title: "Для ЭТрН с 01.09.2026",
    description:
      "Без УКЭП электронную транспортную накладную не подписать. После дедлайна очереди на выпуск вырастут в 5–10 раз.",
  },
  {
    icon: Building,
    title: "Для ГосЛог до 30.04.2026",
    description:
      "Регистрация в реестрах экспедиторов и перевозчиков требует квалифицированной подписи руководителя.",
  },
  {
    icon: Users,
    title: "Для mos.ru и Госуслуг бизнеса",
    description:
      "Пропуски, справки, выписки, торги, ФНС, суды — всё через ЭП юридического лица. Без неё бизнес-процессы встают.",
  },
  {
    icon: ShieldCheck,
    title: "Для МЧД вместо бумажной доверенности",
    description:
      "С 2025 года бумажные доверенности для ЭДО не действуют. МЧД — единственный способ делегировать подписание сотрудникам.",
  },
];

const packages = [
  {
    name: "Только КЭП",
    price: "от 5 000 ₽",
    unit: "разово",
    popular: false,
    description: "Подпись на 1 год для руководителя",
    features: [
      "Выпуск УКЭП в ФНС или аккредитованном УЦ",
      "Помощь с идентификацией (визит или видео)",
      "Установка на Рутокен / флешку",
      "Настройка на вашем ПК",
      "Краткая инструкция по применению",
    ],
  },
  {
    name: "КЭП + МЧД",
    price: "от 8 000 ₽",
    unit: "разово",
    popular: true,
    description: "Руководитель + 1–3 сотрудника по доверенности",
    features: [
      "Всё из пакета «Только КЭП»",
      "Выпуск МЧД на 1–3 сотрудников",
      "Настройка прав подписания для ЭТрН",
      "Регистрация МЧД в реестре ФНС",
      "Поддержка 1 месяц по вопросам применения",
    ],
  },
  {
    name: "Корпоративный",
    price: "от 15 000 ₽",
    unit: "разово + абонент",
    popular: false,
    description: "Для ТК с множеством водителей",
    features: [
      "КЭП для руководителя и главбуха",
      "МЧД на 5–10 сотрудников и водителей",
      "Выбор формата: флешка / облако / VPN",
      "Интеграция с вашим ЭДО (Контур/СБИС/Астрал)",
      "Документация по внутренним регламентам",
      "Абонентская поддержка — от 2 000 ₽/мес",
    ],
  },
];

const steps = [
  {
    icon: Phone,
    title: "Заявка и документы",
    description:
      "Вы отправляете паспорт руководителя, СНИЛС, ИНН, ОГРН. Мы проверяем комплектность за 15 минут.",
    time: "15 минут",
  },
  {
    icon: UserCheck,
    title: "Идентификация",
    description:
      "Онлайн-видеоверификация или визит в офис партнёра. Руководитель подтверждает личность.",
    time: "30 минут",
  },
  {
    icon: KeyRound,
    title: "Выпуск КЭП",
    description:
      "Наш УЦ-партнёр (Контур, СБИС, Такском или ФНС) формирует сертификат. Ключ записывается на защищённый носитель.",
    time: "1–2 дня",
  },
  {
    icon: Fingerprint,
    title: "Настройка и МЧД",
    description:
      "Устанавливаем подпись на ваш ПК/сервер. Формируем и регистрируем МЧД на сотрудников. Проверяем работу с ЭТрН и Госуслугами.",
    time: "1 день",
  },
];

const integrationTargets = [
  "Госуслуги бизнеса",
  "ГосЛог (goslog.ru)",
  "ЭТрН — Контур.Диадок",
  "ЭТрН — СБИС",
  "ЭТрН — Такском",
  "mos.ru (пропуска)",
  "ФНС — Личный кабинет ЮЛ",
  "ЕГАИС / Честный ЗНАК",
  "Торговые площадки (B2B)",
  "Арбитражные суды (мой.арбитр)",
];

const painBox = {
  title: "Частые проблемы при самостоятельном выпуске",
  items: [
    "Отказ в ФНС из-за несоответствия паспортных данных в реестре",
    "Носитель КЭП не прошёл сертификацию — ключ не работает в Диадок",
    "МЧД выпущена неправильно — ЭТрН подписывается, но не принимается",
    "Руководитель уехал в командировку, идентификация сорвалась",
    "Потратили неделю на разбор, а ЭТрН нужен был к концу месяца",
  ],
};

const faq = [
  {
    question: "В чём разница между КЭП, УКЭП и УНЭП?",
    answer:
      "КЭП (квалифицированная электронная подпись) = УКЭП (усиленная квалифицированная) — это одно и то же: подпись юридического лица с максимальной правовой силой, эквивалентная собственноручной. УНЭП (усиленная неквалифицированная) — проще, но для ЭТрН и ГосЛог не подходит. Нам нужна именно УКЭП руководителя.",
  },
  {
    question: "Что такое МЧД и зачем она нужна?",
    answer:
      "Машиночитаемая доверенность. Это электронный документ, которым руководитель делегирует право подписывать документы сотруднику (логисту, водителю, бухгалтеру) — без выпуска отдельной УКЭП на сотрудника. С 2025 года бумажные доверенности для ЭДО не действуют. МЧД регистрируется в реестре ФНС и действует автоматически.",
  },
  {
    question: "Можно ли выпустить КЭП в ФНС самостоятельно бесплатно?",
    answer:
      "Можно, но есть нюансы: нужно иметь носитель с сертификатом ФСБ (сам Рутокен — 1 500 ₽), лично приехать в ФНС, потратить день в очередях, самостоятельно настроить ПО (КриптоПро, драйверы, плагин). Мы делаем всё под ключ за 5 000 ₽ и сокращаем время до 1–3 дней. Плюс — наша КЭП совместима с ЭТрН всех операторов сразу.",
  },
  {
    question: "На какой срок выдаётся КЭП?",
    answer:
      "Срок действия квалифицированной электронной подписи — 12 или 15 месяцев (зависит от УЦ). За 30 дней до истечения мы автоматически напоминаем о продлении и помогаем перевыпустить без простоя.",
  },
  {
    question: "Что если руководитель не может приехать на идентификацию?",
    answer:
      "Все наши УЦ-партнёры принимают видеоидентификацию по «Госуслугам» или через биометрию (ЕБС). Если руководитель в другом городе/стране — идентификация возможна удалённо за 30 минут. Визит в офис — опциональный.",
  },
  {
    question: "Подойдёт ли эта КЭП для ЭТрН?",
    answer:
      "Да. Наша КЭП из коробки совместима со всеми операторами ЭДО: Контур.Диадок, СБИС, Такском, Астрал, 1С-ЭПД. Больше того — в пакете «КЭП + МЧД» мы сами подключаем её к выбранному оператору и проверяем формирование первой тестовой накладной.",
  },
  {
    question: "Можно ли получить КЭП на ИП?",
    answer:
      "Да. С 2022 года для ИП КЭП выдаётся только в ФНС бесплатно. Мы помогаем подготовить документы, записываем в очередь, сопровождаем в инспекции. Стоимость наших услуг для ИП — от 3 500 ₽ (без стоимости токена).",
  },
];

export default function KepPage() {
  return (
    <>
      <ServiceJsonLd
        name="КЭП и МЧД для перевозчика"
        description="Выпуск квалифицированной электронной подписи (УКЭП) и машиночитаемой доверенности (МЧД) для грузоперевозчиков. Нужно для ЭТрН, ГосЛог, mos.ru."
        price={5000}
        url="/kep"
      />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "КЭП и МЧД", href: "/kep" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <BadgeCheck className="mr-1.5 size-3.5" />
            Под ключ · 1–3 дня
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            КЭП и МЧД под ключ — без очередей, без возни, без ФНС
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Выпускаем квалифицированную подпись и машиночитаемую доверенность за
            1–3 дня. Без ваших походов в ФНС, без настройки КриптоПро. Ключ сразу
            готов для ЭТрН, ГосЛог, mos.ru и Госуслуг.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#kep-form"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Получить КЭП
            </a>
            <a
              href="#packages"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Пакеты услуг
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { v: "1–3 дня", l: "срок выпуска" },
              { v: "от 5 000 ₽", l: "под ключ" },
              { v: "0", l: "визитов в ФНС" },
              { v: "10+", l: "совместимых систем" },
            ].map((m) => (
              <div key={m.l} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="font-heading text-xl font-extrabold text-primary sm:text-2xl">
                  {m.v}
                </div>
                <div className="mt-1 text-xs leading-tight text-muted-foreground">
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who needs */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Кому и зачем нужна КЭП
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              4 ситуации, в которых без электронной подписи бизнес встаёт
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {whoNeeds.map((w) => (
              <Card
                key={w.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <w.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {w.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pain — why not self */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-3xl border-destructive/20 bg-destructive/5 shadow-sm">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertTriangle className="size-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    {painBox.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {painBox.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm font-semibold text-foreground">
                    Мы проходим этот путь для наших клиентов 300+ раз в год.
                    Знаем все подводные камни. Ошибки — наши, результат — ваш.
                  </p>
                </div>
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
              Как мы выпускаем КЭП
            </h2>
            <p className="mt-4 text-muted-foreground">
              4 этапа: от заявки до рабочей подписи на вашем ПК
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                      <step.icon className="size-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {step.time}
                    </span>
                  </div>
                  <div className="mt-4 text-xs font-bold text-primary">
                    Шаг {index + 1}
                  </div>
                  <h3 className="mt-1 font-semibold text-foreground">
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

      {/* Integrations */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-3">
              <Zap className="mr-1.5 size-3.5" />
              Совместимость
            </Badge>
            <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Ваша КЭП сразу работает в 10+ системах
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Без дополнительных настроек и перевыпусков
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {integrationTargets.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Пакеты
            </h2>
            <p className="mt-4 text-muted-foreground">
              От одной подписи до корпоративного решения
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {packages.map((p) => (
              <Card
                key={p.name}
                className={
                  p.popular
                    ? "relative rounded-3xl border-2 border-accent bg-card shadow-lg"
                    : "rounded-3xl border-0 bg-card shadow-sm"
                }
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Чаще всего
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-bold text-primary">
                      {p.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {p.unit}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#kep-form"
                    className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    Заказать
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-sm text-foreground">
              <strong>В составе пакета «ЭТрН Переход»</strong> КЭП и МЧД уже
              включены.{" "}
              <Link
                href="/etrn"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Перейти на ЭТрН под ключ →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { v: "Партнёры", l: "Контур, СБИС, Такском" },
              { v: "Сертификат", l: "ФСБ" },
              { v: "Поддержка", l: "после выдачи" },
              { v: "Гарантия", l: "работы КЭП" },
            ].map((i) => (
              <div key={i.l} className="text-center">
                <span className="block font-heading text-lg font-extrabold text-primary-foreground sm:text-xl">
                  {i.v}
                </span>
                <span className="text-xs text-primary-foreground/70">
                  {i.l}
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
              Частые вопросы о КЭП и МЧД
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-card p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-foreground">
                  {item.question}
                  <Lock className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
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
      <section id="kep-form" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Закажите КЭП — начнём сегодня
            </h2>
            <p className="mt-3 text-muted-foreground">
              Перезвоним за 15 минут, пришлём список документов, запишем на
              идентификацию в удобное время.
            </p>
          </div>
          <CtaSection />
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-xs text-muted-foreground sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2">
              <Phone className="size-3.5" />
              <a
                href="tel:+74991105549"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                +7 (499) 110-55-49
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Smartphone className="size-3.5" />
              Ответим в Telegram и WhatsApp
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
