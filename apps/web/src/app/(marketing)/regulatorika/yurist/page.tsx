import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Gavel, Scale } from "lucide-react";

import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title:
    "Юрист-перевозчик — подписочная юридическая поддержка | Инфолог24",
  description:
    "Юрист-перевозчик: консультации, обжалование штрафов, проверка договоров, представительство в судах. Подписка от 5 000 ₽/мес. Юристы в штате с 8+ годами опыта в транспортной отрасли.",
  keywords: [
    "юрист перевозчика",
    "транспортный юрист",
    "юрист грузоперевозки",
    "обжалование штрафов юрист",
    "юрист по грузоперевозкам",
  ],
  openGraph: {
    title: "Юрист-перевозчик от Инфолог24",
    description:
      "Подписочная юридическая поддержка: консультации, обжалование, договоры, суды.",
    type: "website",
    url: "https://inlog24.ru/regulatorika/yurist",
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: "https://inlog24.ru/regulatorika/yurist",
  },
};

const plans = [
  {
    name: "Базовый",
    price: "5 000 ₽/мес",
    description: "Для частников и микро-ТК 1–4 машины",
    features: [
      "2 консультации юриста в месяц (по 30 мин)",
      "Обжалование штрафов по фиксированной ставке",
      "Шаблоны договоров перевозки и экспедирования",
      "Ответы на запросы ФНС и МАДИ",
      "Email и Telegram-поддержка в рабочие часы",
    ],
    highlight: false,
  },
  {
    name: "Расширенный",
    price: "15 000 ₽/мес",
    description: "Для ТК 5–20 машин",
    features: [
      "Неограниченные консультации в рабочие часы",
      "Безлимитное обжалование штрафов парка",
      "Проверка любых договоров до подписания",
      "Представительство в судах первой инстанции",
      "Ответы на претензии грузоотправителей",
      "Выезд юриста в ДТП (Москва и МО)",
    ],
    highlight: true,
  },
];

const includedWorks = [
  {
    title: "Консультации по любым вопросам",
    description:
      "Транспортные договоры, ДТП, штрафы, налоги ИП/ООО, трудовое право водителей, аренда ТС, ответственность экспедитора. Если это связано с грузоперевозками — мы знаем ответ.",
  },
  {
    title: "Обжалование штрафов",
    description:
      "Штрафы МАДИ, АМПП, ГИБДД, РНИС, ГосЛог, ЭТрН. Шансы на успех оцениваются до начала работы. Базовый тариф — фикс за жалобу, расширенный — безлимит.",
  },
  {
    title: "Проверка и составление договоров",
    description:
      "Транспортной экспедиции, перевозки, субподряда, аренды ТС. Проверим «подводные камни» в договорах грузоотправителей до подписания — бесплатно для подписчиков.",
  },
  {
    title: "Представительство в судах",
    description:
      "Суды первой инстанции по транспортным спорам, взыскание долгов по перевозкам, защита от необоснованных претензий. Для расширенного тарифа — без доплат за выезд.",
  },
];

const faq = [
  {
    question: "Чем юрист-перевозчик отличается от обычного юриста?",
    answer:
      "Мы специализируемся исключительно на транспортной отрасли. За 8 лет наши юристы провели более 3 000 обжалований штрафов, проверили 1 500+ договоров перевозки и выиграли десятки судов. У нас собственная база прецедентов и типовых аргументов — обычный юрист тратит часы на разбор каждой новой ситуации, мы отвечаем в минутах.",
  },
  {
    question: "Что входит в «неограниченные консультации»?",
    answer:
      "В тарифе «Расширенный» вы можете задавать юристам вопросы без ограничений в рабочие часы (пн-пт, 9–20). Каждый ответ оформляется письменным заключением, которое можно использовать как рекомендацию для суда, ФНС или контрагента.",
  },
  {
    question: "Можно ли подписаться только на один месяц?",
    answer:
      "Да, оба тарифа оформляются помесячно без минимального срока. Однако для сложных судебных процессов рекомендуем подписку минимум на квартал — судебные заседания могут занимать месяцы.",
  },
  {
    question: "Есть ли разовые услуги без подписки?",
    answer:
      "Да: консультация 30 минут — 3 000 ₽, проверка договора — от 5 000 ₽, обжалование штрафа — от 2 500 ₽ за документ. Но подписчики «Базового» экономят от 40% на тех же услугах.",
  },
  {
    question: "Входит ли юрист в пакеты «Транзит Москва» и «Флот Про»?",
    answer:
      "В «Транзит Москва» включены 2 консультации в месяц (соответствует «Базовому» тарифу). В «Флот Про» включён полный тариф «Расширенный» без ограничений и судов первой инстанции.",
  },
];

export default function YuristPage() {
  return (
    <>
      <ServiceJsonLd
        name="Юрист-перевозчик — подписка"
        description="Подписочная юридическая поддержка для перевозчиков: консультации, обжалование штрафов, договоры, суды. От 5 000 ₽/мес."
        price={5000}
        priceUnit="₽/мес"
        url="/regulatorika/yurist"
      />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Регуляторика", href: "/regulatorika" },
          { name: "Юрист-перевозчик", href: "/regulatorika/yurist" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Gavel className="mr-1.5 size-3.5" />
            Подписочная юридическая поддержка
          </Badge>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Scale className="size-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Юрист-перевозчик
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Консультации, обжалование штрафов, проверка договоров,
            представительство в судах — по подписке, без гонораров за каждую
            мелочь. Юристы в штате с 8+ годами опыта в транспортной отрасли.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#plans"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Выбрать тариф
            </Link>
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Получить консультацию
            </Link>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Что входит в подписку
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {includedWorks.map((item) => (
              <Card
                key={item.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Два тарифа
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Базовый — для частников, расширенный — для ТК с постоянной
              нагрузкой
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlight
                    ? "rounded-2xl border-2 border-accent bg-card shadow-lg"
                    : "rounded-2xl border-0 bg-card shadow-sm"
                }
              >
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-4 text-3xl font-bold text-primary">
                    {plan.price}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о юристе
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
      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Подключить юриста
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — проведём первую консультацию бесплатно, чтобы
            оценить объём работы и подобрать оптимальный тариф.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Получить консультацию
            </Link>
            <Link
              href="/regulatorika/kalendar"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Календарь дедлайнов
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
