"use client";

import { CheckCircle, Info, Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { analytics } from "@/lib/analytics/events";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function readUtmFromCookies(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const result: Record<string, string> = {};
  const pairs = document.cookie.split("; ");
  for (const p of pairs) {
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    const key = p.slice(0, idx).trim();
    const value = p.slice(idx + 1);
    if (!key || !value) continue;
    if ((UTM_KEYS as readonly string[]).includes(key)) {
      try {
        result[key] = decodeURIComponent(value);
      } catch {
        result[key] = value;
      }
    }
  }
  return result;
}

type BusinessType = "carrier" | "expeditor" | "mixed" | "other";

export function GoslogForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [businessType, setBusinessType] =
    useState<BusinessType>("carrier");
  const [fleet, setFleet] = useState<string>("1-5");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      toast.error("Необходимо согласие на обработку персональных данных");
      return;
    }
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const website = (formData.get("website") as string) ?? "";

    const context: Record<string, string> = {
      ...readUtmFromCookies(),
      segment: businessType,
      fleet: fleet,
    };

    const email = (formData.get("email") as string)?.trim();
    const company = (formData.get("company") as string)?.trim();
    if (company) context.company = company;

    const question = (formData.get("question") as string)?.trim() ?? "";

    try {
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: email || undefined,
          source: "goslog",
          priority:
            businessType === "expeditor" ? "high" : "normal",
          message:
            (businessType === "expeditor"
              ? "Лид-экспедитор — рекомендуем партнёра. "
              : "") + (question || ""),
          context,
          website,
        }),
      });
    } catch {
      // Fallback — still show success for UX
    }

    analytics.callbackRequested();
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-primary p-8 text-center sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/20">
          <CheckCircle className="size-8 text-accent" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-primary-foreground">
          Заявка отправлена
        </h3>
        <p className="mt-2 text-primary-foreground/80">
          {businessType === "expeditor"
            ? "Учтём, что вы экспедитор, и расскажем про партнёров для срочной регистрации. Перезвоним в течение 15 минут в рабочее время."
            : "Перезвоним в течение 15 минут в рабочее время. Подготовим короткий план подготовки к 1 марта 2027 по вашему автопарку."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-primary p-6 sm:p-8 lg:p-10">
      <div className="text-center">
        <h3 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
          Задать вопрос юристу по ГосЛогу
        </h3>
        <p className="mt-2 text-primary-foreground/70">
          Заполните форму — перезвоним за 15 минут, вышлем план подготовки
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="goslog-name" className="text-primary-foreground">
              Имя
            </Label>
            <Input
              id="goslog-name"
              name="name"
              placeholder="Как к вам обращаться"
              required
              className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goslog-phone" className="text-primary-foreground">
              Телефон
            </Label>
            <Input
              id="goslog-phone"
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              required
              className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="goslog-email" className="text-primary-foreground">
              Email (необязательно)
            </Label>
            <Input
              id="goslog-email"
              name="email"
              type="email"
              placeholder="для отправки гайда"
              className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goslog-company" className="text-primary-foreground">
              Компания (необязательно)
            </Label>
            <Input
              id="goslog-company"
              name="company"
              placeholder="Название ООО / ИП"
              className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="goslog-business"
              className="text-primary-foreground"
            >
              Тип бизнеса
            </Label>
            <Select
              name="business"
              value={businessType}
              onValueChange={(v) => setBusinessType(v as BusinessType)}
            >
              <SelectTrigger
                id="goslog-business"
                className="h-12 w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground data-[placeholder]:text-primary-foreground/50"
              >
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carrier">
                  Перевозчик (грузовой транспорт &gt; 3,5 т)
                </SelectItem>
                <SelectItem value="expeditor">Экспедитор</SelectItem>
                <SelectItem value="mixed">
                  И то, и другое
                </SelectItem>
                <SelectItem value="other">Другое / не уверен</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goslog-fleet" className="text-primary-foreground">
              Размер парка ТС
            </Label>
            <Select name="fleet" value={fleet} onValueChange={setFleet}>
              <SelectTrigger
                id="goslog-fleet"
                className="h-12 w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground data-[placeholder]:text-primary-foreground/50"
              >
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1–5 машин</SelectItem>
                <SelectItem value="6-20">6–20 машин</SelectItem>
                <SelectItem value="21-50">21–50 машин</SelectItem>
                <SelectItem value="50+">Больше 50</SelectItem>
                <SelectItem value="none">
                  Пока нет парка / планирую
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {businessType === "expeditor" && (
          <div className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-primary-foreground">
            <Info className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <div className="font-semibold text-primary-foreground">
                Если вы экспедитор — срок для вас 30 апреля 2026
              </div>
              <p className="mt-1 text-primary-foreground/80">
                Мы сосредоточены на подготовке перевозчиков к 1 марта 2027. Для
                срочной регистрации экспедитора быстрее через наших партнёров —
                Контур или аудит-бюро «Картель». Оставьте заявку, и мы всё
                равно свяжемся, расскажем вариант и дадим контакт партнёра.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="goslog-question" className="text-primary-foreground">
            Ваш вопрос юристу (необязательно)
          </Label>
          <Textarea
            id="goslog-question"
            name="question"
            rows={4}
            placeholder="Например: с чего начать подготовку, если в парке 12 ТС?"
            className="min-h-[120px] border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
          />
        </div>

        <div className="flex items-start gap-2 text-xs text-primary-foreground/70">
          <Checkbox
            id="consent-goslog"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            required
            className="mt-0.5 border-primary-foreground/40 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
          />
          <Label
            htmlFor="consent-goslog"
            className="cursor-pointer text-xs font-normal leading-relaxed text-primary-foreground/70"
          >
            Я согласен на обработку персональных данных в соответствии с{" "}
            <Link
              href="/privacy"
              className="text-accent underline-offset-2 hover:underline"
            >
              Политикой конфиденциальности
            </Link>{" "}
            и принимаю условия{" "}
            <Link
              href="/terms"
              className="text-accent underline-offset-2 hover:underline"
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
          className="h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Отправка...
            </>
          ) : (
            "Отправить вопрос"
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-primary-foreground/60">
          <Shield className="size-3.5" />
          <span>
            Перезвоним за 15 минут. Не передаём ваши данные третьим лицам.
          </span>
        </div>
      </form>
    </div>
  );
}
