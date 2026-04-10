"use client";

import { CheckCircle, HandshakeIcon, Megaphone, Wallet } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const benefits = [
  {
    icon: Wallet,
    title: "Агентское вознаграждение",
    description:
      "Получайте комиссию за каждого привлечённого клиента. Чем больше клиентов — тем выше процент.",
  },
  {
    icon: Megaphone,
    title: "Промоматериалы",
    description:
      "Предоставим готовые рекламные материалы, баннеры, тексты и скрипты продаж.",
  },
  {
    icon: HandshakeIcon,
    title: "Персональный менеджер",
    description:
      "Закреплённый менеджер поможет с любыми вопросами и обеспечит быструю обработку заявок ваших клиентов.",
  },
];

const steps = [
  {
    number: 1,
    title: "Оставьте заявку",
    description: "Заполните форму ниже. Мы свяжемся с вами в течение 1 рабочего дня.",
  },
  {
    number: 2,
    title: "Подпишите договор",
    description:
      "Заключим партнёрский договор с прозрачными условиями вознаграждения.",
  },
  {
    number: 3,
    title: "Привлекайте клиентов",
    description:
      "Рекомендуйте нас своим клиентам и получайте вознаграждение за каждую оплаченную заявку.",
  },
];

export function PartnersClient() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-primary px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            Партнёрская программа
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80">
            Зарабатывайте вместе с нами. Рекомендуйте Инфологистик-24 своим
            клиентам и получайте агентское вознаграждение за каждого
            привлечённого клиента.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Преимущества партнёрства
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title}>
                  <CardContent className="flex flex-col items-center text-center">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Как это работает
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Стать партнёром
          </h2>

          {submitted ? (
            <Card className="mt-8">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <CheckCircle className="size-16 text-primary" />
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  Заявка отправлена!
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Мы свяжемся с вами в течение 1 рабочего дня для обсуждения
                  условий партнёрства.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-8">
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-name">Имя *</Label>
                    <Input
                      id="partner-name"
                      name="name"
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-company">Компания</Label>
                    <Input
                      id="partner-company"
                      name="company"
                      placeholder="Название компании"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-phone">Телефон *</Label>
                    <Input
                      id="partner-phone"
                      name="phone"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-email">Email *</Label>
                    <Input
                      id="partner-email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-message">Комментарий</Label>
                    <Textarea
                      id="partner-message"
                      name="message"
                      placeholder="Расскажите о вашем бизнесе и как вы планируете привлекать клиентов"
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
