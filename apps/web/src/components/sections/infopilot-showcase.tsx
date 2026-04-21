import {
  ArrowRight,
  Bot,
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
import { Button } from "@/components/ui/button";
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
    <section id="infopilot" className={cn("scroll-mt-24 space-y-6", className)}>
      {/* Dark hero block */}
      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 sm:p-10 lg:p-14">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary via-primary to-foreground/80 opacity-90"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-20 size-[400px] rounded-full bg-accent/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/80">
            <Sparkles className="size-4 text-accent" />
            Флагманский продукт
          </div>

          <h2 className="font-heading text-3xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            ИнфоПилот — <span className="text-accent">ИИ-диспетчер</span>{" "}
            на&nbsp;трассе 24/7
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
            Водитель говорит в чате: «Сломался, Воронежская трасса, 230-й
            километр, мост через Дон, не заводится». Через 2 минуты у него
            в&nbsp;чате — карточка с проверенным эвакуатором: ETA 27 минут,
            цена зафиксирована 8&nbsp;500&nbsp;₽, ИнфоПилот уже связался
            с&nbsp;диспетчером партнёра. Водитель нажимает «Подтверждаю». Всё.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <OpenChatTrigger className="inline-flex h-13 w-auto items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl">
              <span className="inline-flex items-center gap-2">
                <Bot className="size-4" />
                Открыть AI-ассистента ИнфоПилот
                <ArrowRight className="ml-1 size-4" />
              </span>
            </OpenChatTrigger>
            <Button
              asChild
              size="lg"
              className="h-13 rounded-xl border-2 border-primary-foreground/40 !bg-transparent px-8 text-base font-semibold text-primary-foreground hover:!bg-primary-foreground/10"
            >
              <Link href="/infopilot">Подробнее про ИнфоПилот</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scenarios block */}
      <div className="rounded-3xl border bg-card p-6 sm:p-10 lg:p-14">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            6 сценариев на запуске MVP
          </h3>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Всё, что может случиться в рейсе — теперь решает один AI-ассистент
            прямо в&nbsp;чате на сайте.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {infopilotScenarios.map((scenario) => {
            const Icon = scenarioIconMap[scenario.iconName];
            return (
              <div
                key={scenario.id}
                className="group flex flex-col rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  {Icon ? <Icon className="size-6" /> : null}
                </div>
                <h4 className="text-lg font-bold text-foreground">
                  {scenario.title}
                </h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {scenario.description}
                </p>
                <span className="mt-4 inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {scenario.monetizationHint}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tech features strip */}
        <div className="mt-12 border-t pt-10">
          <h3 className="text-center font-heading text-xl font-bold text-foreground sm:text-2xl">
            Что внутри технологически
          </h3>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {infopilotTechFeatures.map((feature) => {
              const Icon = techIconMap[feature.iconName];
              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary">
                    {Icon ? <Icon className="size-6" /> : null}
                  </div>
                  <h4 className="text-base font-bold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl bg-accent/5 p-6 text-center sm:flex-row sm:justify-center sm:gap-4">
          <Sparkles className="size-5 text-accent" />
          <p className="text-sm font-medium text-foreground sm:text-base">
            На пилотном запуске —{" "}
            <span className="font-bold text-accent">47 партнёров</span> в
            23&nbsp;городах и{" "}
            <span className="font-bold text-accent">312 обработанных инцидентов</span>.
            Продукт расширяется каждый месяц.
          </p>
        </div>
      </div>
    </section>
  );
}
