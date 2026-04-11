import { Bot, Building2, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { companyInfo } from "@/content/company";
import { cn } from "@/lib/utils";

const serviceLinks = [
  { href: "/services/propusk-mkad", label: "Пропуск на МКАД" },
  { href: "/services/propusk-ttk", label: "Пропуск на ТТК" },
  { href: "/services/propusk-sk", label: "Пропуск на Садовое" },
  { href: "/services/vremennyj-propusk", label: "Временный пропуск" },
  { href: "/goslog", label: "Регистрация в ГосЛог" },
  { href: "/etrn", label: "Переход на ЭТрН" },
  { href: "/pricing", label: "Тарифы" },
];

const companyLinks = [
  { href: "/about", label: "О нас" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];

const trustItems = [
  { value: "10 лет", label: "на рынке" },
  { value: "50 000+", label: "пропусков" },
  { value: "98%", label: "одобрение" },
  { value: "Договор", label: "с каждым клиентом" },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const maxLink = companyInfo.social.find((s) => s.name === "MAX");

  return (
    <footer className={cn(className)}>
      {/* Trust Bar */}
      <div className="border-b border-primary-foreground/10 bg-primary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-primary-foreground/10 md:py-12 lg:px-8">
          {trustItems.map((item) => (
            <div
              key={item.value}
              className="flex flex-col items-center justify-center px-4 text-center md:px-6"
            >
              <span className="block font-[family-name:var(--font-manrope)] text-2xl font-extrabold leading-none text-primary-foreground sm:text-3xl lg:text-4xl">
                {item.value}
              </span>
              <span className="mt-2 text-sm text-primary-foreground/60 sm:text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-primary text-primary-foreground/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 — Brand + AI chat trigger + MAX */}
            <div className="order-last space-y-5 sm:order-first lg:order-first">
              <Logo
                size={36}
                textClassName="text-primary-foreground"
                iconClassName="text-accent"
              />
              <p className="text-sm leading-relaxed text-primary-foreground/50">
                Оформление пропусков в Москву для грузового транспорта с 2016
                года. Быстро, надёжно, с гарантией результата.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <OpenChatTrigger
                  className="inline-flex w-auto items-center gap-2 rounded-full bg-primary-foreground/5 px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-accent/20 hover:text-accent"
                  ariaLabel="Открыть AI-ассистента в чате"
                >
                  <Bot className="size-4 text-accent" />
                  AI-ассистент в чате
                </OpenChatTrigger>
                {maxLink && (
                  <a
                    href={maxLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/5 px-4 py-2 text-xs font-semibold text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    aria-label="Написать в MAX"
                  >
                    <span className="flex size-4 items-center justify-center rounded-sm bg-accent/80 text-[8px] font-black text-white">
                      M
                    </span>
                    MAX
                  </a>
                )}
              </div>
            </div>

            {/* Column 2 — Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground">
                Услуги
              </h3>
              <ul className="space-y-2.5">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/50 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Company */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground">
                Компания
              </h3>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/50 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Contacts */}
            <div className="order-first space-y-4 sm:order-last lg:order-last">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground">
                Контакты
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`tel:${companyInfo.contacts.phoneTel}`}
                    className="flex items-center gap-2.5 text-base font-bold text-primary-foreground transition-colors hover:text-accent"
                  >
                    <Phone className="size-4 shrink-0 text-accent" />
                    {companyInfo.contacts.phoneFormatted}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${companyInfo.contacts.email}`}
                    className="flex items-center gap-2.5 text-sm text-primary-foreground/50 transition-colors hover:text-accent"
                  >
                    <Mail className="size-4 shrink-0" />
                    {companyInfo.contacts.email}
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2.5 text-sm text-primary-foreground/50">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    {companyInfo.contacts.physicalAddress}
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-2.5 text-sm text-primary-foreground/50">
                    <Clock className="size-4 shrink-0" />
                    {companyInfo.contacts.workingHours}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Юр-блок: ИНН/ОГРН/КПП/директор + полное название */}
          <div className="mt-12 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Building2 className="size-4 text-primary-foreground/70" />
              </div>
              <div className="flex-1 space-y-2 text-xs leading-relaxed text-primary-foreground/60 sm:text-sm">
                <p className="font-semibold text-primary-foreground/90">
                  {companyInfo.legal.legalNameShort}
                </p>
                <p>
                  ИНН {companyInfo.legal.inn} · КПП {companyInfo.legal.kpp} ·
                  ОГРН {companyInfo.legal.ogrn}
                </p>
                <p>
                  Юридический адрес: {companyInfo.contacts.legalAddress}
                </p>
                <p>
                  Генеральный директор: {companyInfo.legal.director}. Дата
                  регистрации: {companyInfo.legal.registrationDate}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 text-center text-xs text-primary-foreground/40 sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span>
                &copy; {companyInfo.foundedYear}&ndash;{currentYear}{" "}
                {companyInfo.legal.legalNameShort}
              </span>
              <span className="hidden sm:inline">&middot;</span>
              <span>ИНН {companyInfo.legal.inn}</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>ОГРН {companyInfo.legal.ogrn}</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="transition-colors hover:text-accent"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-accent"
              >
                Оферта
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
