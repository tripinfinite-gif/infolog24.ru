import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Handshake,
  Headphones,
  MessageCircle,
  Phone,
  RefreshCw,
  Shield,
  Truck,
  UserCheck,
  Wrench,
} from "lucide-react";

import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { SegmentCtaButton } from "@/components/forms/segment-cta-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

// ISR: revalidate every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Пропуска для грузового транспорта производственных компаний — Инфолог24",
  description:
    "Полный аутсорсинг оформления пропусков для производственных компаний. Одна точка контакта, закрывающие документы для бухгалтерии, от документов до продления — берём всё на себя.",
  keywords: [
    "пропуска для производственных компаний",
    "оформление пропусков для производства",
    "пропуска на грузовой транспорт для бизнеса",
    "аутсорсинг пропусков в Москву",
    "пропуска для грузовиков завода",
    "логистика пропусков для производства",
    "пропуска на МКАД для юрлиц",
  ],
  openGraph: {
    title:
      "Пропуска для грузового транспорта производственных компаний — Инфолог24",
    description:
      "Полный аутсорсинг: от документов до продления. Одна точка контакта, закрывающие документы для бухгалтерии.",
    type: "website",
    url: absoluteUrl("/proizvodstvo"),
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: absoluteUrl("/proizvodstvo"),
  },
};

const problems = [
  {
    icon: Clock,
    title: "Срывы поставок из-за пропусков",
    description:
      "Пропуск просрочен, водитель не может въехать в Москву, заказчик ждёт. Один день задержки — штрафные санкции по контракту и репутационные потери.",
  },
  {
    icon: Wrench,
    title: "Логистика — не ваш основной бизнес",
    description:
      "Вы производите продукцию, а не оформляете документы. Но кто-то должен следить за пропусками, РНИС, ЭТрН — и это съедает время ваших сотрудников.",
  },
  {
    icon: FileSpreadsheet,
    title: "Бухгалтерия завалена документами",
    description:
      "Акты, счета, договоры с 5 разными подрядчиками по транспорту. Главбух тратит 2–3 дня в месяц на сверку документов по пропускам.",
  },
  {
    icon: RefreshCw,
    title: "Текучка водителей и машин",
    description:
      "Меняется парк, приходят новые водители, арендуете дополнительные ТС на сезон — каждый раз нужно заново оформлять пропуска.",
  },
];

const solutions = [
  {
    icon: Handshake,
    title: "Берём всё на себя",
    description:
      "От сбора документов до продления пропусков — полный цикл. Ваши сотрудники занимаются производством, а не бумагами.",
  },
  {
    icon: UserCheck,
    title: "Одна точка контакта",
    description:
      "Выделенный аккаунт-менеджер. Один номер, один email, одна ответственность. Не нужно звонить в 5 мест.",
  },
  {
    icon: FileSpreadsheet,
    title: "Закрывающие документы для бухгалтерии",
    description:
      "Договор, акты, счета-фактуры — всё по стандарту. Один контрагент вместо пяти. Бухгалтерия скажет спасибо.",
  },
  {
    icon: Shield,
    title: "Надёжность как сервис",
    description:
      "Мониторинг сроков, автопродление, уведомления. Транспорт работает как электричество — незаметно и надёжно. 98% одобрения заявок.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Передаёте данные парка",
    description:
      "Список ТС, документы, контакты ответственного. Менеджер проверит и сообщит, если чего-то не хватает.",
  },
  {
    step: "02",
    title: "Мы оформляем пропуска",
    description:
      "Подаём документы в Департамент транспорта, подключаем РНИС, оформляем ЭТрН. Вы занимаетесь производством.",
  },
  {
    step: "03",
    title: "Транспорт работает",
    description:
      "Машины ездят по Москве легально. Мы мониторим сроки и продлеваем пропуска автоматически.",
  },
  {
    step: "04",
    title: "Получаете закрывающие документы",
    description:
      "Акты, счета-фактуры — в конце каждого месяца. Один контрагент, один договор, один комплект документов.",
  },
];

