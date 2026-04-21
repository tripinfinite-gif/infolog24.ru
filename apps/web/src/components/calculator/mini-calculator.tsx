"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator as CalcIcon, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
import { analytics } from "@/lib/analytics/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * MiniCalculator — компактный калькулятор стоимости для главной страницы.
 *
 * Отличается от полного калькулятора (`/calculator`) упрощёнными опциями
 * и auto-calc без кнопки «Рассчитать». Цены отличаются от /calculator
 * намеренно: мини показывает «стартовые» цены (МКАД временный от 6 000 ₽),
 * полный — регулярные. Расхождение объяснимо UX-контекстом: «от» для быстрого
 * ответа, точная калькуляция — в полном.
 */

type ZoneId = "mkad" | "ttk" | "sk";
type PassType = "temp" | "annual";
type FleetSize = "1" | "2-5" | "5-10" | "10+";

interface PricingRow {
  zone: ZoneId;
  passType: PassType;
  pricePerVehicle: number;
}

/**
 * Таблица цен — согласована с content/calculator.ts (единый источник).
 * Все зоны одинаковы по цене: годовой 12 000 ₽, временный 4 500 ₽.
 */
const PRICING: PricingRow[] = [
  { zone: "mkad", passType: "temp", pricePerVehicle: 4500 },
  { zone: "mkad", passType: "annual", pricePerVehicle: 12000 },
  { zone: "ttk", passType: "temp", pricePerVehicle: 4500 },
  { zone: "ttk", passType: "annual", pricePerVehicle: 12000 },
  { zone: "sk", passType: "temp", pricePerVehicle: 4500 },
  { zone: "sk", passType: "annual", pricePerVehicle: 12000 },
];

const ZONE_OPTIONS: { value: ZoneId; label: string }[] = [
  { value: "mkad", label: "МКАД" },
  { value: "ttk", label: "ТТК" },
  { value: "sk", label: "Садовое кольцо" },
];

const PASS_TYPE_OPTIONS: { value: PassType; label: string }[] = [
  { value: "temp", label: "Временный (до 10 суток)" },
  { value: "annual", label: "Годовой (12 месяцев)" },
];

const FLEET_OPTIONS: {
  value: FleetSize;
  label: string;
  vehicles: number;
  discount: number; // 0..1
}[] = [
  { value: "1", label: "1 машина", vehicles: 1, discount: 0 },
  { value: "2-5", label: "2–5 машин", vehicles: 3, discount: 0 },
  { value: "5-10", label: "5–10 машин", vehicles: 7, discount: 0.1 },
  { value: "10+", label: "10+ машин", vehicles: 12, discount: 0.15 },
];

const PROCESSING_DAYS_HINT = "Регламент: 10 рабочих дней · временный — 1 день";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function formatRub(value: number): string {
  return currencyFormatter.format(value).replace(",00", "");
}

function findBasePrice(zone: ZoneId, passType: PassType): number {
  return (
    PRICING.find((r) => r.zone === zone && r.passType === passType)
      ?.pricePerVehicle ?? 0
  );
}

export interface MiniCalculatorProps {
  className?: string;
  /**
   * Вариант вёрстки. `default` — полноценная карточка с заголовком,
   * `compact` — компактный вариант для A/B-тестов (пока совпадает с default,
   * задел на будущее).
   */
  variant?: "default" | "compact";
}

