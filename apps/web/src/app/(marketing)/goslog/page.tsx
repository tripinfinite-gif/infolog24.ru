import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle,
  ClipboardCheck,
  FileSearch,
  Handshake,
  KeyRound,
  Landmark,
  Layers,
  Mail,
  MessageCircle,
  Percent,
  Phone,
  Scale,
  Scan,
  ShieldCheck,
  Users,
} from "lucide-react";

import { CtaSection } from "@/components/sections/cta-section";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

import { GoslogForm } from "./goslog-form";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "ГосЛог для перевозчиков — готовим к 1 марта 2027 — Инфолог24",
  description:
    "ФЗ № 140-ФЗ обязывает грузовых перевозчиков свыше 3,5 т войти в реестр ГосЛог до 1 марта 2027. База знаний, чек-лист готовности, пошаговый гайд, консультация юриста. Сопровождаем — не делаем за вас. 10 лет с грузоперевозчиками Москвы.",
  keywords: [
    "реестр перевозчиков ГосЛог",
    "регистрация перевозчика ГосЛог",
    "ГосЛог 1 марта 2027",
    "как зарегистрироваться в ГосЛог",
    "ст. 11.14.3 КоАП перевозчики",
    "ФЗ 140-ФЗ перевозчики",
    "чек-лист ГосЛог",
    "консультация юриста ГосЛог",
  ],
  openGraph: {
    title:
      "ГосЛог для перевозчиков — подготовка к 1 марта 2027 — Инфолог24",
    description:
      "База знаний, чек-лист, пошаговый гайд и консультация юриста. Сопровождаем перевозчиков до включения в реестр — не делаем за вас.",
    type: "website",
    url: absoluteUrl("/goslog"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "ГосЛог для перевозчиков — Инфолог24",
    description:
      "База знаний, чек-лист, пошаговый гайд, консультация юриста. Подготовим к 1 марта 2027.",
  },
  alternates: {
    canonical: absoluteUrl("/goslog"),
  },
};

// --- Content blocks ----------------------------------------------------------

const what2027 = [
  {
    icon: Landmark,
    title: "Обязательный реестр перевозчиков",
    description:
      "ФЗ № 140-ФЗ от 07.06.2025 вводит реестр перевозчиков на платформе ГосЛог. Закон, принятый 16.12.2025, перенёс дату с 2026 на 1 марта 2027 — у перевозчиков есть время подготовиться спокойно.",
  },
  {
    icon: ClipboardCheck,
    title: "Кому обязательно",
    description:
      "Юрлицам и ИП, которые эксплуатируют грузовые ТС массой свыше 3,5 тонн для коммерческих перевозок. Нужны данные о парке, специалисте по БДД, маршрутах.",
  },
  {
    icon: Scale,
    title: "Штрафы — ст. 11.14.3 КоАП РФ",
    description:
      "За работу без записи в реестре юрлицам и ИП — от 100 000 до 300 000 ₽ (ч. 3), повторно — от 500 000 до 1 000 000 ₽ (ч. 4). Норма введена ФЗ № 281-ФЗ от 31.07.2025.",
  },
  {
    icon: Percent,
    title: "Оборотные штрафы после регистрации",
    description:
      "ч. 5–6 ст. 11.14.3 КоАП: за нарушение правил хранения и предоставления данных — 0,1–0,3% годовой выручки, минимум 500 000 ₽. Это касается уже зарегистрированных компаний.",
  },
];

