import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Briefcase,
  Clock,
  FileCheck,
  FileSignature,
  Gauge,
  Network,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

import { CtaSection } from "@/components/sections/cta-section";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Единое окно для перевозчика: пропуска, ЭТрН, штрафы, юрист — Инфолог24",
  description:
    "Экосистема цифровых сервисов для грузоперевозчиков: пропуска в Москву, ЭТрН, ГосЛог, мониторинг штрафов, юрист, КЭП, страховка — в одном личном кабинете. 10 лет опыта, 3 000+ клиентов.",
  keywords: [
    "экосистема для перевозчика",
    "единое окно перевозчик",
    "цифровой сервис грузоперевозки",
    "платформа для автопарка",
    "все услуги для перевозчика",
    "пропуск РНИС ЭТрН штрафы",
  ],
  openGraph: {
    title: "Единое окно для перевозчика — Инфолог24",
    description:
      "Пропуска, ЭТрН, штрафы, юрист, страховка — всё для автопарка в одной платформе.",
    type: "website",
    url: absoluteUrl("/ekosistema"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Единое окно для перевозчика — Инфолог24",
    description: "Все цифровые услуги для грузоперевозчика в одной платформе.",
  },
  alternates: {
    canonical: absoluteUrl("/ekosistema"),
  },
};

const painVsGain = [
  {
    pain: "5 подрядчиков: пропуска, РНИС, ЭТрН, юрист, страховая",
    gain: "Один личный кабинет и один менеджер на все задачи",
  },
  {
    pain: "Сроки пропусков и документов — в голове или в Excel",
    gain: "Умный календарь присылает напоминания за 45 дней",
  },
  {
    pain: "Штрафы приходят на юрадрес — узнаёте поздно, скидка 25% сгорает",
    gain: "Мониторинг штрафов по всему парку, уведомление за 12 часов",
  },
  {
    pain: "Разные договоры, счета, акты — бухгалтерия в шоке",
    gain: "Единый договор, ежемесячный акт, всё в ЛК",
  },
  {
    pain: "Менеджер подрядчика не берёт трубку в пятницу вечером",
    gain: "ИнфоПилот AI 24/7 + приоритетная поддержка по SLA",
  },
];

const services = [
  {
    icon: Truck,
    title: "Пропуска в Москву",
    description:
      "МКАД, ТТК, Садовое кольцо. Годовые, разовые, срочные. Гарантия результата.",
    price: "от 12 000 ₽",
    href: "/services",
    badge: "Основа",
  },
  {
    icon: FileCheck,
    title: "ГосЛог Старт",
    description:
      "Регистрация в реестре экспедиторов и перевозчиков. Штраф до 300 000 ₽ без записи.",
    price: "от 15 000 ₽",
    href: "/goslog",
    badge: "Дедлайн 30.04.2026",
    urgent: true,
  },
  {
    icon: FileSignature,
    title: "ЭТрН Переход",
    description:
      "Подключение к ЭДО, выпуск УКЭП, обучение. Поддержка 3 месяца после запуска.",
    price: "от 25 000 ₽",
    href: "/etrn",
    badge: "С 01.09.2026",
  },
  {
    icon: Shield,
    title: "Антиштраф",
    description:
      "Мониторинг штрафов по всему парку, уведомления, работа со скидкой 25%.",
    price: "от 500 ₽/мес за ТС",
    href: "/monitoring",
    badge: "Recurring",
  },
  {
    icon: Briefcase,
    title: "Юрист-перевозчик",
    description:
      "Обжалование штрафов, лизинг, дебиторка, договоры. Подписка без почасовой оплаты.",
    price: "от 7 000 ₽/мес",
    href: "/yurist",
    badge: "Подписка",
  },
  {
    icon: BadgeCheck,
    title: "КЭП и МЧД",
    description:
      "Квалифицированная электронная подпись и машиночитаемая доверенность под ключ.",
    price: "от 5 000 ₽",
    href: "/kep",
    badge: "1-3 дня",
  },
  {
    icon: Gauge,
    title: "Парк Про (ЛК)",
    description:
      "Весь автопарк в одном кабинете: пропуска, РНИС, штрафы, документы, напоминания.",
    price: "Бесплатно / Premium",
    href: "/park-pro",
    badge: "Lock-in",
  },
  {
    icon: Sparkles,
    title: "ИнфоПилот (AI)",
    description:
      "AI-диспетчер 24/7 в Telegram: отвечает водителям, генерирует документы, проверяет РНИС.",
    price: "Включён в пакет",
    href: "/infopilot",
    badge: "Эксклюзив",
  },
];

