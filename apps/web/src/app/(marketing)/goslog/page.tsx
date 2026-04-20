import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  CalendarClock,
  CheckCircle,
  Clock,
  FileCheck,
  FileSearch,
  Gavel,
  KeyRound,
  Layers,
  Percent,
  Phone,
  RefreshCcw,
  Scale,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Target,
  Truck,
  UserCheck,
  Wallet,
  XCircle,
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
    "Регистрация в реестре ГосЛог под ключ от 19 900 ₽ — Инфолог24",
  description:
    "Включим вашу компанию в реестр экспедиторов ГосЛог до дедлайна 30 апреля 2026. Проверяем 12 критериев до подачи, работаем с отказами бесплатно, предупреждаем о штрафах до 1 млн ₽ и оборотных от 500 000 ₽. 8+ лет в регуляторике для грузоперевозок Москвы.",
  keywords: [
    "регистрация ГосЛог",
    "реестр экспедиторов ГосЛог",
    "реестр перевозчиков ГосЛог",
    "регистрация в ГосЛог под ключ",
    "штраф ГосЛог 11.14.3 КоАП",
    "ОКВЭД 52.29 ГосЛог",
    "дедлайн ГосЛог 30 апреля 2026",
    "Инфолог24 ГосЛог",
  ],
  openGraph: {
    title:
      "ГосЛог под ключ от 19 900 ₽. До дедлайна 30.04.2026 — Инфолог24",
    description:
      "Проверяем 12 критериев до подачи, работаем с отказами, предупреждаем об оборотных штрафах от 500 000 ₽. Включим в реестр или вернём деньги.",
    type: "website",
    url: absoluteUrl("/goslog"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "ГосЛог под ключ — Инфолог24",
    description:
      "Регистрация в реестре экспедиторов до 30 апреля 2026. Гарантия результата или возврат.",
  },
  alternates: {
    canonical: absoluteUrl("/goslog"),
  },
};

// --- Content blocks ----------------------------------------------------------

const fineTiles = [
  {
    icon: AlertTriangle,
    value: "до 300 000 ₽",
    title: "за работу без записи в реестре",
    caption:
      "ч. 3 ст. 11.14.3 КоАП РФ — первичное нарушение для юрлиц и ИП",
    accent: "destructive" as const,
  },
  {
    icon: ShieldAlert,
    value: "до 1 000 000 ₽",
    title: "за повторное нарушение",
    caption: "ч. 4 ст. 11.14.3 КоАП РФ",
    accent: "destructive" as const,
  },
  {
    icon: Percent,
    value: "от 500 000 ₽",
    title: "оборотный штраф 0,1–0,3% выручки",
    caption:
      "ч. 5–6 ст. 11.14.3 КоАП — нарушение хранения и предоставления данных. Этого риска нет у тех, кто продаёт только регистрацию за 3 000 ₽.",
    accent: "destructive" as const,
  },
];

const refusalReasons = [
  {
    icon: Gavel,
    title: "Неснятая судимость руководителя",
    description:
      "За преступления в сфере экономической деятельности. Проверяется через СМЭВ до 5 рабочих дней.",
  },
  {
    icon: XCircle,
    title: "Два и более адм. нарушения ФЗ № 87-ФЗ за год",
    description:
      "Автоматический отказ. Проверяется по базе МВД и реестрам Ространснадзора.",
  },
  {
    icon: Scan,
    title: "Несоответствие ОКВЭД 52.29",
    description:
      "Без актуального кода в ЕГРЮЛ/ЕГРИП в регистрации откажут. Правим через ФНС заранее.",
  },
];

const timeline = [
  {
    date: "1 марта 2026",
    title: "Реестр экспедиторов запущен",
    description: "ФЗ № 140-ФЗ от 07.06.2025, ПП № 173 от 20.02.2026",
    status: "done" as const,
  },
  {
    date: "30 апреля 2026",
    title: "Крайний срок регистрации",
    description:
      "60-дневный переходный период заканчивается. Дальше — ст. 11.14.3 КоАП РФ.",
    status: "urgent" as const,
  },
  {
    date: "1 сентября 2026",
    title: "Обязательные ЭПД",
    description: "Все перевозочные документы — только в электронном виде.",
    status: "next" as const,
  },
  {
    date: "1 марта 2027",
    title: "Реестр перевозчиков",
    description: "Для владельцев ТС свыше 3,5 т. Закон принят 16.12.2025.",
    status: "next" as const,
  },
];

