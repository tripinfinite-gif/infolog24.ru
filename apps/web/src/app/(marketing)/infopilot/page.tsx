import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  History,
  MapPin,
  Mic,
  PhoneCall,
  Scale,
  Shield,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";

import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  infopilotScenarios,
  infopilotTechFeatures,
} from "@/content/infopilot-scenarios";

export const metadata: Metadata = {
  title: "ИнфоПилот — ИИ-диспетчер на трассе 24/7 | Инфологистик-24",
  description:
    "ИнфоПилот — ИИ-диспетчер для водителей грузовиков: эвакуация, диагностика, ремонт, мойки, страхование и обжалование штрафов. 6 сценариев, 23 города, бесплатно для подписчиков пакетов.",
  keywords: [
    "ИнфоПилот",
    "ИИ диспетчер грузовик",
    "SOS для водителя",
    "эвакуатор грузовика 24/7",
    "помощь водителю на трассе",
  ],
  openGraph: {
    title: "ИнфоПилот — ИИ-диспетчер на трассе 24/7",
    description:
      "Эвакуация, ремонт, мойки, страхование и обжалование штрафов — в одном чате. ИИ-агент сам звонит партнёрам и фиксирует цену.",
    type: "website",
    url: "https://inlog24.ru/infopilot",
    siteName: "Инфологистик-24",
  },
  alternates: {
    canonical: "https://inlog24.ru/infopilot",
  },
};

const scenarioIcons: Record<string, typeof Truck> = {
  Truck,
  ClipboardCheck,
  Wrench,
  Droplets,
  Shield,
  Scale,
};

const techIcons: Record<string, typeof Mic> = {
  Mic,
  PhoneCall,
  MapPin,
  History,
};

const howItWorksSteps = [
  {
    title: "Водитель пишет в Telegram",
    description:
      "«Встал на М-4, сломался ТНВД, координаты вот такие» — голосом или текстом, на русском.",
  },
  {
    title: "ИИ находит партнёра",
    description:
      "Анализирует тип проблемы, геолокацию и рейтинг СТО в базе — выбирает ближайшую подходящую.",
  },
  {
    title: "Робот созванивается с СТО",
    description:
      "VoIP-агент звонит в мастерскую, согласует цену, время и наличие запчасти. Пишет подтверждение.",
  },
  {
    title: "Отчёт водителю в чат",
    description:
      "«Мастерская N, цена 14 500 ₽, время 2 часа, адрес такой-то» — одним сообщением. Плюс карточка в ЛК.",
  },
];

const pricingTiers = [
  {
    name: "В составе пакета",
    price: "Бесплатно",
    sub: "для подписчиков «Пропуск+» и «Транзит Москва»",
    features: [
      "Все 6 сценариев без ограничений",
      "Безлимитный SOS-доступ (в «Транзит Москва»)",
      "История инцидентов в ЛК",
      "Цены партнёров — без наценок",
    ],
    highlight: true,
  },
  {
    name: "Pay-as-you-go",
    price: "0 ₽",
    sub: "подписка + 290 ₽ за вызов + цена партнёра",
    features: [
      "Платите только за сами вызовы",
      "Все 6 сценариев доступны",
      "Фиксированная комиссия за звонок",
      "Подходит частникам с редкими рейсами",
    ],
    highlight: false,
  },
  {
    name: "SOS-подписка",
    price: "990 ₽/мес",
    sub: "за одно ТС, безлимитные вызовы",
    features: [
      "Безлимитные вызовы по всем сценариям",
      "Приоритетная обработка",
      "Цена партнёра — без комиссий сверху",
      "Подходит для 1–4 активных машин",
    ],
    highlight: false,
  },
];

