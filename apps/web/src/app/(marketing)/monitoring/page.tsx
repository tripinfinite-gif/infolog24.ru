import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Eye,
  FileSearch,
  FileWarning,
  LayoutDashboard,
  Percent,
  Phone,
  Plus,
  Scale,
  Shield,
  Smartphone,
  Truck,
  Wallet,
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
  title: "Мониторинг штрафов для автопарка — от 500 ₽/мес",
  description:
    "Следим за штрафами ГИБДД, МАДИ, АМПП по всему парку в реальном времени. Уведомляем за 12 часов до потери скидки 25%. Обжалование включено в тариф. От 500 ₽/мес за ТС.",
  keywords: [
    "мониторинг штрафов",
    "штрафы ГИБДД автопарк",
    "АМПП МАДИ штрафы",
    "обжалование штрафов перевозчик",
    "сервис штрафов грузовых",
    "антиштраф",
  ],
  openGraph: {
    title: "Антиштраф — мониторинг штрафов для автопарка | Инфолог24",
    description:
      "Штрафы по всему парку в одном кабинете. Уведомление за 12 часов. Скидка 25% не сгорает. От 500 ₽/мес за ТС.",
    type: "website",
    url: absoluteUrl("/monitoring"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Антиштраф: мониторинг штрафов для автопарка — Инфолог24",
    description: "Штрафы по всему парку, уведомление за 12 часов, обжалование.",
  },
  alternates: {
    canonical: absoluteUrl("/monitoring"),
  },
};

const painPoints = [
  {
    icon: FileWarning,
    title: "43 штрафа за один рейс без пропуска",
    description:
      "Камеры на въездах дают до 215 000 ₽ с одной машины за день. Узнаёте через 30 дней — скидка 25% уже сгорела.",
  },
  {
    icon: Clock,
    title: "Штрафы приходят на юрадрес с опозданием",
    description:
      "Срок на оплату со скидкой — 20 дней. Почта России, бухгалтер в отпуске, счёт на столе директора — деньги теряются.",
  },
  {
    icon: FileSearch,
    title: "Водитель молчит, директор узнаёт последним",
    description:
      "Штрафы оформляются на собственника ТС. Без мониторинга кассовый разрыв на 50–200 тыс. ₽ в месяц для парка 10 машин.",
  },
];

const howItWorks = [
  {
    icon: Plus,
    title: "Добавляете ТС в кабинет",
    description: "Госномер, СТС, ВИН. Можно загрузить списком Excel — до 500 ТС сразу.",
  },
  {
    icon: Eye,
    title: "Мы подключаемся к источникам",
    description:
      "ГИБДД, МАДИ, АМПП, Госуслуги, Дептранс. Сканируем каждые 2–4 часа.",
  },
  {
    icon: Bell,
    title: "Уведомление сразу после появления",
    description:
      "SMS, email, Telegram-бот, push в ЛК. За 12 часов до потери скидки 25% — отдельный тревожный алерт.",
  },
  {
    icon: Scale,
    title: "Обжалуем спорные",
    description:
      "В тариф входит подготовка жалобы на штраф за пропуск, перегруз и РНИС (до 5–10 жалоб/мес в зависимости от тарифа).",
  },
  {
    icon: Wallet,
    title: "Оплачиваете в один клик",
    description:
      "Платёж из ЛК без комиссии. Автоплатёж по правилам: «оплачивать все до 3 000 ₽ автоматически со скидкой».",
  },
];

const tariffs = [
  {
    name: "Базовый",
    price: "500 ₽",
    unit: "/мес за ТС",
    popular: false,
    description: "Для ИП и парков 1–4 ТС",
    features: [
      "Мониторинг штрафов ГИБДД + АМПП + МАДИ",
      "Уведомления SMS + email",
      "Оплата со скидкой 25% в ЛК",
      "Отчёт по штрафам — 1 раз в месяц",
    ],
  },
  {
    name: "Про",
    price: "900 ₽",
    unit: "/мес за ТС",
    popular: true,
    description: "Для ТК с парком 5–20 ТС",
    features: [
      "Всё из тарифа «Базовый»",
      "Telegram-бот с алертами 24/7",
      "Автоплатёж штрафов до 3 000 ₽",
      "До 5 жалоб в месяц на спорные штрафы",
      "Отчёт по каждому водителю",
      "Интеграция с ИнфоПилотом",
    ],
  },
  {
    name: "Флот",
    price: "от 600 ₽",
    unit: "/мес за ТС (парк 20+)",
    popular: false,
    description: "Для корпоративных парков",
    features: [
      "Всё из тарифа «Про»",
      "Неограниченное количество жалоб",
      "API для интеграции с вашей ERP / 1С",
      "Персональный юрист по штрафам",
      "SLA 4 часа на разбор спорного штрафа",
      "Ежемесячный аналитический отчёт для собственника",
    ],
  },
];

