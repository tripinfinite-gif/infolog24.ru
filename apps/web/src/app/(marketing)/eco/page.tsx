import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  FileSearch,
  FileText,
  Phone,
  Shield,
  Wrench,
} from "lucide-react";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Повышение экологического класса автомобиля — Евро-0 → Евро-2, 3, 4",
  description:
    "Как законно повысить экологический класс грузового автомобиля. Способы, документы, сроки, стоимость. Внесение изменений в ПТС и базу ГИБДД. Нужно для получения пропуска в Москву.",
  keywords: [
    "повышение экологического класса",
    "повысить экокласс автомобиля",
    "евро 0 на евро 2",
    "изменить экологический класс птс",
    "экологический класс для пропуска",
    "подтверждение экологического класса",
  ],
  openGraph: {
    title: "Повышение экологического класса автомобиля",
    description:
      "Законные способы повысить экокласс с Евро-0 до Евро-2/3/4. Документы, процедура, сроки.",
    type: "article",
    url: absoluteUrl("/eco"),
    siteName: "Инфолог24",
  },
  alternates: { canonical: absoluteUrl("/eco") },
};

const faqItems = [
  {
    question: "Зачем повышать экологический класс?",
    answer:
      "Для получения пропуска на въезд грузового транспорта в Москву (МКАД, ТТК, СК) автомобиль должен иметь экологический класс не ниже Евро-2. Если в ПТС указан Евро-0 или класс не определён — пропуск не выдадут.",
  },
  {
    question: "Что значит «экологический класс не определён» в ПТС?",
    answer:
      "Если автомобиль зарегистрирован до 2010 года, в ПТС может быть пустая графа или прочерк в поле экологического класса. В этом случае автомобиль приравнивается к Евро-0 и требует подтверждения или повышения класса.",
  },
  {
    question: "Можно ли повысить экокласс без переоборудования двигателя?",
    answer:
      "Да. Если автомобиль фактически соответствует более высокому классу (по году выпуска и модели двигателя), достаточно провести экспертизу и получить заключение — установка дополнительного оборудования не требуется. Это самый быстрый и дешёвый способ.",
  },
  {
    question: "Сколько стоит повышение экологического класса?",
    answer:
      "Стоимость зависит от способа. Подтверждение (без переоборудования) — от 15 000 ₽. С установкой нейтрализатора — от 40 000 ₽. Точную стоимость рассчитаем после анализа вашего ПТС.",
  },
  {
    question: "Сколько времени занимает процедура?",
    answer:
      "Подтверждение класса (экспертиза) — 3–7 рабочих дней. Переоборудование с внесением изменений в ПТС — 10–20 рабочих дней. Всё зависит от загруженности ГИБДД и лаборатории.",
  },
  {
    question: "Какие автомобили подходят для подтверждения класса?",
    answer:
      "Импортные автомобили с 1998 года выпуска и отечественные с 2000 года. Если модель двигателя серийно выпускалась с соблюдением норм Евро-2 или выше — подтверждение возможно без переоборудования.",
  },
];

