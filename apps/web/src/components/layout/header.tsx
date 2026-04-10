"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Clock,
  Mail,
  Menu,
  Phone,
  PhoneCall,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/pricing", label: "Тарифы" },
  { href: "/about", label: "О компании" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
  { href: "/blog", label: "Блог" },
];

const passTypes = [
  {
    href: "/services/mkad",
    title: "Пропуск на МКАД",
    price: "от 4 800 ₽",
    description: "Для грузовиков свыше 3,5 тонн",
  },
  {
    href: "/services/ttk",
    title: "Пропуск на ТТК",
    price: "от 9 500 ₽",
    description: "Третье транспортное кольцо",
  },
  {
    href: "/services/sadovoe",
    title: "Пропуск на Садовое",
    price: "от 14 000 ₽",
    description: "Садовое кольцо и центр",
  },
  {
    href: "/services/temporary",
    title: "Временный пропуск",
    price: "от 3 500 ₽",
    description: "Разовый въезд на 1-5 дней",
  },
];

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openDropdown = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-300",
        scrolled ? "shadow-[0_2px_20px_-4px_rgba(28,28,30,0.08)]" : "",
        className
      )}
    >
      {/* Top Bar — Desktop only */}
      <div className="hidden border-b border-border/60 bg-background/80 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Пн-Пт 9:00-20:00
            </span>
            <a
              href="mailto:info@infolog24.ru"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Mail className="size-3.5" />
              info@infolog24.ru
            </a>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
            onClick={() => {
              const el = document.getElementById("callback-widget-trigger");
              if (el) el.click();
            }}
          >
            <PhoneCall className="size-3.5" />
            Перезвоните мне
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary lg:size-9">
              <Truck className="size-5 text-white lg:size-5" />
            </div>
            <span className="font-[family-name:var(--font-manrope)] text-lg font-extrabold tracking-tight text-foreground lg:text-xl">
              Инфологистик-24
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {/* Пропуска dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <Link
                href="/services"
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                Пропуска
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </Link>

              {/* Mega Menu Dropdown */}
              {dropdownOpen && (
                <div className="absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 pt-2">
                  <div className="rounded-2xl border border-border/60 bg-card p-2 shadow-[0_8px_30px_-4px_rgba(28,28,30,0.12)]">
                    <div className="grid grid-cols-2 gap-1">
                      {passTypes.map((pass) => (
                        <Link
                          key={pass.href}
                          href={pass.href}
                          className="group rounded-lg p-3 transition-colors hover:bg-primary/5"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                              {pass.title}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {pass.description}
                          </p>
                          <span className="mt-1.5 inline-block text-sm font-bold text-accent">
                            {pass.price}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-1 border-t pt-2">
                      <Link
                        href="/services"
                        className="flex items-center justify-center rounded-lg p-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Все услуги
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-[15px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="tel:+74951234567"
              className="group flex items-center gap-2"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Phone className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-tight text-foreground">
                  +7 (495) 123-45-67
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Бесплатная консультация
                </span>
              </div>
            </a>
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-accent text-accent-foreground shadow-sm hover:bg-accent/90"
            >
              <Link href="#zayavka">Оформить пропуск</Link>
            </Button>
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Button variant="ghost" size="icon" asChild>
              <a href="tel:+74951234567" aria-label="Позвонить">
                <Phone className="size-5 text-primary" />
              </a>
            </Button>
            <MobileNav>
              <Button variant="ghost" size="icon" aria-label="Открыть меню">
                <Menu className="size-5" />
              </Button>
            </MobileNav>
          </div>
        </div>
      </div>
    </header>
  );
}
