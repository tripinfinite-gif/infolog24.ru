"use client";

import { ArrowRight, MessageCircle, Phone, Send, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FinalCtaFormProps {
  className?: string;
}

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
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleNeed = (id: string) => {
    setNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fleetLabel =
        fleetOptions.find((f) => f.value === fleet)?.label ?? fleet;
      const needsLabels = needOptions
        .filter((n) => needs.includes(n.id))
        .map((n) => n.label)
        .join(", ");

      const message = [
        `Размер парка: ${fleetLabel}`,
        needsLabels ? `Что нужно: ${needsLabels}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message,
          source: "homepage-v2",
        }),
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
        "relative scroll-mt-24 overflow-hidden rounded-3xl bg-primary p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-heading text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Обсудим ваш парк — 15 минут
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
            Расскажите, сколько у вас машин и что нужно. Менеджер перезвонит
            и предложит оптимальный формат работы.
          </p>

          <div className="mt-8 space-y-3">
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
          <div className="mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
              Или напишите сразу
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/74951234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366]/15 px-4 py-2.5 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/25"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
              <a
                href="https://t.me/infolog24_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#229ED9]/15 px-4 py-2.5 text-sm font-semibold text-[#229ED9] transition-colors hover:bg-[#229ED9]/25"
              >
                <Send className="size-4" />
                Telegram
              </a>
              <a
                href="tel:+74951234567"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              >
                <Phone className="size-4" />
                +7 (495) 123-45-67
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-background p-6 shadow-2xl sm:p-8">
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
                  Перезвоним за 15 минут
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
              </div>

              {/* Fleet size */}
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
                          "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
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

              {/* Needs */}
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
                          "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
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

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
              >
                {loading ? "Отправка..." : "Получить расчёт"}
                {!loading && <ArrowRight className="ml-2 size-4" />}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="size-3.5" />
                <span>Данные защищены. Спам не отправляем.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
