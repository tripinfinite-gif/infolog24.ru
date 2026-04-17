import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Headphones,
  Phone,
  Shield,
  TrendingDown,
  Truck,
  Users,
} from "lucide-react";

import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

// ISR: revalidate every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Пропуска для транспортных компаний от 5 машин — Инфолог24",
  description:
    "Оформление пропусков на МКАД, ТТК и Садовое кольцо для транспортных компаний с парком 5–20 грузовиков. Персональный менеджер, мониторинг сроков, скидка от 5 ТС. Гарантия результата.",
  keywords: [
    "пропуска для транспортных компаний",
    "пропуск МКАД для ТК",
    "оформление пропусков для парка грузовиков",
    "пропуск на МКАД для юридических лиц",
    "пропуска для грузового транспорта компании",
    "корпоративные пропуска в Москву",
    "пропуск на 5 машин",
  ],
  openGraph: {
    title: "Пропуска для транспортных компаний от 5 машин — Инфолог24",
    description:
      "Персональный менеджер, мониторинг сроков, скидка от 5 ТС. Пропуска для парка 5–20 грузовиков за 3–4 дня.",
    type: "website",
    url: absoluteUrl("/malye-tk"),
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: absoluteUrl("/malye-tk"),
  },
};

const problems = [
  {
    icon: TrendingDown,
    title: "Простой ТС = прямые убытки",
    description:
      "Каждый день простоя грузовика — это 15 000–30 000 ₽ упущенной выручки. Пока вы ждёте пропуск, конкуренты возят ваши грузы.",
  },
  {
    icon: AlertTriangle,
    title: "РНИС слетело — пропуск аннулирован",
    description:
      "Проблемы с бортовым устройством РНИС приводят к аннулированию пропуска. Без мониторинга вы узнаёте об этом уже после штрафа.",
  },
  {
    icon: Clock,
    title: "Диспетчер забыл продлить",
    description:
      "Когда в парке 10–20 машин, уследить за сроками всех пропусков нереально. Один пропущенный дедлайн — неделя без доступа в Москву.",
  },
  {
    icon: FileCheck,
    title: "Штрафы с камер копятся",
    description:
      "Камеры фиксируют каждый выезд без пропуска: 7 500 ₽ за нарушение. За рейс по Москве может набежать до 180 000 ₽.",
  },
];

const solutions = [
  {
    icon: Users,
    title: "Персональный менеджер",
    description:
      "Один человек ведёт весь ваш парк. Знает каждую машину, каждый срок, каждый документ. Не нужно каждый раз объяснять ситуацию заново.",
  },
  {
    icon: Calendar,
    title: "Мониторинг сроков",
    description:
      "Автоматические напоминания за 30, 14 и 7 дней до окончания пропуска. Продление запускается заранее — без простоев.",
  },
  {
    icon: Truck,
    title: "Скидка от 5 ТС",
    description:
      "Чем больше парк — тем ниже цена за единицу. Для парков от 5 машин действует корпоративная скидка.",
  },
  {
    icon: Shield,
    title: "Гарантия результата",
    description:
      "Если пропуск не оформлен по нашей вине — возвращаем деньги. За 10 лет работы процент одобрения — 98%.",
  },
];

const faqItems = [
  {
    question: "Какие документы нужны для оформления пропусков на парк?",
    answer:
      "Для юрлица: свидетельство о регистрации ТС, ПТС, полис ОСАГО, доверенность на представителя, карточка предприятия. Для каждого ТС — данные о габаритах и массе. Мы помогаем собрать и проверить полный пакет документов.",
  },
  {
    question: "Сколько времени занимает оформление на весь парк?",
    answer:
      "Базовый пакет из 5 ТС оформляем за 3–4 рабочих дня. При подаче на 10–20 машин одновременно — 5–7 рабочих дней. Мы подаём документы партиями, чтобы ускорить процесс.",
  },
  {
    question: "Что будет, если РНИС перестанет работать?",
    answer:
      "Мы мониторим статус РНИС каждого ТС в реальном времени. Если устройство перестаёт передавать данные, менеджер сразу связывается с вами и помогает решить проблему до того, как пропуск аннулируют.",
  },
  {
    question: "Можно ли добавлять машины после заключения договора?",
    answer:
      "Да, в любой момент. Новое ТС добавляется к текущему договору, оформление пропуска — за 1–3 дня. Корпоративная скидка пересчитывается при увеличении парка.",
  },
  {
    question: "Работаете ли вы с лизинговыми машинами?",
    answer:
      "Да, оформляем пропуска на лизинговые и арендованные ТС. Потребуется дополнительно договор лизинга или аренды. Менеджер подскажет точный список документов.",
  },
];

