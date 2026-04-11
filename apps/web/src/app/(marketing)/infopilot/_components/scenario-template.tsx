import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface ScenarioStep {
  title: string;
  description: string;
}

export interface ScenarioAdvantage {
  title: string;
  description: string;
}

export interface ScenarioFaqItem {
  question: string;
  answer: string;
}

export interface ScenarioSibling {
  href: string;
  label: string;
}

export interface ScenarioTemplateProps {
  icon: LucideIcon;
  title: string;
  promise: string;
  story: string;
  steps: ScenarioStep[];
  advantages: ScenarioAdvantage[];
  citiesNote?: string;
  faq: ScenarioFaqItem[];
  sibling: ScenarioSibling;
}

const defaultCities = [
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Екатеринбург",
  "Новосибирск",
  "Нижний Новгород",
  "Краснодар",
  "Ростов-на-Дону",
  "Воронеж",
  "Самара",
  "Уфа",
  "Челябинск",
  "Пермь",
  "Волгоград",
  "Саратов",
  "Тольятти",
  "Ижевск",
  "Ярославль",
  "Тула",
  "Рязань",
  "Липецк",
  "Киров",
  "Тверь",
];

export function ScenarioTemplate({
  icon: Icon,
  title,
  promise,
  story,
  steps,
  advantages,
  citiesNote,
  faq,
  sibling,
}: ScenarioTemplateProps) {
  return (
    <>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            ИнфоПилот · Сценарий
          </Badge>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="size-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold text-primary">
            {promise}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {story}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <OpenChatTrigger className="inline-flex h-12 w-auto items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90">
              <span className="inline-flex items-center gap-2">
                <Bot className="size-4" />
                Открыть AI-ассистента
              </span>
            </OpenChatTrigger>
            <Link
              href="/infopilot"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Все сценарии ИнфоПилота
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как это работает
            </h2>
            <p className="mt-4 text-muted-foreground">
              От сообщения водителя до решённой проблемы
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {steps.map((step, index) => (
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

      {/* Advantages */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Почему партнёр через ИнфоПилота лучше, чем гугл
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Мы проверяем партнёров и фиксируем цены договором — никаких
              «разводов на трассе»
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {advantages.map((adv) => (
              <Card
                key={adv.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {adv.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {adv.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Geography */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Уже работаем в 23 городах РФ
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {citiesNote ??
              "Сеть партнёров покрывает ключевые логистические узлы — от Москвы до Новосибирска. Добавляем новые города каждый месяц."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {defaultCities.map((city) => (
              <Badge
                key={city}
                variant="outline"
                className="rounded-full border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
              >
                {city}
              </Badge>
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

      {/* Sibling link */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href={sibling.href}
            className="block rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Соседний сценарий ИнфоПилота
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {sibling.label}
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-primary" />
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
            Попробовать ИнфоПилота
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
            Бесплатно для подписчиков пакетов «Пропуск+» и «Транзит Москва».
            Для всех остальных — pay-as-you-go или SOS-подписка 990 ₽/мес.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <OpenChatTrigger className="inline-flex h-12 w-auto items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90">
              <span className="inline-flex items-center gap-2">
                <Bot className="size-4" />
                Открыть AI-ассистента
              </span>
            </OpenChatTrigger>
            <Link
              href="/resheniya"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Посмотреть пакеты
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
