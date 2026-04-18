"use client";

import { useState } from "react";

import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
import { Button } from "@/components/ui/button";
import type { VehicleType } from "@/content/vehicle-types";
import { cn } from "@/lib/utils";

interface VehicleCtaButtonProps {
  vehicle: VehicleType;
  label?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function VehicleCtaButton({
  vehicle,
  label = "Оформить пропуск",
  size = "lg",
  variant = "default",
  className,
}: VehicleCtaButtonProps) {
  const [open, setOpen] = useState(false);
  const priceFrom = vehicle.permitTypes.mkad?.priceFrom ?? "";
  return (
    <>
      <Button
        size={size}
        variant={variant}
        onClick={() => setOpen(true)}
        className={cn(className)}
      >
        {label}
      </Button>
      <QuickLeadModal
        open={open}
        onOpenChange={setOpen}
        title={`Оформить пропуск на ${vehicle.name}`}
        description={
          priceFrom
            ? `От ${priceFrom} ₽ за МКАД. Оформим за 3-4 дня.`
            : "Рассчитаем стоимость и оформим за 3-4 дня."
        }
        source={`vehicle_${vehicle.slug.slice(0, 80)}`}
        context={{
          vehicle: vehicle.name,
          weightKg: vehicle.weightKg ?? "",
          priceFromMkad: String(priceFrom),
        }}
        submitLabel="Получить расчёт"
      />
    </>
  );
}
