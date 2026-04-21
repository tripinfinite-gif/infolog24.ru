import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  FileSignature,
  FileText,
  Gavel,
  HandCoins,
  Mail,
  MessageCircle,
  Phone,
  Scale,
  Shield,
  TrendingUp,
  Truck,
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

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Юрист для перевозчика — подписка от 7 000 ₽/мес",
  description:
    "Обжалование штрафов за перегруз и пропуска, лизинговые споры, взыскание дебиторки, договоры. Юрист, специализированный на грузоперевозках. Подписка без почасовой оплаты.",
  keywords: [
    "юрист перевозчик",
    "юрист грузоперевозки",
    "обжалование штрафов перегруз",
    "юридическая подписка ТК",
    "лизинговые споры перевозчик",
    "взыскание дебиторки транспорт",
  ],
  openGraph: {
    title: "Юрист-перевозчик — юридическая подписка | Инфолог24",
    description:
      "Штрафы, лизинг, дебиторка, договоры. Юрист со специализацией на ст. 12.21.1 КоАП. От 7 000 ₽/мес.",
    type: "website",
    url: absoluteUrl("/yurist"),
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Юрист-перевозчик — подписка | Инфолог24",
    description: "Штрафы, лизинг, дебиторка, договоры. От 7 000 ₽/мес.",
  },
  alternates: {
    canonical: absoluteUrl("/yurist"),
  },
};

const whyUs = [
  {
    icon: Scale,
    title: "Специализация на перегрузе и пропусках",
    description:
      "Отдельная команда под ст. 12.21.1 КоАП (перегруз) — выигрываем до 70% дел. Средний возврат — 300–400 тыс. ₽ на одном рейсе.",
  },
  {
    icon: Clock,
    title: "Без почасовой оплаты",
    description:
      "Обычный юрист — 3 000–5 000 ₽/час, и вы не знаете, когда кончится счёт. У нас фиксированная подписка: 30–40 дел в год входят в тариф.",
  },
  {
    icon: Shield,
    title: "Понимаем специфику ТК",
    description:
      "Знаем РНИС, ГосЛог, ЭТрН, лизинг грузовых, взаимодействие с ФНС по НДС и тарифной системой. Не нужно объяснять юристу, что такое перетарив.",
  },
  {
    icon: TrendingUp,
    title: "Абонентская модель — экономия 60%",
    description:
      "Штатный юрист — 80 000+ ₽/мес, аутсорс по часам — 30 000–50 000 ₽/мес. Наша подписка «Актив» — 12 000 ₽/мес, и в неё входят 10 дел.",
  },
];

const services = [
  {
    icon: AlertCircle,
    title: "Обжалование штрафов за перегруз",
    details:
      "Работаем с АПВГК, оспариваем постановления. Статистика выигрышей — 60–70%. Работаем только по договору оферты, комиссия 20–30% от отменённой суммы.",
    category: "Штрафы",
  },
  {
    icon: Shield,
    title: "Штрафы за отсутствие пропуска",
    details:
      "Ст. 12.16.3 КоАП. Оспариваем: техническая ошибка камеры, отсутствие уведомления, ошибки в номере ТС. До 40% успеха.",
    category: "Штрафы",
  },
  {
    icon: FileText,
    title: "Договоры перевозки и экспедиции",
    details:
      "Проверка договоров контрагентов, разработка шаблонов под ваши рейсы, защита от скрытых условий и абсурдной ответственности.",
    category: "Договоры",
  },
  {
    icon: HandCoins,
    title: "Взыскание дебиторской задолженности",
    details:
      "Досудебные претензии, иски в арбитраж, исполнительное производство. Частая ситуация: заказчик не платит за выполненный рейс 2–3 месяца.",
    category: "Дебиторка",
  },
  {
    icon: Truck,
    title: "Лизинговые споры",
    details:
      "Возврат лизингового ТС, оспаривание штрафных санкций лизингодателя, кейсы по изъятию. Защита при нарушении условий графика платежей.",
    category: "Лизинг",
  },
  {
    icon: Users,
    title: "Трудовые споры с водителями",
    details:
      "Ответственность за ущерб ТС и груз, дисциплинарные взыскания, оформление материальной ответственности. Защита от фиктивных трудовых исков.",
    category: "HR",
  },
  {
    icon: Briefcase,
    title: "Работа с ФНС и налоговыми проверками",
    details:
      "Защита при камеральных и выездных проверках, споры по НДС при межрегиональных перевозках, выбор оптимальной системы налогообложения.",
    category: "Налоги",
  },
  {
    icon: Gavel,
    title: "Судебное представительство",
    details:
      "Арбитраж, общая юрисдикция, КАС. Первая инстанция — включена в тариф. Апелляция и кассация — по прозрачному прайсу, фиксированная цена за дело.",
    category: "Суды",
  },
];