const checks = [
  {
    icon: Scan,
    title: "Аудит ОКВЭД 52.29 в ЕГРЮЛ/ЕГРИП",
    description:
      "Если кода нет — правим через ФНС до подачи. Без него сразу отказ.",
  },
  {
    icon: Gavel,
    title: "Проверка на критерии отказа",
    description:
      "Судимость руководителя, адм. нарушения 87-ФЗ. Закрываем до подачи, а не после.",
  },
  {
    icon: KeyRound,
    title: "Аудит УКЭП руководителя",
    description:
      "Срок действия, СНИЛС, совместимость с Госуслугами. При необходимости — выпуск «под ключ».",
  },
  {
    icon: UserCheck,
    title: "Машиночитаемая доверенность (МЧД)",
    description:
      "Оформляем для сотрудника, который будет подписывать уведомление вместо директора.",
  },
  {
    icon: ShieldCheck,
    title: "Подтверждение учётки юрлица на Госуслугах",
    description:
      "ЕСИА, двухфакторная аутентификация, привязка к УКЭП. Без этого уведомление не уйдёт.",
  },
  {
    icon: Layers,
    title: "Настройка КриптоПро и Госплагин",
    description:
      "Удалённо настраиваем рабочее место. Браузер, плагины, сертификаты — всё под ключ.",
  },
  {
    icon: FileSearch,
    title: "Подготовка сведений для уведомления",
    description:
      "ИНН, ОГРН, адрес, территория деятельности, страховая сумма, допуски.",
  },
  {
    icon: FileCheck,
    title: "Подача на Госуслугах",
    description:
      "gosuslugi.ru/680221/1/form — единственный официальный канал. Подписываем Госключом или УКЭП.",
  },
  {
    icon: Clock,
    title: "Включение в реестр — 1 рабочий день",
    description:
      "При корректной подаче. Выписка в ЛК Госуслуг — до 7 дней. Следим и сообщаем вам.",
  },
  {
    icon: RefreshCcw,
    title: "Работа с отказом — бесплатно",
    description:
      "Если пришёл отказ — анализируем причину, исправляем и подаём повторно. Без доплат.",
  },
  {
    icon: ShieldAlert,
    title: "Инструктаж по обязательствам после регистрации",
    description:
      "45 дней на подачу заявления в ФСБ, ПТС, досмотр грузов, 1 час на уведомление о запрещённых грузах.",
  },
  {
    icon: Target,
    title: "Подготовка к ЭПД 01.09.2026",
    description:
      "Карта перехода на электронные перевозочные документы — чтобы второй дедлайн не застал врасплох.",
  },
];

const compareRows = [
  {
    feature: "Цена",
    budget: "1 500 – 4 400 ₽",
    premium: "от 50 000 ₽",
    ours: "19 900 ₽",
    oursBold: true,
  },
  {
    feature: "Проверка на критерии отказа",
    budget: "—",
    premium: "✓",
    ours: "✓",
  },
  {
    feature: "Правка ОКВЭД через ФНС",
    budget: "—",
    premium: "✓",
    ours: "✓",
  },
  {
    feature: "Инструктаж по ФСБ-обязательствам",
    budget: "—",
    premium: "✓",
    ours: "✓",
  },
  {
    feature: "Работа с отказом",
    budget: "доплата",
    premium: "✓",
    ours: "✓ бесплатно",
  },
  {
    feature: "Пакет с пропуском Москва",
    budget: "—",
    premium: "—",
    ours: "✓ −15%",
    oursBold: true,
  },
  {
    feature: "Удалённо, без визитов",
    budget: "✓",
    premium: "частично",
    ours: "✓",
  },
  {
    feature: "Гарантия возврата при неудаче",
    budget: "—",
    premium: "—",
    ours: "✓",
    oursBold: true,
  },
];

const pricing = [
  {
    slug: "start",
    name: "ГосЛог Старт",
    price: "19 900 ₽",
    priceHint: "разовый платёж",
    description:
      "Базовый пакет: всё, чтобы спокойно войти в реестр до 30 апреля.",
    features: [
      "Аудит 12 критериев до подачи",
      "Настройка УКЭП и Госуслуг удалённо",
      "Подача уведомления через Госуслуги",
      "Сопровождение до выписки из реестра",
      "Повторная подача при отказе — 0 ₽",
    ],
    cta: "Оставить заявку",
    highlight: false,
  },
  {
    slug: "complex",
    name: "ГосЛог Комплекс",
    price: "34 900 ₽",
    priceHint: "выбирают 6 из 10",
    description:
      "Старт + всё, что нужно сделать ПОСЛЕ регистрации, чтобы не получить оборотный штраф.",
    features: [
      "Всё из пакета «Старт»",
      "Выпуск УКЭП «под ключ», если нет",
      "Оформление МЧД на ответственного сотрудника",
      "Инструктаж по заявлению в ФСБ (45 дней)",
      "Часовой разбор compliance-рисков с юристом",
    ],
    cta: "Выбрать «Комплекс»",
    highlight: true,
  },
  {
    slug: "combo",
    name: "ГосЛог + Пропуск Москва",
    price: "от 29 900 ₽",
    priceHint: "единый договор",
    description:
      "Регистрация ГосЛог + годовой пропуск МКАД / ТТК / СК со скидкой 15%.",
    features: [
      "Всё из пакета «Старт»",
      "Годовой пропуск Москва −15%",
      "Один менеджер на обе задачи",
      "Личный кабинет Инфолог24",
      "Напоминания о продлении",
    ],
    cta: "Собрать комбо",
    highlight: false,
  },
];

