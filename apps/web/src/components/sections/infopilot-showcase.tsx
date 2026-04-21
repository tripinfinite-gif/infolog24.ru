import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  History,
  MapPin,
  Mic,
  PhoneCall,
  Scale,
  Shield,
  Sparkles,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import {
  infopilotScenarios,
  infopilotTechFeatures,
} from "@/content/infopilot-scenarios";
import { cn } from "@/lib/utils";

interface InfopilotShowcaseProps {
  className?: string;
}

const scenarioIconMap: Record<string, LucideIcon> = {
  Truck,
  ClipboardCheck,
  Wrench,
  Droplets,
  Shield,
  Scale,
};

const techIconMap: Record<string, LucideIcon> = {
  Mic,
  PhoneCall,
  MapPin,
  History,
};

export function InfopilotShowcase({ className }: InfopilotShowcaseProps) {
  return (
    <div
      id="infopilot"
      className={cn("relative mx-auto w-full max-w-7xl", className)}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* LEFT: text + CTA + stats */}
        <div>
          <span className="eyebrow">
            <Sparkles className="size-3" />
            flagship · ai dispatcher
          </span>

          <h2 className="display-text mt-8 text-foreground">
            <span className="display-italic">ИнфоПилот</span> —
            <br />
            <span className="gradient-text">ИИ-диспетчер</span>
            <br />
            на&nbsp;трассе 24/7
          </h2>

          <p className="mt-7 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
            Водитель пишет в чате — ИИ за 2 минуты находит эвакуатор,
            фиксирует цену, договаривается с партнёром. Водитель нажимает
            «Подтверждаю». Всё.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <OpenChatTrigger className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-background transition-all hover:bg-[var(--violet)]">
              <Bot className="size-4" />
              Открыть AI-ассистента
              <span className="flex size-6 items-center justify-center rounded-full bg-background/15 transition-transform group-hover:translate-x-0.5">
                <ArrowUpRight className="size-3.5" />
              </span>
            </OpenChatTrigger>
            <Link
              href="/infopilot"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground bg-foreground/[0.08] ring-1 ring-foreground/30 hover:bg-foreground/[0.14]"
            >
              Подробнее про ИнфоПилот
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 divide-x divide-border/60 border-y border-border/60 py-5">
            <div className="pr-4">
              <div className="mono-label">инцидентов решили в 2026</div>
              <div className="stat-number mt-1 text-[var(--amber)]">312</div>
            </div>
            <div className="pl-4">
              <div className="mono-label">среднее время реакции</div>
              <div className="stat-number mt-1 text-foreground">27 мин</div>
            </div>
          </div>
        </div>

        {/* RIGHT: chat mockup */}
        <div className="relative">
          <div className="glass glass-strong ring-neon relative rounded-3xl p-5 sm:p-6">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--violet)] to-[oklch(0.55_0.22_285)] text-accent-foreground">
                <Bot className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-[var(--amber)]" />
              </div>
              <div className="flex-1">
                <div className="font-display text-base font-medium text-foreground">
                  ИнфоПилот
                </div>
                <div className="mono-label">
                  online · ~2min response
                </div>
              </div>
              <span className="chip chip-violet">ai</span>
            </div>

            <div className="mt-5 space-y-3">
              {/* Driver msg */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-foreground px-4 py-2.5 text-sm text-background">
                  Сломался, Воронежская трасса, 230 км, мост через Дон, не
                  заводится
                </div>
              </div>

              <div className="flex gap-2">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--violet)]/15 text-[var(--violet)]">
                  <Bot className="size-3.5" />
                </div>
                <div className="max-w-[85%] space-y-2">
                  <div className="rounded-2xl rounded-tl-sm bg-foreground/[0.06] px-4 py-2.5 text-sm text-foreground/90 ring-1 ring-border/60">
                    Секунду, ищу ближайшего эвакуатора…
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-background/60 p-4 ring-1 ring-border backdrop-blur">
                    <div className="mono-label flex items-center gap-1.5">
                      <Truck className="size-3.5 text-[var(--cyan)]" />
                      evacuator · match
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="mono-label">eta</div>
                        <div className="font-display text-xl font-medium text-foreground">
                          27 мин
                        </div>
                      </div>
                      <div>
                        <div className="mono-label">price</div>
                        <div className="font-display text-xl font-medium text-foreground">
                          8 500 ₽
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="mono-label">partner</div>
                        <div className="text-sm font-medium text-foreground">
                          «Автопомощь-36» · 4.9 rating
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--amber)] py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-[oklch(0.15_0.02_280)]"
                    >
                      <CheckCircle2 className="size-4" />
                      подтверждаю
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Mic className="size-3.5" />
              voice / text · 152-fz · 24/7
            </div>
          </div>

          <div className="absolute -left-4 top-6 hidden sm:block">
            <span className="chip chip-amber">
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
              live preview
            </span>
          </div>
        </div>
      </div>

      {/* Scenarios — compact row below (hidden on first view, appears when scrolling within scene) */}
      <div className="mt-16 border-t border-border/60 pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <span className="mono-label">/ 06 use-cases on mvp</span>
            <h3 className="mt-2 font-display text-2xl font-medium text-foreground sm:text-3xl">
              Что умеет на запуске
            </h3>
          </div>
          <Link
            href="/infopilot"
            className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            все сценарии →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {infopilotScenarios.map((scenario, idx) => {
            const Icon = scenarioIconMap[scenario.iconName];
            const chipClass =
              idx % 3 === 0
                ? "text-[var(--violet)]"
                : idx % 3 === 1
                ? "text-[var(--cyan)]"
                : "text-[var(--amber)]";
            return (
              <div
                key={scenario.id}
                className="group rounded-xl bg-foreground/[0.03] p-4 ring-1 ring-border/60 transition-all hover:ring-neon"
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg bg-foreground/5",
                    chipClass
                  )}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                </div>
                <h4 className="mt-3 text-sm font-medium text-foreground">
                  {scenario.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                  {scenario.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {infopilotTechFeatures.map((feature) => {
            const Icon = techIconMap[feature.iconName];
            return (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-[var(--cyan)]">
                  {Icon ? <Icon className="size-4" /> : null}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-foreground">
                    {feature.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