const kbIncludes = [
  {
    icon: BookOpen,
    title: "Публично и бесплатно",
    description:
      "Статьи, FAQ, разбор нормативной базы (ФЗ № 140-ФЗ, 281-ФЗ, ПП № 139, 173). Регулярно обновляем под изменения законодательства.",
  },
  {
    icon: FileSearch,
    title: "Пошаговый гайд",
    description:
      "PDF и веб-версия. От проверки ОКВЭД и УКЭП до самостоятельной подачи уведомления через Госуслуги и работы с возможным отказом.",
  },
  {
    icon: ClipboardCheck,
    title: "Интерактивный чек-лист готовности",
    description:
      "Проходите по пунктам, отмечаете выполненное — видите, что ещё нужно сделать до 1 марта 2027. Прогресс сохраняется в личном кабинете.",
  },
  {
    icon: MessageCircle,
    title: "Консультация юриста Инфолог24",
    description:
      "Прямой разбор вашей ситуации — по Zoom или в чате. Юрист отвечает на вопросы по ОКВЭД, критериям отказа, обязательствам после регистрации.",
  },
  {
    icon: Mail,
    title: "Мониторинг изменений закона",
    description:
      "Короткие письма, когда в нормативке что-то меняется. Постановления Правительства, приказы Ространснадзора, поправки в КоАП.",
  },
  {
    icon: Handshake,
    title: "Партнёрские скидки",
    description:
      "На выпуск УКЭП и оформление МЧД через партнёра Контур. Подключение к ЭДО, помощь с подписанием Госключом.",
  },
];

const whoDoesWhat = [
  {
    stage: "Аудит готовности",
    who: "Мы",
    detail:
      "Интерактивный чек-лист + консультация юриста по вашей ситуации",
    ours: true,
  },
  {
    stage: "Правка ОКВЭД (если нужна)",
    who: "Вы сами",
    detail:
      "Через налоговую или бухгалтера. Подсказываем коды и формы.",
    ours: false,
  },
  {
    stage: "Выпуск УКЭП руководителя",
    who: "Партнёр Контур",
    detail:
      "У нас статус партнёра Контура. Оформляем заявку, даём скидку. Подпись выпускает официальный аккредитованный УЦ.",
    ours: false,
  },
  {
    stage: "Машиночитаемая доверенность (МЧД)",
    who: "Партнёр + наша консультация",
    detail:
      "Контур оформляет, мы помогаем заполнить корректно для ГосЛог.",
    ours: false,
  },
  {
    stage: "Регистрация на Госуслугах",
    who: "Вы сами",
    detail:
      "Подтверждённая учётная запись юрлица. Проводим за ручку в чек-листе.",
    ours: false,
  },
  {
    stage: "Подача уведомления в реестр",
    who: "Вы сами",
    detail:
      "Через gosuslugi.ru/680221/1/form — это единственный официальный канал. Мы рядом на консультации.",
    ours: false,
  },
  {
    stage: "Разбор отказа, если он пришёл",
    who: "Мы",
    detail:
      "Консультация юриста: анализируем причину, формулируем исправления, готовим вас к повторной подаче.",
    ours: true,
  },
  {
    stage: "Обязательства после регистрации (ФСБ 45 дней, ПТС, ЭПД)",
    who: "Консультируем",
    detail:
      "Даём чек-лист того, что делать после включения в реестр. Предупреждаем об оборотных штрафах ч. 5–6 КоАП.",
    ours: true,
  },
];

const timeline = [
  {
    date: "30 апреля 2026",
    title: "Крайний срок для экспедиторов",
    description:
      "Если вы экспедитор — срок уже горит. Консультируем, но для срочной регистрации рекомендуем обратиться к партнёру Контур или аудит-бюро «Картель».",
    tone: "muted" as const,
  },
  {
    date: "1 сентября 2026",
    title: "Обязательные ЭПД",
    description:
      "Электронные перевозочные документы становятся обязательными для всех грузовых перевозок.",
    tone: "next" as const,
  },
  {
    date: "1 марта 2027",
    title: "Реестр перевозчиков — старт",
    description:
      "С этой даты коммерческие грузоперевозки (ТС > 3,5 т) без записи в реестре запрещены. До этой даты у вас есть время подготовиться.",
    tone: "primary" as const,
  },
];

const trustItems = [
  { value: "2016", label: "на рынке с" },
  { value: "10 лет", label: "в регуляторике Москвы" },
  { value: "3 000+", label: "клиентов по пропускам" },
  { value: "2", label: "партнёра — Контур, Картель" },
];

