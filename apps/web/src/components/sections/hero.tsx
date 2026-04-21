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
  { value: "50 000+", label: "пропусков за 10 лет без срывов" },
  { value: "6 систем", label: "в одном кабинете: РНИС, ЭТрН, ГосЛог" },
  { value: "24/7", label: "ИИ за 2 мин, юрист за 30" },
];

const partners = ["Контур", "Астрал"];
const ratings = ["Яндекс.Карты 4.7", "2ГИС 4.6", "150+ отзывов"];

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
            Пропуск в Москву{" "}
            <span className="text-accent">за день</span>
            <br />
            плюс регуляторика и&nbsp;ИИ-диспетчер 24/7.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
            МКАД, ТТК, Садовое — оформляем с&nbsp;2016 года. В&nbsp;одном
            кабинете РНИС, ЭТрН, ГосЛог и&nbsp;мониторинг штрафов. ИнфоПилот
            подсказывает водителю прямо на&nbsp;трассе.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-13 rounded-xl bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl"
            >
              <Link href="#mini-calculator">
                Рассчитать пакет за 30 секунд
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
                Посмотреть пропуска
              </Link>
            </Button>
          </div>

          <div className="mt-4">
            <OpenChatTrigger className="inline-flex w-auto items-center gap-2 text-sm text-primary-foreground/70 underline-offset-4 transition-colors hover:text-accent hover:underline">
              <span className="inline-flex items-center gap-2">
                <Bot className="size-4" />
                Спросить ИнфоПилот в&nbsp;чате — без регистрации
              </span>
            </OpenChatTrigger>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary-foreground sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs leading-snug text-primary-foreground/60 sm:text-sm">
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

      {/* Trust bar — two groups: partners + ratings */}
      <div className="relative mt-10 grid gap-4 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/60 sm:grid-cols-2 sm:gap-8 sm:text-sm">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-semibold text-primary-foreground/80">
            Партнёры:
          </span>
          {partners.map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-semibold text-primary-foreground/80">
            Рейтинг:
          </span>
          {ratings.map((item) => (
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
