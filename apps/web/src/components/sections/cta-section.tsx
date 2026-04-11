"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  phone?: string;
  className?: string;
}

export function CtaSection({
  heading,
  description,
  ctaText,
  ctaHref,
  phone = "+7 (495) XXX-XX-XX",
  className,
}: CtaSectionProps) {
  // Simple mode for other pages
  if (heading && ctaText && ctaHref) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "rounded-3xl bg-primary p-6 sm:p-10 lg:p-14 text-center",
          className
        )}
      >
        <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">
          {heading}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/70">
            {description}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
          >
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-2 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-80"
          >
            <Phone className="size-5" />
            {phone}
          </a>
        </div>
      </motion.div>
    );
  }

  return <CtaFormSection className={className} />;
}

function CtaFormSection({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, source: "cta-form" }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Ошибка отправки. Попробуйте позже.");
        return;
      }

      setSubmitted(true);
      toast.success("Заявка принята! Перезвоним вам в течение 5 минут.");
      router.push("/thank-you");
    } catch {
      toast.error("Ошибка сети. Попробуйте позже или позвоните нам.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-primary p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: text */}
        <div>
          <h2 className="font-heading text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl lg:text-4xl">
            Каждый день без пропуска — штрафы и простой
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/70">
            Не откладывайте. Один рейс без пропуска дороже, чем оформление на&nbsp;год.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Бесплатная консультация",
              "Расчёт за 2 минуты",
              "Перезвоним за 5 минут",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-primary-foreground/60"
              >
                <Shield className="size-4 text-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <a
            href="tel:+74951234567"
            className="mt-6 flex items-center gap-2 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-80 lg:hidden"
          >
            <Phone className="size-5" />
            +7 (495) XXX-XX-XX
          </a>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl bg-background p-6 shadow-2xl sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
                <Shield className="size-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Заявка принята!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Перезвоним вам в течение 5 минут.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  Получить расчёт бесплатно
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Заполните форму — перезвоним за 5 минут
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta-name">Имя</Label>
                <Input
                  id="cta-name"
                  placeholder="Как к вам обращаться?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta-phone">Телефон</Label>
                <Input
                  id="cta-phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 w-full rounded-xl text-base font-semibold bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
              >
                {loading ? "Отправка..." : "Получить расчёт бесплатно"}
                {!loading && <ArrowRight className="ml-2 size-4" />}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="size-3.5" />
                <span>Перезвоним за 5 минут. Данные защищены.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
