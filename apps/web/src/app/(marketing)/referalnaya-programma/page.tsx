import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Send, Share2, Wallet } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { absoluteUrl } from "@/lib/utils/base-url";

export const metadata: Metadata = {
  title: "Реферальная программа — 1000 ₽ за каждого друга | Инфолог24",
  description:
    "Приведите друга в Инфолог24 — получите промокод на 1000 ₽. Простые правила, прозрачные условия, выплаты после оплаты заказа другом.",
  alternates: { canonical: absoluteUrl("/referalnaya-programma") },
};

const steps = [
  {
    icon: Share2,
    title: "Поделитесь ссылкой",
    text: "В личном кабинете у каждого клиента есть персональная ссылка. Отправьте её коллеге-перевозчику в WhatsApp, Telegram или на почту.",
  },
  {
    icon: Send,
    title: "Друг оформляет заказ",
    text: "Друг регистрируется по вашей ссылке и подаёт заявку на пропуск. Мы автоматически привязываем его аккаунт к вам.",
  },
  {
    icon: Wallet,
    title: "Получите 1000 ₽ бонусом",
    text: "Как только заказ друга оплачен, мы начисляем вам промокод на 1000 ₽. Действует 90 дней на любой следующий заказ.",
  },
];

const faqItems = [
  {
    q: "Сколько друзей можно пригласить?",
    a: "Ограничений нет. За каждого уникального друга, который оформит и оплатит первый заказ, вы получаете отдельный промокод на 1000 ₽.",
  },
  {
    q: "Когда я получу бонус?",
    a: "После оплаты первого заказа друга. Оплату подтверждает YooKassa — мы выдаём промокод автоматически, без участия менеджера.",
  },
  {
    q: "Можно ли привести самого себя?",
    a: "Нет. Система проверяет, что реферер и новый клиент — разные пользователи. При попытке самореферала запись не создаётся.",
  },
  {
    q: "Сколько действует промокод?",
    a: "Промокод активен 90 дней с момента начисления. За это время его нужно использовать на любой заказ — МКАД, ТТК, СК или временный пропуск.",
  },
  {
    q: "Друг получает скидку?",
    a: "Сейчас программа рассчитана на вас — реферера. Мы постепенно добавим бонус и для друга: следите за обновлениями в личном кабинете.",
  },
];

export default async function ReferralLandingPage() {
  const session = await getSession();
  const ctaHref = session ? "/dashboard/referral" : "/register";
  const ctaLabel = session
    ? "Открыть мою ссылку"
    : "Зарегистрироваться и получить ссылку";

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Gift className="size-7" />
        </div>
        <h1 className="text-balance font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight sm:text-5xl">
          Приведите друга — получите 1000 ₽ на следующий заказ
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Делитесь Инфолог24 с коллегами-перевозчиками. За каждого друга,
          который оформит и оплатит первый пропуск, мы начисляем промокод
          на 1000 ₽. Никаких лимитов и скрытых условий.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          {!session && (
            <Button asChild size="lg" variant="outline">
              <Link href="/login">У меня уже есть аккаунт</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Три шага */}
      <section>
        <h2 className="mb-8 text-center font-[family-name:var(--font-manrope)] text-2xl font-bold sm:text-3xl">
          Как это работает
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <CardHeader>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">
                    <span className="mr-2 text-muted-foreground">
                      {idx + 1}.
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Условия */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Условия программы</CardTitle>
            <CardDescription>Коротко и без мелкого шрифта.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Размер бонуса: 1000 ₽ за каждого оплаченного друга.</p>
            <p>• Формат: промокод на скидку, срок действия 90 дней.</p>
            <p>• Кому: действующим клиентам с подтверждённым аккаунтом.</p>
            <p>
              • Когда начисляется: автоматически, сразу после подтверждения
              оплаты YooKassa.
            </p>
            <p>
              • Ограничения: один промокод — один заказ, нельзя суммировать с
              другими промокодами.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-8 text-center font-[family-name:var(--font-manrope)] text-2xl font-bold sm:text-3xl">
          Частые вопросы
        </h2>
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {faqItems.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:p-12">
        <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold sm:text-3xl">
          Готовы пригласить первого друга?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          {session
            ? "Ваша персональная ссылка уже ждёт вас в личном кабинете."
            : "Регистрация занимает меньше минуты — email, телефон и пароль."}
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-6">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </section>
    </div>
  );
}
