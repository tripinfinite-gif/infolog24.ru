"use client";

import { Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useCallback, type FormEvent, type ChangeEvent } from "react";
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
import { cn } from "@/lib/utils";

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

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  // Remove leading 7 or 8 if present
  const cleaned = digits.startsWith("7")
    ? digits.slice(1)
    : digits.startsWith("8")
      ? digits.slice(1)
      : digits;

  const parts = cleaned.slice(0, 10);
  let result = "+7";
  if (parts.length > 0) result += ` (${parts.slice(0, 3)}`;
  if (parts.length >= 3) result += ")";
  if (parts.length > 3) result += ` ${parts.slice(3, 6)}`;
  if (parts.length > 6) result += `-${parts.slice(6, 8)}`;
  if (parts.length > 8) result += `-${parts.slice(8, 10)}`;

  return result;
}

function getPhoneDigits(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

interface InlineLeadFormProps {
  ctaText?: string;
  showZone?: boolean;
  className?: string;
  onSuccess?: () => void;
  source?: string;
}

export function InlineLeadForm({
  ctaText = "Получить расчёт",
  showZone = true,
  className,
  onSuccess,
  source = "inline_lead_form",
}: InlineLeadFormProps) {
  const [phone, setPhone] = useState("+7");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow deletion
    if (raw.length < 3) {
      setPhone("+7");
      return;
    }
    setPhone(formatPhone(raw));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string | null) ?? "";
    const zoneRaw = formData.get("zone") as string | null;
    const zone = zoneRaw && zoneRaw !== "unknown" ? zoneRaw : undefined;

    setLoading(true);
    try {
      const utm = readUtmFromCookies();
      const message =
        Object.keys(utm).length > 0 ? `UTM: ${JSON.stringify(utm)}` : undefined;

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          source,
          zone,
          message,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Слишком много запросов. Попробуйте через минуту.");
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      analytics.callbackRequested();
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      toast.error("Ошибка отправки. Позвоните нам или напишите в чат.");
      console.warn("[InlineLeadForm]", err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={cn("rounded-xl border border-border/60 bg-card p-6 text-center", className)}>
        <CheckCircle className="mx-auto mb-3 size-12 text-green-600" />
        <p className="text-lg font-semibold text-foreground">Спасибо!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Мы перезвоним вам в течение 5 минут
        </p>
      </div>
    );
  }

  const phoneDigits = getPhoneDigits(phone);
  const isPhoneValid = phoneDigits.length === 11;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
    >
      <div className="space-y-2">
        <Label htmlFor="lead-name">Имя</Label>
        <Input
          id="lead-name"
          name="name"
          placeholder="Ваше имя"
          required
          autoComplete="given-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-phone">Телефон</Label>
        <Input
          id="lead-phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+7 (___) ___-__-__"
          required
          autoComplete="tel"
        />
      </div>

      {showZone && (
        <div className="space-y-2">
          <Label htmlFor="lead-zone">Зона пропуска</Label>
          <Select name="zone">
            <SelectTrigger id="lead-zone" className="w-full">
              <SelectValue placeholder="Выберите зону" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mkad">МКАД</SelectItem>
              <SelectItem value="ttk">ТТК</SelectItem>
              <SelectItem value="sk">Садовое кольцо</SelectItem>
              <SelectItem value="unknown">Не знаю</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-start gap-2">
        <Checkbox
          id="lead-agree"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
          required
        />
        <Label htmlFor="lead-agree" className="text-xs leading-normal text-muted-foreground">
          Согласен на{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            обработку персональных данных
          </Link>
        </Label>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!agreed || !isPhoneValid || loading}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {loading ? "Отправка..." : ctaText}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-1.5 rounded-full bg-green-500" />
          Перезвоним за 5 минут
        </span>
        <span className="flex items-center gap-1">
          <Lock className="size-3" />
          Данные защищены
        </span>
      </div>
    </form>
  );
}
