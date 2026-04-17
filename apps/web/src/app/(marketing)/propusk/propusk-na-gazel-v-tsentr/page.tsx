import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Phone,
  Shield,
  Truck,
} from "lucide-react";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Пропуск на Газель в центр Москвы — оформление на МКАД, ТТК, СК",
  description:
    "Оформление пропуска на Газель в Москву. Какие Газели требуют пропуск, документы, сроки, штрафы. Помощь в получении пропуска на МКАД, ТТК и Садовое кольцо за 1–3 дня.",
  keywords: [
    "пропуск на газель",
    "пропуск на газель в москву",
    "пропуск газель мкад",
    "пропуск газель ттк",
    "нужен ли пропуск на газель",
    "оформить пропуск на газель",
  ],
  openGraph: {
    title: "Пропуск на Газель в центр Москвы",
    description:
      "Полный гайд по пропускам на Газель: когда нужен, какие документы, как оформить. Помощь в получении за 1–3 дня.",
    type: "website",
    url: "https://inlog24.ru/propusk/propusk-na-gazel-v-tsentr",
    siteName: "Инфолог24",
  },
  alternates: { canonical: "https://inlog24.ru/propusk/propusk-na-gazel-v-tsentr" },
};

const faqItems = [
  {
    question: "Нужен ли пропуск на Газель Next?",
    answer:
      "Да, если полная масса Газель Next превышает 2 500 кг (большинство модификаций — 3 500 кг и выше), для въезда на МКАД с 7:00 до 23:00 требуется пропуск. Исключение — модели до 2 500 кг полной массой.",
  },
  {
    question: "Можно ли ездить на Газели по МКАД ночью без пропуска?",
    answer:
      "Да, с 23:00 до 7:00 для проезда по МКАД пропуск не требуется. Однако для проезда через ТТК и Садовое кольцо пропуск нужен круглосуточно.",
  },
  {
    question: "Какой экологический класс нужен Газели для пропуска?",
    answer:
      "Минимальный требуемый экологический класс — Евро-2. Если в ПТС указан Евро-0 или класс не определён, сначала необходимо повысить экологический класс. Мы помогаем и с этой услугой.",
  },
  {
    question: "Сколько стоит пропуск на Газель?",
    answer:
      "Стоимость зависит от зоны и срока. Годовой пропуск на МКАД — от 12 000 ₽, на ТТК — от 18 000 ₽, на Садовое кольцо — от 25 000 ₽. Временный пропуск на 5 дней — от 3 500 ₽.",
  },
  {
    question: "Как быстро можно получить пропуск?",
    answer:
      "Временный пропуск оформляется за 1 рабочий день. Годовой — за 3–14 рабочих дней в зависимости от зоны. На время оформления годового пропуска мы бесплатно выдаём временный.",
  },
  {
    question: "Что будет, если ездить без пропуска?",
    answer:
      "Штраф — 7 500 ₽ за каждую фиксацию камерой. При повторном нарушении — 10 000 ₽. Камеры фиксируют автоматически, штрафы приходят по почте. За один рейс может прийти несколько штрафов.",
  },
];

