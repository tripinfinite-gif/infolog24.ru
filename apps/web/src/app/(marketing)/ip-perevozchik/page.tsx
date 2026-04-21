import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  CheckCircle2,
  CreditCard,
  FileQuestion,
  Headphones,
  MessageCircle,
  Phone,
  Shield,
  ShieldCheck,
  Truck,
  Wallet,
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
  title: "Пропуск на МКАД для ИП и частных перевозчиков — от 12 000 ₽",
  description:
    "Помощь в оформлении пропуска на МКАД, ТТК и Садовое кольцо для ИП и частных перевозчиков. Единая цена 12 000 ₽, гарантия возврата денег, помощь с документами.",
  keywords: [
    "пропуск на МКАД для ИП",
    "пропуск для частного перевозчика",
    "пропуск на грузовик в Москву",
    "оформить пропуск МКАД цена",
    "пропуск на МКАД от 12000",
    "пропуск для грузовика ИП",
    "пропуск ТТК для ИП",
  ],
  openGraph: {
    title: "Пропуск на МКАД для ИП и частных перевозчиков — от 12 000 ₽",
    description:
      "Фиксированная цена, гарантия возврата денег, помощь с документами. Регламент Дептранса — до 10 рабочих дней.",
    type: "website",
    url: absoluteUrl("/ip-perevozchik"),
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: absoluteUrl("/ip-perevozchik"),
  },
};

const problems = [
  {
    icon: AlertTriangle,
    title: "Штраф 7 500 ₽ с каждой камеры",
    description:
      "За один рейс по Москве без пропуска камеры могут зафиксировать десятки нарушений. Итого — до 180 000 ₽ за один день работы.",
  },
  {
    icon: Ban,
    title: "Страх кидалова",
    description:
      "Рынок полон «посредников», которые берут предоплату и исчезают. Или оформляют фиктивный пропуск, который не проходит проверку камерами.",
  },
  {
    icon: FileQuestion,
    title: "Сложные документы",
    description:
      "Какие документы нужны? Где взять маршрут? Как заполнить заявку? Для ИП без юриста разобраться в требованиях — отдельная головная боль.",
  },
  {
    icon: CreditCard,
    title: "Непонятная цена",
    description:
      "Одни называют 5 000 ₽, другие — 30 000 ₽. Без опыта невозможно понять, сколько стоит пропуск на самом деле и за что вы платите.",
  },
];

const solutions = [
  {
    icon: Wallet,
    title: "Фиксированная цена от 12 000 ₽",
    description:
      "Никаких скрытых платежей. Вы знаете стоимость до начала работы. Цена зависит только от зоны: МКАД, ТТК или Садовое кольцо.",
  },
  {
    icon: ShieldCheck,
    title: "Гарантия возврата денег",
    description:
      "Если пропуск не оформлен по нашей вине — возвращаем 100% оплаты. Договор, чек, акт — всё официально.",
  },
  {
    icon: FileQuestion,
    title: "Помощь с документами",
    description:
      "Не знаете, какие документы нужны? Менеджер проверит, подскажет и поможет собрать полный пакет. Даже если вы делаете это впервые.",
  },
  {
    icon: Shield,
    title: "Официальное оформление",
    description:
      "Работаем только через Департамент транспорта Москвы. Пропуск проходит проверку камерами — штрафов не будет.",
  },
];

const faqItems = [
  {
    question: "Сколько стоит пропуск на МКАД для ИП?",
    answer:
      "Стоимость пропуска на МКАД для ИП — от 12 000 ₽. Точная цена зависит от зоны (МКАД, ТТК, Садовое кольцо), срока действия и характеристик ТС. Мы называем окончательную цену до начала работы — без скрытых доплат.",
  },
  {
    question: "Какие документы нужны ИП для пропуска?",
    answer:
      "Свидетельство ИП (ОГРНИП), паспорт, свидетельство о регистрации ТС, ПТС, полис ОСАГО. Если ТС арендованное — договор аренды. Менеджер проверит ваши документы бесплатно и подскажет, если чего-то не хватает.",
  },
  {
    question: "Как быстро будет готов пропуск?",
    answer:
      "Регламентный срок Дептранса Москвы — до 10 рабочих дней с момента подачи полного пакета документов. На время ожидания годового пропуска мы бесплатно помогаем с временным, чтобы вы не простаивали.",
  },
  {
    question: "А если пропуск не одобрят?",
    answer:
      "Процент одобрения у нас — 98%. Если заявку отклонят, мы разберёмся в причинах, исправим и подадим повторно за свой счёт. Если пропуск не получен по нашей вине — вернём деньги.",
  },
  {
    question: "Вы точно не мошенники?",
    answer:
      "Мы работаем с 2016 года, ООО «Инфолог24» — зарегистрированное юрлицо с ИНН и ОГРН. Оформляем договор, выдаём чеки и акты. 50 000+ пропусков за 10 лет, отзывы реальных клиентов на сайте.",
  },
];

