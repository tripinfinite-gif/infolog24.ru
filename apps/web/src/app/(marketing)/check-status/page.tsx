"use client";

import { Loader2, MessageCircle, Phone, Search, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckStatusPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;

    try {
      const res = await fetch("/api/orders/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();

      if (json.success && json.order) {
        setResult(
          `Статус заявки: ${json.order.statusLabel}. ${json.order.details || ""}`,
        );
      } else {
        setResult(json.error || "Заявка не найдена.");
      }
    } catch {
      toast.error("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Search className="size-7 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Проверить статус заявки
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Введите номер заявки или телефон, указанный при оформлении
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-lg">
          <Card className="rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="query">Номер заявки или телефон</Label>
                  <Input
                    id="query"
                    name="query"
                    placeholder="Например: +7 (495) 123-45-67"
                    required
                    className="h-12"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Проверяем...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 size-4" />
                      Проверить статус
                    </>
                  )}
                </Button>
              </form>

              {result && (
                <div className="mt-6 rounded-xl bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">{result}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Не можете найти заявку? Свяжитесь с нами:
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+74951234567"
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                <Phone className="size-4" />
                +7 (495) 123-45-67
              </a>
              <a
                href="https://wa.me/74951234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
              <a
                href="https://t.me/infolog24"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Send className="size-4" />
                Telegram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
