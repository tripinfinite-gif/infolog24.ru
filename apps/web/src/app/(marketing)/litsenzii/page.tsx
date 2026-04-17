import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Globe,
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
  title: "Лицензия на международные перевозки + карта МАП — оформление за 30 дней",
  description:
    "Оформление лицензии на международные автомобильные перевозки и карты допуска МАП. Полный комплекс: от консультации до получения. Сроки, документы, стоимость.",
  keywords: [
    "лицензия на международные перевозки",
    "карта мап",
    "допуск к международным перевозкам",
    "лицензия на перевозки грузов",
    "международная транспортная лицензия",
    "оформить лицензию на перевозки",
  ],
  openGraph: {
    title: "Лицензия на международные перевозки",
    description:
      "Оформление лицензии и карты МАП за 30 дней. Полное сопровождение от подачи до получения.",
    type: "website",
    url: "https://inlog24.ru/litsenzii",
    siteName: "Инфолог24",
  },
  alternates: { canonical: "https://inlog24.ru/litsenzii" },
};

const faqItems = [
  {
    question: "Кому нужна лицензия на международные перевозки?",
    answer:
      "Юридическим лицам и индивидуальным предпринимателям, которые осуществляют коммерческие или некоммерческие перевозки грузов или пассажиров за пределами Российской Федерации автомобильным транспортом.",
  },
  {
    question: "Что такое карта допуска МАП?",
    answer:
      "МАП (международные автомобильные перевозки) — удостоверение допуска к международным автомобильным перевозкам. Выдаётся Федеральной службой по надзору в сфере транспорта (Ространснадзор) на каждое транспортное средство. Без неё нельзя пересечь границу с грузом.",
  },
  {
    question: "Сколько действует лицензия?",
    answer:
      "Лицензия на международные перевозки бессрочная. Однако карта допуска МАП выдаётся на срок от 1 года до 5 лет и требует периодического продления.",
  },
  {
    question: "Можно ли оформить лицензию на одно ТС?",
    answer:
      "Лицензия оформляется на компанию (ИП или юрлицо), а не на конкретный автомобиль. Но карта допуска МАП выдаётся отдельно на каждое транспортное средство, которое будет использоваться для международных перевозок.",
  },
  {
    question: "Какие штрафы за работу без лицензии?",
    answer:
      "Перевозка грузов без лицензии — штраф от 50 000 до 400 000 ₽ для юридических лиц (ст. 14.1.2 КоАП). Плюс задержание транспортного средства на границе и отказ в пропуске через таможню.",
  },
  {
    question: "Сколько стоит оформление?",
    answer:
      "Стоимость зависит от объёма работ: подготовка документов, подача заявления, сопровождение проверок. Ориентировочно — от 50 000 ₽ за полный комплекс услуг (лицензия + карта МАП на одно ТС). Точную стоимость рассчитаем после консультации.",
  },
];

export default function LitsenziiPage() {
  return (
    <>
      <ServiceJsonLd
        name="Лицензия на международные перевозки"
        description="Оформление лицензии на международные автомобильные перевозки и карты допуска МАП"
        price={50000}
        url="https://inlog24.ru/litsenzii"
      />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Лицензии на международные перевозки", href: "/litsenzii" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
            <Globe className="size-4" />
            Допуск к международным перевозкам
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Лицензия на международные перевозки{" "}
            <span className="text-accent">+ карта МАП</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Оформляем лицензию Ространснадзора и карту допуска МАП на каждое транспортное
            средство. Полное сопровождение — от сбора документов до получения. Срок — 30 дней.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+74991105549"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Phone className="size-4" />
              Бесплатная консультация
            </a>
            <Link
              href="#uslugi"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold transition-colors hover:bg-muted"
            >
              Что входит в услугу
            </Link>
          </div>
        </div>
      </section>

      {/* Что такое */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Что такое лицензия на международные перевозки
          </h2>
          <div className="mt-6 space-y-4 text-lg text-muted-foreground">
            <p>
              <strong>Международная транспортная лицензия</strong> — специальное разрешение
              (допуск) на осуществление международных автомобильных перевозок грузов и пассажиров.
              Выдаётся Ространснадзором юридическим лицам и индивидуальным предпринимателям.
            </p>
            <p>
              <strong>Карта допуска МАП</strong> — удостоверение, подтверждающее допуск
              конкретного транспортного средства к международным перевозкам. Оформляется
              на каждую единицу транспорта отдельно.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Лицензия</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                    Оформляется на компанию (ИП/юрлицо)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                    Бессрочная
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                    Одна на весь автопарк
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Truck className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Карта МАП</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                    Оформляется на каждое ТС
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                    Срок 1–5 лет (с продлением)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                    Обязательна для пересечения границы
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Что входит в услугу */}
      <section id="uslugi" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Что входит в услугу
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                step: 1,
                icon: Phone,
                title: "Бесплатная консультация эксперта",
                desc: "Оценим готовность вашей компании и автопарка. Определим, какие документы нужны и сколько времени займёт процесс.",
                time: "1 день",
              },
              {
                step: 2,
                icon: FileText,
                title: "Сбор и проверка документов",
                desc: "Готовим полный пакет документов: учредительные, транспортные, квалификационные. Проверяем на соответствие требованиям Ространснадзора.",
                time: "3–5 дней",
              },
              {
                step: 3,
                icon: Globe,
                title: "Подача заявления в Ространснадзор",
                desc: "Подаём заявление в Федеральную службу по надзору в сфере транспорта от вашего имени по доверенности.",
                time: "1 день",
              },
              {
                step: 4,
                icon: Shield,
                title: "Сопровождение проверок",
                desc: "Ространснадзор проводит проверку заявителя. Мы контролируем процесс, оперативно устраняем замечания проверяющих экспертов.",
                time: "15–20 дней",
              },
              {
                step: 5,
                icon: CheckCircle,
                title: "Получение лицензии и карты МАП",
                desc: "Получаем готовые документы и передаём вам. Можно начинать международные перевозки.",
                time: "1 день",
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
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 size-3" />
                      {s.time}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Документы */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Необходимые документы
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold">На компанию</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  {[
                    "Выписка из ЕГРЮЛ / ЕГРИП",
                    "Устав (для юрлиц)",
                    "ИНН, ОГРН",
                    "Доверенность на представителя",
                    "Квалификационные документы ответственного за перевозки",
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
                <h3 className="text-lg font-semibold">На транспортное средство</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  {[
                    "ПТС (паспорт транспортного средства)",
                    "СТС (свидетельство о регистрации)",
                    "Диагностическая карта (техосмотр)",
                    "Полис ОСАГО",
                    "Договор лизинга (при наличии)",
                    "Тахограф с СКЗИ (для грузовиков свыше 3,5 т)",
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
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-primary px-4 py-12 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {[
            { value: "С 2016", label: "на рынке" },
            { value: "30 дней", label: "средний срок" },
            { value: "100%", label: "документов с первого раза" },
            { value: "24/7", label: "поддержка клиентов" },
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
            Оформим лицензию и карту МАП за 30 дней
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Полное сопровождение от первой консультации до получения документов.
            Без вашего присутствия в Ространснадзоре.
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
