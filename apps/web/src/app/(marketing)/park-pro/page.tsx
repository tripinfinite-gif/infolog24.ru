import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle,
  Clock,
  Cloud,
  Cpu,
  Crown,
  FileBarChart,
  FileCheck,
  FileText,
  Gauge,
  LayoutDashboard,
  Phone,
  Shield,
  Sparkles,
  Truck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { CtaSection } from "@/components/sections/cta-section";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Парк Про: личный кабинет для автопарка — бесплатно | Инфолог24",
  description:
    "Все машины, пропуска, штрафы, РНИС, сроки документов и счета — в одном кабинете. Базовый тариф бесплатно навсегда. Premium от 2 000 ₽/мес. Для парков от 1 ТС.",
  keywords: [
    "личный кабинет автопарка",
    "ЛК для перевозчика",
    "управление автопарком онлайн",
    "календарь документов ТС",
    "мониторинг парка бесплатно",
    "парк про инфолог24",
  ],
  openGraph: {
    title: "Парк Про — ЛК для автопарка | Инфолог24",
    description:
      "Машины, пропуска, штрафы, РНИС, напоминания — в одном кабинете. Базовый тариф — бесплатно.",
    type: "website",
    url: absoluteUrl("/park-pro"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Парк Про — ЛК для автопарка | Инфолог24",
    description: "Управление автопарком онлайн. Базовый — бесплатно.",
  },
  alternates: {
    canonical: absoluteUrl("/park-pro"),
  },
};

const features = [
  {
    icon: Truck,
    title: "Весь автопарк на одном экране",
    description:
      "Госномера, ВИН, СТС, водители, лизинг. Загрузка списком Excel или CRM. До 500 ТС в базовом тарифе.",
    tier: "free",
  },
  {
    icon: FileCheck,
    title: "Умный календарь документов",
    description:
      "Пропуска, ОСАГО, диагностические карты, сроки РНИС. Уведомление за 45/14/3 дня до истечения.",
    tier: "free",
  },
  {
    icon: Shield,
    title: "Единый кабинет штрафов",
    description:
      "Штрафы ГИБДД/АМПП/МАДИ по всему парку с источниками. Оплата со скидкой 25% в 1 клик.",
    tier: "free",
  },
  {
    icon: Activity,
    title: "Мониторинг РНИС",
    description:
      "Статус подключения, передача данных в систему, риск аннуляции пропуска. Алерт при проблеме.",
    tier: "free",
  },
  {
    icon: Bell,
    title: "Уведомления в Telegram/SMS/email",
    description:
      "Выберите любые каналы и события. Тревожные — через все, остальные — в ЛК.",
    tier: "free",
  },
  {
    icon: Cloud,
    title: "Хранилище документов",
    description:
      "Все СТС, ОСАГО, договоры, акты — в облаке. 10 ГБ бесплатно, 100 ГБ в Premium.",
    tier: "free",
  },
  {
    icon: Sparkles,
    title: "ИнфоПилот AI — ваш диспетчер",
    description:
      "Telegram-бот 24/7: отвечает водителям, проверяет пропуска, генерирует договоры. Premium.",
    tier: "premium",
  },
  {
    icon: BarChart3,
    title: "Аналитика и отчёты",
    description:
      "Экономика парка, штрафы по водителям, затраты на документы. Выгрузка в Excel для бухгалтерии.",
    tier: "premium",
  },
  {
    icon: Users,
    title: "Роли и доступ для сотрудников",
    description:
      "Диспетчер, логист, бухгалтер, водители — у каждого свой доступ. Аудит действий.",
    tier: "premium",
  },
  {
    icon: Cpu,
    title: "API и интеграции",
    description:
      "Синхронизация с 1С, SAP, Битрикс24. Webhook при штрафах и аннуляциях. Открытая документация.",
    tier: "premium",
  },
  {
    icon: Wallet,
    title: "Автоплатёж штрафов",
    description:
      "Правила: «оплачивать все штрафы до 3 000 ₽ в первые 10 дней со скидкой». Работает автоматически.",
    tier: "premium",
  },
  {
    icon: CalendarClock,
    title: "Планировщик ТО и ремонтов",
    description:
      "Сроки техосмотра, замены шин, ТО, лизинговых платежей. Расходы по каждой машине.",
    tier: "premium",
  },
];