export default function EcoPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Повышение экологического класса автомобиля: способы, документы, сроки"
        description="Как законно повысить экологический класс грузового автомобиля для получения пропуска в Москву"
        datePublished="2024-01-15"
        url={absoluteUrl("/eco")}
      />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Повышение экокласса", href: "/eco" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
            <Shield className="size-4" />
            Без Евро-2 пропуск в Москву не получить
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Повышение экологического класса{" "}
            <span className="text-accent">автомобиля</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Как законно изменить экокласс с Евро-0 на Евро-2, 3 или 4.
            Три способа, документы, сроки и подводные камни. Разбираемся, когда достаточно
            экспертизы, а когда нужно переоборудование.
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
              href="#sposoby"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold transition-colors hover:bg-muted"
            >
              Способы повышения
            </Link>
          </div>
        </div>
      </section>

      {/* Зачем нужно */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Зачем повышать экологический класс
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card className="rounded-2xl border-destructive/20 bg-destructive/5 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="size-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">Без экокласса</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>• Отказ в выдаче пропуска на МКАД, ТТК, СК</li>
                  <li>• Штрафы 7 500–10 000 ₽ за каждую камеру</li>
                  <li>• Невозможность работать в Москве легально</li>
                  <li>• Ограничение при продаже автомобиля</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <CheckCircle className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">С Евро-2 и выше</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>• Можно получить пропуск на любую зону Москвы</li>
                  <li>• Легальная работа без штрафов</li>
                  <li>• Новые данные в ПТС и СТС</li>
                  <li>• Повышение стоимости при продаже</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3 способа */}
      <section id="sposoby" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Три законных способа повысить экокласс
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Выбор способа зависит от года выпуска, модели двигателя и текущего класса в ПТС.
          </p>

          <div className="mt-10 space-y-8">
            {/* Способ 1 */}
            <Card className="rounded-2xl border-primary/20 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <FileSearch className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">
                        1. Подтверждение класса (экспертиза)
                      </h3>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        Самый быстрый
                      </Badge>
                    </div>
                    <p className="mt-3 text-muted-foreground">
                      Если автомобиль <strong>фактически соответствует</strong> более высокому
                      классу по году выпуска и модели двигателя, аккредитованная лаборатория
                      проводит экспертизу и выдаёт заключение. Никакого переоборудования не нужно.
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Срок</p>
                        <p className="font-semibold">3–7 дней</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Стоимость</p>
                        <p className="font-semibold">от 15 000 ₽</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Подходит для</p>
                        <p className="font-semibold">импорт с 1998 г.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Способ 2 */}
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Wrench className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      2. Установка каталитического нейтрализатора
                    </h3>
                    <p className="mt-3 text-muted-foreground">
                      Если двигатель конструктивно не соответствует Евро-2, устанавливается
                      каталитический нейтрализатор (катализатор). После установки — повторная
                      экспертиза в лаборатории, затем внесение изменений в ПТС через ГИБДД.
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Срок</p>
                        <p className="font-semibold">10–20 дней</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Стоимость</p>
                        <p className="font-semibold">от 40 000 ₽</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Подходит для</p>
                        <p className="font-semibold">старые ТС</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Способ 3 */}
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      3. Замена двигателя на более экологичный
                    </h3>
                    <p className="mt-3 text-muted-foreground">
                      Радикальный вариант — замена двигателя на модель, сертифицированную
                      под Евро-3 или Евро-4. Требует согласования с ГИБДД, экспертизы
                      до и после установки, регистрации изменений конструкции.
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Срок</p>
                        <p className="font-semibold">20–40 дней</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Стоимость</p>
                        <p className="font-semibold">от 100 000 ₽</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3 text-center">
                        <p className="text-sm text-muted-foreground">Подходит для</p>
                        <p className="font-semibold">ТС до 1998 г.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Процедура */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Как проходит процедура
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                step: 1,
                icon: Phone,
                title: "Анализ ПТС",
                desc: "Присылаете фото ПТС — мы определяем, какой способ повышения подходит вашему автомобилю.",
              },
              {
                step: 2,
                icon: FileSearch,
                title: "Экспертиза в лаборатории",
                desc: "Аккредитованная лаборатория проводит исследование и выдаёт заключение о соответствии экологическому классу.",
              },
              {
                step: 3,
                icon: FileText,
                title: "Внесение изменений в ГИБДД",
                desc: "На основании заключения вносим изменения в базу ГИБДД. Вы получаете новые ПТС и СТС с корректным экоклассом.",
              },
              {
                step: 4,
                icon: CheckCircle,
                title: "Оформление пропуска",
                desc: "Теперь можно подавать заявление на пропуск в Москву. Мы поможем и с этим — от подачи до получения.",
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {s.step}. {s.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
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
            Поможем повысить экокласс и оформить пропуск
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Пришлите фото ПТС — определим способ, рассчитаем стоимость и сроки.
            Консультация бесплатная.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Отправить ПТС на анализ
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
