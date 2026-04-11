import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Radar,
} from "lucide-react";

import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title:
    "РНИС — подключение региональной навигации для перевозчиков | Инфологистик-24",
  description:
    "РНИС обязательна для перевозок по регионам РФ. Поможем подключить трекер через партнёра-оператора по себестоимости. От 350 ₽/мес за ТС. Без РНИС — штрафы и запрет на пропуска.",
  keywords: [
    "РНИС",
    "подключение РНИС",
    "региональная навигационная система",
    "трекер для РНИС",
    "РНИС для перевозчика",
  ],
  openGraph: {
    title: "РНИС — подключение для перевозчика",
    description:
      "Подключим РНИС через партнёра-оператора по себестоимости. От 350 ₽/мес за ТС.",
    type: "website",
    url: "https://inlog24.ru/regulatorika/rnis",
    siteName: "Инфологистик-24",
  },
  alternates: {
    canonical: "https://inlog24.ru/regulatorika/rnis",
  },
};

const faq = [
  {
    question: "Что такое РНИС?",
    answer:
      "Региональная навигационная информационная система — государственная система сбора данных о движении коммерческого транспорта по территории субъектов РФ. Каждое ТС должно передавать координаты через сертифицированный трекер в региональный центр РНИС.",
  },
  {
    question: "Кому обязательна РНИС?",
    answer:
      "Всем перевозчикам, выполняющим коммерческие рейсы по территории регионов РФ: доставка товаров, строительные перевозки, пассажирские перевозки, рейсы по договорам с госзаказчиком. Фактически — все коммерческие грузовики массой от 3,5 т.",
  },
  {
    question: "Что грозит без подключения к РНИС?",
    answer:
      "Штрафы за эксплуатацию ТС без подключения, отказ в выдаче пропусков в Москву (на МКАД пропуск с 2024 выдаётся только при подключении к РНИС), проблемы с прохождением контроля на трассе. Для госзаказчиков — отказ в допуске к тендерам.",
  },
  {
    question: "Сколько стоит подключение РНИС?",
    answer:
      "Сам трекер (разовая покупка) — 6 000–12 000 ₽ в зависимости от модели. Месячная абонентская плата оператора РНИС — от 350 до 900 ₽/мес за ТС. Мы не берём комиссию за посредничество — работа с партнёром-оператором по себестоимости.",
  },
  {
    question: "Как быстро подключается РНИС?",
    answer:
      "Установка трекера — 30–60 минут в сервисном центре партнёра. Активация в системе РНИС — 1–2 рабочих дня. После этого ТС готов к передаче данных и может получить пропуск в Москву на МКАД.",
  },
];

export default function RnisPage() {
  return (
    <>
      <ServiceJsonLd
        name="Подключение РНИС"
        description="Помощь с подключением региональной навигационной информационной системы для перевозчиков. Через партнёра-оператора по себестоимости."
        price={350}
        priceUnit="₽/мес за ТС"
        url="/regulatorika/rnis"
      />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Регуляторика", href: "/regulatorika" },
          { name: "РНИС", href: "/regulatorika/rnis" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="destructive" className="mb-6">
            <AlertTriangle className="mr-1.5 size-3.5" />
            Обязательно для пропусков на МКАД
          </Badge>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Radar className="size-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            РНИС — региональная навигация под ключ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Без подключения к РНИС не получить пропуск на МКАД, не выйти на
            госконтракт и легально не возить грузы по регионам. Подключим через
            проверенного партнёра-оператора по себестоимости — без наценок за
            посредничество.
          </p>
          <div className="mt-8 inline-flex flex-col items-center rounded-2xl bg-primary/5 px-8 py-5">
            <span className="text-3xl font-bold text-primary">
              от 350 ₽/мес
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              за ТС, трекер отдельно по себестоимости
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#zayavka"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Подключить РНИС
            </Link>
            <Link
              href="/resheniya/propusk-plus"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              В составе «Пропуск+»
            </Link>
          </div>
        </div>
      </section>

      {/* What is RNIS */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Что такое РНИС простыми словами
            </h2>
          </div>
          <Card className="mt-10 rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="p-6 sm:p-10">
              <p className="text-base leading-relaxed text-foreground">
                Это государственная система, куда каждый коммерческий
                грузовик обязан передавать координаты и параметры движения —
                скорость, направление, пройденный километраж. Данные
                используются для контроля экологических зон, мониторинга
                перевозок по госконтрактам и учёта влияния транспорта на
                дорожную инфраструктуру региона.
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground">
                Технически это работает так: в грузовик устанавливается
                сертифицированный GPS/ГЛОНАСС-трекер. Данные передаются через
                оператора связи в региональный центр РНИС. Оператор
                гарантирует непрерывность передачи и хранение данных в
                соответствии с требованиями.
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground">
                С 2024 года <strong>пропуск на МКАД не выдаётся</strong> без
                подтверждённого подключения к РНИС. С каждым годом требования
                ужесточаются — региональные центры начинают штрафовать за
                пропуски данных, разрывы связи и устаревшие модели трекеров.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How we help */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как мы помогаем
            </h2>
          </div>
          <ul className="mt-10 space-y-4">
            {[
              "Подберём модель трекера, сертифицированного для вашего региона",
              "Установим и активируем в сервисе партнёра — 30–60 минут на машину",
              "Оформим договор с оператором РНИС — работаем с проверенными операторами",
              "Настроим передачу данных и проверим непрерывность",
              "Мониторинг работоспособности — алерты в Telegram при разрывах",
              "Цены — по себестоимости, без комиссии Инфологистик-24",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-card p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-base text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы о РНИС
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
      <section
        id="zayavka"
        className="px-4 pb-20 pt-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Подключить РНИС
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Оставьте заявку — рассчитаем стоимость подключения для вашего
            парка и установим трекеры в ближайшем сервисном центре партнёра.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Оставить заявку
            </Link>
            <Link
              href="/regulatorika/antishraf"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Антиштраф — мониторинг
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
