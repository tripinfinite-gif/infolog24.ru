import { ArrowRight, Award, Bot, Layers, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LavenderBadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

function LavenderBadge({ icon, label, className }: LavenderBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
        "bg-secondary text-secondary-foreground",
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  return (
    <section className={cn("w-full", className)}>
      <div className="grid grid-cols-12 gap-4">
        {/* Left large card */}
        <div
          className="relative col-span-12 overflow-hidden rounded-[28px] lg:col-span-8"
          style={{ minHeight: 560 }}
        >
          <Image
            src="/images/moscow-city-truck.jpg"
            alt="Грузовик в Москве"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(19,27,58,0.92) 0%, rgba(19,27,58,0.5) 45%, transparent 80%)" }} />

          {/* Content */}
          <div className="relative flex h-full flex-col justify-between p-8 lg:p-10">
            {/* Top badge */}
            <div>
              <LavenderBadge
                icon={<Truck className="h-3.5 w-3.5" />}
                label="Платформа для перевозчика"
              />
            </div>

            {/* Bottom content */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl xl:text-5xl">
                  Пропуск в Москву{" "}
                  <span style={{ color: "var(--orange)" }}>за день</span>
                  <br />
                  плюс регуляторика и ИИ-диспетчер 24/7.
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-white/75 lg:text-base">
                  Оформляем пропуска на МКАД, ТТК и Садовое кольцо с 2016 года.
                  Берём документы, подаём, контролируем — вы получаете готовый
                  пропуск без очередей и ошибок.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="rounded-full font-semibold text-white shadow-none"
                  style={{ background: "var(--orange)" }}
                >
                  <Link href="#mini-calculator">
                    Рассчитать пакет за 30 секунд
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="#passes">Посмотреть пропуска</Link>
                </Button>

                <OpenChatTrigger className="w-auto">
                  <span className="text-sm text-white/70 underline underline-offset-4 hover:text-white/90 transition-colors cursor-pointer">
                    Спросить ИнфоПилот в чате
                  </span>
                </OpenChatTrigger>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — stat cards */}
        <div className="col-span-12 grid gap-4 lg:col-span-4">
          {/* Card 1 — dark */}
          <div className="bg-primary flex flex-col justify-between rounded-[22px] p-6">
            <LavenderBadge
              icon={<Award className="h-3.5 w-3.5" />}
              label="10 лет работы"
            />
            <div className="mt-6">
              <p className="text-5xl font-bold leading-none tracking-tight" style={{ color: "#9FB0FF" }}>
                50 000+
              </p>
              <p className="mt-2 text-sm text-primary-foreground/60">
                пропусков оформлено
              </p>
            </div>
          </div>

          {/* Card 2 — white */}
          <div className="bg-card border-border flex flex-col justify-between rounded-[22px] border p-6">
            <LavenderBadge
              icon={<Layers className="h-3.5 w-3.5" />}
              label="Одна платформа"
            />
            <div className="mt-6">
              <p className="text-accent text-5xl font-bold leading-none tracking-tight">
                6 систем
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                интегрировано в одном окне
              </p>
            </div>
          </div>

          {/* Card 3 — white */}
          <div className="bg-card border-border flex flex-col justify-between rounded-[22px] border p-6">
            <LavenderBadge
              icon={<Bot className="h-3.5 w-3.5" />}
              label="AI на трассе"
            />
            <div className="mt-6">
              <p className="text-accent text-5xl font-bold leading-none tracking-tight">
                24/7
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                ИИ-диспетчер всегда на связи
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-card mt-6 flex flex-wrap items-center justify-between gap-4 rounded-full px-6 py-4">
        {/* Partners */}
        <div className="flex items-center gap-5">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Партнёры
          </span>
          <div className="flex items-center gap-4">
            {["Контур", "Астрал"].map((partner) => (
              <div key={partner} className="flex items-center gap-1.5">
                <span className="bg-accent h-1.5 w-1.5 rounded-full" />
                <span className="text-sm font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-5">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Рейтинги
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="text-accent h-3.5 w-3.5 fill-current" />
              <span className="text-sm font-medium">Яндекс.Карты</span>
              <span className="text-muted-foreground text-sm">4.7</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="text-accent h-3.5 w-3.5 fill-current" />
              <span className="text-sm font-medium">2ГИС</span>
              <span className="text-muted-foreground text-sm">4.6</span>
            </div>
            <div className="text-muted-foreground text-sm">150+ отзывов</div>
          </div>
        </div>
      </div>
    </section>
  );
}
