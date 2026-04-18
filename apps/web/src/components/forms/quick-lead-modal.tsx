"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { analytics } from "@/lib/analytics/events";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
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

export interface QuickLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Source tag used for /api/contacts and analytics (max 100 chars). */
  source: string;
  /** Optional hidden context merged into the submission payload. */
  context?: Record<string, string>;
  submitLabel?: string;
}

export function QuickLeadModal({
  open,
  onOpenChange,
  title = "Оставить заявку",
  description = "Перезвоним в течение 5 минут",
  source,
  context,
  submitLabel = "Получить расчёт",
}: QuickLeadModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [agreed, setAgreed] = useState(false);
  // Honeypot field — if non-empty on submit we silently fake-success bots.
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const descriptionId = useId();
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  // Tracks whether the current "open" session ended with a successful submit,
  // so we can report it to analytics on close.
  const submittedRef = useRef(false);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state and fire open analytics whenever the modal transitions to open.
  useEffect(() => {
    if (!open) return;

    setName("");
    setPhone("+7");
    setAgreed(false);
    setWebsite("");
    setLoading(false);
    setSuccess(false);
    submittedRef.current = false;

    analytics.leadModalOpened(source);

    // Autofocus the name field after the dialog/sheet has mounted its content.
    const focusTimer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(focusTimer);
    };
  }, [open, source]);

  // Clean up any pending auto-close timer on unmount.
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, []);

  const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.length < 3) {
      setPhone("+7");
      return;
    }
    setPhone(formatPhone(raw));
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && open) {
        // Reporting at close time is cheaper than tracking every state change.
        analytics.leadModalClosed(source, submittedRef.current);
      }
      onOpenChange(next);
    },
    [open, onOpenChange, source],
  );

  const phoneDigits = getPhoneDigits(phone);
  const isPhoneValid = phoneDigits.length === 11;
  const isNameValid = name.trim().length >= 2 && name.trim().length <= 100;
  const canSubmit = isNameValid && isPhoneValid && agreed && !loading;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    // Honeypot: real users never see/fill this field. Silently fake success.
    if (website.trim().length > 0) {
      submittedRef.current = true;
      setSuccess(true);
      autoCloseTimerRef.current = setTimeout(() => {
        handleOpenChange(false);
      }, 3000);
      return;
    }

    if (!canSubmit) return;

    setLoading(true);

    try {
      const mergedContext: Record<string, string> = {
        ...readUtmFromCookies(),
        ...(context ?? {}),
      };

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          source,
          context: mergedContext,
        }),
      });

      if (res.status === 429) {
        toast.error("Слишком много запросов. Подождите минуту.");
        return;
      }

      if (!res.ok) {
        toast.error("Ошибка отправки. Позвоните +7 (499) 110-55-49");
        return;
      }

      submittedRef.current = true;
      analytics.leadModalSubmitted(source);
      analytics.callbackRequested();
      setSuccess(true);
      autoCloseTimerRef.current = setTimeout(() => {
        handleOpenChange(false);
      }, 3000);
    } catch {
      toast.error("Ошибка отправки. Позвоните +7 (499) 110-55-49");
    } finally {
      setLoading(false);
    }
  }

  const body = success ? (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle className="size-12 text-green-600" aria-hidden="true" />
      <p className="text-lg font-semibold text-foreground">Заявка принята!</p>
      <p className="text-sm text-muted-foreground">
        Перезвоним за 5 минут
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot — hidden from real users, catches naive bots. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor={`${descriptionId}-website`}>Website</label>
        <input
          id={`${descriptionId}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${descriptionId}-name`}>Имя</Label>
        <Input
          id={`${descriptionId}-name`}
          ref={nameInputRef}
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          minLength={2}
          maxLength={100}
          required
          autoComplete="given-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${descriptionId}-phone`}>Телефон</Label>
        <Input
          id={`${descriptionId}-phone`}
          name="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+7 (___) ___-__-__"
          required
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id={`${descriptionId}-consent`}
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
          required
          className="mt-0.5"
        />
        <Label
          htmlFor={`${descriptionId}-consent`}
          className="text-xs leading-normal font-normal text-muted-foreground"
        >
          Согласен с{" "}
          <Link
            href="/privacy"
            className="underline hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            обработкой персональных данных
          </Link>
        </Label>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        className={cn(
          "w-full bg-accent text-accent-foreground hover:bg-accent/90",
        )}
      >
        {loading ? "Отправляем..." : submitLabel}
      </Button>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby={descriptionId}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription id={descriptionId}>
              {description}
            </DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" aria-describedby={descriptionId}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription id={descriptionId}>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">{body}</div>
      </SheetContent>
    </Sheet>
  );
}
