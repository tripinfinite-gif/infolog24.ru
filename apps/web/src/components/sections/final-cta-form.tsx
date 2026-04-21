"use client";

import { ArrowRight, Bot, MessageSquare, Phone, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companyInfo } from "@/content/company";
import { cn } from "@/lib/utils";

interface FinalCtaFormProps {
  className?: string;
}

const SIMPLIFIED = process.env.NEXT_PUBLIC_CTA_SIMPLIFIED === "true";

type FleetOption = "1" | "2-4" | "5-20" | "20+";

const fleetOptions: { value: FleetOption; label: string }[] = [
  { value: "1", label: "1 машина" },
  { value: "2-4", label: "2–4" },
  { value: "5-20", label: "5–20" },
  { value: "20+", label: "20+" },
];

interface NeedOption {
  id: string;
  label: string;
}

const needOptions: NeedOption[] = [
  { id: "propusk", label: "Пропуск" },
  { id: "rnis", label: "РНИС" },
  { id: "etrn", label: "ЭТрН" },
  { id: "goslog", label: "ГосЛог" },
  { id: "infopilot", label: "ИнфоПилот" },
  { id: "all", label: "Всё сразу" },
];

export function FinalCtaForm({ className }: FinalCtaFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fleet, setFleet] = useState<FleetOption>("1");
  const [needs, setNeeds] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const maxLink = companyInfo.social.find((s) => s.name === "MAX");

  const toggleNeed = (id: string) => {
    setNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      toast.error("Необходимо согласие на обработку персональных данных");
      return;
    }

    setLoading(true);

    try {
      const body: {
        name: string;
        phone: string;
        message?: string;
        source: string;
      } = {
        name,
        phone,
        source: SIMPLIFIED ? "homepage-v2-simplified" : "homepage-v2",
      };

      if (!SIMPLIFIED) {
        const fleetLabel =
          fleetOptions.find((f) => f.value === fleet)?.label ?? fleet;
        const needsLabels = needOptions
          .filter((n) => needs.includes(n.id))
          .map((n) => n.label)
          .join(", ");

        body.message = [
          `Размер парка: ${fleetLabel}`,
          needsLabels ? `Что нужно: ${needsLabels}` : null,
        ]
          .filter(Boolean)
          .join("\n");
      }

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(
          (json as { error?: string })?.error ??
            "Ошибка отправки. Попробуйте позже."
        );
        return;
      }

      setSubmitted(true);
      toast.success("Заявка принята! Перезвоним за 15 минут.");
    } catch {
      toast.error("Ошибка сети. Попробуйте позже или позвоните нам.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="zayavka"
      className={cn(
        "relative mx-auto w-full max-w-7xl scroll-mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.22_0.06_290)] via-[oklch(0.18_0.04_280)] to-[oklch(0.14_0.02_280)] p-6 ring-neon sm:p-10 lg:p-14",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 size-[360px] rounded-full bg-highlight/12 blur-3xl"
        aria-hidden="true"
      />

      <div className="grain absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <span className="eyebrow eyebrow-dark">
            <Shield className="size-3.5" />
            Оставить заявку
          </span>
          <h2 className="section-title mt-5 text-primary-foreground">
            Расчёт под ваш парк —{" "}
            <span className="bg-gradient-to-r from-[oklch(0.75_0.18_260)] to-[oklch(0.80_0.14_50)] bg-clip-text text-transparent">
              за 15 минут, бесплатно
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
            Напишите, сколько у вас машин и что нужно. Менеджер перезвонит
            и&nbsp;покажет, сколько вы сэкономите на пакете.
          </p>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-primary-foreground/10">
            <div className="bg-primary/95 p-4">
              <div className="stat-number text-2xl text-primary-foreground">
                15 мин
              </div>
              <div className="text-[11px] text-primary-foreground/60">
                до перезвона
              </div>
            </div>
            <div className="bg-primary/95 p-4">
              <div className="stat-number text-2xl text-primary-foreground">
                0 ₽
              </div>
              <div className="text-[11px] text-primary-foreground/60">
                за консультацию
              </div>
            </div>
            <div className="bg-primary/95 p-4">
              <div className="stat-number text-2xl text-highlight">152-ФЗ</div>
              <div className="text-[11px] text-primary-foreground/60">
                защита данных
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-2.5">
            {[
              "Бесплатная консультация",
              "Расчёт под ваш парк за 15 минут",
              "Подбор пакета или одиночной услуги",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-primary-foreground/70"
              >
                <Shield className="size-4 text-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Alternatives */}
          {!SIMPLIFIED && (
            <div className="mt-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
                Или напишите сразу
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new Event("infopilot:open"));
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-colors hover:bg-accent/90"
                >
                  <Bot className="size-4" />
                  AI-ассистент
                </button>
                {maxLink && (
                  <a
                    href={maxLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-primary-foreground/15 transition-colors hover:bg-primary-foreground/15"
                  >
                    <MessageSquare className="size-4" />
                    MAX
                  </a>
                )}
                <a
                  href={`tel:${companyInfo.contacts.phoneTel}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-primary-foreground/15 transition-colors hover:bg-primary-foreground/15"
                >
                  <Phone className="size-4" />
                  {companyInfo.contacts.phoneFormatted}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="rounded-3xl bg-card p-6 shadow-2xl sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/15">
                <Shield className="size-8 text-accent" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Заявка принята!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Менеджер перезвонит вам в течение 15 минут.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  Получить расчёт
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Перезвоним за 15 минут и рассчитаем стоимость
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-name">Имя</Label>
                <Input
                  id="final-name"
                  placeholder="Как к вам обращаться?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-phone">Телефон</Label>
                <Input
                  id="final-phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-12 rounded-2xl"
                />
              </div>

              {/* Fleet size */}
              {!SIMPLIFIED && (
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-foreground">
                    Сколько у вас машин?
                  </legend>
                  <div className="grid grid-cols-4 gap-2">
                    {fleetOptions.map((option) => {
                      const active = fleet === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFleet(option.value)}
                          className={cn(
                            "rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                            active
                              ? "border-accent bg-accent text-accent-foreground shadow-sm"
                              : "border-border bg-card text-foreground hover:border-accent"
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* Needs */}
              {!SIMPLIFIED && (
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-foreground">
                    Что нужно? (можно несколько)
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {needOptions.map((option) => {
                      const checked = needs.includes(option.id);
                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition-colors",
                            checked
                              ? "border-accent bg-accent/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-accent"
                          )}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleNeed(option.id)}
                            className="size-4"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* 152-ФЗ согласие на обработку персональных данных */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Checkbox
                  id="consent-final"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  required
                  className="mt-0.5"
                />
                <Label
                  htmlFor="consent-final"
                  className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground"
                >
                  Я согласен на обработку персональных данных в соответствии
                  с{" "}
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

              <Button
                type="submit"
                size="lg"
                disabled={loading || !consent}
                className="w-full shadow-md shadow-accent/25"
              >
                {loading ? "Отправка..." : "Получить расчёт"}
                {!loading && <ArrowRight className="ml-2 size-4" />}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="size-3.5" />
                <span>Данные защищены по 152-ФЗ. Без навязчивых звонков.</span>
              </div>
            </form>
          )}

          {SIMPLIFIED && !submitted && (
            <div className="mt-8 border-t pt-6">
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Или свяжитесь по-другому:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new Event("infopilot:open"));
                    }
                  }}
                >
                  <Bot className="mr-2 size-4" /> Чат ИнфоПилот
                </Button>
                <Button type="button" variant="outline" asChild>
                  <a href={`tel:${companyInfo.contacts.phoneTel}`}>
                    <Phone className="mr-2 size-4" /> Позвонить
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