const faqItems = [
  {
    question: "Сколько стоит обслуживание для производственной компании?",
    answer:
      "Стоимость зависит от размера парка, зон пропусков и набора услуг. Для производственных компаний мы готовим индивидуальное предложение. Оставьте заявку — менеджер рассчитает стоимость за 1 рабочий день.",
  },
  {
    question:
      "У нас меняется парк в течение года — можно добавлять/убирать ТС?",
    answer:
      "Да, это стандартная ситуация. Добавление нового ТС — 1–3 рабочих дня. Исключение ТС из договора — в любой момент. Стоимость пересчитывается ежемесячно.",
  },
  {
    question: "Какие зоны пропусков вы оформляете?",
    answer:
      "Все три зоны: МКАД, ТТК и Садовое кольцо. Для каждой зоны — свои требования и сроки. Менеджер подберёт оптимальные пропуска под ваши маршруты.",
  },
  {
    question: "Работаете ли вы с тендерами и госзакупками?",
    answer:
      "Да, мы работаем по 44-ФЗ и 223-ФЗ. Предоставляем полный пакет документов для закупок: КП, техзадание, проект договора.",
  },
  {
    question: "Как происходит переход от текущего подрядчика?",
    answer:
      "Плавно. Мы берём на себя оформление новых пропусков и продление текущих, когда истечёт их срок. Никаких разрывов — ваш транспорт продолжает работать.",
  },
];

export default function ProizvodstvoPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Услуги", href: "/services" },
          {
            name: "Для производственных компаний",
            href: "/proizvodstvo",
          },
        ]}
      />
      <ServiceJsonLd
        name="Пропуска для грузового транспорта производственных компаний"
        description="Полный аутсорсинг оформления пропусков: от документов до продления. Одна точка контакта, закрывающие документы для бухгалтерии."
        price={900}
        priceUnit="от ₽/мес за ТС"
        url="/proizvodstvo"
      />
      <FaqJsonLd items={faqItems} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Building2 className="mr-1.5 size-3.5" />
            Для производственных компаний
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Транспорт должен работать{" "}
            <span className="text-accent">как электричество</span> — незаметно
            и надёжно
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Полный аутсорсинг пропусков для грузового транспорта. Вы производите
            продукцию — мы обеспечиваем, чтобы она доехала до заказчика в Москве.
            Без срывов, без штрафов, без вашего участия.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SegmentCtaButton
              segmentSlug="proizvodstvo"
              segmentName="Производственные компании"
              label="Обсудить условия для предприятия"
              className="h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
            />
            <a
              href="tel:+74991105549"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Phone className="size-4" />
              +7 (499) 110-55-49
            </a>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Почему пропуска — головная боль производства
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Вы делаете продукт. А транспортная логистика отнимает время, деньги
              и нервы ваших сотрудников.
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
              Наше решение: полный аутсорсинг
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Передайте нам всю работу с пропусками — и забудьте о ней.
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

      {/* How it works */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как это работает
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Четыре шага — и ваш транспорт работает без перебоев.
            </p>
          </div>
          <div className="mt-12 space-y-6">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="flex gap-5 rounded-2xl bg-card p-6 shadow-sm sm:p-8"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-lg font-bold text-accent-foreground">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Нам доверяют производственные компании
            </h2>
          </div>
          <Card className="mt-10 rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="p-6 sm:p-10">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  И
                </div>
                <div>
                  <p className="text-base leading-relaxed text-foreground italic">
                    &laquo;Раньше я тратила на пропуска 3 дня в месяц. Теперь — ноль.
                    Инфолог24 взяли на себя всё: документы, продления, даже РНИС
                    мониторят. Акты приходят вовремя, бухгалтерия довольна.&raquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Ирина, главный бухгалтер
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Мебельная фабрика, 8 грузовиков
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {[
              { value: "10+", label: "лет на рынке" },
              { value: "50 000+", label: "оформленных пропусков" },
              { value: "0 дней", label: "вашего времени" },
              { value: "98%", label: "одобрение заявок" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </div>
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
              href="/malye-tk"
              className="flex items-center gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-muted"
            >
              <Truck className="size-8 text-primary" />
              <div>
                <div className="font-semibold text-foreground">
                  Транспортные компании
                </div>
                <div className="text-sm text-muted-foreground">
                  5–20 машин, скидки от 15%
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
            Обсудим условия для вашего предприятия
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — подготовим индивидуальное предложение с учётом
            размера парка, маршрутов и графика работы. Консультация бесплатна.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SegmentCtaButton
              segmentSlug="proizvodstvo"
              segmentName="Производственные компании"
              label="Обсудить условия для предприятия"
              className="h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
            />
            <OpenChatTrigger className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
              <MessageCircle className="size-4" />
              Спросить ИнфоПилота
            </OpenChatTrigger>
          </div>
        </div>
      </section>
    </>
  );
}
