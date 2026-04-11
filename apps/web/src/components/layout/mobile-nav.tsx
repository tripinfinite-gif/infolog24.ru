"use client";

import { Clock, MessageCircle, Phone, Send, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/services", label: "Пропуска" },
  { href: "/pricing", label: "Тарифы" },
  { href: "/about", label: "О компании" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
  { href: "/blog", label: "Блог" },
];

const passLinks = [
  { href: "/services/propusk-mkad", label: "МКАД", price: "от 12 000 ₽" },
  { href: "/services/propusk-ttk", label: "ТТК", price: "от 12 000 ₽" },
  { href: "/services/propusk-sk", label: "Садовое", price: "от 12 000 ₽" },
  { href: "/services/vremennyj-propusk", label: "Временный", price: "от 3 500 ₽" },
];

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col bg-card sm:max-w-sm">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center gap-2.5"
              onClick={() => setOpen(false)}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Truck className="size-5 text-white" />
              </div>
              <span className="font-[family-name:var(--font-manrope)] text-lg font-extrabold tracking-tight">
                Инфологистик-24
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Phone */}
        <div className="px-4">
          <a
            href="tel:+74951234567"
            className="flex items-center gap-3 rounded-xl bg-primary/5 p-3"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Phone className="size-5 text-primary" />
            </div>
            <div>
              <span className="block text-lg font-bold text-foreground">
                +7 (495) 123-45-67
              </span>
              <span className="text-xs text-muted-foreground">
                Бесплатная консультация
              </span>
            </div>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-4">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted",
                  pathname === link.href
                    ? "text-primary bg-primary/5"
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}

          {/* Pass types sub-links */}
          <div className="mt-2 rounded-xl border bg-muted/30 p-3">
            <span className="mb-2 block px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Виды пропусков
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {passLinks.map((pass) => (
                <SheetClose asChild key={pass.href}>
                  <Link
                    href={pass.href}
                    className="rounded-lg p-2 text-center transition-colors hover:bg-background"
                  >
                    <span className="block text-sm font-semibold text-foreground">
                      {pass.label}
                    </span>
                    <span className="text-xs font-medium text-accent">
                      {pass.price}
                    </span>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom section */}
        <div className="mt-auto space-y-4 border-t p-4">
          {/* Working hours */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Пн-Пт 9:00-20:00</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href="https://t.me/infolog24"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-[#229ED9]/10 text-[#229ED9] transition-colors hover:bg-[#229ED9]/20"
              aria-label="Telegram"
            >
              <Send className="size-5" />
            </a>
            <a
              href="https://wa.me/74951234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-5" />
            </a>
          </div>

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className="w-full rounded-xl bg-accent text-accent-foreground shadow-sm hover:bg-accent/90"
          >
            <Link href="#zayavka" onClick={() => setOpen(false)}>
              Оформить пропуск
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
