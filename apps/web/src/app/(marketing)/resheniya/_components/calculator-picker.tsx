"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FleetSize = "1-4" | "5-20" | "20-50" | "50+";

const recommendations: Record<
  FleetSize,
  {
    slug: string;
    name: string;
    reason: string;
  }
> = {
  "1-4": {
    slug: "propusk-plus",
    name: "Пропуск+",
    reason:
      "Для небольшого парка и частников — только самое необходимое: пропуск, РНИС, ЭТрН и базовый мониторинг штрафов. Цена от 12 500 ₽.",
  },
  "5-20": {
    slug: "tranzit-moskva",
    name: "Транзит Москва",
    reason:
      "Оптимальный выбор для растущей ТК: полный пакет + Антиштраф, ГосЛог, юрист и выделенный менеджер. Экономия до 22% против отдельной покупки.",
  },
  "20-50": {
    slug: "tranzit-moskva",
    name: "Транзит Москва",
    reason:
      "При парке 20–50 ТС пакет «Транзит Москва» ещё окупается, но стоит рассмотреть и «Флот Про», если нужна API-интеграция с вашей TMS.",
  },
  "50+": {
    slug: "flot-pro",
    name: "Флот Про",
    reason:
      "Корпоративный продукт: API, SLA 4 часа, выделенный аккаунт-менеджер, Юрист в штате. Индивидуальный прайс от 900 ₽/мес за ТС.",
  },
};

export function CalculatorPicker() {
  const [selected, setSelected] = useState<FleetSize | null>(null);

  const options: { value: FleetSize; label: string }[] = [
    { value: "1-4", label: "1–4 ТС" },
    { value: "5-20", label: "5–20 ТС" },
    { value: "20-50", label: "20–50 ТС" },
    { value: "50+", label: "50+ ТС" },
  ];

  const recommendation = selected ? recommendations[selected] : null;

  return (
    <Card className="rounded-3xl border-0 bg-card shadow-sm">
      <CardContent className="p-6 sm:p-10">
        <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          Калькулятор подбора пакета
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Сколько машин в вашем парке?
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {options.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={selected === option.value ? "default" : "outline"}
              className="h-14 rounded-xl text-base"
              onClick={() => setSelected(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {recommendation && (
          <div className="mt-8 rounded-2xl bg-primary/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Рекомендуем
            </p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">
              {recommendation.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {recommendation.reason}
            </p>
            <Link
              href={`/resheniya/${recommendation.slug}`}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Подробнее о пакете
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
