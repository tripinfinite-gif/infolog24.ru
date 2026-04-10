import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const serviceLinks = [
  { href: "/services/mkad", label: "Пропуск на МКАД" },
  { href: "/services/ttk", label: "Пропуск на ТТК" },
  { href: "/services/sadovoe", label: "Пропуск на Садовое" },
  { href: "/services/temporary", label: "Временный пропуск" },
  { href: "/pricing", label: "Тарифы" },
];

const companyLinks = [
  { href: "/about", label: "О нас" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Блог" },
  { href: "/partner", label: "Партнёрство" },
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
  return (
    <footer className={cn(className)}>
      {/* Trust Bar */}
      <div className="bg-primary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
          {trustItems.map((item) => (
            <div key={item.value} className="text-center">
              <span className="block font-[family-name:var(--font-manrope)] text-xl font-extrabold text-primary-foreground sm:text-2xl">
                {item.value}
              </span>
              <span className="text-sm text-primary-foreground/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-primary text-primary-foreground/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 — About + Socials (order last on mobile, first on desktop) */}
            <div className="order-last space-y-5 sm:order-first lg:order-first">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Truck className="size-5 text-primary-foreground" />
                </div>
                <span className="font-[family-name:var(--font-manrope)] text-lg font-extrabold tracking-tight text-primary-foreground">
                  Инфологистик-24
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-primary-foreground/50">
                Оформление пропусков в Москву для грузового транспорта с 2016
                года. Быстро, надёжно, с гарантией результата.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://t.me/infolog24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/5 text-primary-foreground/50 transition-colors hover:bg-[#229ED9]/20 hover:text-[#229ED9]"
                  aria-label="Telegram"
                >
                  <Send className="size-5" />
                </a>
                <a
                  href="https://wa.me/74951234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/5 text-primary-foreground/50 transition-colors hover:bg-[#25D366]/20 hover:text-[#25D366]"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="size-5" />
                </a>
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

            {/* Column 4 — Contacts (first on mobile) */}
            <div className="order-first space-y-4 sm:order-last lg:order-last">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground">
                Контакты
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+74951234567"
                    className="flex items-center gap-2.5 text-base font-bold text-primary-foreground transition-colors hover:text-accent"
                  >
                    <Phone className="size-4 shrink-0 text-accent" />
                    +7 (495) 123-45-67
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@infolog24.ru"
                    className="flex items-center gap-2.5 text-sm text-primary-foreground/50 transition-colors hover:text-accent"
                  >
                    <Mail className="size-4 shrink-0" />
                    info@infolog24.ru
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2.5 text-sm text-primary-foreground/50">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    Москва, ул. Примерная, д. 1
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-2.5 text-sm text-primary-foreground/50">
                    <Clock className="size-4 shrink-0" />
                    Пн-Пт 9:00-20:00
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 text-center text-xs text-primary-foreground/40 sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span>
                &copy; 2016&ndash;2026 ООО &laquo;Инфологистик-24&raquo;
              </span>
              <span className="hidden sm:inline">&middot;</span>
              <span>ИНН XXXXXXXXXX</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>ОГРН XXXXXXXXXXXXXXX</span>
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
