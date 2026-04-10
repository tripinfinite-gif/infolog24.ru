"use client";

import { CheckCircle } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrate with backend
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle className="size-16 text-primary" />
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            Заявка отправлена!
          </h3>
          <p className="mt-2 text-muted-foreground">
            Мы свяжемся с вами в течение 15 минут в рабочее время.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold text-foreground">
          Напишите нам
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Заполните форму, и мы свяжемся с вами в ближайшее время
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Имя *</Label>
            <Input
              id="contact-name"
              name="name"
              placeholder="Ваше имя"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Телефон *</Label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Сообщение</Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Опишите вашу задачу..."
              rows={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Отправить заявку
          </Button>
          <p className="text-xs text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <a href="/privacy" className="text-primary underline">
              политикой конфиденциальности
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