const trustItems = [
  { value: "2016", label: "на рынке с" },
  { value: "3 000+", label: "клиентов по пропускам Москва" },
  { value: "12", label: "проверок до подачи" },
  { value: "0 ₽", label: "за повторную подачу при отказе" },
];

const faqItems = [
  {
    question: "Что такое ГосЛог и зачем нужен реестр?",
    answer:
      "ГосЛог — государственная платформа Минтранса, которую администрирует Ространснадзор. С 1 марта 2026 заработал реестр экспедиторов (на основании ФЗ № 140-ФЗ от 07.06.2025). С 1 марта 2027 заработает реестр перевозчиков. Без записи в реестре коммерческая транспортно-экспедиционная деятельность — незаконна.",
  },
  {
    question: "Кому обязательно регистрироваться?",
    answer:
      "Все юрлица и ИП с ОКВЭД 52.29, организующие перевозку груза по договору транспортной экспедиции. Логистические операторы, брокеры, посредники. Не нужно тем, кто возит только собственный груз собственным транспортом без экспедиторских функций.",
  },
  {
    question: "Можно ли зарегистрироваться самостоятельно?",
    answer:
      "Да, через Госуслуги (gosuslugi.ru/680221/1/form — это единственный официальный канал, не goslog.ru). Нужны: подтверждённая учётка юрлица, УКЭП руководителя, корректный ОКВЭД 52.29, МЧД для сотрудника. Типичная ошибка — подать с неверным ОКВЭД или без проверки критериев отказа. Отказ фиксируется в базе, повторная подача возможна, но время теряется.",
  },
  {
    question: "Какой штраф за работу без записи в реестре?",
    answer:
      "По ч. 3 ст. 11.14.3 КоАП РФ для юрлиц и ИП — от 100 000 до 300 000 ₽ за первое нарушение, по ч. 4 — от 500 000 до 1 000 000 ₽ за повторное. Норма введена ФЗ № 281-ФЗ от 31.07.2025.",
  },
  {
    question: "Что такое оборотный штраф и когда он грозит?",
    answer:
      "После включения в реестр у вас есть обязательства: хранить данные минимум 3 года на серверах в РФ, обеспечивать круглосуточный удалённый доступ органов безопасности, уведомлять о запрещённых грузах в течение 1 часа. Нарушение этих правил карается по ч. 5–6 ст. 11.14.3 КоАП — от 0,1 до 0,3% годовой выручки, минимум 500 000 ₽. Повторно — 1–3%, минимум 1 000 000 ₽. Этот риск не покрывают регистраторы за 3 000 ₽.",
  },
  {
    question: "По каким причинам отказывают в регистрации?",
    answer:
      "Две основных: неснятая/непогашенная судимость руководителя за преступления в сфере экономики; два и более случая привлечения к адм. ответственности за нарушения ФЗ № 87-ФЗ в течение года. Проверка через СМЭВ — до 5 рабочих дней. Мы проверяем оба основания до подачи и отдельно — соответствие ОКВЭД 52.29.",
  },
  {
    question: "Что происходит после регистрации?",
    answer:
      "В течение 45 дней нужно подать заявление в региональное управление ФСБ, получить куратора и разработать план внедрения программно-технических средств. Параллельно — готовиться к 1 сентября 2026 (обязательные ЭПД). В пакет «Комплекс» мы включаем полный инструктаж по этим этапам.",
  },
  {
    question: "Сколько времени занимает регистрация через вас?",
    answer:
      "Стандарт — 2–3 рабочих дня на подготовку пакета и подачу. Включение в реестр — до 1 рабочего дня после подачи, выписка в ЛК Госуслуг — до 7 дней. Срочный режим (подача в день обращения) — +50% к цене.",
  },
  {
    question: "Что если пришёл отказ?",
    answer:
      "В тарифах «Старт», «Комплекс» и «Комбо» повторная подача после отказа входит в стоимость. Если после всех попыток включить вас в реестр не удалось по причинам, которые можно было выявить на этапе аудита, — возвращаем деньги по договору.",
  },
  {
    question: "Чем вы отличаетесь от Контура и Астрала за 3 000 ₽?",
    answer:
      "Они делают одну техническую консультацию по настройке ПК и подаче. Мы до подачи проверяем 12 критериев (включая ОКВЭД и причины отказа), работаем с отказами без доплат и предупреждаем об обязательствах после регистрации, которые вступают в силу через 45 дней и грозят оборотными штрафами от 500 000 ₽. Если вас интересует только техническая консультация — честно скажем, что вам может быть достаточно их пакета.",
  },
];

