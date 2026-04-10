"use client";

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

export function Calculator() {
  const [zone, setZone] = useState("mkad");
  const [passType, setPassType] = useState("annual-day");
  const [vehicleCount, setVehicleCount] = useState(1);

  const result = calculateTotal(zone, passType, vehicleCount);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground sm:text-4xl">
          Рассчитайте стоимость
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          Выберите параметры и узнайте стоимость оформления пропуска
        </p>

        <Card className="mt-8">
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
              <div className="rounded-lg bg-muted/50 p-6 text-center">
                {result.discount > 0 && (
                  <p className="mb-2 text-sm font-medium text-primary">
                    Скидка {result.discount}% за объём
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Цена за 1 машину:{" "}
                  <span className="font-semibold text-foreground">
                    {result.pricePerVehicle.toLocaleString("ru-RU")} руб.
                  </span>
                </p>
                <p className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
                  {result.total.toLocaleString("ru-RU")} руб.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Итого за {vehicleCount}{" "}
                  {vehicleCount === 1
                    ? "машину"
                    : vehicleCount < 5
                      ? "машины"
                      : "машин"}
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-muted/50 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Для выбранной комбинации нет тарифа. Свяжитесь с нами для расчёта.
                </p>
              </div>
            )}

            <div className="text-center">
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a href="/contacts">Оставить заявку</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
