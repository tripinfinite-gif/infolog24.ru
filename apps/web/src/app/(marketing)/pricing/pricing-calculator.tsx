"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { fineData } from "@/content/pricing";

export function PricingCalculator() {
  const [zone, setZone] = useState("mkad");
  const [passType, setPassType] = useState("annual");
  const [vehicleCount, setVehicleCount] = useState(1);

  const result = calculateTotal(zone, passType, vehicleCount);

  const vehicleWord = (count: number) => {
    if (count === 1) return "машину";
    if (count >= 2 && count <= 4) return "машины";
    return "машин";
  };

  // Annual fines avoided per vehicle
  const annualFinesSaved = fineData.totalPerMonth * 12;

  return (
    <section
      id="calculator"
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Calculator className="size-6 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Рассчитайте стоимость
          </h2>
          <p className="mt-3 text-muted-foreground">
            Выберите параметры — узнайте точную стоимость с учётом скидок
          </p>
        </motion.div>

        <Card className="mt-10 rounded-3xl border-0 bg-card shadow-sm">
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Зона</Label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger className="w-full">
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
                <Label>Тип пропуска</Label>
                <Select value={passType} onValueChange={setPassType}>
                  <SelectTrigger className="w-full">
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
                <Label>Количество машин</Label>
                <Select
                  value={String(vehicleCount)}
                  onValueChange={(v) => setVehicleCount(Number(v))}
                >
                  <SelectTrigger className="w-full">
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
              <div className="space-y-4">
                <div className="rounded-xl bg-primary/5 p-6">
                  {result.discount > 0 && (
                    <div className="mb-3 flex justify-center">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Скидка {result.discount}% за объём
                      </span>
                    </div>
                  )}
                  <p className="text-center text-sm text-muted-foreground">
                    Цена за 1 машину:{" "}
                    <span className="font-semibold text-foreground">
                      {result.pricePerVehicle.toLocaleString("ru-RU")} ₽
                    </span>
                  </p>
                  <p className="mt-2 text-center text-3xl font-bold text-primary sm:text-4xl">
                    {result.total.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Итого за {vehicleCount} {vehicleWord(vehicleCount)}
                  </p>

                  {/* Comparison with fines */}
                  {passType !== "temp" && (
                    <div className="mt-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                      <p className="text-center text-xs text-green-800 dark:text-green-400">
                        Потенциальные штрафы без пропуска за{" "}
                        {vehicleCount} {vehicleWord(vehicleCount)} в год:{" "}
                        <span className="font-bold text-destructive">
                          {(annualFinesSaved * vehicleCount).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
                  >
                    <Link href="/contacts">
                      Оставить заявку
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-muted/50 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Для выбранной комбинации нет тарифа. Свяжитесь с нами для
                  расчёта.
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/contacts">Связаться</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
