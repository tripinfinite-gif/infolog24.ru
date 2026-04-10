"use client";

import { CheckCircle, Clock, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockStatuses = [
  { step: 1, title: "Заявка принята", completed: true, date: "10.04.2026" },
  { step: 2, title: "Документы проверены", completed: true, date: "10.04.2026" },
  { step: 3, title: "Оплата получена", completed: true, date: "11.04.2026" },
  { step: 4, title: "Заявка подана в Дептранс", completed: true, date: "11.04.2026" },
  { step: 5, title: "На рассмотрении", completed: false, date: "" },
  { step: 6, title: "Пропуск готов", completed: false, date: "" },
];

export function CheckStatusClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [showResult, setShowResult] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (orderNumber.trim()) {
      setShowResult(true);
    }
  }

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Проверить статус пропуска
          </h1>
          <p className="mt-4 text-muted-foreground">
            Введите номер заказа, чтобы узнать текущий статус оформления
          </p>
        </div>

        <Card className="mt-8">
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="order-number">Номер заказа</Label>
                <Input
                  id="order-number"
                  placeholder="Например: INF-2026-0001"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setShowResult(false);
                  }}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit">
                  <Search className="mr-2 size-4" />
                  Проверить
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {showResult && (
          <Card className="mt-8">
            <CardContent>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Заказ {orderNumber}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Пропуск на МКАД (дневной)
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                  <Clock className="size-3" />
                  В обработке
                </span>
              </div>

              <div className="space-y-0">
                {mockStatuses.map((status, index) => (
                  <div key={status.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${
                          status.completed
                            ? "bg-primary text-primary-foreground"
                            : "border-2 border-muted bg-background text-muted-foreground"
                        }`}
                      >
                        {status.completed ? (
                          <CheckCircle className="size-4" />
                        ) : (
                          <span className="text-xs">{status.step}</span>
                        )}
                      </div>
                      {index < mockStatuses.length - 1 && (
                        <div
                          className={`h-8 w-0.5 ${
                            status.completed ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-8">
                      <p
                        className={`text-sm font-medium ${
                          status.completed
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {status.title}
                      </p>
                      {status.date && (
                        <p className="text-xs text-muted-foreground">
                          {status.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Это демонстрационные данные. Личный кабинет с реальным
                отслеживанием появится в ближайшее время.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
