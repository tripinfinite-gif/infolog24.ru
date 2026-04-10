import {
  CheckCircle,
  FileCheck,
  Scale,
  Shield,
  Smile,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { FadeIn } from "@/components/motion/fade-in";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";
import { CtaSection } from "@/components/sections/cta-section";
import { Stats } from "@/components/sections/stats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { companyInfo } from "@/content/company";
import { stats } from "@/content/stats";

export const metadata: Metadata = {
  title: "О компании Инфологистик-24 — 10 лет помогаем грузоперевозчикам",
  description:
    "Инфологистик-24 — сервис оформления пропусков в Москву с 2016 года. 50 000+ оформленных пропусков, 98% одобрение, 30-50 специалистов в команде.",
  openGraph: {
    title: "О компании Инфологистик-24 — 10 лет помогаем грузоперевозчикам",
    description:
      "Сервис оформления пропусков в Москву с 2016 года. 50 000+ пропусков, 98% одобрение.",
    type: "website",
  },
};

const timeline = [
  {
    year: "2016",
    title: "Основание компании",
    description:
      "Начали с команды из 5 человек, которая хорошо знала все тонкости работы с Департаментом транспорта Москвы.",
  },
  {
    year: "2018",
    title: "1 000 пропусков",
    description:
      "Оформили тысячный пропуск. Расширили команду до 15 человек, добавили работу с ТТК и Садовым кольцом.",
  },
  {
    year: "2020",
    title: "Цифровизация",
    description:
      "Запустили личный кабинет клиента, автоматизировали отслеживание статусов заявок и уведомления.",
  },
  {
    year: "2022",
    title: "10 000 пропусков",
    description:
      "Преодолели отметку в 10 000 оформленных пропусков. Стали одним из крупнейших операторов на рынке.",
  },
  {
    year: "2024",
    title: "30 000+ пропусков",
    description:
      "Команда выросла до 30-50 специалистов. Добавили юридическую поддержку и обжалование штрафов.",
  },
  {
    year: "2026",
    title: "50 000+ пропусков",
    description:
      "Интеграция с системой ГосЛог, запуск AI-консультанта, полная автоматизация процессов оформления.",
  },
];

const values = [
  {
    icon: Zap,
    title: "Скорость",
    description:
      "Делаем быстрее всех на рынке. Средний срок оформления — 3 дня. Временный пропуск — за 1 день. Мы ценим ваше время.",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Shield,
    title: "Надёжность",
    description:
      "Гарантия результата в 98% случаев. Берём сложные случаи после отказов. Повторная подача — бесплатно. Не оформим — вернём деньги.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Smile,
    title: "Простота",
    description:
      "Клиент передаёт документы и забывает о проблеме. Мы проверяем, подаём заявку, сопровождаем и выдаём готовый пропуск.",
    color: "bg-green-500/10 text-green-600",
  },
];

const teamRoles = [
  {
    icon: Users,
    role: "Менеджеры по работе с клиентами",
    desc: "Принимают заявки, консультируют, сопровождают весь процесс оформления от первого звонка до получения пропуска.",
  },
  {
    icon: FileCheck,
    role: "Специалисты по оформлению",
    desc: "Готовят документы, подают заявки в Дептранс через ГосЛог, работают с возражениями и повторными подачами.",
  },
  {
    icon: Scale,
    role: "Юристы",
    desc: "Помогают в сложных случаях, обжалуют штрафы, консультируют по правовым вопросам и изменениям в законодательстве.",
  },
];

const trustItems = [
  "Работаем по договору с каждым клиентом",
  "Официально зарегистрированная компания (ООО)",
  "ИНН, ОГРН — все данные в открытом доступе",
  "Возврат средств при невыполнении обязательств",
  "Конфиденциальность персональных данных",
  "10 лет безупречной репутации на рынке",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="secondary"
            className="mb-6"
          >
            С 2016 года на рынке
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            10 лет помогаем грузоперевозчикам работать в Москве без штрафов
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {companyInfo.description}
          </p>
        </div>
      </section>

      {/* Big Numbers */}
      <Stats stats={stats} />

      {/* Our Story Timeline */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                Наша история
              </h2>
              <p className="mt-4 text-muted-foreground">
                Путь от небольшой команды до крупнейшего оператора пропусков в
                Москве
              </p>
            </div>
          </FadeIn>

          <div className="relative mt-12">
            {/* Vertical line */}
            <div
              className="absolute left-4 top-0 hidden h-full w-0.5 bg-muted-foreground/20 sm:left-1/2 sm:block sm:-translate-x-1/2"
              aria-hidden="true"
            />

            <div className="space-y-8 sm:space-y-12">
              {timeline.map((item, index) => (
                <FadeIn
                  key={item.year}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.1}
                >
                  <div
                    className={`relative flex flex-col sm:flex-row ${
                      index % 2 === 0
                        ? "sm:flex-row"
                        : "sm:flex-row-reverse"
                    } items-start gap-4 sm:gap-8`}
                  >
                    {/* Year dot */}
                    <div className="hidden sm:absolute sm:left-1/2 sm:flex sm:-translate-x-1/2 sm:items-center sm:justify-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-accent">
                        <div className="size-3 rounded-full bg-accent-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 rounded-2xl p-4 sm:p-5 ${
                        index % 2 === 0
                          ? "bg-card sm:mr-8 sm:text-right"
                          : "bg-primary text-primary-foreground sm:ml-8 sm:text-left"
                      }`}
                    >
                      <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                        index % 2 === 0
                          ? "bg-primary/10 text-primary"
                          : "bg-primary-foreground/10 text-primary-foreground"
                      }`}>
                        {item.year}
                      </span>
                      <h3 className={`mt-2 text-lg font-semibold ${
                        index % 2 === 0 ? "text-foreground" : "text-primary-foreground"
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`mt-1 text-sm leading-relaxed ${
                        index % 2 === 0 ? "text-muted-foreground" : "text-primary-foreground/70"
                      }`}>
                        {item.description}
                      </p>
                    </div>

                    {/* Spacer for the other side */}
                    <div className="hidden flex-1 sm:block" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                Наши ценности
              </h2>
              <p className="mt-4 text-muted-foreground">
                Три принципа, на которых строится наша работа
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="h-full rounded-2xl border-0 bg-card shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                    <div
                      className={`flex size-16 items-center justify-center rounded-2xl ${value.color}`}
                    >
                      <value.icon className="size-8" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Наша миссия
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {companyInfo.mission}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Our Team */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl rounded-3xl bg-primary p-6 sm:p-8 lg:p-12">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">
                Наша команда
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/70">
                {companyInfo.team.count} специалистов, которые ежедневно помогают
                перевозчикам работать в Москве
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-primary-foreground/60">
                {companyInfo.team.description}
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {teamRoles.map((item) => (
              <StaggerItem key={item.role}>
                <Card className="h-full rounded-2xl border-0 bg-primary-foreground/10 shadow-none transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/20">
                      <item.icon className="size-7 text-accent" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-primary-foreground">
                      {item.role}
                    </h3>
                    <p className="mt-2 text-sm text-primary-foreground/60">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Team photo */}
          <FadeIn delay={0.3}>
            <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl aspect-[16/9]">
              <Image
                src="/images/team-office.jpg"
                alt="Команда Инфологистик-24 в офисе"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                Почему нам доверяют
              </h2>
              <p className="mt-4 text-muted-foreground">
                Мы работаем прозрачно и несём ответственность за результат
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card className="mt-10 rounded-3xl border-0 bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {trustItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl bg-background p-6">
                  <h3 className="text-sm font-semibold text-foreground">
                    Реквизиты компании
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-foreground">
                        Название:
                      </span>{" "}
                      {companyInfo.fullName}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">ИНН:</span>{" "}
                      7714XXXXXX
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        ОГРН:
                      </span>{" "}
                      116XXXXXXXXXXX
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Год основания:
                      </span>{" "}
                      {companyInfo.foundedYear}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <CtaSection />
    </>
  );
}