const tariffs = [
  {
    name: "Консультант",
    price: "7 000 ₽",
    unit: "/мес",
    popular: false,
    description: "Для ИП и малых ТК до 5 ТС",
    features: [
      "Онлайн-консультации без ограничений (email, чат)",
      "Проверка до 3 договоров в месяц",
      "Ответ на письма ФНС, приставов, проверяющих",
      "Шаблоны документов из базы",
      "Скидка 30% на судебное представительство",
    ],
  },
  {
    name: "Актив",
    price: "12 000 ₽",
    unit: "/мес",
    popular: true,
    description: "Для ТК 5–20 ТС — самый частый выбор",
    features: [
      "Всё из тарифа «Консультант»",
      "До 10 дел в год (штрафы, претензии, простые суды)",
      "Обжалование штрафов ГИБДД и МАДИ",
      "Обжалование штрафов за перегруз (до 5/год)",
      "Разработка договоров под ключ",
      "Взыскание дебиторки до 500 тыс. ₽ — без допоплат",
      "Персональный юрист с телефоном для срочных вопросов",
    ],
  },
  {
    name: "Корпоративный",
    price: "от 25 000 ₽",
    unit: "/мес",
    popular: false,
    description: "Для компаний 20+ ТС и автопарков производств",
    features: [
      "Всё из тарифа «Актив»",
      "Безлимитное обжалование штрафов любых типов",
      "Безлимитная дебиторка (любые суммы)",
      "Сопровождение налоговых проверок",
      "Судебное представительство в арбитраже (первая инстанция)",
      "Работа с 3–5 юристами одновременно",
      "SLA 4 часа на срочные запросы",
      "Ежемесячный правовой аудит процессов компании",
    ],
  },
];

const cases = [
  {
    title: "Возврат 520 000 ₽ за перегруз",
    description:
      "ТК из Подмосковья, 8 машин. На одной из фур — 11 штрафов по 150 000 ₽ за 3 месяца. Оспорили по несоответствию акта АПВГК: вернули 520 000 ₽, сэкономили за счёт скидки 25% ещё 180 000 ₽.",
    verdict: "Выиграно, 70% сумм возвращены",
  },
  {
    title: "Отмена штрафа за пропуск МКАД",
    description:
      "Водитель въехал в пропускную зону — камера оформила штраф 7 500 ₽, хотя пропуск был активен. Подготовили жалобу, приложили скриншоты из ЛК — отмена за 21 день.",
    verdict: "Штраф отменён",
  },
  {
    title: "Взыскание дебиторки 340 000 ₽",
    description:
      "Заказчик из Екатеринбурга задолжал за 4 рейса 340 000 ₽, избегал общения. Подали претензию, затем иск в арбитраж — выплатил в течение 2 месяцев без дохождения до суда.",
    verdict: "Деньги возвращены в досудебном порядке",
  },
];

