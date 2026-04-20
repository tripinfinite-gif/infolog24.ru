import { ArrowRight, Bot, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

const heroStats = [
  { value: "10 лет", label: "на рынке" },
  { value: "50 000+", label: "пропусков оформлено" },
  { value: "6", label: "систем в одном окне" },
  { value: "24/7", label: "ИИ-диспетчер" },
];

const trustItems = [
  "Контур • Астрал",
  "Яндекс 4.7",
  "2ГИС 4.6",
  "50 000+ кейсов",
];

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl bg-primary p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary via-primary to-foreground/80 opacity-90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-accent/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/80">
            <Sparkles className="size-3.5 text-accent" />
            Платформа для перевозчика
          </div>

          <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Больше чем пропуск.{" "}
            <span className="text-accent">
              Вся операционная работа перевозчика в одном окне
            </span>{" "}
            — и ИИ-диспетчер на трассе 24/7.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
            Помощь с пропусками, РНИС, ЭТрН и ГосЛог. Мониторинг штрафов.
            Эвакуация, ремонт, мойка и страхование через проверенных партнёров.
            Работаем с&nbsp;2016 года — более 50&nbsp;000 оформленных пропусков.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-13 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
            >
              <Link href="#packages">
                Подобрать пакет за 30 секунд
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-13 rounded-xl bg-primary-foreground px-8 text-base font-semibold text-primary shadow-lg transition-all hover:bg-primary-foreground/90 hover:shadow-xl"
            >
              <Link href="#passes">
                <Truck className="mr-2 size-4" />
                Помочь с пропуском
              </Link>
            </Button>
          </div>

          <div className="mt-4">
            <OpenChatTrigger className="inline-flex w-auto items-center gap-2 text-sm text-primary-foreground/70 underline-offset-4 transition-colors hover:text-accent hover:underline">
              <span className="inline-flex items-center gap-2">
                <Bot className="size-4" />
                Открыть AI-ассистента ИнфоПилот
              </span>
            </OpenChatTrigger>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary-foreground sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs text-primary-foreground/50 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative h-[400px] w-[340px] overflow-hidden rounded-2xl">
            <Image
              src="/images/moscow-city-truck.jpg"
              alt="Грузовик на фоне Москва-Сити"
              fill
              className="object-cover"
              sizes="340px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="relative mt-10 border-t border-primary-foreground/10 pt-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-primary-foreground/60 sm:text-sm">
          <span className="font-semibold text-primary-foreground/80">
            Нам доверяют:
          </span>
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