const numbers = [
  { value: "10+", label: "лет на рынке" },
  { value: "3 000+", label: "активных клиентов" },
  { value: "15-20%", label: "доли рынка Москвы" },
  { value: "98%", label: "одобрение пропусков" },
];

const philosophyItems = [
  {
    icon: Network,
    title: "Одно окно вместо пяти подрядчиков",
    description:
      "Раньше перевозчик тратил часы, чтобы обзвонить разных посредников. Мы собрали все задачи автопарка в один сервис — от пропуска до юриста.",
  },
  {
    icon: Bell,
    title: "Проактивно, а не реактивно",
    description:
      "Сроки, штрафы, аннуляции, новые законы — мы следим за этим раньше вас. Уведомление приходит до того, как проблема стала дорогой.",
  },
  {
    icon: Users,
    title: "Перевозчик в центре, а не мы",
    description:
      "Большинство на рынке продаёт один пропуск и исчезает. Мы строим отношения на годы: LTV, а не разовая сделка.",
  },
  {
    icon: ShieldCheck,
    title: "Гарантия результата, а не процесса",
    description:
      "Договор с каждым клиентом. Если пропуск не выдают — возвращаем деньги или делаем повторно бесплатно.",
  },
];

const targetSegments = [
  {
    title: "Частный перевозчик / ИП",
    fleet: "1–3 машины",
    pain: "Боюсь штрафов, не разбираюсь в регуляторике",
    package: "Пропуск+ → от 12 500 ₽",
    href: "/ip-perevozchik",
  },
  {
    title: "Малая транспортная компания",
    fleet: "5–20 машин",
    pain: "Хаос: сроки, РНИС, штрафы, документы разбросаны",
    package: "Транзит Москва → от 52 000 ₽",
    href: "/malye-tk",
  },
  {
    title: "Производство / ритейл с автопарком",
    fleet: "10–50+ машин",
    pain: "Нужно API, SLA, выделенный менеджер",
    package: "Флот Про → индивидуально",
    href: "/proizvodstvo",
  },
];

const ecosystemFaq = [
  {
    question: "Чем экосистема отличается от отдельных услуг?",
    answer:
      "Вы покупаете не пропуск, а доступ к платформе для всего автопарка. В одном кабинете видны все машины, документы, штрафы, пропуска и сроки. Один менеджер, один договор, одна подписка. Это экономит до 20 часов в месяц на администрировании.",
  },
  {
    question: "Можно ли подключить только одну услугу?",
    answer:
      "Да. Все услуги продаются и отдельно. Но при подключении двух и более — скидка 15–22%, и вы получаете единый ЛК без доплат. Большинство клиентов начинают с пропуска и через 2–3 месяца расширяют подписку.",
  },
  {
    question: "Сколько экономит экосистема?",
    answer:
      "Типичный кейс для компании на 10 машин: 2 000 ₽ пропуск + 1 500 ₽ РНИС + 3 000 ₽ юрист + 5 000 ₽ ЭТрН-оператор = 11 500 ₽/мес при раздельной покупке. У нас в пакете «Транзит Москва» это 7 500 ₽/мес, плюс мониторинг штрафов и ИнфоПилот. Экономия — 35% и 3 дня работы бухгалтера.",
  },
  {
    question: "Что с конфиденциальностью данных автопарка?",
    answer:
      "Все данные хранятся в России на сертифицированных серверах. ФЗ-152 соблюдается. Доступ к ЛК только по логину/паролю с 2FA. Данные не передаются третьим лицам без вашего согласия.",
  },
  {
    question: "Как быстро подключить компанию?",
    answer:
      "Первый пропуск — за 1–3 дня. Полное подключение экосистемы (пропуск + РНИС + ЭТрН + мониторинг штрафов) — 5–7 рабочих дней. Для компаний с 20+ ТС возможна срочная интеграция за 2 дня.",
  },
  {
    question: "Работаете с другими городами?",
    answer:
      "Пока специализируемся на Москве и МО — это наша сильная сторона. Для других городов (СПб, Казань, Екатеринбург) работает партнёрская сеть. Полное покрытие регионов планируется с 2027 года.",
  },
];

