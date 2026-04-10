"use client";

import { Menu, Phone, Truck } from "lucide-react";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/tarify", label: "Тарифы" },
  { href: "/o-kompanii", label: "О компании" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/kontakty", label: "Контакты" },
  { href: "/blog", label: "Блог" },
];

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Truck className="size-6 text-primary lg:size-7" />
          <span className="text-lg font-bold text-foreground lg:text-xl">
            Инфологистик-24
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
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
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+74951234567"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <Phone className="size-4 text-primary" />
            +7 (495) 123-45-67
          </a>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/zayavka">Оформить пропуск</Link>
          </Button>
        </div>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-2 lg:hidden">
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
    </header>
  );
}
