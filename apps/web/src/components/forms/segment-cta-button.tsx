"use client";

import { useState } from "react";

import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SegmentCtaButtonProps {
  segmentSlug: string;
  segmentName: string;
  label?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "secondary" | "outline";
  description?: string;
  className?: string;
}

export function SegmentCtaButton({
  segmentSlug,
  segmentName,
  label = "Оставить заявку",
  size = "lg",
  variant = "default",
  description,
  className,
}: SegmentCtaButtonProps) {
  const [open, setOpen] = useState(false);
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
        title={`Оставить заявку — ${segmentName}`}
        description={
          description ??
          "Перезвоним в течение 5 минут и рассчитаем стоимость под ваши задачи."
        }
        source={`segment_${segmentSlug}`}
        context={{ segment: segmentName }}
        submitLabel="Получить расчёт"
      />
    </>
  );
}
