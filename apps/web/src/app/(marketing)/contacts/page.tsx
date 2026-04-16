import {
  Bot,
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";

import { FadeIn } from "@/components/motion/fade-in";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { companyInfo } from "@/content/company";

import { ContactForm } from "./contact-form";

// ISR: revalidate every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Контакты — Инфолог24, ответим за 5 минут",
  description:
    "Свяжитесь с Инфолог24 для оформления пропуска в Москву. Телефон, MAX, AI-ассистент, email. Ответим за 5 минут в рабочее время. Пн–Пт: 9:00–20:00.",
  keywords: [
    "контакты Инфолог24",
    "телефон пропуска Москва",
    "заказать пропуск",
  ],
  openGraph: {
    title: "Контакты — Инфолог24",
    description:
      "Свяжитесь с нами для оформления пропуска в Москву. Ответим за 5 минут.",
    type: "website",
    url: "https://inlog24.ru/contacts",
    siteName: "Инфолог24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Контакты — Инфолог24",
    description:
      "Свяжитесь с нами для оформления пропуска в Москву. Ответим за 5 минут.",
  },
  alternates: {
    canonical: "https://inlog24.ru/contacts",
  },
};

const contactCards = [
  {
    icon: Phone,
    title: "Телефон",
    value: companyInfo.contacts.phoneFormatted,
    href: `tel:${companyInfo.contacts.phoneTel}`,
    description: "Звоните в рабочее время",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Bot,
    title: "AI-ассистент",
    value: "Открыть чат",
    href: "#open-chat",
    description: "Ответит за 60 секунд, 24/7",
    color: "bg-accent/15 text-accent",
    aiChat: true,
  },
  {
    icon: MessageSquare,
    title: "MAX",
    value: "@infolog24",
    href: companyInfo.social.find((s) => s.name === "MAX")?.url ?? "https://max.ru/infolog24",
    description: "Российский мессенджер",
    color: "bg-primary/10 text-primary",
    external: true,
  },
  {
    icon: Mail,
    title: "Email",
    value: companyInfo.contacts.email,
    href: `mailto:${companyInfo.contacts.email}`,
    description: "Для документов и запросов",
    color: "bg-foreground/10 text-foreground",
  },
];

export default function ContactsPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Свяжитесь с нами
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Ответим за 5 минут в рабочее время
          </p>
          <Badge
            variant="secondary"
            className="mt-4"
          >
            <Clock className="mr-1 size-3" />
            Пн-Пт: 9:00-20:00, Сб: 10:00-17:00
          </Badge>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => {
              const inner = (
                <Card className="h-full rounded-2xl border-0 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
                    <div
                      className={`flex size-14 items-center justify-center rounded-2xl ${card.color}`}
                    >
                      <card.icon className="size-7" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-base font-bold text-primary">
                      {card.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              );

              return (
                <StaggerItem key={card.title}>
                  {card.aiChat ? (
                    <OpenChatTrigger className="block h-full rounded-2xl">
                      {inner}
                    </OpenChatTrigger>
                  ) : (
                    <a
                      href={card.href}
                      target={card.external ? "_blank" : undefined}
                      rel={card.external ? "noopener noreferrer" : undefined}
                      className="block h-full"
                    >
                      {inner}
                    </a>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Form + Info Grid */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <FadeIn direction="left">
              <ContactForm />
            </FadeIn>

            {/* Info Side */}
            <FadeIn direction="right" delay={0.1}>
              <div className="space-y-6">
                {/* Working Hours */}
                <Card className="rounded-2xl border-0 bg-card shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="size-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Время работы
                      </h3>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                        <span className="text-sm text-foreground">
                          Понедельник — Пятница
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          9:00 — 20:00
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                        <span className="text-sm text-foreground">
                          Суббота
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          10:00 — 17:00
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                        <span className="text-sm text-foreground">
                          Воскресенье
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">
                          Выходной
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      В мессенджерах отвечаем и в нерабочее время — обычно в
                      течение часа
                    </p>
                  </CardContent>
                </Card>

                {/* Map Placeholder */}
                <Card className="overflow-hidden rounded-2xl border-0 bg-primary shadow-sm">
                  <div className="relative">
                    <div className="flex h-[250px] items-center justify-center bg-primary-foreground/5">
                      <div className="text-center">
                        <MapPin className="mx-auto size-10 text-primary-foreground/30" />
                        <p className="mt-2 text-sm font-medium text-primary-foreground/70">
                          г. Москва
                        </p>
                        <p className="mt-1 text-xs text-primary-foreground/50">
                          Яндекс Карта будет подключена после публикации
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                      <p className="text-sm text-primary-foreground/70">
                        {companyInfo.contacts.physicalAddress}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Legal Info */}
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <Card className="rounded-3xl border-0 bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Реквизиты компании
                  </h2>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-background px-4 py-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      Полное наименование
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.legal.legalName}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <p className="text-xs text-muted-foreground">ИНН</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.legal.inn}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <p className="text-xs text-muted-foreground">КПП</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.legal.kpp}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">ОГРН</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.legal.ogrn}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      Юридический адрес
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.contacts.legalAddress}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Генеральный директор
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.legal.director}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Дата регистрации
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.legal.registrationDate}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.contacts.email}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3">
                    <p className="text-xs text-muted-foreground">Телефон</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.contacts.phoneFormatted}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background px-4 py-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      Основной ОКВЭД
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyInfo.legal.okved} —{" "}
                      {companyInfo.legal.okvedDescription}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