export default function EkosistemaPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Экосистема для перевозчика", href: "/ekosistema" },
        ]}
      />
      <FaqJsonLd items={ecosystemFaq} />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Network className="mr-1.5 size-3.5" />
            Единая платформа для перевозчика
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-6xl">
            Все задачи автопарка — в одном кабинете
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Пропуска, ЭТрН, ГосЛог, мониторинг штрафов, юрист, страховка и AI-диспетчер.
            Один договор, один менеджер, один личный кабинет. Перевозчик работает —
            остальное делаем мы.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#services"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Что входит в экосистему
              <ArrowRight className="ml-2 size-4" />
            </a>
            <a
              href="#ekosistema-form"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Получить консультацию
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                  {n.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {n.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain vs Gain */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Перевозчик тратит 20 часов в месяц на то, что можно закрыть за 2
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Типичная головная боль небольшой ТК — и как её снимает экосистема
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {painVsGain.map((item) => (
              <div
                key={item.pain}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <Card className="rounded-2xl border-destructive/20 bg-destructive/5 shadow-sm">
                  <CardContent className="flex items-start gap-3 p-5">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <span className="text-sm font-bold text-destructive">
                        —
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {item.pain}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
                  <CardContent className="flex items-start gap-3 p-5">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-sm font-bold text-primary">+</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {item.gain}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section id="services" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              8 сервисов — в одной подписке
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Покупайте отдельно или соберите пакет со скидкой до 22%
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative block"
              >
                <Card
                  className={`h-full rounded-2xl border-0 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                    service.urgent ? "ring-2 ring-destructive/30" : ""
                  }`}
                >
                  <CardContent className="flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                        <service.icon className="size-5 text-primary" />
                      </div>
                      {service.badge && (
                        <Badge
                          variant={service.urgent ? "destructive" : "secondary"}
                          className="text-[10px]"
                        >
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-sm font-semibold text-primary">
                        {service.price}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
            <p className="text-sm text-foreground">
              <strong>Экономия до 22%</strong> при подключении 2+ сервисов.{" "}
              <Link
                href="/resheniya"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Смотреть готовые пакеты →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy / Why ecosystem */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              4 принципа, на которых построена экосистема
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Почему мы не оформляем один пропуск и не исчезаем, как 90% рынка
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {philosophyItems.map((item, index) => (
              <Card
                key={item.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="size-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
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

      {/* Target segments */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Для кого экосистема
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Выберите сценарий, который ближе к вашей ситуации
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {targetSegments.map((seg) => (
              <Card
                key={seg.title}
                className="rounded-2xl border-0 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6 sm:p-8">
                  <Badge variant="secondary" className="mb-3">
                    {seg.fleet}
                  </Badge>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {seg.title}
                  </h3>
                  <p className="mt-3 text-sm italic text-muted-foreground">
                    «{seg.pain}»
                  </p>
                  <div className="mt-5 rounded-xl bg-primary/5 p-4">
                    <div className="text-xs font-semibold text-primary">
                      РЕКОМЕНДУЕМ
                    </div>
                    <div className="mt-1 text-sm font-bold text-foreground">
                      {seg.package}
                    </div>
                  </div>
                  <Link
                    href={seg.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Подробнее
                    <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-3xl border-0 bg-primary text-primary-foreground shadow-lg">
            <CardContent className="p-8 sm:p-12">
              <TrendingUp className="size-8 text-primary-foreground/70" />
              <p className="mt-6 font-heading text-xl font-semibold leading-relaxed sm:text-2xl">
                «Раньше у меня был отдельный подрядчик на пропуска, отдельный — на
                РНИС, юрист по штрафам, бухгалтер с 1С-ЭПД. Минимум 4 платёжки в
                месяц, все с разными сроками. Перешёл на «Транзит Москва» — один
                акт в месяц, одна подписка, минус 4 часа работы бухгалтера
                еженедельно.»
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Users className="size-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Андрей Л.</div>
                  <div className="text-sm text-primary-foreground/70">
                    Директор ТК, 12 машин, клиент 3-й год
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Частые вопросы об экосистеме
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {ecosystemFaq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-card p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-foreground">
                  {item.question}
                  <Clock className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA form */}
      <section id="ekosistema-form" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Хотите подобрать связку под свой автопарк?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Оставьте заявку — эксперт позвонит за 15 минут, посчитает экономию
              и предложит оптимальный набор.
            </p>
          </div>
          <CtaSection />
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Phone className="size-3.5" />
            <span>
              Или позвоните сами —{" "}
              <a
                href="tel:+74991105549"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                +7 (499) 110-55-49
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
