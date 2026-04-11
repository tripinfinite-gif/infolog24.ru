import {
  Award,
  Bot,
  Layers,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface WhyUsTilesProps {
  className?: string;
}

interface Tile {
  title: string;
  description: string;
  icon: LucideIcon;
  dark?: boolean;
  accent?: boolean;
}

const tiles: Tile[] = [
  {
    title: "10 лет на рынке",
    description:
      "С 2016 года. 15 000+ пропусков. Юрлицо, договор, чеки. Не мошенники.",
    icon: Award,
    dark: true,
  },
  {
    title: "Гарантия результата",
    description:
      "Пропуск не выдали — вернём деньги. Аннулировали — переоформим бесплатно.",
    icon: ShieldCheck,
  },
  {
    title: "Платформа, а не посредник",
    description:
      "Личный кабинет, API, уведомления, дашборд парка. Ничего вручную.",
    icon: Layers,
  },
  {
    title: "ИнфоПилот 24/7",
    description:
      "Единственная в рынке пропусков компания с ИИ-диспетчером на трассе.",
    icon: Bot,
    accent: true,
  },
];

export function WhyUsTiles({ className }: WhyUsTilesProps) {
  return (
    <section className={cn("space-y-8", className)}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Почему мы
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Четыре вещи, которые отличают нас от 90% рынка
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.title}
              className={cn(
                "group flex flex-col rounded-3xl p-6 transition-shadow hover:shadow-lg sm:p-8 lg:p-10",
                tile.dark && "bg-primary text-primary-foreground",
                tile.accent && "bg-accent text-accent-foreground",
                !tile.dark && !tile.accent && "border bg-card text-foreground"
              )}
            >
              <div
                className={cn(
                  "mb-5 flex size-12 items-center justify-center rounded-2xl",
                  tile.dark && "bg-primary-foreground/10 text-accent",
                  tile.accent && "bg-accent-foreground/10 text-accent-foreground",
                  !tile.dark && !tile.accent && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="size-6" />
              </div>

              <h3 className="text-xl font-bold sm:text-2xl">{tile.title}</h3>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed sm:text-base",
                  tile.dark && "text-primary-foreground/75",
                  tile.accent && "text-accent-foreground/85",
                  !tile.dark && !tile.accent && "text-muted-foreground"
                )}
              >
                {tile.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