export default function IpPerevozchikPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Услуги", href: "/services" },
          { name: "Для ИП и частных перевозчиков", href: "/ip-perevozchik" },
        ]}
      />
      <ServiceJsonLd
        name="Пропуск на МКАД для ИП и частных перевозчиков"
        description="Помощь в оформлении пропуска на МКАД, ТТК и Садовое кольцо для ИП. Единая цена 12 000 ₽, гарантия возврата денег."
        price={12000}
        priceUnit="за одно ТС"
        url="/ip-perevozchik"
      />
      <FaqJsonLd items={faqItems} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Truck className="mr-1.5 size-3.5" />
            Для ИП и частных перевозчиков
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Берите заказы в центр Москвы —{" "}
            <span className="text-accent">без риска штрафов.</span>{" "}
            Регламент — до 10 рабочих дней
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Фиксированная цена от 12 000 ₽. Гарантия возврата денег, если пропуск
            не оформлен. Помогаем собрать документы, даже если вы делаете это впервые.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SegmentCtaButton
              segmentSlug="ip_perevozchik"
              segmentName="ИП/частные перевозчики (1-3 машины)"
              label="Оформить пропуск от 12 000 ₽"
              className="h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
            />
            <OpenChatTrigger className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted">
              <MessageCircle className="size-4" />
              Спросить ИнфоПилота
            </OpenChatTrigger>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Почему ездить без пропуска — дорого и опасно
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Один рейс без пропуска может стоить дороже, чем оформление на год.
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
              Что вы получаете
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Прозрачные условия, реальные гарантии, живая поддержка.
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
              Простая и понятная цена
            </h2>
          </div>
          <Card className="mt-10 rounded-3xl border-2 border-accent bg-card shadow-lg">
            <CardContent className="p-6 sm:p-10">
              <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                <div className="flex-1">
                  <Badge className="mb-4 bg-accent text-accent-foreground">
                    Для 1–3 машин
                  </Badge>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    Пропуск+
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Всё, что нужно частному перевозчику: пропуск, помощь с документами,
                    контроль статуса, напоминание о продлении.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      "Пропуск на МКАД, ТТК или Садовое",
                      "Проверка и сбор документов",
                      "Отслеживание статуса заявки",
                      "Напоминание о продлении",
                      "Гарантия возврата денег",
                      "Поддержка по телефону и в чате",
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
                      от 12 000 ₽
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      за одно ТС
                    </p>
                    <p className="mt-1 text-xs font-semibold text-accent">
                      Гарантия возврата при отказе
                    </p>
                  </div>
                  <SegmentCtaButton
                    segmentSlug="ip_perevozchik"
                    segmentName="ИП/частные перевозчики (1-3 машины)"
                    label="Оформить пропуск"
                    className="mt-4 h-12 w-full rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
                  />
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
              Отзывы перевозчиков
            </h2>
          </div>
          <Card className="mt-10 rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="p-6 sm:p-10">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  В
                </div>
                <div>
                  <p className="text-base leading-relaxed text-foreground italic">
                    &laquo;Раньше боялся ездить за ТТК. Теперь спокоен — пропуск всегда
                    актуальный. Оформили за 3 дня, цену назвали сразу, никаких доплат.
                    Уже порекомендовал двоим знакомым.&raquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Василий, ИП
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Перевозки продуктов, 2 грузовика
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {[
              { value: "12 000 ₽", label: "от — за пропуск" },
              { value: "10 дней", label: "регламент Дептранса" },
              { value: "98%", label: "одобрение заявок" },
              { value: "100%", label: "возврат при отказе" },
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
            Каждый день без пропуска — штрафы и простой
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Один рейс без пропуска может стоить дороже, чем оформление на год.
            Оформите пропуск сейчас — работайте спокойно.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SegmentCtaButton
              segmentSlug="ip_perevozchik"
              segmentName="ИП/частные перевозчики (1-3 машины)"
              label="Оформить пропуск от 12 000 ₽"
              className="h-12 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
            />
            <a
              href="tel:+74991105549"
              className="flex items-center gap-2 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-80"
            >
              <Phone className="size-5" />
              +7 (499) 110-55-49
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