const tiers = [
  {
    name: "Базовый",
    price: "0 ₽",
    unit: "навсегда",
    description: "Для всех клиентов компании",
    badge: "Бесплатно",
    badgeVariant: "secondary" as const,
    features: [
      "До 500 ТС в базе",
      "Календарь документов с напоминаниями",
      "Единый кабинет штрафов",
      "Мониторинг РНИС",
      "Уведомления в Telegram/SMS/email",
      "10 ГБ облачного хранилища",
      "Чат с менеджером",
      "Статус всех заказанных услуг",
    ],
    cta: "Начать бесплатно",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "2 000 ₽",
    unit: "/мес — фикс, любой парк",
    description: "Для тех, кто хочет автоматизации и аналитики",
    badge: "Популярно",
    badgeVariant: "default" as const,
    features: [
      "Всё из тарифа «Базовый»",
      "ИнфоПилот AI без ограничений",
      "Аналитика и отчёты по парку",
      "Роли и доступы для сотрудников",
      "Автоплатёж штрафов",
      "Планировщик ТО и лизинга",
      "API и вебхуки",
      "100 ГБ облачного хранилища",
      "Приоритетная поддержка",
    ],
    cta: "Подключить Premium",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "от 10 000 ₽",
    unit: "/мес для парков 50+ ТС",
    description: "С выделенным менеджером и SLA",
    badge: "Индивидуально",
    badgeVariant: "outline" as const,
    features: [
      "Всё из тарифа «Premium»",
      "SLA 2 часа на инциденты",
      "Выделенный аккаунт-менеджер",
      "Интеграция с корпоративной ERP/1С/SAP",
      "On-premise или приватный облачный инстанс",
      "Обучение сотрудников (2 очных сессии)",
      "Безлимитное хранилище",
      "Индивидуальные дашборды",
    ],
    cta: "Обсудить проект",
    highlighted: false,
  },
];

const scenarios = [
  {
    icon: AlertCircle,
    title: "Сценарий 1: водитель получил штраф, директор узнаёт поздно",
    before:
      "Штраф приходит на юрадрес через 15–25 дней. Скидка 25% уже сгорела. Директор узнаёт при ежемесячной сверке.",
    after:
      "Алерт в Telegram через 2 часа после появления. Бухгалтер оплачивает в 1 клик. Скидка сохранена.",
  },
  {
    icon: CalendarClock,
    title: "Сценарий 2: пропуск истёк, машина простаивает",
    before:
      "Срок пропуска в Excel у логиста. Логист в отпуске. Машина едет в Москву — штраф 7 500 ₽ + простой.",
    after:
      "Уведомление за 45 дней → запуск перевыпуска автоматически. Ноль простоев, ноль штрафов.",
  },
  {
    icon: FileBarChart,
    title: "Сценарий 3: собственнику нужна аналитика по парку",
    before:
      "Данные в 5 местах: 1С, Excel, телефон логиста, почта, сервис РНИС. Собирать отчёт — 2 дня работы бухгалтера.",
    after:
      "Дашборд «Парк Про» показывает: расходы, штрафы, пропуска, ТО, лизинг по каждой машине. Отчёт — за 5 минут.",
  },
];

const faq = [
  {
    question: "Почему базовый тариф бесплатный?",
    answer:
      "Личный кабинет — наш способ быть ближе к клиенту. Когда вы видите в ЛК, что у 3 машин заканчиваются пропуска через 2 недели, удобнее заказать перевыпуск у нас в 1 клик, чем искать конкурентов. Бесплатный ЛК + платные услуги — выгодно и нам, и вам.",
  },
  {
    question: "Нужно ли быть клиентом компании, чтобы пользоваться ЛК?",
    answer:
      "Нет. Базовый тариф доступен всем — можно даже никогда ничего не заказывать у нас. Вам нужен ЛК, нам — доверие и присутствие в вашей рутине. Когда возникнет срочный пропуск или штраф — будем первыми, к кому вы обратитесь.",
  },
  {
    question: "Как загрузить автопарк?",
    answer:
      "Три способа: (1) добавить машины вручную по одной, (2) загрузить Excel-файл списком (шаблон в ЛК), (3) синхронизировать с 1С или вашей CRM через API. В среднем загрузка 50 машин — 30 минут.",
  },
  {
    question: "Откуда берутся штрафы?",
    answer:
      "Интеграция с ГИС ГМП, ГИБДД, АМПП и МАДИ. Это официальные источники. В Premium добавляется автоплатёж с вашего счёта — с ограничениями по сумме, которые вы задаёте сами.",
  },
  {
    question: "Что с конфиденциальностью?",
    answer:
      "Данные хранятся в России на сертифицированных серверах. Соответствие ФЗ-152. Доступ к ЛК — по логину/паролю + 2FA (опционально). Enterprise может быть развёрнут on-premise или в вашем приватном облаке.",
  },
  {
    question: "Можно ли перенести данные из другой системы?",
    answer:
      "Да. Импорт из Excel, API 1С, выгрузок конкурентов. Если данных много (500+ ТС, архив документов за годы) — помогаем с миграцией бесплатно. Это входит в онбординг Premium и Enterprise.",
  },
  {
    question: "Что будет при отказе от Premium?",
    answer:
      "Всё, что было доступно в Premium, перестаёт работать (ИнфоПилот, автоплатёж, аналитика). Но базовый функционал сохраняется, данные не удаляются. Можно вернуться к Premium в любой момент — всё подтянется.",
  },
];