const faq = [
  {
    question: "Чем отличаетесь от обычной юрфирмы?",
    answer:
      "Обычный юрист работает со всем подряд: семейное, уголовное, корпоративное. Мы — только перевозчики. За 10 лет прошли тысячи дел по ст. 12.21.1 КоАП и штрафам за пропуска. У нас есть внутренние базы выигрышных аргументов, знакомые судьи в АПВГК Москвы и регионов, сводки по позициям Верховного суда по нашей теме.",
  },
  {
    question: "Почему подписка, а не оплата за каждое дело?",
    answer:
      "По данным наших клиентов: у средней ТК в месяц возникает 3–8 юридических задач (штраф, договор, претензия, налоговое письмо). По часам это 20–40 тыс. ₽. Подписка даёт фиксированный бюджет и экономит 40–60%. Плюс — вы не откладываете «мелкие» вопросы из экономии, а обрабатываете их сразу.",
  },
  {
    question: "Что если подписка не нужна, просто одно дело?",
    answer:
      "Работаем и по разовым делам. Обжалование штрафа за перегруз — фикс. от 15 000 ₽ + 20% от возвращённой суммы. Договор под ключ — от 12 000 ₽. Судебное представительство — от 40 000 ₽ за инстанцию. Но на 3–4-м деле подписка окупается.",
  },
  {
    question: "Работаете только в Москве?",
    answer:
      "Основная команда в Москве, но ведём дела по всей России удалённо. Суды в регионах — работаем через сеть партнёров-юристов. Штрафы обжалуем в любой инспекции ГИБДД и МАДИ. Личное присутствие нужно максимум на 5–10% дел.",
  },
  {
    question: "Что с конфиденциальностью?",
    answer:
      "Подписываем NDA с каждым клиентом. Документы хранятся в закрытой системе с 2FA. Доступ — только у закреплённого за вами юриста. При необходимости — заключаем адвокатское соглашение с адвокатской тайной.",
  },
  {
    question: "Есть ли гарантии по выигрышу?",
    answer:
      "Честно: 100% гарантии нет ни у кого — это противоречит этике профессии. Но мы честно говорим «шансов мало» до начала дела, чтобы не тратить ваше время и деньги. Статистика выигрышей: штрафы за перегруз — 60–70%, пропуска — 40%, дебиторка в досудебном — 85%.",
  },
  {
    question: "Можно ли поменять тариф?",
    answer:
      "Да. Переход с «Консультант» на «Актив» — со следующего месяца без доплат. На «Корпоративный» — обычно с началом квартала, индивидуальным договором. При отказе от подписки — возвращаем неиспользованную часть года пропорционально.",
  },
];

const steps = [
  {
    icon: MessageCircle,
    title: "Бесплатная диагностика",
    description:
      "30-минутный разговор по телефону или видеосвязи. Поймём ваш профиль рисков и подберём тариф.",
  },
  {
    icon: FileSignature,
    title: "Договор и онбординг",
    description:
      "Подписываем договор оферты, закрепляем персонального юриста, собираем текущие «горячие» вопросы.",
  },
  {
    icon: Briefcase,
    title: "Работа по заявкам",
    description:
      "Пишете в Telegram/email — берём в работу в тот же день. SLA ответа — 4 часа для «Актив» и «Корпоратив».",
  },
  {
    icon: TrendingUp,
    title: "Ежемесячный отчёт",
    description:
      "Раз в месяц показываем: сколько штрафов обжаловано, сколько сэкономлено, над чем работаем. Прозрачно, без «чёрных ящиков».",
  },
];