const metrics = [
  {
    value: "—60 %",
    label: "средняя экономия на штрафах за счёт скидки 25% и обжалования",
  },
  { value: "< 2 ч", label: "от появления штрафа до уведомления" },
  { value: "до 80 %", label: "обжалованных штрафов возвращаются" },
  { value: "3 000+", label: "ТС под мониторингом" },
];

const faq = [
  {
    question: "Откуда берёте данные о штрафах?",
    answer:
      "Интегрируемся с ГИС ГМП, ГИБДД, АМПП (парковки), МАДИ (пропуска, РНИС, грузовой каркас), Дептрансом Москвы и Госуслугами. Это официальные источники — данные идентичны тому, что вы видели бы в личном кабинете Госуслуг, только все машины в одном месте.",
  },
  {
    question: "Что будет со старыми штрафами, которые уже пришли?",
    answer:
      "При подключении мы подгружаем все активные штрафы за последние 12 месяцев. Если среди них есть спорные — поможем обжаловать (в рамках квоты тарифа). Уже оплаченные можно выгрузить отчётом для бухгалтерии.",
  },
  {
    question: "Как работает скидка 25%?",
    answer:
      "По большинству статей КоАП (ГИБДД, парковки) при оплате в первые 20 дней действует скидка 25%. Ключевое — не пропустить срок. Система присылает тревожный алерт за 12 часов до конца льготного периода. С нашим мониторингом ни один штраф не оплачивается по полной цене.",
  },
  {
    question: "Что с обжалованием штрафов за пропуска и перегруз?",
    answer:
      "Штрафы за отсутствие пропуска МКАД/ТТК (ст. 12.16.3, 12.16.3.1) обжалуются, если пропуск был, но не считался камерой (техническая ошибка — до 30%). Штрафы за перегруз (ст. 12.21.1) — до 60% успеха при наличии весового документа. Жалобы включены в тариф «Про» (до 5/мес) и «Флот» (безлимит).",
  },
  {
    question: "Почему это дешевле собственного юриста?",
    answer:
      "Юрист на аутсорсе — от 15 000 ₽/мес просто за консультации. Штатный — от 80 000 ₽/мес. Наш тариф «Про» — 900 ₽/мес за ТС = 9 000 ₽ за 10 машин, и в эту цену входит до 5 жалоб. Мы масштабируем шаблоны, поэтому юрист-специалист обрабатывает 50–100 дел одновременно.",
  },
  {
    question: "Что если штраф всё-таки не удалось обжаловать?",
    answer:
      "Мы честно говорим «шансов мало» до подачи — не тратим ваше время на безнадёжные дела. Если подали и получили отказ — помогаем подать в суд первой инстанции. В тарифы входит досудебное обжалование; суд оплачивается отдельно по прозрачному прайсу.",
  },
  {
    question: "Можно ли попробовать бесплатно?",
    answer:
      "Да — бесплатно добавляйте до 3 ТС на 14 дней. Увидите реальные штрафы по своему парку, попробуете обжалование, оцените скорость уведомлений. Подписку подключаете только если устраивает.",
  },
];

const integrations = [
  "ГИБДД",
  "ГИС ГМП",
  "АМПП (парковки)",
  "МАДИ",
  "Дептранс Москвы",
  "Госуслуги",
  "Telegram",
  "1С / SAP (API)",
];

