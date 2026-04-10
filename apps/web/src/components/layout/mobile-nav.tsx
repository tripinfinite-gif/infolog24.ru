"use client";

import { Phone, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/tarify", label: "Тарифы" },
  { href: "/o-kompanii", label: "О компании" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/kontakty", label: "Контакты" },
  { href: "/blog", label: "Блог" },
];

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex items-center gap-2">
              <Truck className="size-6 text-primary" />
              <span className="text-lg font-bold">Инфологистик-24</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t p-4">
          <a
            href="tel:+74951234567"
            className="flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <Phone className="size-5 text-primary" />
            +7 (495) 123-45-67
          </a>
          <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/zayavka">Оформить пропуск</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