const integrations = [
  "1С: Транспорт",
  "SAP",
  "Битрикс24",
  "АМОcrm",
  "Telegram",
  "WhatsApp Business",
  "Google Calendar",
  "Яндекс.Карты",
  "Госуслуги",
  "mos.ru",
];

export default function ParkProPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Парк Про — ЛК", href: "/park-pro" },
        ]}
      />
      <FaqJsonLd items={faq} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-6">
            <LayoutDashboard className="mr-1.5 size-3.5" />
            Базовый тариф — бесплатно навсегда
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-6xl">
            Парк Про — управление автопарком в одном кабинете
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Машины, водители, пропуска, штрафы, РНИС, документы, ТО, лизинг,
            напоминания — всё в одном облачном ЛК. Работает из браузера, Telegram
            и мобильного приложения.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#parkpro-form"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Начать бесплатно
            </a>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Что внутри
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { v: "0 ₽", l: "базовый тариф" },
              { v: "до 500", l: "ТС в ЛК" },
              { v: "12 модулей", l: "в одном кабинете" },
              { v: "10+", l: "интеграций" },
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

      {/* Scenarios — before/after */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как меняется жизнь директора автопарка
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              3 сценария «как было» / «как стало» с Парк Про
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {scenarios.map((s) => (
              <Card
                key={s.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <s.icon className="size-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                      {s.title}
                    </h3>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border-destructive/20 border bg-destructive/5 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-destructive">
                          Было
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {s.before}
                      </p>
                    </div>
                    <div className="rounded-xl border-primary/20 border bg-primary/5 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-primary">
                          Стало
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{s.after}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              12 модулей в одном кабинете
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Подписан:{" "}
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                free
              </span>{" "}
              — в базовом, бесплатно{" "}
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                premium
              </span>{" "}
              — в Premium тарифе
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className={`rounded-2xl border-0 bg-card shadow-sm ${
                  f.tier === "premium" ? "ring-1 ring-accent/20" : ""
                }`}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                      <f.icon className="size-5 text-primary" />
                    </div>
                    {f.tier === "premium" ? (
                      <Badge className="bg-accent/10 text-[10px] text-accent hover:bg-accent/20">
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Free
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {f.description}
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
              Интеграции
            </Badge>
            <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Работает с вашим стеком
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

      {/* Tiers */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Тарифы Парк Про
            </h2>
            <p className="mt-4 text-muted-foreground">
              Начинайте бесплатно. Переходите на Premium, когда почувствуете
              ценность
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <Card
                key={t.name}
                className={
                  t.highlighted
                    ? "relative rounded-3xl border-2 border-accent bg-card shadow-lg"
                    : "rounded-3xl border-0 bg-card shadow-sm"
                }
              >
                {t.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      {t.badge}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 sm:p-8">
                  {!t.highlighted && (
                    <Badge variant={t.badgeVariant} className="mb-3">
                      {t.badge}
                    </Badge>
                  )}
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.description}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-bold text-primary">
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
                    href="#parkpro-form"
                    className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    {t.cta}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-center font-heading text-xl font-bold text-foreground">
            Встроено в экосистему Инфолог24
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Парк Про — часть платформы. Услуги заказываются в 1 клик прямо из ЛК
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                href: "/services",
                icon: Truck,
                title: "Пропуска",
                desc: "Заказ из ЛК, статус в реальном времени",
              },
              {
                href: "/monitoring",
                icon: Shield,
                title: "Антиштраф",
                desc: "Встроен в ЛК бесплатно",
              },
              {
                href: "/ekosistema",
                icon: Sparkles,
                title: "Экосистема",
                desc: "Все продукты в одном месте",
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
              Частые вопросы о Парк Про
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
                  <Gauge className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
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
      <section id="parkpro-form" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Создайте кабинет за 2 минуты
            </h2>
            <p className="mt-3 text-muted-foreground">
              Оставьте телефон — откроем Базовый тариф бесплатно, поможем
              загрузить парк, покажем как пользоваться.
            </p>
          </div>
          <CtaSection />
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Phone className="size-3.5" />
            <span>
              Или позвоните —{" "}
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