export default function MonitoringPage() {
  return (
    <>
      <ServiceJsonLd
        name="Антиштраф — мониторинг штрафов для автопарка"
        description="Подписочный сервис: мониторинг штрафов ГИБДД, МАДИ, АМПП по всему парку, уведомления за 12 часов до потери скидки 25%, обжалование спорных штрафов."
        price={500}
        url="/monitoring"
      />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Антиштраф — мониторинг", href: "/monitoring" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Shield className="mr-1.5 size-3.5" />
            Подписка · от 500 ₽/мес за ТС
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Штрафы всего автопарка — в одном кабинете
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Следим за штрафами ГИБДД, МАДИ, АМПП в реальном времени. Уведомляем
            за 12 часов до потери скидки 25%. Обжалуем спорные штрафы. Экономия
            до 60% на штрафах парка.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#tariffs"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Подключить Антиштраф
            </a>
            <a
              href="#monitoring-form"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Попробовать бесплатно 14 дней
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="font-heading text-xl font-extrabold text-primary sm:text-2xl">
                  {m.value}
                </div>
                <div className="mt-1 text-xs leading-tight text-muted-foreground">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="destructive" className="mb-4">
              <AlertTriangle className="mr-1.5 size-3.5" />
              Боль директора автопарка
            </Badge>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Почему штрафы съедают маржу перевозчика
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {painPoints.map((p) => (
              <Card
                key={p.title}
                className="rounded-2xl border-destructive/20 bg-destructive/5 shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
                    <p.icon className="size-6 text-destructive" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-primary p-8 text-center sm:p-10">
            <Percent className="mx-auto size-10 text-primary-foreground/70" />
            <p className="mt-4 font-heading text-xl font-semibold leading-relaxed text-primary-foreground sm:text-2xl">
              Парк на 10 машин теряет в среднем 120 000 ₽/год только на
              просроченных скидках 25%. Тариф «Про» на 10 ТС — 9 000 ₽/мес.
            </p>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Окупается за 1 штраф, пойманный вовремя.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как работает Антиштраф
            </h2>
            <p className="mt-4 text-muted-foreground">
              5 шагов от подключения до экономии
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {howItWorks.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="size-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-primary">
                    Шаг {index + 1}
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

      {/* Integrations */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-3">
              <LayoutDashboard className="mr-1.5 size-3.5" />
              Источники данных
            </Badge>
            <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Собираем штрафы из официальных систем
            </h3>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {integrations.map((name) => (
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

      {/* Tariffs */}
      <section id="tariffs" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Тарифы
            </h2>
            <p className="mt-4 text-muted-foreground">
              Платите только за машины в парке. Чем больше парк — тем дешевле ТС.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tariffs.map((t) => (
              <Card
                key={t.name}
                className={
                  t.popular
                    ? "relative rounded-3xl border-2 border-accent bg-card shadow-lg"
                    : "rounded-3xl border-0 bg-card shadow-sm"
                }
              >
                {t.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Выбирают чаще
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.description}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-bold text-primary">
                      {t.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t.unit}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#monitoring-form"
                    className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    Подключить
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-sm text-foreground">
              <strong>В пакете с пропуском</strong> — Антиштраф входит в тарифы{" "}
              <Link
                href="/resheniya"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                «Транзит Москва» и «Флот Про»
              </Link>{" "}
              без доплаты.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-center font-heading text-xl font-bold text-foreground">
            Что ещё полезно перевозчику
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                href: "/yurist",
                icon: Scale,
                title: "Юрист-перевозчик",
                desc: "Подписка: штрафы, лизинг, договоры",
              },
              {
                href: "/infopilot",
                icon: Smartphone,
                title: "ИнфоПилот AI",
                desc: "Бот 24/7 для водителей и диспетчера",
              },
              {
                href: "/park-pro",
                icon: Truck,
                title: "Парк Про",
                desc: "ЛК для управления автопарком",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <item.icon className="size-6 text-primary" />
                <div className="mt-4 font-semibold text-foreground group-hover:text-primary">
                  {item.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {item.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы
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
      <section id="monitoring-form" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Попробуйте бесплатно 14 дней
            </h2>
            <p className="mt-3 text-muted-foreground">
              Добавьте до 3 машин, посмотрите реальные штрафы по своему парку,
              решите, подходит ли сервис.
            </p>
          </div>
          <CtaSection />
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Phone className="size-3.5" />
            <span>
              Телефон отдела продаж —{" "}
              <a
                href="tel:+74991105549"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                +7 (499) 110-55-49
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