export default function MalyeTkPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Услуги", href: "/services" },
          { name: "Для транспортных компаний", href: "/malye-tk" },
        ]}
      />
      <ServiceJsonLd
        name="Оформление пропусков для транспортных компаний (5–20 ТС)"
        description="Пропуска на МКАД, ТТК и Садовое кольцо для парка грузовиков. Персональный менеджер, мониторинг сроков, гарантия результата."
        price={52000}
        priceUnit="за пакет от 5 ТС"
        url="/malye-tk"
      />
      <FaqJsonLd items={faqItems} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Truck className="mr-1.5 size-3.5" />
            Для парков 5–20 машин
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Ваши машины стоят — наши работают.{" "}
            <span className="text-accent">Пропуска для парка 5–20 грузовиков</span>{" "}
            за 3–4 дня
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Персональный менеджер, автоматический мониторинг сроков, скидки от 5 ТС.
            Больше никаких простоев из-за пропусков — мы берём это на себя.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Рассчитать стоимость для парка
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <a
              href="tel:+74991105549"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Phone className="size-4" />
              Позвонить менеджеру
            </a>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Знакомые проблемы?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Когда в парке 5–20 машин, каждый из этих рисков превращается в системную проблему.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {problems.map((problem) => (
              <Card
                key={problem.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10">
                    <problem.icon className="size-6 text-destructive" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {problem.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как мы решаем эти задачи
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Один договор, один менеджер, полный контроль — от подачи документов до продления.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {solutions.map((solution) => (
              <Card
                key={solution.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <solution.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Стоимость для парков 5–20 ТС
            </h2>
          </div>
          <Card className="mt-10 rounded-3xl border-2 border-accent bg-card shadow-lg">
            <CardContent className="p-6 sm:p-10">
              <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                <div className="flex-1">
                  <Badge className="mb-4 bg-accent text-accent-foreground">
                    Рекомендуем
                  </Badge>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    Транзит Москва
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Пакет для транспортных компаний с парком от 5 машин: пропуска, РНИС,
                    мониторинг штрафов, персональный менеджер, продление без вашего участия.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      "Пропуска на МКАД, ТТК, Садовое кольцо",
                      "Подключение и мониторинг РНИС",
                      "Персональный менеджер для парка",
                      "Автопродление пропусков",
                      "Мониторинг штрафов с камер",
                      "Помощь с ЭТрН и ГосЛог",
                    ].map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex flex-col items-center md:ml-10 md:mt-0">
                  <div className="rounded-2xl bg-primary/5 p-6 text-center">
                    <div className="text-3xl font-bold text-primary">
                      от 52 000 ₽
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      за пакет от 5 ТС
                    </p>
                    <p className="mt-1 text-xs font-semibold text-accent">
                      Скидка 15% от розничной цены
                    </p>
                  </div>
                  <Link
                    href="/contacts"
                    className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                  >
                    Рассчитать для моего парка
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Нам доверяют транспортные компании
            </h2>
          </div>
          <Card className="mt-10 rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="p-6 sm:p-10">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  О
                </div>
                <div>
                  <p className="text-base leading-relaxed text-foreground italic">
                    &laquo;Оформляют быстрее всех, ни одного простоя за год. Менеджер сам
                    напоминает о продлении — я даже не думаю об этом. Раньше тратили по 2 дня
                    в месяц на пропуска, теперь — ноль.&raquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Олег, директор ООО &laquo;ТрансЛогик&raquo;
                  </p>
                  <p className="text-sm text-muted-foreground">12 машин в парке</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {[
              { value: "10+", label: "лет на рынке" },
              { value: "50 000+", label: "оформленных пропусков" },
              { value: "98%", label: "одобрение заявок" },
              { value: "3–4", label: "дня на оформление" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqItems.map((item) => (
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

      {/* Cross-links */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-xl font-bold text-foreground sm:text-2xl">
            Решения для других сегментов
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/ip-perevozchik"
              className="flex items-center gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-muted"
            >
              <Truck className="size-8 text-primary" />
              <div>
                <div className="font-semibold text-foreground">
                  ИП и частные перевозчики
                </div>
                <div className="text-sm text-muted-foreground">
                  1–3 машины, от 12 000 ₽
                </div>
              </div>
              <ArrowRight className="ml-auto size-5 text-muted-foreground" />
            </Link>
            <Link
              href="/proizvodstvo"
              className="flex items-center gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-muted"
            >
              <Headphones className="size-8 text-primary" />
              <div>
                <div className="font-semibold text-foreground">
                  Производственные компании
                </div>
                <div className="text-sm text-muted-foreground">
                  Полный аутсорсинг логистики пропусков
                </div>
              </div>
              <ArrowRight className="ml-auto size-5 text-muted-foreground" />
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/services"
              className="text-accent underline-offset-4 hover:underline"
            >
              Все услуги
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="/resheniya"
              className="text-accent underline-offset-4 hover:underline"
            >
              Пакетные решения
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Рассчитайте стоимость для вашего парка
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — менеджер изучит ваш парк и предложит оптимальное
            решение со скидкой. Бесплатная консультация, расчёт за 2 минуты.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Рассчитать стоимость для парка
            </Link>
            <OpenChatTrigger className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
              Спросить ИнфоПилота
            </OpenChatTrigger>
          </div>
        </div>
      </section>
    </>
  );
}
