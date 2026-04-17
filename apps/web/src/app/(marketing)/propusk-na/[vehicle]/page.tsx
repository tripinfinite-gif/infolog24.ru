import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Package,
  Phone,
  Shield,
  Sparkles,
  Truck,
  Weight,
} from "lucide-react";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getRelatedVehicles,
  getVehicleBySlug,
  vehicleTypes,
  type VehicleType,
} from "@/content/vehicle-types";
import { absoluteUrl } from "@/lib/utils/base-url";

export const revalidate = 3600;

interface PageParams {
  vehicle: string;
}

export function generateStaticParams(): PageParams[] {
  return vehicleTypes.map((v) => ({ vehicle: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { vehicle } = await params;
  const v = getVehicleBySlug(vehicle);
  if (!v) {
    return {
      title: "Страница не найдена",
    };
  }

  const title = `Пропуск на ${v.name} в Москву от ${formatPrice(v.priceFrom)} ₽ — оформление МКАД, ТТК, СК`;
  const description = `${v.heroSubtitle} Стоимость от ${formatPrice(v.priceFrom)} ₽, временный пропуск — 1 день, годовой — 3–7 дней. Гарантия результата, бесплатная повторная подача.`;

  return {
    title,
    description,
    keywords: v.keywords,
    openGraph: {
      title: `Пропуск на ${v.name} в Москву — Инфолог24`,
      description,
      type: "website",
      url: absoluteUrl(`/propusk-na/${v.slug}`),
      siteName: "Инфолог24",
    },
    alternates: { canonical: absoluteUrl(`/propusk-na/${v.slug}`) },
  };
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n);
}

function weightClassLabel(cls: VehicleType["weightClass"]): string {
  switch (cls) {
    case "under-2.5t":
      return "Лёгкий коммерческий (до 2,5 т)";
    case "2.5-3.5t":
      return "Малотоннажный (2,5–3,5 т)";
    case "3.5-12t":
      return "Среднетоннажный (3,5–12 т)";
    case "over-12t":
      return "Тяжёлый (свыше 12 т)";
  }
}

export default async function PropuskVehiclePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { vehicle } = await params;
  const v = getVehicleBySlug(vehicle);
  if (!v) {
    notFound();
  }

  const related = getRelatedVehicles(v.slug, 3);
  const pageUrl = `/propusk-na/${v.slug}`;

  return (
    <>
      <ServiceJsonLd
        name={`Пропуск на ${v.name} в Москву`}
        description={`Оформление пропуска на ${v.name} для проезда по МКАД, ТТК и Садовому кольцу Москвы. ${v.summary}`}
        price={v.priceFrom}
        url={pageUrl}
      />
      <FaqJsonLd items={v.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Услуги", href: "/services" },
          { name: `Пропуск на ${v.name}`, href: pageUrl },
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
            <Truck className="size-4" />
            {weightClassLabel(v.weightClass)}
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Пропуск на {v.name} в Москву от{" "}
            <span className="text-accent">{formatPrice(v.priceFrom)} ₽</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {v.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/calculator"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Calculator className="size-4" />
              Рассчитать стоимость
            </Link>
            <OpenChatTrigger className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-semibold transition-colors hover:bg-muted">
              <Sparkles className="size-4" />
              Спросить ИнфоПилота
            </OpenChatTrigger>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <Phone className="mr-1 inline size-4" />
            Или звоните:{" "}
            <a href="tel:+74991105549" className="font-semibold text-foreground">
              8 (499) 110-55-49
            </a>
          </p>
        </div>
      </section>

      {/* Характеристики ТС */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            {v.name} — характеристики для пропуска
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{v.summary}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Weight className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">Масса</h3>
                <p className="mt-1 text-muted-foreground">{v.weightKg}</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Truck className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">Альтернативные названия</h3>
                <p className="mt-1 text-muted-foreground">
                  {v.alsoKnownAs.join(", ")}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">Типичные грузы</h3>
                <p className="mt-1 text-muted-foreground">
                  {v.typicalCargo.join(", ")}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">Типовые маршруты</h3>
                <p className="mt-1 text-muted-foreground">
                  {v.commonRoutes.join(", ")}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm sm:col-span-2">
              <CardContent className="p-6">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">Экологический класс</h3>
                <p className="mt-1 text-muted-foreground">
                  Минимальные требования: {v.ecoClass}. Если у вашего {v.name.toLowerCase()} экокласс
                  ниже — мы поможем повысить его, чтобы открыть доступ в нужную зону.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Какие пропуска нужны */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Какие пропуска нужны для {v.nameAccusative}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            В Москве три зоны ограничения движения грузовиков — МКАД, ТТК и Садовое кольцо.
            Для {v.nameAccusative.toLowerCase()} требования следующие:
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* МКАД */}
            <Card
              className={`rounded-2xl border-0 shadow-sm ${
                v.permitTypes.mkad.required ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">МКАД</h3>
                  {v.permitTypes.mkad.required ? (
                    <Badge className="bg-primary text-primary-foreground">Нужен</Badge>
                  ) : (
                    <Badge variant="outline">Не нужен</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {v.permitTypes.mkad.required
                    ? `Ограничение с 7:00 до 23:00. Годовой пропуск — от ${formatPrice(v.permitTypes.mkad.priceFrom)} ₽.`
                    : `Масса вашего ${v.name.toLowerCase()} ниже порога 3,5 тонн — пропуск на МКАД не требуется.`}
                </p>
              </CardContent>
            </Card>

            {/* ТТК */}
            <Card
              className={`rounded-2xl border-0 shadow-sm ${
                v.permitTypes.ttk.required ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">ТТК</h3>
                  {v.permitTypes.ttk.required ? (
                    <Badge className="bg-primary text-primary-foreground">Нужен</Badge>
                  ) : (
                    <Badge variant="outline">Не нужен</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {v.permitTypes.ttk.required
                    ? `Ограничение круглосуточное (от 1 тонны). Годовой пропуск — от ${formatPrice(v.permitTypes.ttk.priceFrom)} ₽.`
                    : `Пропуск не требуется.`}
                </p>
              </CardContent>
            </Card>

            {/* Садовое кольцо */}
            <Card
              className={`rounded-2xl border-0 shadow-sm ${
                v.permitTypes.sk.required ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Садовое</h3>
                  {v.permitTypes.sk.required ? (
                    <Badge className="bg-primary text-primary-foreground">Нужен</Badge>
                  ) : (
                    <Badge variant="outline">Не нужен</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {v.permitTypes.sk.required
                    ? `Строгая зона, экокласс от Евро-4, РНИС обязателен. От ${formatPrice(v.permitTypes.sk.priceFrom)} ₽.`
                    : `Пропуск не требуется.`}
                </p>
              </CardContent>
            </Card>
          </div>

          {v.permitTypes.nightDelivery.needed && (
            <Card className="mt-6 rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Ночной режим работ</p>
                  <p className="mt-1 text-muted-foreground">
                    {v.permitTypes.nightDelivery.note ??
                      `Для ${v.nameAccusative.toLowerCase()} часто требуется отдельное разрешение на работу в ночное время (23:00–6:00). Оформляем вместе с основным пропуском.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Проблемы именно этой модели */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            На что обратить внимание именно {v.nameAccusative.toLowerCase()}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            За годы работы мы собрали типичные сложности, с которыми сталкиваются владельцы
            {" "}
            {v.name} при оформлении пропуска в Москву.
          </p>
          <div className="mt-8 space-y-4">
            {v.painPoints.map((point) => (
              <Card key={point} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="flex items-start gap-4 p-6">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-accent" />
                  <p className="text-muted-foreground">{point}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Штрафы */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Что будет, если {v.name.toLowerCase()} поедет без пропуска
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { value: "7 500 ₽", label: "первое нарушение", desc: "за каждую фиксацию камерой" },
              { value: "10 000 ₽", label: "повторное нарушение", desc: "скидка 25% при оплате за 20 дней" },
              { value: "до 150 000 ₽", label: "за один рейс", desc: "5–15 камер по МКАД" },
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
          <p className="mt-6 text-center text-muted-foreground">
            Стоимость годового пропуска — от {formatPrice(v.priceFrom)} ₽. Один день без
            пропуска на {v.nameAccusative.toLowerCase()} обычно окупает годовой сбор.
          </p>
        </div>
      </section>

      {/* Процесс оформления */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
                desc: `Звоните или пишете в чат. За 5 минут определим, какой пропуск нужен вашему ${v.name}, и назовём точную стоимость.`,
                time: "5 минут",
              },
              {
                step: 2,
                icon: FileText,
                title: "Подготовка документов",
                desc: "Присылаете фото/скан СТС, ПТС, диагностической карты и доверенности. Мы проверяем комплект и заполняем заявление.",
                time: "1 день",
              },
              {
                step: 3,
                icon: Clock,
                title: "Подача и временный пропуск",
                desc: "Подаём заявление в Дептранс Москвы. На время оформления годового — бесплатный временный пропуск, чтобы не терять рейсы.",
                time: "1–7 дней",
              },
              {
                step: 4,
                icon: Shield,
                title: "Гарантия результата",
                desc: "Если Дептранс откажет — повторная подача бесплатно. Если по нашей вине — возврат 100%.",
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
            Частые вопросы про пропуск на {v.name}
          </h2>
          <div className="mt-8 space-y-3">
            {v.faqs.map((item) => (
              <details key={item.q} className="group rounded-2xl bg-card p-5 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                  {item.q}
                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Связанные страницы */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Пропуск на другой транспорт
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Если у вас несколько машин разных классов — оформим сразу весь парк. Скидки от
            5% за 2+ единицы.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/propusk-na/${r.slug}`}
                className="group rounded-2xl bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Truck className="size-5 text-primary" />
                  <h3 className="font-semibold group-hover:text-primary">
                    Пропуск на {r.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  От {formatPrice(r.priceFrom)} ₽ ·{" "}
                  {weightClassLabel(r.weightClass).toLowerCase()}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Все услуги
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/malye-tk"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Для транспортных компаний
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Калькулятор
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Оформите пропуск на {v.name} сегодня
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Рассчитаем стоимость за 5 минут, подготовим документы и подадим заявление.
            Временный пропуск — в день обращения.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/calculator"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Рассчитать стоимость
              <ArrowRight className="size-4" />
            </Link>
            <OpenChatTrigger className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-8 text-base font-semibold transition-colors hover:bg-white/10">
              <Sparkles className="size-4" />
              Задать вопрос ИнфоПилоту
            </OpenChatTrigger>
          </div>
        </div>
      </section>
    </>
  );
}
