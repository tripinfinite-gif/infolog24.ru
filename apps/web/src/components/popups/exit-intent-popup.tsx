"use client";

import { useEffect, useState, useCallback, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle, Calculator } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { analytics } from "@/lib/analytics/events";

const STORAGE_KEY = "exit-intent-shown";

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

interface ExitIntentPopupProps {
  onOpen?: () => void;
  onClose?: () => void;
}

export function ExitIntentPopup({ onOpen, onClose }: ExitIntentPopupProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("+7");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const showPopup = useCallback(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(true);
    onOpen?.();
  }, [onOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Desktop: mouse leaves viewport at the top
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        showPopup();
      }
    }

    // Mobile: detect back button via popstate
    function handlePopState() {
      showPopup();
    }

    // Add a fake history entry for mobile back detection
    window.history.pushState({ exitIntent: true }, "");

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showPopup]);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) onClose?.();
  }

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw.length < 3) {
      setPhone("+7");
      return;
    }
    setPhone(formatPhone(raw));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string | null) ?? "";

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
          source: "exit_intent",
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
      setTimeout(() => {
        setOpen(false);
        onClose?.();
      }, 3000);
    } catch (err) {
      toast.error("Ошибка отправки. Позвоните нам или напишите в чат.");
      console.warn("[ExitIntentPopup]", err);
    } finally {
      setLoading(false);
    }
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 11;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-3xl bg-card sm:max-w-md" showCloseButton>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <CheckCircle className="mx-auto mb-3 size-12 text-green-600" />
              <p className="text-lg font-semibold text-foreground">Спасибо!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Мы перезвоним вам в течение 5 минут и рассчитаем стоимость
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-accent/10">
                  <Calculator className="size-6 text-accent" />
                </div>
                <DialogTitle className="text-center text-xl">
                  Уже уходите? Получите бесплатный расчёт стоимости!
                </DialogTitle>
                <DialogDescription className="text-center">
                  Мы перезвоним за 5 минут и рассчитаем точную стоимость для ваших машин
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exit-name">Имя</Label>
                  <Input
                    id="exit-name"
                    name="name"
                    placeholder="Ваше имя"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exit-phone">Телефон</Label>
                  <Input
                    id="exit-phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    required
                    autoComplete="tel"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="exit-agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                  />
                  <Label htmlFor="exit-agree" className="text-xs leading-normal text-muted-foreground">
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
                  {loading ? "Отправка..." : "Получить расчёт"}
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
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
