import { Mail, MapPin, Phone, Truck } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const serviceLinks = [
  { href: "/uslugi/mkad", label: "Пропуск на МКАД" },
  { href: "/uslugi/ttk", label: "Пропуск на ТТК" },
  { href: "/uslugi/sadovoe", label: "Пропуск на Садовое" },
  { href: "/tarify", label: "Тарифы" },
];

const infoLinks = [
  { href: "/faq", label: "Частые вопросы" },
  { href: "/blog", label: "Блог" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/o-kompanii", label: "О компании" },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn("border-t bg-muted/50", className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Truck className="size-6 text-primary" />
              <span className="text-lg font-bold">Инфологистик-24</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Оформление пропусков в Москву для грузового транспорта с 2016 года.
              Быстро, надёжно, с гарантией результата.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Услуги</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Информация
            </h3>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+74951234567"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" />
                  +7 (495) 123-45-67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@infolog24.ru"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" />
                  info@infolog24.ru
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  Москва, ул. Примерная, д. 1
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>&copy; 2016&ndash;2026 ООО &laquo;Инфологистик-24&raquo;</p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/oferta"
              className="transition-colors hover:text-foreground"
            >
              Оферта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