export function MiniCalculator({
  className,
  variant = "default",
}: MiniCalculatorProps) {
  const [zone, setZone] = useState<ZoneId>("mkad");
  const [passType, setPassType] = useState<PassType>("annual");
  const [fleet, setFleet] = useState<FleetSize>("1");
  const [modalOpen, setModalOpen] = useState(false);

  const result = useMemo(() => {
    const fleetOption =
      FLEET_OPTIONS.find((f) => f.value === fleet) ?? FLEET_OPTIONS[0];
    const basePrice = findBasePrice(zone, passType);
    const subtotal = basePrice * fleetOption.vehicles;
    const discountAmount = Math.round(subtotal * fleetOption.discount);
    const total = subtotal - discountAmount;
    return {
      basePrice,
      vehicles: fleetOption.vehicles,
      subtotal,
      discount: fleetOption.discount,
      discountAmount,
      total,
      isPerVehicle: fleetOption.vehicles === 1,
    };
  }, [zone, passType, fleet]);

  // Анимационный ключ — при смене любого параметра результат делает fade-in
  const resultKey = `${zone}-${passType}-${fleet}`;

  // Analytics: трекаем «использование калькулятора» с debounce 1 сек,
  // чтобы не слать событие на каждый клик по селекту.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      analytics.calculatorUsed(zone, result.total);
    }, 1000);
    return () => window.clearTimeout(handle);
  }, [zone, passType, fleet, result.total]);

  const zoneLabel =
    ZONE_OPTIONS.find((z) => z.value === zone)?.label ?? zone;
  const passTypeLabel =
    PASS_TYPE_OPTIONS.find((p) => p.value === passType)?.label ?? passType;
  const fleetLabel =
    FLEET_OPTIONS.find((f) => f.value === fleet)?.label ?? fleet;

  return (
    <section
      id="mini-calculator"
      className={cn("scroll-mt-20", className)}
      aria-labelledby="mini-calculator-title"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <CalcIcon className="size-3.5" aria-hidden="true" />
            Узнайте стоимость за 10 секунд
          </div>
          <h2
            id="mini-calculator-title"
            className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl"
          >
            Сколько стоит пропуск для вашего транспорта
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Выберите зону, срок и количество ТС — получите цену сразу, без звонков.
          </p>
        </div>

        <Card
          className={cn(
            "border-accent/20 shadow-lg",
            variant === "compact" && "border-border shadow-sm"
          )}
        >
          <CardContent className="space-y-5 pt-6">
            {/* Форма: 3 селекта в ряд на десктопе, stacked на мобильном */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label
                  htmlFor="mini-calc-zone"
                  className="text-sm font-medium"
                >
                  Зона
                </Label>
                <Select
                  value={zone}
                  onValueChange={(v) => setZone(v as ZoneId)}
                >
                  <SelectTrigger
                    id="mini-calc-zone"
                    className="w-full"
                    aria-label="Зона пропуска"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONE_OPTIONS.map((z) => (
                      <SelectItem key={z.value} value={z.value}>
                        {z.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mini-calc-type"
                  className="text-sm font-medium"
                >
                  Срок
                </Label>
                <Select
                  value={passType}
                  onValueChange={(v) => setPassType(v as PassType)}
                >
                  <SelectTrigger
                    id="mini-calc-type"
                    className="w-full"
                    aria-label="Тип пропуска"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PASS_TYPE_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mini-calc-fleet"
                  className="text-sm font-medium"
                >
                  Количество ТС
                </Label>
                <Select
                  value={fleet}
                  onValueChange={(v) => setFleet(v as FleetSize)}
                >
                  <SelectTrigger
                    id="mini-calc-fleet"
                    className="w-full"
                    aria-label="Количество транспортных средств"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLEET_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Результат */}
            <motion.div
              key={resultKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-live="polite"
              className="rounded-xl border border-border bg-muted/40 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <div className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                      {formatRub(result.total)}
                    </div>
                    {result.discount > 0 && (
                      <div className="text-sm text-muted-foreground line-through">
                        {formatRub(result.subtotal)}
                      </div>
                    )}
                    {result.discount > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-accent/15 text-accent hover:bg-accent/15"
                      >
                        Скидка {Math.round(result.discount * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.isPerVehicle ? "За 1 ТС" : "За весь парк"}
                    {" · "}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {PROCESSING_DAYS_HINT}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    onClick={() => setModalOpen(true)}
                    className="h-11 rounded-xl bg-accent px-6 text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90"
                  >
                    Заказать
                    <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Ссылка на полный калькулятор */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Цены «от». Экокласс, режим пропуска (дневной/ночной/круглосуточный), доп. опции — в полном калькуляторе.
              </span>
              <Link
                href="/calculator"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Расширенный калькулятор →
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Есть вопросы?{" "}
          <OpenChatTrigger
            className="!inline !w-auto text-accent underline hover:text-accent/80"
            ariaLabel="Открыть чат ИнфоПилот"
          >
            Спросите ИнфоПилот
          </OpenChatTrigger>
        </p>
      </div>

      <QuickLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={`Помощь с пропуском на ${zoneLabel}`}
        description={`Ваша цена: ${formatRub(result.total)}. Оставьте телефон — перезвоним за 5 минут с готовым расчётом.`}
        source="mini_calc"
        context={{
          zone: zoneLabel,
          passType: passTypeLabel,
          fleet: fleetLabel,
          price: formatRub(result.total),
        }}
        submitLabel="Получить расчёт бесплатно"
      />
    </section>
  );
}