const faqItems = [
  {
    question: "Кому обязательно регистрироваться в ГосЛог?",
    answer:
      "С 1 марта 2027 — всем грузовым перевозчикам (юрлицам и ИП), которые эксплуатируют ТС массой свыше 3,5 т для коммерческих перевозок. Основание — ФЗ № 140-ФЗ от 07.06.2025 с изменениями от 16.12.2025 (перенос даты с 2026 на 2027). Экспедиторам — с 1 марта 2026, крайний срок для действующих — 30 апреля 2026.",
  },
  {
    question: "А что с экспедиторами? Вы помогаете им?",
    answer:
      "Нет, это не наш сегмент. Дедлайн для экспедиторов — 30 апреля 2026, и рынок там уже насыщен крупными игроками (Контур, Астрал, 1С). Если вы экспедитор — рекомендуем обратиться напрямую к Контуру или в аудит-бюро «Картель». Мы сосредоточены на подготовке перевозчиков к 1 марта 2027 — у вас есть время разобраться спокойно и не переплачивать за срочность.",
  },
  {
    question: "Вы регистрируете за клиента в реестре?",
    answer:
      "Нет. Мы сопровождаем подготовку: база знаний, чек-лист, пошаговый гайд, консультация юриста. Официальную подачу через Госуслуги делает сам клиент — это требование закона и единственно корректный путь. Мы будем рядом на всех этапах и ответим на любой вопрос.",
  },
  {
    question: "А электронную подпись (УКЭП) вы выпускаете?",
    answer:
      "Нет — УКЭП выпускает только аккредитованный удостоверяющий центр. У нас статус партнёра Контура: оформляем заявку на выпуск, даём партнёрскую скидку и сопровождаем настройку. Сам сертификат выдаёт официальный УЦ.",
  },
  {
    question: "Что входит в платную подписку в личном кабинете?",
    answer:
      "Полный пошаговый гайд (PDF и веб), интерактивный чек-лист готовности с сохранением прогресса, 1–2 консультации с юристом Инфолог24 (Zoom или чат — на выбор), уведомления об изменениях законодательства, партнёрские скидки на УКЭП и МЧД через Контур.",
  },
  {
    question: "Сколько стоит подписка?",
    answer:
      "Ценник финализируется — ориентир 990–2 990 ₽. Это низкая цена намеренно: наша задача — быть доступным проводником для тысяч перевозчиков, которым ближайший год нужно подготовиться к 1 марта 2027, а не монетизировать панику.",
  },
  {
    question: "Что такое оборотный штраф и когда он грозит?",
    answer:
      "После включения в реестр у перевозчика появляются обязательства: хранение данных минимум 3 года на серверах в РФ, круглосуточный удалённый доступ органов безопасности, уведомление о запрещённых грузах в течение 1 часа. Нарушение — 0,1–0,3% годовой выручки, минимум 500 000 ₽ (ч. 5–6 ст. 11.14.3 КоАП). Повторно — 1–3%, минимум 1 000 000 ₽. В чек-листе и гайде разбираем, как закрыть все эти требования.",
  },
  {
    question: "Можно ли зарегистрироваться самостоятельно, без вас?",
    answer:
      "Да, конечно. Регистрация бесплатна, подача идёт через Госуслуги (gosuslugi.ru/680221/1/form — это единственный официальный канал, не goslog.ru). Нужны подтверждённая учётная запись юрлица, УКЭП руководителя, корректный ОКВЭД, МЧД при подаче сотрудником. Наша подписка — для тех, кто хочет разобраться быстрее и с поддержкой юриста.",
  },
  {
    question: "Чем вы отличаетесь от Контура и других регистраторов?",
    answer:
      "Мы не конкурируем с ними — мы с ними партнёримся. Контур делает УКЭП, МЧД и ЭДО. Мы — 10 лет сопровождаем грузоперевозчиков Москвы в регуляторике (пропуска, штрафы, переходы на новые правила) и делаем из этой экспертизы доступный продукт-проводник. Если вам нужно только оформить подпись — идите в Контур. Если хотите понять, что именно делать год до 1 марта 2027 — заходите к нам.",
  },
  {
    question: "Как получить консультацию юриста?",
    answer:
      "Оставьте заявку в форме ниже или зайдите в личный кабинет после оформления подписки. Мы согласуем удобный формат — Zoom или чат. В рабочее время отвечаем за 15 минут.",
  },
];

