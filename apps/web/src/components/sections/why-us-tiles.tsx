import {
  ArrowUpRight,
  Award,
  Bot,
  Layers,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface WhyUsTilesProps {
  className?: string;
}

interface Tile {
  title: string;
  description: string;
  icon: LucideIcon;
  metric?: { value: string; label: string };
  tone: "dark" | "accent" | "soft" | "highlight";
  span: "wide" | "tall" | "square";
  href?: string;
}

// Bento 4-items, asymmetric:
// ┌────────────────────┬──────────┐
// │ Award (wide, dark) │ Shield   │
// ├──────────┬─────────┴──────────┤
// │ Layers   │ Bot (wide, accent) │
// └──────────┴────────────────────┘

const tiles: Tile[] = [
  {
    title: "10 лет на рынке",
    description:
      "С 2016 года. Более 50 000 оформленных пропусков. Юрлицо с 2016 года. Договор и чеки с каждым клиентом.",
    icon: Award,
    metric: { value: "50K+", label: "пропусков оформлено" },
    tone: "dark",
    span: "wide",
  },
  {
    title: "Гарантия результата",
    description:
      "Пропуск не выдали — вернём деньги. Аннулировали — переоформим бесплатно.",
    icon: ShieldCheck,
    tone: "soft",
    span: "square",
  },
  {
    title: "Собственная платформа",
    description:
      "Личный кабинет, API, уведомления, дашборд парка. Всё в одном окне, без лишних звеньев.",
    icon: Layers,
    tone: "soft",
    span: "square",
  },
  {
    title: "ИнфоПилот 24/7",
    description:
      "Первыми на рынке пропусков запустили ИИ-диспетчера. Помогает водителю прямо на трассе.",
    icon: Bot,
    metric: { value: "24/7", label: "на связи" },
    tone: "accent",
    span: "wide",
    href: "/infopilot",
  },
];

function getToneClasses(tone: Tile["tone"]) {
  switch (tone) {
    case "dark":
      return {
        card: "bg-gradient-to-br from-[oklch(0.22_0.06_290)] via-[oklch(0.18_0.04_280)] to-[oklch(0.12_0.02_280)] ring-neon text-foreground",
        icon: "bg-foreground/5 text-[var(--amber)] ring-1 ring-border/80",
        body: "text-foreground/70",
        blob: "bg-[var(--amber)]/15",
      };
    case "accent":
      return {
        card: "bg-gradient-to-br from-[var(--violet)] to-[oklch(0.55_0.22_285)] text-accent-foreground",
        icon: "bg-background/15 text-accent-foreground ring-1 ring-foreground/10",
        body: "text-accent-foreground/90",
        blob: "bg-background/20",
      };
    case "highlight":
      return {
        card: "bg-gradient-to-br from-[var(--amber)] to-[oklch(0.65_0.18_50)] text-[oklch(0.15_0.02_280)]",
        icon: "bg-background/10 text-[oklch(0.15_0.02_280)]",
        body: "text-[oklch(0.15_0.02_280)]/85",
        blob: "bg-background/20",
      };
    default:
      return {
        card: "glass hover:ring-neon-cyan",
        icon: "bg-foreground/5 text-[var(--cyan)] ring-1 ring-border/80",
        body: "text-muted-foreground",
        blob: "bg-[var(--cyan)]/10",
      };
  }
}

export function WhyUsTiles({ className }: WhyUsTilesProps) {
  return (
    <section className={cn("relative mx-auto w-full max-w-7xl space-y-10", className)}>
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <span className="eyebrow">why · four reasons</span>
          <h2 className="section-title mt-6 text-foreground">
            Четыре вещи, которые{" "}
            <span className="display-italic gradient-text">
              отличают нас
            </span>{" "}
            от&nbsp;90% рынка
          </h2>
        </div>
      </div>

      {/* Bento 4-items */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:grid-rows-2">
        {tiles.map((tile, idx) => {
          const Icon = tile.icon;
          const cls = getToneClasses(tile.tone);
          const gridClass =
            tile.span === "wide"
              ? "md:col-span-2"
              : "md:col-span-1";
          const CardTag: "a" | "div" = tile.href ? "a" : "div";

          return (
            <CardTag
              key={tile.title}
              {...(tile.href
                ? ({
                    href: tile.href,
                    "aria-label": tile.title,
                  } as Record<string, string>)
                : {})}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[28px] p-6 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8",
                cls.card,
                gridClass
              )}
            >
              {/* Decorative blob */}
              <div
                className={cn(
                  "pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl",
                  cls.blob
                )}
                aria-hidden="true"
              />

              {/* Top row: icon + optional arrow if linked */}
              <div className="relative flex items-start justify-between">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    cls.icon
                  )}
                >
                  <Icon className="size-6" />
                </div>
                {tile.href && (
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent-foreground/15 text-accent-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight className="size-5" />
                  </div>
                )}
              </div>

              {/* Big metric for wide cards */}
              {tile.metric && tile.span === "wide" && (
                <div className="relative mt-6">
                  <div className="stat-number text-5xl sm:text-6xl">
                    {tile.metric.value}
                  </div>
                  <div className={cn("text-xs font-medium uppercase tracking-wider opacity-70", cls.body)}>
                    {tile.metric.label}
                  </div>
                </div>
              )}

              <h3
                className={cn(
                  "relative font-heading font-bold tracking-tight",
                  tile.span === "wide"
                    ? "mt-6 text-2xl sm:text-3xl"
                    : "mt-6 text-xl sm:text-2xl",
                )}
              >
                {tile.title}
              </h3>
              <p
                className={cn(
                  "relative mt-2 flex-1 text-sm leading-relaxed sm:text-base",
                  cls.body
                )}
              >
                {tile.description}
              </p>

              {tile.href && (
                <Link
                  href={tile.href}
                  className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground/90 underline-offset-4 hover:underline"
                >
                  Читать подробно
                  <ArrowUpRight className="size-4" />
                </Link>
              )}

              {/* Corner index */}
              <span
                className={cn(
                  "absolute bottom-5 right-6 font-heading text-sm font-semibold opacity-40 tracking-widest"
                )}
              >
                0{idx + 1}
              </span>
            </CardTag>
          );
        })}
      </div>
    </section>
  );
}