const hubFaq = [
  {
    question: "Что такое ИнфоПилот простыми словами?",
    answer:
      "Это Telegram-бот с ИИ, который заменяет диспетчера в голове у водителя. Вместо того чтобы самому искать эвакуатор, СТО или мойку, водитель пишет в бота — и тот сам находит проверенного партнёра, договаривается о цене и времени, а потом присылает карточку с адресом и ценой.",
  },
  {
    question: "Чем он отличается от обычного поиска в Яндекс.Картах?",
    answer:
      "Карта показывает все подряд — и хорошие, и плохие СТО. ИнфоПилот работает только с проверенными партнёрами, у которых зафиксирована цена договором. Плюс ИИ сам звонит подрядчику и уточняет цену до вашего подтверждения — вы узнаёте финальную сумму заранее.",
  },
  {
    question: "Нужно ли устанавливать приложение?",
    answer:
      "Нет, всё работает в Telegram. Водителю достаточно открыть бота @infolog24_bot, нажать «старт», привязать ТС и госномер. Можно отправлять голосовые — SpeechKit их распознаёт.",
  },
  {
    question: "Что если в моём городе нет партнёров?",
    answer:
      "Мы добавляем города каждый месяц — сейчас их 23. Если конкретно в вашей точке нет партнёра, ИИ подберёт ближайшего с указанием расстояния. Можно также предложить своего проверенного подрядчика — мы его проверим и добавим в базу.",
  },
  {
    question: "Как оплачиваются услуги партнёров?",
    answer:
      "Цена партнёра фиксируется до вызова. Оплата — напрямую партнёру по безналу или наличке на месте. Для клиентов пакетов работает единый счёт: все вызовы ИнфоПилота за месяц — одной строкой в отчёте.",
  },
];

export default function InfopilotHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "ИнфоПилот", href: "/infopilot" },
        ]}
      />
      <FaqJsonLd items={hubFaq} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Bot className="mr-1.5 size-3.5" />
            ИИ-диспетчер для грузовиков
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            ИнфоПилот — ИИ-диспетчер на трассе 24/7
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Водитель в два часа ночи на М-5 с поломкой тормозов. Он не знает,
            где ближайший эвакуатор, кто чинит по-честному и как вернуть груз к
            утру. Он открывает Telegram, говорит в бота — и через 10 минут у
            него адрес проверенного партнёра, цена договором и время прибытия.
            Это ИнфоПилот.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://t.me/infolog24_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Открыть в Telegram
            </a>
            <Link
              href="#scenarios"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Посмотреть 6 сценариев
            </Link>
          </div>
        </div>
      </section>

      {/* 6 scenarios grid */}
      <section id="scenarios" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              6 сценариев — одна точка входа
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Всё, что может случиться с грузовиком на трассе — закрывается
              одним чатом в Telegram
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infopilotScenarios.map((scenario) => {
              const Icon = scenarioIcons[scenario.iconName] ?? Sparkles;
              return (
                <Link
                  key={scenario.id}
                  href={`/infopilot/${scenario.slug}`}
                  className="group block"
                >
                  <Card className="h-full rounded-2xl border-0 bg-card shadow-sm transition-shadow group-hover:shadow-md">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">
                        {scenario.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {scenario.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-accent">
                        {scenario.monetizationHint}
                      </p>
                      <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                        Подробнее
                        <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech features */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Что внутри технологически
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Не просто чат-бот — это связка ИИ, VoIP-робота и геобазы
              партнёров
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {infopilotTechFeatures.map((feature) => {
              const Icon = techIcons[feature.iconName] ?? Sparkles;
              return (
                <Card
                  key={feature.title}
                  className="rounded-2xl border-0 bg-card shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как работает — 4 шага
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {howItWorksSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
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

      {/* Pricing tiers */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как получить доступ
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Три варианта — от бесплатного в составе пакета до SOS-подписки
              для частника
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={
                  tier.highlight
                    ? "rounded-2xl border-2 border-accent bg-card shadow-sm"
                    : "rounded-2xl border-0 bg-card shadow-sm"
                }
              >
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-foreground">
                    {tier.name}
                  </h3>
                  <div className="mt-3 text-2xl font-bold text-primary">
                    {tier.price}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tier.sub}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {tier.features.map((feature) => (
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
              Частые вопросы об ИнфоПилоте
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {hubFaq.map((item) => (
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
            Попробуйте прямо сейчас
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Откройте бота в Telegram — тестовый доступ активируется за минуту.
            Если вы — партнёр (СТО, эвакуатор, мойка), оставьте заявку на
            сотрудничество.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://t.me/infolog24_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Открыть в Telegram
            </a>
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Стать партнёром
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
