"use client";

import { useEffect, useState, useCallback, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Lock, HelpCircle } from "lucide-react";
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

const STORAGE_KEY = "scroll-popup-shown";

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

type Zone = "mkad" | "ttk" | "sk" | "unknown";
type VehicleCount = "1" | "2-5" | "6-10" | "11+";

const ZONE_LABELS: Record<Zone, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  unknown: "Индивидуально",
};

const BASE_PRICES: Record<Zone, number> = {
  mkad: 12000,
  ttk: 12000,
  sk: 12000,
  unknown: 12000,
};

function getDiscount(count: VehicleCount): number {
  switch (count) {
    case "1":
      return 0;
    case "2-5":
      return 5;
    case "6-10":
      return 10;
    case "11+":
      return 15;
  }
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

interface ScrollPopupProps {
  triggerPercent?: number;
  onOpen?: () => void;
  onClose?: () => void;
}

export function ScrollPopup({
  triggerPercent = 60,
  onOpen,
  onClose,
}: ScrollPopupProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [zone, setZone] = useState<Zone | null>(null);
  const [vehicleCount, setVehicleCount] = useState<VehicleCount | null>(null);
  const [phone, setPhone] = useState("+7");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

    function handleScroll() {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= triggerPercent) {
        showPopup();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerPercent, showPopup]);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) onClose?.();
  }

  function selectZone(z: Zone) {
    setZone(z);
    setStep(2);
  }

  function selectCount(c: VehicleCount) {
    setVehicleCount(c);
    setStep(3);
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

    // ScrollPopup — UX минимума кликов, имя не собираем. Манагер уточнит при созвоне.
    const name = "Клиент (калькулятор)";

    setLoading(true);
    try {
      const utm = readUtmFromCookies();
      const messageParts: string[] = [];
      if (zone) messageParts.push(`Зона: ${ZONE_LABELS[zone]}`);
      if (vehicleCount) messageParts.push(`Машин: ${vehicleCount}`);
      if (Object.keys(utm).length > 0) messageParts.push(`UTM: ${JSON.stringify(utm)}`);
      const message = messageParts.length > 0 ? messageParts.join(" | ") : undefined;

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          source: "scroll_popup",
          zone: zone && zone !== "unknown" ? zone : undefined,
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
      setStep(4);
      setTimeout(() => {
        setOpen(false);
        onClose?.();
      }, 3000);
    } catch (err) {
      toast.error("Ошибка отправки. Позвоните нам или напишите в чат.");
      console.warn("[ScrollPopup]", err);
    } finally {
      setLoading(false);
    }
  }

  const price = zone ? BASE_PRICES[zone] : 0;
  const discount = vehicleCount ? getDiscount(vehicleCount) : 0;
  const phoneDigits = phone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 11;

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-3xl bg-card sm:max-w-md" showCloseButton>
        {/* Step indicators */}
        {!submitted && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "w-8 bg-accent"
                    : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Zone selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-accent/10">
                  <HelpCircle className="size-6 text-accent" />
                </div>
                <DialogTitle className="text-center text-xl">
                  Нужна помощь с выбором пропуска?
                </DialogTitle>
                <DialogDescription className="text-center">
                  Какая зона вам нужна?
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto flex-col gap-1 rounded-xl border-border/60 py-4 hover:border-accent/40 hover:bg-accent/5"
                  onClick={() => selectZone("mkad")}
                >
                  <span className="text-base font-semibold">МКАД</span>
                  <span className="text-xs text-muted-foreground">от 12 000 &#8381;</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto flex-col gap-1 rounded-xl border-border/60 py-4 hover:border-accent/40 hover:bg-accent/5"
                  onClick={() => selectZone("ttk")}
                >
                  <span className="text-base font-semibold">ТТК</span>
                  <span className="text-xs text-muted-foreground">от 12 000 &#8381;</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto flex-col gap-1 rounded-xl border-border/60 py-4 hover:border-accent/40 hover:bg-accent/5"
                  onClick={() => selectZone("sk")}
                >
                  <span className="text-base font-semibold">Садовое</span>
                  <span className="text-xs text-muted-foreground">от 12 000 &#8381;</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto flex-col gap-1 rounded-xl border-border/60 py-4 hover:border-accent/40 hover:bg-accent/5"
                  onClick={() => selectZone("unknown")}
                >
                  <span className="text-base font-semibold">Не знаю</span>
                  <span className="text-xs text-muted-foreground">Подберём</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Vehicle count */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  Сколько машин?
                </DialogTitle>
                <DialogDescription className="text-center">
                  Чем больше машин, тем больше скидка
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(["1", "2-5", "6-10", "11+"] as VehicleCount[]).map((count) => (
                  <Button
                    key={count}
                    variant="outline"
                    size="lg"
                    className="h-auto flex-col gap-1 rounded-xl border-border/60 py-4 hover:border-accent/40 hover:bg-accent/5"
                    onClick={() => selectCount(count)}
                  >
                    <span className="text-lg font-semibold">{count}</span>
                    {count !== "1" && (
                      <span className="text-xs text-accent font-medium">
                        скидка {getDiscount(count)}%
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Result + phone */}
          {step === 3 && !submitted && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  Ваш расчёт готов!
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 rounded-xl bg-accent/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Для вас: <strong className="text-foreground">{zone ? ZONE_LABELS[zone] : ""}</strong>
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  от {price.toLocaleString("ru-RU")} &#8381;
                </p>
                {discount > 0 && (
                  <p className="mt-1 text-sm font-medium text-accent">
                    Скидка {discount}% за {vehicleCount} машин{vehicleCount === "2-5" ? "ы" : ""}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scroll-phone">Телефон для точного расчёта</Label>
                  <Input
                    id="scroll-phone"
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
                    id="scroll-agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                  />
                  <Label htmlFor="scroll-agree" className="text-xs leading-normal text-muted-foreground">
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
                  {loading ? "Отправка..." : "Получить точный расчёт"}
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

          {/* Step 4: Success */}
          {step === 4 && submitted && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <CheckCircle className="mx-auto mb-3 size-12 text-green-600" />
              <p className="text-lg font-semibold text-foreground">Спасибо!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Мы перезвоним вам в течение 5 минут с точным расчётом
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