export default function YuristPage() {
  return (
    <>
      <ServiceJsonLd
        name="Юрист-перевозчик — юридическая подписка для ТК"
        description="Подписочная юридическая услуга для перевозчиков: обжалование штрафов, лизинговые споры, взыскание дебиторки, договоры. От 7 000 ₽/мес."
        price={7000}
        url="/yurist"
      />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Юрист-перевозчик", href: "/yurist" },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Scale className="mr-1.5 size-3.5" />
            Подписка · от 7 000 ₽/мес
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Юрист, который знает перевозки лучше водителя
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Обжалование штрафов за перегруз и пропуска, лизинговые споры,
            взыскание дебиторки, договоры. Подписка без почасовой оплаты — 30–40
            дел в год входят в тариф.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#tariffs"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Смотреть тарифы
            </a>
            <a
              href="#yurist-form"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Бесплатная диагностика
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { v: "10+", l: "лет по ст. 12.21.1" },
              { v: "60–70%", l: "перегруз — обжаловано" },
              { v: "520 тыс. ₽", l: "средний возврат за рейс" },
              { v: "1 200+", l: "дел в год" },
            ].map((m) => (
              <div key={m.l} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="font-heading text-xl font-extrabold text-primary sm:text-2xl">
                  {m.v}
                </div>
                <div className="mt-1 text-xs leading-tight text-muted-foreground">
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Почему не «обычный» юрист
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              4 причины, почему малые и средние ТК держат нас на подписке по 3+ года
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {whyUs.map((w) => (
              <Card
                key={w.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <w.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {w.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              8 направлений юридической работы
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Всё, что реально нужно перевозчику — без заказа отдельно у разных
              юристов
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Card
                key={s.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-5 sm:p-6">
                  <Badge variant="secondary" className="mb-3 text-[10px]">
                    {s.category}
                  </Badge>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                    <s.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {s.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              3 кейса из практики
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Реальные ситуации, без фамилий клиентов
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {cases.map((c) => (
              <Card
                key={c.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-7">
                  <Gavel className="size-7 text-primary" />
                  <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">
                        {c.verdict}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Как начать работать
            </h2>
            <p className="mt-4 text-muted-foreground">
              4 шага от заявки до первого результата
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="rounded-2xl border-0 bg-card shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <step.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary">
                        Шаг {index + 1}
                      </div>
                      <h3 className="mt-1 font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tariffs */}
      <section id="tariffs" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Тарифы
            </h2>
            <p className="mt-4 text-muted-foreground">
              От ИП до корпоративного автопарка
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tariffs.map((t) => (
              <Card
                key={t.name}
                className={
                  t.popular
                    ? "relative rounded-3xl border-2 border-accent bg-card shadow-lg"
                    : "rounded-3xl border-0 bg-card shadow-sm"
                }
              >
                {t.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Выбирают чаще
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.description}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-bold text-primary">
                      {t.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t.unit}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#yurist-form"
                    className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    Оставить заявку
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-sm text-foreground">
              <strong>Разовые услуги</strong> без подписки: обжалование штрафа
              за перегруз от 15 000 ₽ + 20% от возврата, договор — от 12 000 ₽,
              судебное представительство — от 40 000 ₽ за инстанцию.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-center font-heading text-xl font-bold text-foreground">
            Часто подключают вместе
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                href: "/monitoring",
                icon: Shield,
                title: "Антиштраф",
                desc: "Мониторинг штрафов парка",
              },
              {
                href: "/goslog",
                icon: FileText,
                title: "ГосЛог Старт",
                desc: "Регистрация в реестре",
              },
              {
                href: "/ekosistema",
                icon: Briefcase,
                title: "Экосистема",
                desc: "Всё в одном кабинете",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <item.icon className="size-6 text-primary" />
                <div className="mt-4 font-semibold text-foreground group-hover:text-primary">
                  {item.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {item.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-foreground">
                  {item.question}
                  <Scale className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section id="yurist-form" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Бесплатная 30-минутная диагностика
            </h2>
            <p className="mt-3 text-muted-foreground">
              Расскажете о своих текущих задачах — подскажем, какие можно
              решить сразу, какие требуют подготовки. Без обязательств.
            </p>
          </div>
          <CtaSection />
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-xs text-muted-foreground sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2">
              <Phone className="size-3.5" />
              <a
                href="tel:+74991105549"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                +7 (499) 110-55-49
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-3.5" />
              <a
                href="mailto:legal@inlog24.ru"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                legal@inlog24.ru
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