const toneStyles = {
  muted: "border-border bg-muted/40 text-foreground",
  next: "border-primary/15 bg-primary/5 text-primary-foreground [&>*]:text-foreground",
  primary:
    "border-primary/40 bg-primary text-primary-foreground shadow-md",
};

// --- Page --------------------------------------------------------------------

export default function GoslogPage() {
  return (
    <>
      <ServiceJsonLd
        name="Сопровождение перевозчика в реестр ГосЛог"
        description="Экспертное сопровождение перевозчиков в реестр ГосЛог: база знаний, чек-лист готовности, пошаговый гайд, консультация юриста. Подготовка к 1 марта 2027. Не подаём за клиента — проводим за ручку."
        price={990}
        url="/goslog"
      />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "ГосЛог для перевозчиков", href: "/goslog" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 px-4 py-20 text-primary-foreground sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 text-primary-foreground ring-1 ring-primary-foreground/20 backdrop-blur"
              >
                <CalendarClock className="size-3.5" />
                С 1 марта 2027 реестр перевозчиков — обязателен
              </Badge>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                ГосЛог для перевозчиков — готовим к{" "}
                <span className="text-accent">1 марта 2027</span> за ручку
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
                Не подаём за вас — проводим за ручку. База знаний, пошаговый гайд, чек-лист готовности и прямая консультация юриста. Официальную подачу делает сам клиент через Госуслуги — это требование закона. Мы — рядом 10 лет в регуляторике грузоперевозок Москвы.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#goslog-form"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
                >
                  Задать вопрос юристу
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#kb"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 px-8 text-base font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/10"
                >
                  Что в базе знаний
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-primary-foreground/15 pt-8 sm:grid-cols-4">
                {trustItems.map((item) => (
                  <div key={item.label}>
                    <div className="font-heading text-2xl font-extrabold text-primary-foreground sm:text-3xl">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs leading-snug text-primary-foreground/70 sm:text-sm">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-3xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-6 backdrop-blur sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent/20">
                  <BookOpen className="size-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/60">
                    Наш подход
                  </div>
                  <div className="font-heading text-xl font-bold">
                    Сопровождаем — не делаем за вас
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-primary-foreground/85">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>Пошаговый гайд по ГосЛогу — web и PDF</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    Интерактивный чек-лист готовности с прогрессом в ЛК
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>Прямая консультация юриста в Zoom или чате</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    Партнёрская скидка на УКЭП и МЧД через Контур
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-primary-foreground/10 p-4 text-xs text-primary-foreground/80">
                <strong className="font-semibold text-primary-foreground">
                  Подача — только через Госуслуги,
                </strong>{" "}
                регистрация бесплатная. Мы помогаем подготовиться, разобраться и пройти путь — но обязательную подачу делает сам клиент.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What changes 1 March 2027 */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 rounded-full">
              Что меняется
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              1 марта 2027 — вся коммерческая грузоперевозка идёт через реестр
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Основание — ФЗ № 140-ФЗ от 07.06.2025. Закон от 16.12.2025 перенёс
              старт реестра перевозчиков с 2026 года на 1 марта 2027. У рынка есть
              год, чтобы подготовиться спокойно, а не в последнюю неделю.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {what2027.map((item) => (
              <Card
                key={item.title}
                className="rounded-3xl border-border bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Регуляторный таймлайн
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Три даты, которые уже в законе
            </h2>
            <p className="mt-4 text-muted-foreground">
              ФЗ № 140-ФЗ, ФЗ № 281-ФЗ, постановления Правительства № 139, 173
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {timeline.map((t) => (
              <Card
                key={t.date}
                className={`rounded-3xl border shadow-sm ${toneStyles[t.tone]}`}
              >
                <CardContent className="p-6">
                  <div className="text-xs uppercase tracking-wider opacity-75">
                    {t.tone === "primary"
                      ? "Наш фокус"
                      : t.tone === "next"
                        ? "Впереди"
                        : "Уже прошло или почти"}
                  </div>
                  <div className="mt-2 font-heading text-xl font-extrabold">
                    {t.date}
                  </div>
                  <div className="mt-2 font-semibold">{t.title}</div>
                  <p className="mt-2 text-sm opacity-85">{t.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What you get (KB contents) */}
      <section id="kb" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 rounded-full">
              База знаний
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Что даёт наша подписка и что бесплатно
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Мы специально делаем публичную часть максимально полезной. Подписку вы выбираете,
              когда готовы к следующему шагу — пошаговому разбору и прямой работе с юристом.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {kbIncludes.map((item) => (
              <Card
                key={item.title}
                className="rounded-3xl border-border bg-card shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who does what */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Честное разделение
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Что делаем мы, что — вы, а что — партнёры
            </h2>
            <p className="mt-4 text-muted-foreground">
              Мы не подменяем клиента и не претендуем на то, что нам делать не положено по закону.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            {whoDoesWhat.map((row, idx) => (
              <div
                key={row.stage}
                className={`grid grid-cols-1 gap-3 px-5 py-5 text-sm sm:grid-cols-[1.2fr_0.8fr_1.5fr] sm:items-center sm:px-8 sm:text-base ${
                  idx !== whoDoesWhat.length - 1
                    ? "border-b border-border/70"
                    : ""
                }`}
              >
                <div className="font-medium text-foreground">{row.stage}</div>
                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    row.ours
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {row.ours ? (
                    <CheckCircle className="size-3.5" />
                  ) : (
                    <Users className="size-3.5" />
                  )}
                  {row.who}
                </div>
                <div className="text-sm text-muted-foreground">
                  {row.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Партнёры
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              С кем мы работаем на этом пути
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="rounded-3xl border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <KeyRound className="size-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Контур
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Аккредитованный удостоверяющий центр. Через наш партнёрский
                  кабинет — выпуск УКЭП, оформление МЧД, подключение к ЭДО и
                  Госключу. Даём партнёрскую скидку, сопровождаем настройку.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>
                    Инфолог24 — партнёр Контура. Сертификат подписи выдаёт сам УЦ.
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Scale className="size-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Аудит-бюро «Картель»
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Если нужна глубокая аудит-проверка и полное сопровождение
                  сторонним юристом (например, для крупного парка или
                  холдинга) — рекомендуем коллег. 27-е место РАЭКС, 13 лет
                  экспертизы.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Handshake className="size-4 text-primary" />
                  <span>
                    Рекомендуем с комиссией — открыто и честно.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              FAQ
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Частые вопросы о ГосЛог для перевозчиков
            </h2>
            <p className="mt-4 text-muted-foreground">
              Если осталось что-то непонятное — задайте вопрос юристу в форме ниже.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow open:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-foreground">
                  <span>{item.question}</span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-transform group-open:rotate-45">
                    <span className="text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Связанные услуги
            </Badge>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              С чем ещё помогаем перевозчикам
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/propusk",
                title: "Пропуск Москва",
                description: "МКАД / ТТК / СК для грузового транспорта",
              },
              {
                href: "/etrn",
                title: "ЭТрН / ЭПД 2026",
                description: "Подготовка к 1 сентября 2026 — электронные перевозочные",
              },
              {
                href: "/kep",
                title: "КЭП и МЧД",
                description: "Подписи через партнёра Контур, со скидкой",
              },
              {
                href: "/monitoring",
                title: "Антиштраф",
                description: "Мониторинг штрафов по всему автопарку",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
                  {item.title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Подробнее
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <section id="goslog-form" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Консультация
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Задайте вопрос юристу — ответим за 15 минут
            </h2>
            <p className="mt-4 text-muted-foreground">
              Расскажите о своём автопарке и текущей ситуации — подберём, с чего начать
              подготовку к 1 марта 2027. Без обязательств.
            </p>
          </div>

          <div className="mt-10">
            <GoslogForm />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              <span>Перезваниваем в течение 15 минут в рабочее время</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>Данные защищены, ФЗ-152</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <CtaSection
          heading="Год на подготовку. С экспертом — спокойно"
          description="До 1 марта 2027 — год. Мы проводим перевозчиков за ручку через всю подготовку: база знаний, пошаговый гайд, чек-лист, юрист на связи. Зайдите, посмотрите материалы и задайте первый вопрос."
          ctaText="Задать вопрос юристу"
          ctaHref="#goslog-form"
        />
      </div>
    </>
  );
}