const statusStyles: Record<"done" | "urgent" | "next", string> = {
  done: "border-primary/20 bg-primary/5 text-primary",
  urgent: "border-destructive/30 bg-destructive/10 text-destructive",
  next: "border-border bg-muted/40 text-foreground",
};

// --- Page --------------------------------------------------------------------

export default function GoslogPage() {
  return (
    <>
      <ServiceJsonLd
        name="Регистрация в реестре ГосЛог под ключ"
        description="Полное сопровождение экспедиторов и перевозчиков в реестр ГосЛог: проверка 12 критериев до подачи, работа с отказами, инструктаж по обязательствам после регистрации. От 19 900 ₽."
        price={19900}
        url="/goslog"
      />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Регистрация в ГосЛог", href: "/goslog" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 px-4 py-20 text-primary-foreground sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-2 rounded-full bg-destructive/15 text-destructive-foreground ring-1 ring-destructive/40 backdrop-blur"
              >
                <AlertTriangle className="size-3.5" />
                До дедлайна 30 апреля 2026 — считанные дни
              </Badge>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Регистрация в реестре{" "}
                <span className="text-accent">ГосЛог</span> — под ключ, с гарантией включения
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
                Проверяем 12 критериев до подачи, работаем с отказами без доплат, предупреждаем об оборотных штрафах от 500 000 ₽ по ст. 11.14.3 КоАП РФ. 8+ лет в регуляторике грузоперевозок Москвы.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#goslog-form"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
                >
                  Оставить заявку
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 px-8 text-base font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/10"
                >
                  Смотреть тарифы
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
                <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/20">
                  <CalendarClock className="size-5 text-destructive-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/60">
                    До запрета работы
                  </div>
                  <div className="font-heading text-xl font-bold">
                    30 апреля 2026
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-primary-foreground/85">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>12 проверок до подачи — исключаем причины отказа</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>Включение в реестр — 1 рабочий день</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>Повторная подача при отказе — 0 ₽</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    Инструктаж о 45-дневной подаче в ФСБ — в пакете «Комплекс»
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-primary-foreground/10 p-4 text-xs text-primary-foreground/75">
                <strong className="font-semibold text-primary-foreground">
                  Подача — только через Госуслуги
                </strong>{" "}
                (gosuslugi.ru/680221/1/form). Сайт goslog.ru — информационный, подача через него невозможна.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain — fines */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 rounded-full">
              Что реально грозит
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Три штрафа, о которых молчат регистраторы за 3 000 ₽
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Штраф 300 000 ₽ за отсутствие записи в реестре — только верхушка.
              Реальный риск для средней компании — оборотные санкции по ч. 5–6 ст.
              11.14.3 КоАП РФ, которые начинают действовать сразу после регистрации.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {fineTiles.map((tile) => (
              <Card
                key={tile.title}
                className="rounded-3xl border-destructive/15 bg-destructive/5 shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
                    <tile.icon className="size-6 text-destructive" />
                  </div>
                  <div className="mt-5 font-heading text-3xl font-extrabold text-destructive">
                    {tile.value}
                  </div>
                  <div className="mt-2 text-base font-semibold text-foreground">
                    {tile.title}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {tile.caption}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
                <Ban className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  + 3 причины, по которым Ространснадзор отказывает в регистрации
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Отказ фиксируется в базе, времени на повторную подачу почти не остаётся.
                  Мы закрываем эти риски до подачи.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {refusalReasons.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-border bg-background p-5"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <r.icon className="size-5 text-amber-600" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-foreground">
                    {r.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
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
              Четыре даты, которые уже в законе
            </h2>
            <p className="mt-4 text-muted-foreground">
              ФЗ № 140-ФЗ, ФЗ № 281-ФЗ, постановления Правительства № 139, 173, 1317, 1318
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-4">
            {timeline.map((t) => (
              <Card
                key={t.date}
                className={`rounded-3xl border shadow-sm ${statusStyles[t.status]}`}
              >
                <CardContent className="p-6">
                  <div className="text-xs uppercase tracking-wider opacity-80">
                    {t.status === "done"
                      ? "Действует"
                      : t.status === "urgent"
                        ? "Горячий дедлайн"
                        : "Впереди"}
                  </div>
                  <div className="mt-2 font-heading text-lg font-extrabold">
                    {t.date}
                  </div>
                  <div className="mt-2 font-semibold">{t.title}</div>
                  <p className="mt-2 text-sm opacity-80">{t.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12 checks */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 rounded-full">
              Наш метод
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              12 проверок до подачи — чтобы вас включили с первого раза
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Стандартный регистратор «настраивает компьютер и отправляет форму».
              Мы проходим все точки, где типично возникает отказ или последующий штраф.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {checks.map((step, idx) => (
              <Card
                key={step.title}
                className="group rounded-3xl border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </div>
                    <span className="font-heading text-sm font-bold text-primary">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-4 font-heading text-base font-semibold text-foreground">
                    {step.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Честное сравнение
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Инфолог24 vs регистраторы за 3 000 ₽ и аудит-премиум от 50 000 ₽
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-4 border-b border-border bg-muted/40 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-8 sm:text-sm">
              <div>Параметр</div>
              <div className="text-center">Регистраторы</div>
              <div className="text-center">Аудит-премиум</div>
              <div className="text-center text-primary">Инфолог24</div>
            </div>

            {compareRows.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-4 items-center border-b border-border/70 px-5 py-4 text-sm sm:px-8 sm:text-base"
              >
                <div className="font-medium text-foreground">{row.feature}</div>
                <div className="text-center text-muted-foreground">
                  {row.budget}
                </div>
                <div className="text-center text-muted-foreground">
                  {row.premium}
                </div>
                <div
                  className={`text-center ${
                    row.oursBold
                      ? "font-semibold text-primary"
                      : "text-foreground"
                  }`}
                >
                  {row.ours}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Тарифы
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Выберите объём ответственности, который хотите нам передать
            </h2>
            <p className="mt-4 text-muted-foreground">
              Срочная регистрация (подача в день обращения) — +50% к базовой цене.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pricing.map((plan) => (
              <Card
                key={plan.slug}
                className={`relative flex h-full flex-col rounded-3xl shadow-sm ${
                  plan.highlight
                    ? "border-2 border-primary bg-card shadow-md"
                    : "border border-border bg-card"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Выбирают чаще
                    </Badge>
                  </div>
                )}
                <CardContent className="flex h-full flex-col p-6 sm:p-8">
                  <div className="font-heading text-xl font-bold text-foreground">
                    {plan.name}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="mt-6">
                    <div className="font-heading text-4xl font-extrabold text-primary">
                      {plan.price}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                      {plan.priceHint}
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="#goslog-form"
                    className={`mt-8 inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "border border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-muted/40 p-6 text-center sm:p-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Truck className="size-5 text-primary" />
                <span>Работаем с юрлицами и ИП по всей России</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Wallet className="size-5 text-primary" />
                <span>Оплата по счёту, договор, закрывающие документы</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Scale className="size-5 text-primary" />
                <span>Гарантия включения или возврат по договору</span>
              </div>
            </div>
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
              Частые вопросы о ГосЛог
            </h2>
            <p className="mt-4 text-muted-foreground">
              Если остался вопрос — звоните, консультируем бесплатно.
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

      {/* Related products */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Связанные услуги
            </Badge>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Что идёт вместе с регистрацией ГосЛог
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
                title: "ЭТрН / ЭПД переход",
                description: "Подготовка к дедлайну 1 сентября 2026",
              },
              {
                href: "/kep",
                title: "КЭП и МЧД",
                description: "Электронная подпись под ключ",
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

      {/* CTA form */}
      <section
        id="goslog-form"
        className="px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Badge variant="outline" className="rounded-full">
              Заявка
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Оставьте заявку — расскажем, что у вас уже готово
            </h2>
            <p className="mt-4 text-muted-foreground">
              15-минутный созвон, проверка ОКВЭД и УКЭП. Бесплатно и без обязательств.
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
          heading="10 дней до 300 000 ₽ — или 19 900 ₽ сегодня"
          description="После 30 апреля 2026 экспедиционная деятельность без записи в реестре запрещена. Очереди на Госуслугах уже растут — не откладывайте."
          ctaText="Оставить заявку"
          ctaHref="#goslog-form"
        />
      </div>
    </>
  );
}
