"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator as CalcIcon, Info } from "lucide-react";
import { useEffect, useState } from "react";

import { analytics } from "@/lib/analytics/events";

import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
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
import { zones, passTypes, calculateTotal } from "@/content/calculator";

export function Calculator() {
  const [zone, setZone] = useState("mkad");
  const [passType, setPassType] = useState("annual");
  const [vehicleCount, setVehicleCount] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const result = calculateTotal(zone, passType, vehicleCount);

  // Analytics: дебаунс 1 сек — трекаем итоговую цену после стабилизации выбора.
  useEffect(() => {
    if (!result) return;
    const total = result.total;
    const handle = window.setTimeout(() => {
      analytics.calculatorUsed(zone, total);
    }, 1000);
    return () => window.clearTimeout(handle);
  }, [zone, passType, vehicleCount, result]);

  return (
    <section id="calculator" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <CalcIcon className="size-5 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Калькулятор
            </span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Рассчитайте стоимость
          </h2>
          <p className="mt-4 text-muted-foreground">
            Выберите параметры и узнайте точную стоимость оформления пропуска
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="mt-8 shadow-lg">
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Зона</Label>
                  <Select value={zone} onValueChange={setZone}>
                    <SelectTrigger className="w-full" aria-label="Зона">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((z) => (
                        <SelectItem key={z.id} value={z.value}>
                          {z.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Тип пропуска</Label>
                  <Select value={passType} onValueChange={setPassType}>
                    <SelectTrigger className="w-full" aria-label="Тип пропуска">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {passTypes.map((pt) => (
                        <SelectItem key={pt.id} value={pt.value}>
                          {pt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Количество машин</Label>
                  <Select
                    value={String(vehicleCount)}
                    onValueChange={(v) => setVehicleCount(Number(v))}
                  >
                    <SelectTrigger className="w-full" aria-label="Количество машин">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {result ? (
                <div className="rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 text-center ring-1 ring-primary/10">
                  {result.discount > 0 && (
                    <Badge className="mb-3 bg-accent text-accent-foreground">
                      Скидка {result.discount}% за объём
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Цена за 1 машину:{" "}
                    <span className="font-semibold text-foreground">
                      {result.pricePerVehicle.toLocaleString("ru-RU")} ₽
                    </span>
                  </p>
                  <p className="mt-3 text-3xl font-bold text-primary sm:text-4xl">
                    {result.total.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Итого за {vehicleCount}{" "}
                    {vehicleCount === 1
                      ? "машину"
                      : vehicleCount < 5
                        ? "машины"
                        : "машин"}
                  </p>
                  {passType !== "temp" && (
                    <p className="mt-2 flex items-center justify-center gap-1 text-xs text-primary/80">
                      <Info className="size-3" />
                      Включает бесплатный временный пропуск
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-muted/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Для выбранной комбинации нет тарифа. Свяжитесь с нами для расчёта.
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  onClick={() => setModalOpen(true)}
                  className="h-12 px-8 text-base font-semibold bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
                >
                  Оставить заявку
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Окончательная цена после проверки документов
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <QuickLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Оформить пропуск"
        description={
          result
            ? `Ваш расчёт: ${new Intl.NumberFormat("ru-RU").format(result.total)} ₽. Оставьте телефон — перезвоним за 5 минут.`
            : "Оставьте телефон — подберём оптимальный тариф за 5 минут."
        }
        source="calculator_main"
        context={{
          zone: zones.find((z) => z.value === zone)?.label ?? zone,
          passType: passTypes.find((p) => p.value === passType)?.label ?? passType,
          vehicleCount: String(vehicleCount),
          price: result ? `${new Intl.NumberFormat("ru-RU").format(result.total)} ₽` : "—",
        }}
        submitLabel="Получить расчёт"
      />
    </section>
  );
}
