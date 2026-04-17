"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  ChevronDown,
  Clock,
  Layers,
  Mail,
  Menu,
  Phone,
  PhoneCall,
  Shield,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { companyInfo } from "@/content/company";
import { cn } from "@/lib/utils";

// ----- Типы -----
type MenuItem = {
  href: string;
  title: string;
  description?: string;
  badge?: "hit" | "new";
  deadline?: string;
};

type MenuSection = {
  key: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: "new";
  matchPrefix?: string;
  items?: MenuItem[];
  columns?: 1 | 2;
  promo?: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

// ----- Данные меню -----
const sections: MenuSection[] = [
  {
    key: "resheniya",
    label: "Решения",
    href: "/resheniya",
    icon: Layers,
    matchPrefix: "/resheniya",
    columns: 1,
    items: [
      {
        href: "/ekosistema",
        title: "Экосистема Инфолог24",
        description: "Все услуги автопарка в одном кабинете",
        badge: "new",
      },
      {
        href: "/resheniya/propusk-plus",
        title: "Пропуск+",
        description: "Пропуск + РНИС + ЭТрН. Для 1–4 машин.",
      },
      {
        href: "/resheniya/tranzit-moskva",
        title: "Транзит Москва",
        description: "+ ГосЛог + Антиштраф. Для 5–20 машин.",
        badge: "hit",
      },
      {
        href: "/resheniya/flot-pro",
        title: "Флот Про",
        description: "Корпоративный ЛК, API, SLA. Для парков 10+.",
      },
      {
        href: "/park-pro",
        title: "Парк Про — ЛК",
        description: "Управление автопарком. Бесплатный тариф.",
      },
      {
        href: "/resheniya#podbor",
        title: "Подобрать пакет",
        description: "Калькулятор под размер автопарка",
      },
    ],
    promo: {
      title: "Пакетная экономия до 25%",
      description:
        "Внутри пакета услуги дешевле, чем покупать по отдельности.",
      ctaLabel: "Смотреть экосистему",
      ctaHref: "/ekosistema",
    },
  },
  {
    key: "propuska",
    label: "Пропуска",
    href: "/services",
    icon: Truck,
    matchPrefix: "/services",
    columns: 2,
    items: [
      {
        href: "/services/propusk-mkad",
        title: "Пропуск на МКАД",
        description: "Для грузовиков свыше 3,5 тонн",
      },
      {
        href: "/services/propusk-ttk",
        title: "Пропуск на ТТК",
        description: "Третье транспортное кольцо",
      },
      {
        href: "/services/propusk-sk",
        title: "Пропуск на Садовое",
        description: "Садовое кольцо и центр",
      },
      {
        href: "/services/vremennyj-propusk",
        title: "Временный пропуск",
        description: "Разовый въезд на 1–5 дней",
      },
      {
        href: "/check-status",
        title: "Проверить статус",
        description: "Узнать готовность пропуска",
      },
    ],
  },
  {
    key: "infopilot",
    label: "ИнфоПилот",
    href: "/infopilot",
    icon: Sparkles,
    badge: "new",
    matchPrefix: "/infopilot",
    columns: 1,
    items: [
      {
        href: "/infopilot",
        title: "Как работает ИнфоПилот",
        description: "ИИ-диспетчер на трассе 24/7",
      },
      {
        href: "/infopilot/evakuaciya",
        title: "Эвакуация 24/7",
        description: "Вызов эвакуатора одной кнопкой",
      },
      {
        href: "/infopilot/diagnostika",
        title: "Диагностическая карта",
        description: "Оформление без очередей",
      },
      {
        href: "/infopilot/remont",
        title: "Ремонт грузовиков",
        description: "Проверенные СТО по маршруту",
      },
      {
        href: "/infopilot/mojki",
        title: "Мойки грузовых",
        description: "Сеть моек с фикс-ценой",
      },
      {
        href: "/infopilot/strahovanie",
        title: "Страхование",
        description: "ОСАГО, КАСКО, грузы",
      },
      {
        href: "/infopilot/obzhalovanie",
        title: "Обжалование штрафов",
        description: "Юрист по дорожным штрафам",
      },
    ],
    promo: {
      title: "Открыть ИнфоПилот в Telegram",
      description: "Диспетчер ответит за 60 секунд. Онлайн 24/7.",
      ctaLabel: "Запустить бота",
      ctaHref: "https://t.me/infolog24_bot",
    },
  },
  {
    key: "regulatorika",
    label: "Регуляторика",
    href: "/regulatorika",
    icon: Shield,
    matchPrefix: "/regulatorika",
    columns: 1,
    items: [
      {
        href: "/goslog",
        title: "ГосЛог — регистрация",
        description: "Экспедиторы — до 30.04.2026",
        deadline: "30.04.2026",
      },
      {
        href: "/etrn",
        title: "ЭТрН — переход",
        description: "Обязательна с 01.09.2026",
        deadline: "01.09.2026",
      },
      {
        href: "/kep",
        title: "КЭП и МЧД",
        description: "Подпись и доверенность, 1–3 дня",
        badge: "new",
      },
      {
        href: "/regulatorika/rnis",
        title: "РНИС — подключение",
        description: "Строго обязательна",
      },
      {
        href: "/monitoring",
        title: "Антиштраф",
        description: "Мониторинг штрафов парка, подписка",
        badge: "new",
      },
      {
        href: "/yurist",
        title: "Юрист-перевозчик",
        description: "Перегруз, лизинг, дебиторка, договоры",
        badge: "new",
      },
      {
        href: "/regulatorika/kalendar",
        title: "Календарь дедлайнов",
        description: "Вся шкала регуляторики в одной линии",
      },
    ],
    promo: {
      title: "Сроки горят",
      description: "До обязательного ГосЛог осталось меньше месяца.",
      ctaLabel: "Смотреть календарь",
      ctaHref: "/regulatorika/kalendar",
    },
  },
  {
    key: "company",
    label: "Компания",
    href: "/about",
    icon: Building2,
    matchPrefix: "/about",
    columns: 2,
    items: [
      {
        href: "/about",
        title: "О нас",
        description: "10 лет, 15 000+ пропусков",
      },
      { href: "/reviews", title: "Отзывы", description: "Реальные кейсы" },
      { href: "/blog", title: "Блог и база знаний" },
      { href: "/partners", title: "Партнёрам", description: "Агентская программа" },
      {
        href: "/partners/infopilot",
        title: "Стать партнёром ИнфоПилота",
        description: "Для СТО, эвакуаторов, моек",
      },
      { href: "/blagotvoritelnost", title: "Благотворительность" },
      { href: "/contacts", title: "Контакты" },
      { href: "/faq", title: "FAQ" },
    ],
  },
];

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openDropdown = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveKey(key);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setActiveKey(null), 150);
  };

  const isActive = (section: MenuSection) => {
    if (!section.matchPrefix) return false;
    return pathname.startsWith(section.matchPrefix);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-300",
        scrolled ? "shadow-[0_2px_20px_-4px_rgba(28,28,30,0.08)]" : "",
        className
      )}
    >
      {/* Top Bar — Desktop only, shrinks to 0 on scroll */}
      <div
        className={cn(
          "hidden overflow-hidden border-b border-border/60 bg-background/80 transition-all duration-300 lg:block",
          scrolled
            ? "h-0 border-b-0 opacity-0"
            : "h-9 opacity-100"
        )}
        aria-hidden={scrolled}
      >
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {companyInfo.contacts.workingHours}
            </span>
            <a
              href={`mailto:${companyInfo.contacts.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Mail className="size-3.5" />
              {companyInfo.contacts.email}
            </a>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("infopilot:open"));
              }
            }}
          >
            <PhoneCall className="size-3.5" />
            Спросить AI-ассистента
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:h-[72px] lg:px-6 xl:px-8">
          {/* Logo */}
          <Logo size={36} />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-0 lg:flex">
            {sections.map((section) => {
              const active = isActive(section);
              const hasDropdown = section.items && section.items.length > 0;
              const open = activeKey === section.key;

              if (!hasDropdown) {
                return (
                  <Link
                    key={section.key}
                    href={section.href}
                    className={cn(
                      "rounded-md px-2.5 py-2 text-[14px] font-medium transition-colors hover:bg-muted hover:text-foreground xl:px-3 xl:text-[15px]",
                      active ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {section.label}
                  </Link>
                );
              }

              return (
                <div
                  key={section.key}
                  className="relative"
                  onMouseEnter={() => openDropdown(section.key)}
                  onMouseLeave={closeDropdown}
                >
                  <Link
                    href={section.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-[14px] font-medium transition-colors hover:bg-muted hover:text-foreground xl:px-3 xl:text-[15px]",
                      active ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {section.label}
                    {section.badge === "new" && (
                      <span className="ml-1 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-accent">
                        NEW
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        open && "rotate-180"
                      )}
                    />
                  </Link>

                  {open && (
                    <div
                      className={cn(
                        "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2",
                        section.promo
                          ? "w-[720px]"
                          : section.columns === 2
                            ? "w-[640px]"
                            : "w-[420px]"
                      )}
                    >
                      <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-[0_8px_30px_-4px_rgba(28,28,30,0.12)]">
                        <div
                          className={cn(
                            "grid gap-3",
                            section.promo
                              ? "grid-cols-[1fr_220px]"
                              : "grid-cols-1"
                          )}
                        >
                          <div
                            className={cn(
                              "grid gap-1",
                              section.columns === 2
                                ? "grid-cols-2"
                                : "grid-cols-1"
                            )}
                          >
                            {section.items!.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-lg p-2.5 transition-colors hover:bg-primary/5"
                                onClick={() => setActiveKey(null)}
                              >
                                <div className="flex items-baseline justify-between gap-2">
                                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                                    {item.title}
                                  </span>
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
                                </div>
                                {item.description && (
                                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </Link>
                            ))}
                          </div>

                          {section.promo && (
                            <div className="flex flex-col justify-between rounded-xl bg-primary/5 p-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  {section.icon ? (
                                    <section.icon className="size-4 text-primary" />
                                  ) : null}
                                  <span className="text-sm font-bold text-foreground">
                                    {section.promo.title}
                                  </span>
                                </div>
                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                  {section.promo.description}
                                </p>
                              </div>
                              <Link
                                href={section.promo.ctaHref}
                                className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                onClick={() => setActiveKey(null)}
                              >
                                {section.promo.ctaLabel}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-3 lg:flex xl:gap-4">
            <a
              href={`tel:${companyInfo.contacts.phoneTel}`}
              className="group hidden items-center gap-2 xl:flex"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Phone className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight text-foreground">
                  {companyInfo.contacts.phoneFormatted}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Бесплатная консультация
                </span>
              </div>
            </a>
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-accent text-accent-foreground shadow-sm hover:bg-accent/90"
            >
              <Link href="/dashboard">Личный кабинет</Link>
            </Button>
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Button variant="ghost" size="icon" asChild>
              <a
                href={`tel:${companyInfo.contacts.phoneTel}`}
                aria-label="Позвонить"
              >
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
