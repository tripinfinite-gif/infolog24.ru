import { ArrowUpRight, Bot, Cpu, Radar, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

// v4 Hero · AI operations center aesthetic.
// Layout: massive italic serif display headline center-left, photographic
// frame hanging off the right as a portrait card with live metrics overlay.
// Decorative SVG "orbit" rings behind headline suggest ML/network activity.

const orbitNodes = [
  { label: "Пропуска", angle: 20 },
  { label: "РНИС", angle: 75 },
  { label: "ЭТрН", angle: 130 },
  { label: "ГосЛог", angle: 195 },
  { label: "Штрафы", angle: 255 },
  { label: "SOS 24/7", angle: 320 },
];

export function Hero({ className }: HeroProps) {
  return (
    <div
      className={cn("relative mx-auto w-full max-w-7xl", className)}
    >
      {/* Top meta-row: tiny mono labels, not a navbar */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex size-2 items-center justify-center">
            <span className="absolute size-2 animate-ping rounded-full bg-[var(--violet)]/70" />
            <span className="relative size-1.5 rounded-full bg-[var(--violet)]" />
          </span>
          status · platform.online
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <span>v4 · 2026</span>
          <span>moscow · rus</span>
          <span>infolog / 24-7</span>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
        {/* LEFT: headline + text + CTA */}
        <div className="relative">
          <span className="eyebrow">
            <Sparkles className="size-3" />
            Платформа для перевозчика · v4
          </span>

          <h1 className="display-text mt-8 text-foreground">
            Пропуск в Москву{" "}
            <span className="display-italic gradient-text">
              за день
            </span>
            <br />
            плюс регуляторика и&nbsp;ИИ-диспетчер 24/7.
          </h1>

          <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
            МКАД, ТТК, Садовое — оформляем с&nbsp;2016 года. В&nbsp;одном кабинете
            РНИС, ЭТрН, ГосЛог и&nbsp;мониторинг штрафов. ИнфоПилот подсказывает
            водителю прямо на&nbsp;трассе.
          </p>

          {/* CTA — primary button + text link */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="#mini-calculator"
              className="group relative inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-background transition-all hover:bg-[var(--violet)] hover:text-accent-foreground"
            >
              <span>Рассчитать пакет за 30 секунд</span>
              <span className="relative flex size-6 items-center justify-center rounded-full bg-background/10 transition-transform group-hover:translate-x-0.5">
                <ArrowUpRight className="size-3.5" />
              </span>
            </Link>
            <div className="flex flex-col gap-1">
              <OpenChatTrigger className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                <Bot className="size-3.5" />
                Спросить ИнфоПилот в&nbsp;чате
              </OpenChatTrigger>
              <span className="font-sans text-[11px] text-muted-foreground">
                Откроется чат, без регистрации
              </span>
            </div>
          </div>

          {/* KPI strip in mono */}
          <dl className="mt-14 grid grid-cols-3 divide-x divide-border/60">
            <div className="pr-6">
              <dt className="mono-label">50 000+ пропусков</dt>
              <dd className="mt-2 text-sm leading-snug text-foreground/80">
                За 10 лет без срывов сроков
              </dd>
            </div>
            <div className="px-6">
              <dt className="mono-label">6 систем в одном кабинете</dt>
              <dd className="mt-2 text-sm leading-snug text-foreground/80">
                РНИС · ЭТрН · ГосЛог · МКАД · ТТК · ЭКО
              </dd>
            </div>
            <div className="pl-6">
              <dt className="mono-label">24/7 на связи</dt>
              <dd className="mt-2 text-sm leading-snug text-foreground/80">
                ИИ отвечает за 2 мин, юрист за 30
              </dd>
            </div>
          </dl>
        </div>

        {/* RIGHT: photo frame with orbit + live metric tags */}
        <div className="relative">
          {/* Orbit ring — SVG decoration behind frame */}
          <svg
            viewBox="0 0 420 420"
            className="absolute inset-0 -z-10 h-full w-full opacity-80"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ring-g" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.2 300)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="oklch(0.82 0.15 210)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle cx="210" cy="210" r="205" fill="none" stroke="url(#ring-g)" strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="210" cy="210" r="160" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="1" />
            {orbitNodes.map((n, i) => {
              const rad = (n.angle * Math.PI) / 180;
              const x = 210 + 205 * Math.cos(rad);
              const y = 210 + 205 * Math.sin(rad);
              return (
                <circle
                  key={n.label}
                  cx={x}
                  cy={y}
                  r={i === 2 ? 5 : 3}
                  fill={i === 2 ? "oklch(0.82 0.17 75)" : "oklch(0.82 0.15 210 / 0.6)"}
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur={`${2 + (i % 3)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}
          </svg>

          {/* Portrait photo frame */}
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl ring-neon lg:ml-auto">
            <Image
              src="/images/moscow-city-truck.jpg"
              alt="Грузовик в Москве"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 440px"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

            {/* Top-right corner tag */}
            <div className="absolute right-4 top-4">
              <span className="chip chip-violet">
                <Cpu className="size-3" />
                AI · LIVE
              </span>
            </div>

            {/* Center badge */}
            <div className="absolute left-1/2 top-6 -translate-x-1/2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
                moscow · kremlin zone · 2026
              </span>
            </div>

            {/* Bottom metrics strip */}
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2">
              <div className="glass px-3 py-2">
                <div className="mono-label">etа callback</div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <Radar className="size-3.5 text-[var(--cyan)]" />
                  <span className="stat-number !text-xl text-foreground">
                    15m
                  </span>
                </div>
              </div>
              <div className="glass px-3 py-2 ring-neon-amber">
                <div className="mono-label">systems</div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="stat-number !text-xl text-[var(--amber)]">
                    06
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    in-one
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating side badge — guarantee */}
          <div className="absolute -left-4 top-16 hidden lg:block">
            <div className="glass px-4 py-3 ring-neon-cyan">
              <div className="mono-label">guarantee · 2016</div>
              <div className="mt-1 text-sm font-medium text-foreground">
                Не выдали пропуск —
                <br />
                вернём деньги
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust strip — two groups: partners + ratings */}
      <div className="mt-16 grid gap-4 border-t border-border/60 pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:grid-cols-2 sm:gap-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-foreground">партнёры</span>
          <span className="opacity-40">·</span>
          <span>контур</span>
          <span className="opacity-40">·</span>
          <span>астрал</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-foreground">рейтинг</span>
          <span className="opacity-40">·</span>
          <span>яндекс.карты 4.7</span>
          <span className="opacity-40">·</span>
          <span>2ГИС 4.6</span>
          <span className="opacity-40">·</span>
          <span>150+ отзывов</span>
        </div>
      </div>
    </div>
  );
}
