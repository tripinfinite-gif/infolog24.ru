"use client";

import {
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Shield,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  includedFeatures,
  serviceZones,
  volumeDiscounts,
} from "@/content/services";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* ─────────────────────────── Hero Section ─────────────────────────── */

function HeroSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
      <div
        className="absolute -top-24 right-0 size-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <motion.div
        className="mx-auto max-w-4xl text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Пропуска в Москву — МКАД, ТТК, Садовое кольцо
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Оформим пропуск за 3 дня с гарантией результата. Временный пропуск
          бесплатно при заказе годового.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <a href="#cta-form">Оставить заявку</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base"
          >
            <a href="#pricing">Смотреть цены</a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────── Pricing Cards ─────────────────────────── */

function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl rounded-3xl bg-card p-6 sm:p-8 shadow-sm">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Выберите пропуск
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            4 типа пропусков для любой зоны Москвы. Годовой или временный — решать вам.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {serviceZones.map((zone) => {
            const isTemp = zone.type === "temp";
            const isPopular = zone.popular;

            return (
              <motion.div key={zone.id} variants={fadeIn} transition={{ duration: 0.4 }}>
                <Card
                  className={`relative flex h-full flex-col rounded-2xl border-0 shadow-sm transition-shadow hover:shadow-md ${
                    isPopular
                      ? "bg-primary text-primary-foreground"
                      : isTemp
                        ? "bg-card"
                        : "bg-card"
                  }`}
                >
                  {/* Badges */}
                  <CardHeader className="relative pb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isPopular && (
                        <Badge className="bg-accent text-accent-foreground">
                          <Star className="mr-1 size-3" />
                          Популярный
                        </Badge>
                      )}
                      {zone.badge && (
                        <Badge variant={isTemp ? "outline" : "secondary"}>
                          {zone.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2 text-xl">{zone.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {isTemp ? "Разовый пропуск" : "Годовой пропуск"}
                    </p>
                  </CardHeader>

                  {/* Price */}
                  <CardContent className="flex flex-1 flex-col gap-4 pt-2">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        {zone.priceLabel}
                      </p>
                      <p className="text-sm text-muted-foreground">{zone.priceUnit}</p>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-1 flex-col gap-2">
                      {zone.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  {/* CTA */}
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <a href="#cta-form">Оформить</a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Zone Map Section ─────────────────────────── */

function ZoneMapSection() {
  const zones = [
    {
      name: "МКАД",
      color: "border-primary-foreground/30",
      bgColor: "bg-primary-foreground/5",
      size: "size-64 sm:size-72 lg:size-80",
      description: "Внешняя граница. Грузовики свыше 3,5 т.",
    },
    {
      name: "ТТК",
      color: "border-primary-foreground/40",
      bgColor: "bg-primary-foreground/10",
      size: "size-44 sm:size-48 lg:size-56",
      description: "Средняя зона. Экокласс Евро-3+.",
    },
    {
      name: "СК",
      color: "border-accent",
      bgColor: "bg-accent/20",
      size: "size-24 sm:size-28 lg:size-32",
      description: "Центр. Самые строгие требования.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl rounded-3xl bg-primary p-6 sm:p-8 lg:p-12">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
            Зоны ограничений в Москве
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/70">
            Москва разделена на 3 зоны для грузового транспорта. Чем ближе к центру —
            тем строже требования.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-16">
          {/* Concentric circles */}
          <motion.div
            className="relative flex items-center justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            {zones.map((zone) => (
              <div
                key={zone.name}
                className={`absolute flex items-center justify-center rounded-full border-2 ${zone.color} ${zone.bgColor} ${zone.size}`}
              >
                {zone.name === "СК" && (
                  <span className="text-xs font-bold text-accent">
                    СК
                  </span>
                )}
              </div>
            ))}
            {/* Labels on circles */}
            <div className="size-64 sm:size-72 lg:size-80">
              <span className="absolute left-1/2 top-1 -translate-x-1/2 text-xs font-semibold text-primary-foreground/60">
                МКАД
              </span>
              <span className="absolute left-1/2 top-[22%] -translate-x-1/2 text-xs font-semibold text-primary-foreground/70 sm:top-[24%]">
                ТТК
              </span>
            </div>
          </motion.div>

          {/* Zone descriptions */}
          <motion.div
            className="flex flex-col gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {serviceZones
              .filter((z) => z.type === "annual")
              .map((zone) => (
                <motion.div
                  key={zone.id}
                  variants={fadeIn}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">{zone.name}</h3>
                    <p className="mt-1 text-sm text-primary-foreground/70">
                      {zone.zoneDescription}
                    </p>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Included Features ─────────────────────────── */

function IncludedSection() {
  const icons = [FileText, Truck, Clock, Shield, Users, CheckCircle];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl rounded-3xl bg-card p-6 sm:p-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Что включено в стоимость
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Каждый пропуск включает полный пакет услуг — от проверки документов до
            получения результата.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {includedFeatures.map((feature, index) => {
            const Icon = icons[index] || CheckCircle;
            return (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Volume Discounts ─────────────────────────── */

function VolumeDiscountsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Скидки для автопарков
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Чем больше машин — тем выгоднее. Скидка применяется к каждому пропуску в
            заказе.
          </p>
        </motion.div>

        <motion.div
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="rounded-2xl border-0 bg-card shadow-sm">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Количество ТС</TableHead>
                    <TableHead className="text-right">Скидка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volumeDiscounts.map((tier) => (
                    <TableRow key={tier.range}>
                      <TableCell className="font-medium">{tier.range}</TableCell>
                      <TableCell className="text-right text-lg font-bold text-primary">
                        {tier.discount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a href="#cta-form">Рассчитать для автопарка</a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Required Documents ─────────────────────────── */

function DocumentsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl rounded-3xl bg-card p-6 sm:p-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Необходимые документы
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Перечень документов зависит от зоны. Мы поможем собрать полный пакет.
          </p>
        </motion.div>

        <motion.div
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible>
            {serviceZones.map((zone) => (
              <AccordionItem key={zone.id} value={zone.id}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  <span className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    {zone.fullName}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-2">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        Документы:
                      </h4>
                      <ul className="space-y-1.5">
                        {zone.documents.map((doc) => (
                          <li
                            key={doc}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        Требования к ТС:
                      </h4>
                      <ul className="space-y-1.5">
                        {zone.requirements.map((req) => (
                          <li
                            key={req}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle className="mt-0.5 size-3.5 shrink-0 text-primary" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FAQ Section ─────────────────────────── */

function ZoneFaqSection() {
  const allFaq = serviceZones.flatMap((zone) =>
    zone.faq.map((item) => ({
      ...item,
      zone: zone.name,
    }))
  );

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl rounded-3xl bg-card p-6 sm:p-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Частые вопросы
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Ответы на популярные вопросы по каждой зоне.
          </p>
        </motion.div>

        <motion.div
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible>
            {allFaq.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA Form Section ─────────────────────────── */

function CtaFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      zone: selectedZone,
      source: "services-page",
    };

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Ошибка отправки. Попробуйте позже.");
        return;
      }

      setSubmitted(true);
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      router.push("/thank-you");
    } catch {
      toast.error("Ошибка сети. Попробуйте позже или позвоните нам.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="cta-form"
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl bg-primary p-6 sm:p-8 lg:p-12">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
            Готовы оформить пропуск?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Оставьте заявку, и мы свяжемся с вами в течение 15 минут. Бесплатная
            консультация.
          </p>
        </motion.div>

        <motion.div
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {submitted ? (
            <div className="rounded-2xl bg-primary-foreground/10 p-8 text-center">
              <CheckCircle className="mx-auto size-12 text-accent" />
              <h3 className="mt-4 text-xl font-bold text-primary-foreground">
                Заявка отправлена!
              </h3>
              <p className="mt-2 text-primary-foreground/80">
                Мы свяжемся с вами в течение 15 минут.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <Input
                name="name"
                placeholder="Имя"
                required
                className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Телефон"
                required
                className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <div className="sm:col-span-2">
                <Select name="zone" value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="h-12 w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground data-[placeholder]:text-primary-foreground/50">
                    <SelectValue placeholder="Выберите зону" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.fullName} — {zone.priceLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    "Получить расчёт"
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-2 text-primary-foreground/70">
          <Phone className="size-4" />
          <a
            href="tel:+74951234567"
            className="text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-80"
          >
            +7 (495) 123-45-67
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Main Page ─────────────────────────── */

export default function ServicesPage() {
  return (
    <>
      <HeroSection />
      <PricingSection />
      <ZoneMapSection />
      <IncludedSection />
      <VolumeDiscountsSection />
      <DocumentsSection />
      <ZoneFaqSection />
      <CtaFormSection />
    </>
  );
}