export default function PropuskGazelPage() {
  return (
    <>
      <ServiceJsonLd
        name="Пропуск на Газель в Москву"
        description="Оформление пропуска на Газель для проезда по МКАД, ТТК и Садовому кольцу"
        price={3500}
        url="https://inlog24.ru/propusk/propusk-na-gazel-v-tsentr"
      />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Услуги", href: "/services" },
          { name: "Пропуск на Газель", href: "/propusk/propusk-na-gazel-v-tsentr" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
            <Truck className="size-4" />
            Газели от 2 500 кг — пропуск обязателен
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Пропуск на Газель в{" "}
            <span className="text-accent">центр Москвы</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Разбираемся, какие Газели требуют пропуск, какие документы нужны и как избежать
            штрафов до 10 000 ₽ за каждую камеру. Помогаем оформить пропуск на МКАД, ТТК
            и Садовое кольцо за 1–3 дня.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Оформить пропуск
            </Link>
            <a
              href="tel:+74991105549"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-semibold transition-colors hover:bg-muted"
            >
              <Phone className="size-4" />
              8 (499) 110-55-49
            </a>
          </div>
        </div>
      </section>

      {/* Когда Газели нужен пропуск */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Когда Газели нужен пропуск
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Не каждая Газель требует пропуск. Всё зависит от полной массы транспортного средства
            и зоны, в которую вы въезжаете.
          </p>

          <div className="mt-10 space-y-6">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold">МКАД — от 3 500 кг</h3>
                <p className="mt-2 text-muted-foreground">
                  Пропуск на МКАД нужен грузовым автомобилям <strong>полной массой свыше 3 500 кг</strong> с
                  7:00 до 23:00. Большинство модификаций Газель Next, Газель Бизнес и Газон Next
                  подпадают под это ограничение. ГАЗель с полной массой до 3 500 кг проезжает свободно.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold">ТТК — от 1 000 кг</h3>
                <p className="mt-2 text-muted-foreground">
                  Для проезда внутри ТТК (Третьего транспортного кольца) пропуск нужен транспорту
                  с <strong>разрешённой максимальной массой свыше 1 000 кг</strong>. Это касается
                  абсолютно всех модификаций Газели — включая малотоннажные.
                  Ограничение действует <strong>круглосуточно</strong>.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold">Садовое кольцо — от 1 000 кг</h3>
                <p className="mt-2 text-muted-foreground">
                  Внутри Садового кольца действуют те же правила, что и на ТТК — пропуск обязателен
                  для транспорта <strong>свыше 1 000 кг</strong>. Ограничение круглосуточное. Это самая строгая
                  зона — получить пропуск сложнее, оформление занимает до 14 дней.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Штрафы */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Штрафы за проезд без пропуска
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { value: "7 500 ₽", label: "первое нарушение", desc: "за каждую фиксацию камерой" },
              { value: "10 000 ₽", label: "повторное нарушение", desc: "скидка 25% при оплате за 20 дней" },
              { value: "5–15", label: "камер за один рейс", desc: "штрафы суммируются" },
            ].map((item) => (
              <Card key={item.label} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-destructive/10">
                    <AlertTriangle className="size-6 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="mt-1 font-medium">{item.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6 rounded-2xl border-destructive/20 bg-destructive/5 shadow-sm">
            <CardContent className="flex items-start gap-4 p-6">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <p className="text-muted-foreground">
                <strong>Важно:</strong> камеры на МКАД фиксируют нарушение автоматически.
                За один рейс из области в центр Москвы и обратно можно получить 5–15 штрафов
                общей суммой <strong>до 150 000 ₽</strong>. Стоимость годового пропуска — от 12 000 ₽.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Документы */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Какие документы нужны
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Для физических лиц</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  {[
                    "ПТС (паспорт транспортного средства)",
                    "СТС (свидетельство о регистрации)",
                    "Диагностическая карта",
                    "Водительское удостоверение",
                    "Паспорт собственника",
                  ].map((doc) => (
                    <li key={doc} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Для ИП и юридических лиц</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  {[
                    "ПТС и СТС",
                    "Диагностическая карта",
                    "Водительское удостоверение",
                    "Карточка организации",
                    "Договор лизинга (при наличии)",
                    "Выписка ЕГРЮЛ / ЕГРИП",
                  ].map((doc) => (
                    <li key={doc} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="flex items-start gap-4 p-6">
              <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-muted-foreground">
                <strong>Экологический класс:</strong> для получения пропуска Газель должна иметь
                экологический класс не ниже Евро-2. Если в ПТС указан Евро-0 или класс
                не определён — мы поможем{" "}
                <Link href="/eco" className="font-medium text-primary underline underline-offset-4">
                  повысить экологический класс
                </Link>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Как мы помогаем */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Как мы оформляем пропуск
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                step: 1,
                icon: Phone,
                title: "Бесплатная консультация",
                desc: "Вы звоните или пишете в чат — мы определяем, какой пропуск нужен вашей Газели, рассчитываем стоимость.",
                time: "5 минут",
              },
              {
                step: 2,
                icon: FileText,
                title: "Подготовка документов",
                desc: "Присылаете копии документов в любом удобном формате. Мы проверяем комплектность и корректность.",
                time: "1 день",
              },
              {
                step: 3,
                icon: Clock,
                title: "Подача и получение",
                desc: "Подаём заявление на портал. На время оформления годового пропуска выдаём бесплатный временный.",
                time: "1–14 дней",
              },
              {
                step: 4,
                icon: Shield,
                title: "Гарантия результата",
                desc: "Если пропуск не одобрен — повторная подача бесплатно. При отказе по нашей вине — возврат 100%.",
                time: "",
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="size-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {s.step}. {s.title}
                    </h3>
                    {s.time && (
                      <Badge variant="outline" className="text-xs">
                        {s.time}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-primary px-4 py-12 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {[
            { value: "С 2016", label: "на рынке" },
            { value: "30 000+", label: "пропусков оформлено" },
            { value: "1–3 дня", label: "среднее время" },
            { value: "100%", label: "гарантия результата" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Частые вопросы
          </h2>
          <div className="mt-8 space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-2xl bg-card p-5 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                  {item.question}
                  <Shield className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Оформите пропуск на Газель сегодня
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Рассчитаем стоимость, подготовим документы и подадим заявление. Временный пропуск —
            в день обращения.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Оставить заявку
              <ArrowRight className="size-4" />
            </Link>
            <OpenChatTrigger className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-8 text-base font-semibold transition-colors hover:bg-white/10">
              Задать вопрос в чате
            </OpenChatTrigger>
          </div>
        </div>
      </section>
    </>
  );
}
