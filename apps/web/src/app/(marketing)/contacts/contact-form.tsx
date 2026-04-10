"use client";

import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate with backend
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  if (submitted) {
    return (
      <Card className="h-full rounded-3xl border-0 bg-card shadow-sm">
        <CardContent className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="size-10 text-green-600" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-foreground">
            Заявка отправлена!
          </h3>
          <p className="mt-3 max-w-sm text-muted-foreground">
            Мы свяжемся с вами в течение 5 минут в рабочее время. Проверьте
            мессенджеры.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSubmitted(false)}
          >
            Отправить ещё одну заявку
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-3xl border-0 bg-card shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-foreground">Напишите нам</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Заполните форму, и мы свяжемся с вами за 5 минут
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="contact-name">
              Имя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-name"
              name="name"
              placeholder="Ваше имя"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">
              Телефон <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="email@example.com"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Сообщение</Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Опишите вашу задачу: какой пропуск нужен, сколько машин, сроки..."
              rows={4}
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
                Отправка...
              </>
            ) : (
              "Отправить заявку"
            )}
          </Button>

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a href="/privacy" className="text-primary underline">
                политикой конфиденциальности
              </a>
              . Мы не передаём ваши данные третьим лицам.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
