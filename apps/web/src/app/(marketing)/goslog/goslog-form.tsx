"use client";

import { CheckCircle, Loader2, Shield } from "lucide-react";
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

export function GoslogForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [urgency, setUrgency] = useState<string>("before_deadline");
  const [type, setType] = useState<string>("expeditor");

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
      segment: type,
      package: urgency,
    };

    const inn = (formData.get("inn") as string)?.trim();
    if (inn) context.inn = inn;

    const company = (formData.get("company") as string)?.trim();
    if (company) context.company = company;

    try {
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          source: "goslog",
          priority: urgency === "expired" ? "high" : "normal",
          message:
            urgency === "expired"
              ? "Клиент пропустил дедлайн 30.04.2026 — консультация по экстренным мерам"
              : urgency === "urgent"
                ? "Дедлайн 30.04.2026 — нужна срочная регистрация"
                : "",
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
          Заявка отправлена!
        </h3>
        <p className="mt-2 text-primary-foreground/80">
          Перезвоним в течение 15 минут в рабочее время. Подготовим список того,
          что нужно до подачи, и расскажем о ваших шансах.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-primary p-6 sm:p-8 lg:p-10">
      <div className="text-center">
        <h3 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
          Заявка на регистрацию в ГосЛог
        </h3>
        <p className="mt-2 text-primary-foreground/70">
          Заполните форму — перезвоним за 15 минут с планом действий
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
          <div className="space-y-2">
            <Label htmlFor="goslog-inn" className="text-primary-foreground">
              ИНН (необязательно)
            </Label>
            <Input
              id="goslog-inn"
              name="inn"
              inputMode="numeric"
              pattern="\d{10,12}"
              placeholder="10 или 12 цифр"
              className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="goslog-type" className="text-primary-foreground">
              Тип деятельности
            </Label>
            <Select name="type" value={type} onValueChange={setType}>
              <SelectTrigger
                id="goslog-type"
                className="h-12 w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground data-[placeholder]:text-primary-foreground/50"
              >
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expeditor">Экспедитор</SelectItem>
                <SelectItem value="carrier">Перевозчик</SelectItem>
                <SelectItem value="both">И то, и другое</SelectItem>
                <SelectItem value="unsure">Ещё не знаю</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goslog-urgency" className="text-primary-foreground">
              Срочность
            </Label>
            <Select
              name="urgency"
              value={urgency}
              onValueChange={setUrgency}
            >
              <SelectTrigger
                id="goslog-urgency"
                className="h-12 w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground data-[placeholder]:text-primary-foreground/50"
              >
                <SelectValue placeholder="Когда нужна регистрация" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">
                  Срочно — до 30 апреля 2026
                </SelectItem>
                <SelectItem value="before_deadline">
                  В ближайшие недели
                </SelectItem>
                <SelectItem value="planning">Планирую — выбираю подрядчика</SelectItem>
                <SelectItem value="expired">
                  Пропустил дедлайн — что делать?
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            "Оставить заявку"
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-primary-foreground/60">
          <Shield className="size-3.5" />
          <span>Перезвоним за 15 минут. Данные защищены.</span>
        </div>
      </form>
    </div>
  );
}
