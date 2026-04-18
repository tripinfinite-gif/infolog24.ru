"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimplePassButtonProps {
  zone: string;        // "МКАД" / "ТТК" / "Садовое" / "Временный"
  price: string;       // "12 000" / "3 500"
  period: string;      // "за машину / год" / "до 5 суток"
  dark?: boolean;
}

/**
 * Кнопка "Оформить" в карточке SimplePass.
 * Открывает QuickLeadModal с контекстом зоны и цены,
 * вместо редиректа на /services/<slug> — минимизирует количество
 * кликов клиента до заявки.
 */
export function SimplePassButton({
  zone,
  price,
  period,
  dark = false,
}: SimplePassButtonProps) {
  const [open, setOpen] = useState(false);

  const isTemporary = zone.toLowerCase().includes("временн");
  const zoneSlug = isTemporary
    ? "vremennyj"
    : zone === "МКАД"
      ? "mkad"
      : zone === "ТТК"
        ? "ttk"
        : zone === "Садовое"
          ? "sk"
          : "unknown";

  const passType = isTemporary ? "Временный (до 5 суток)" : "Годовой (12 месяцев)";
  const priceLabel = `${price} ₽ ${period}`;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          "mt-6 w-full rounded-xl",
          dark
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        Оформить
        <ArrowRight className="ml-2 size-4" />
      </Button>
      <QuickLeadModal
        open={open}
        onOpenChange={setOpen}
        title={`Пропуск ${isTemporary ? "временный" : "на " + zone}`}
        description={`${priceLabel}. Оставьте телефон — перезвоним за 5 минут, уточним документы и сроки.`}
        source={`simple_pass_${zoneSlug}`}
        context={{
          zone,
          passType,
          price: priceLabel,
        }}
        submitLabel="Получить расчёт"
      />
    </>
  );
}
