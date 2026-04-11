"use client";

import { useState } from "react";
import Link from "next/link";
import { BellRing } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SubscribeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Необходимо согласие на обработку персональных данных");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          source: "regulatorika-kalendar-subscribe",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Ошибка отправки. Попробуйте позже.");
        return;
      }
      setSubmitted(true);
      toast.success("Готово! Пришлём напоминания за 60, 30 и 7 дней до дедлайнов.");
    } catch {
      toast.error("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl bg-primary/5 p-8 text-center sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          <BellRing className="size-8 text-primary" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          Вы подписались на напоминания
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Мы пришлём уведомления за 60, 30 и 7 дней до каждого дедлайна —
          никакого спама.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card p-6 shadow-sm sm:p-10"
    >
      <div className="text-center">
        <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          Подписаться на напоминания о дедлайнах
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Пришлём уведомления за 60, 30 и 7 дней до каждого важного события.
          Бесплатно, можно отписаться одним кликом.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sub-name">Имя</Label>
          <Input
            id="sub-name"
            placeholder="Как к вам обращаться?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub-email">Email</Label>
          <Input
            id="sub-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub-phone">Телефон</Label>
          <Input
            id="sub-phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox
            id="consent-subscribe"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            required
            className="mt-0.5"
          />
          <Label
            htmlFor="consent-subscribe"
            className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground"
          >
            Я согласен на обработку персональных данных в соответствии с{" "}
            <Link
              href="/privacy"
              className="text-primary underline-offset-2 hover:underline"
            >
              Политикой конфиденциальности
            </Link>{" "}
            и принимаю условия{" "}
            <Link
              href="/terms"
              className="text-primary underline-offset-2 hover:underline"
            >
              публичной оферты
            </Link>
            .
          </Label>
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={loading || !consent}
        className="mt-6 h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
      >
        {loading ? "Отправка..." : "Подписаться на напоминания"}
      </Button>
    </form>
  );
}
