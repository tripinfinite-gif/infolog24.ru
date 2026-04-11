"use client";

import {
  Building2,
  ChevronDown,
  Clock,
  Layers,
  LogIn,
  MessageCircle,
  Phone,
  Send,
  Shield,
  Sparkles,
  Truck,
} from "lucide-react";
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

// ----- Типы -----
type MobileMenuItem = {
  href: string;
  label: string;
  badge?: "hit" | "new";
  deadline?: string;
};

type MobileMenuSection = {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: "new";
  matchPrefix?: string;
  items?: MobileMenuItem[];
};

// ----- Данные меню -----
const sections: MobileMenuSection[] = [
  {
    key: "resheniya",
    label: "Решения",
    href: "/resheniya",
    icon: Layers,
    matchPrefix: "/resheniya",
    items: [
      { href: "/resheniya/propusk-plus", label: "Пропуск+" },
      { href: "/resheniya/tranzit-moskva", label: "Транзит Москва", badge: "hit" },
      { href: "/resheniya/flot-pro", label: "Флот Про" },
      { href: "/resheniya#podbor", label: "Подобрать пакет" },
    ],
  },
  {
    key: "propuska",
    label: "Пропуска",
    href: "/services",
    icon: Truck,
    matchPrefix: "/services",
    items: [
      { href: "/services/propusk-mkad", label: "Пропуск на МКАД" },
      { href: "/services/propusk-ttk", label: "Пропуск на ТТК" },
      { href: "/services/propusk-sk", label: "Пропуск на Садовое" },
      { href: "/services/vremennyj-propusk", label: "Временный пропуск" },
      { href: "/services/godovoj-propusk", label: "Годовой пропуск" },
      { href: "/check-status", label: "Проверить статус пропуска" },
      { href: "/pricing", label: "Калькулятор стоимости" },
    ],
  },
  {
    key: "infopilot",
    label: "ИнфоПилот",
    href: "/infopilot",
    icon: Sparkles,
    badge: "new",
    matchPrefix: "/infopilot",
    items: [
      { href: "/infopilot", label: "Как работает ИнфоПилот" },
      { href: "/infopilot/evakuaciya", label: "Эвакуация 24/7" },
      { href: "/infopilot/diagnostika", label: "Диагностическая карта" },
      { href: "/infopilot/remont", label: "Ремонт грузовиков" },
      { href: "/infopilot/mojki", label: "Мойки грузовых" },
      { href: "/infopilot/strahovanie", label: "Страхование" },
      { href: "/infopilot/obzhalovanie", label: "Обжалование штрафов" },
    ],
  },
  {
    key: "regulatorika",
    label: "Регуляторика",
    href: "/regulatorika",
    icon: Shield,
    matchPrefix: "/regulatorika",
    items: [
      { href: "/goslog", label: "ГосЛог", deadline: "30.04.2026" },
      { href: "/etrn", label: "ЭТрН", deadline: "01.09.2026" },
      { href: "/regulatorika/rnis", label: "РНИС" },
      { href: "/regulatorika/antishraf", label: "Антиштраф" },
      { href: "/regulatorika/yurist", label: "Юрист-перевозчик" },
      { href: "/regulatorika/kalendar", label: "Календарь дедлайнов" },
    ],
  },
  {
    key: "pricing",
    label: "Тарифы",
    href: "/pricing",
    icon: Truck,
    matchPrefix: "/pricing",
  },
  {
    key: "company",
    label: "Компания",
    href: "/about",
    icon: Building2,
    matchPrefix: "/about",
    items: [
      { href: "/about", label: "О нас" },
      { href: "/reviews", label: "Отзывы" },
      { href: "/blog", label: "Блог и база знаний" },
      { href: "/partners", label: "Партнёрам" },
      { href: "/partners/infopilot", label: "Стать партнёром ИнфоПилота" },
      { href: "/blagotvoritelnost", label: "Благотворительность" },
      { href: "/contacts", label: "Контакты" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  const toggle = (key: string) =>
    setExpanded((prev) => (prev === key ? null : key));

  const isActive = (section: MobileMenuSection) => {
    if (!section.matchPrefix) return false;
    if (section.matchPrefix === "/pricing") return pathname === "/pricing";
    return pathname.startsWith(section.matchPrefix);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col bg-card p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border/60 px-4 pb-4 pt-5">
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
        <div className="px-4 pt-4">
          <a
            href="tel:+74951234567"
            className="flex items-center gap-3 rounded-xl bg-primary/5 p-3"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Phone className="size-5 text-primary" />
            </div>
            <div>
              <span className="block text-base font-bold text-foreground">
                +7 (495) 123-45-67
              </span>
              <span className="text-xs text-muted-foreground">
                Бесплатная консультация
              </span>
            </div>
          </a>
        </div>

        {/* Navigation — accordion */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const active = isActive(section);
            const isOpen = expanded === section.key;
            const hasChildren = section.items && section.items.length > 0;

            if (!hasChildren) {
              return (
                <SheetClose asChild key={section.key}>
                  <Link
                    href={section.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-base font-semibold transition-colors hover:bg-muted",
                      active ? "bg-primary/5 text-primary" : "text-foreground"
                    )}
                  >
                    <Icon className="size-5 text-muted-foreground" />
                    {section.label}
                  </Link>
                </SheetClose>
              );
            }

            return (
              <div key={section.key} className="overflow-hidden rounded-md">
                <button
                  type="button"
                  onClick={() => toggle(section.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-base font-semibold transition-colors hover:bg-muted",
                    active ? "text-primary" : "text-foreground"
                  )}
                  aria-expanded={isOpen}
                >
                  <Icon className="size-5 text-muted-foreground" />
                  <span className="flex-1">{section.label}</span>
                  {section.badge === "new" && (
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-accent">
                      NEW
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="mb-1 ml-4 flex flex-col gap-0.5 border-l border-border/60 pl-3">
                    {section.items!.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                            pathname === item.href
                              ? "text-primary"
                              : "text-foreground/80"
                          )}
                        >
                          <span className="flex-1">{item.label}</span>
                          {item.badge === "hit" && (
                            <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-accent">
                              Хит
                            </span>
                          )}
                          {item.deadline && (
                            <span className="whitespace-nowrap rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold leading-none text-destructive">
                              {item.deadline}
                            </span>
                          )}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Личный кабинет */}
          <SheetClose asChild>
            <Link
              href="/dashboard"
              className="mt-2 flex items-center gap-3 rounded-md border border-border/60 px-3 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <LogIn className="size-5 text-primary" />
              Личный кабинет
            </Link>
          </SheetClose>
        </nav>

        {/* Bottom section */}
        <div className="mt-auto space-y-3 border-t border-border/60 p-4">
          {/* Working hours */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-4" />
            <span>Пн-Пт 9:00-20:00</span>
          </div>

          {/* Social / bot links */}
          <div className="flex items-center gap-2">
            <a
              href="https://t.me/infolog24_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#229ED9]/10 px-3 py-2.5 text-sm font-semibold text-[#229ED9] transition-colors hover:bg-[#229ED9]/20"
            >
              <Send className="size-4" />
              Бот ИнфоПилота
            </a>
            <a
              href="https://wa.me/74951234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
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
