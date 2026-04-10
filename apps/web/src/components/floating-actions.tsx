"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Send, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/74951234567";
const TELEGRAM_URL = "https://t.me/infologistic24";

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

interface FloatingActionsProps {
  className?: string;
}

export function FloatingActions({ className }: FloatingActionsProps) {
  const [visible, setVisible] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("+7");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw.length < 3) {
      setPhone("+7");
      return;
    }
    setPhone(formatPhone(raw));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Callback form submitted:", {
      name: formData.get("name"),
      phone: phone,
    });
    setSubmitted(true);
    setTimeout(() => {
      setCallbackOpen(false);
      setSubmitted(false);
      setPhone("+7");
      setAgreed(false);
    }, 3000);
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 11;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <>
            {/* Desktop: Vertical stack, bottom-right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(
                "fixed bottom-6 right-6 z-40 hidden flex-col gap-3 rounded-2xl bg-card/80 p-2 shadow-[0_4px_20px_-4px_rgba(28,28,30,0.10)] backdrop-blur lg:flex",
                className
              )}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
              >
                <Button
                  size="icon-lg"
                  className="size-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#25D366]/90"
                  asChild
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <MessageCircle className="size-6" />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              >
                <Button
                  size="icon-lg"
                  className="size-14 rounded-full bg-[#0088cc] text-white shadow-lg hover:bg-[#0088cc]/90"
                  asChild
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                    <Send className="size-6" />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
              >
                <Button
                  size="icon-lg"
                  className="size-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
                  onClick={() => setCallbackOpen(true)}
                  aria-label="Перезвоните мне"
                >
                  <Phone className="size-6" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Mobile: Horizontal bar at bottom */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-4 border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden"
            >
              <Button
                size="lg"
                className="flex-1 gap-2 rounded-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
                asChild
              >
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-5" />
                  <span className="sr-only sm:not-sr-only">WhatsApp</span>
                </a>
              </Button>

              <Button
                size="lg"
                className="flex-1 gap-2 rounded-full bg-[#0088cc] text-white hover:bg-[#0088cc]/90"
                asChild
              >
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Send className="size-5" />
                  <span className="sr-only sm:not-sr-only">Telegram</span>
                </a>
              </Button>

              <Button
                size="lg"
                className="flex-1 gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setCallbackOpen(true)}
              >
                <Phone className="size-5" />
                <span className="sr-only sm:not-sr-only">Звонок</span>
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Callback Dialog */}
      <Dialog open={callbackOpen} onOpenChange={setCallbackOpen}>
        <DialogContent className="rounded-3xl bg-card sm:max-w-md">
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
                  Мы перезвоним вам в ближайшее время
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <DialogHeader>
                  <DialogTitle>Перезвоните мне</DialogTitle>
                  <DialogDescription>
                    Оставьте номер, и мы перезвоним вам за 5 минут
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="floating-name">Имя</Label>
                    <Input
                      id="floating-name"
                      name="name"
                      placeholder="Ваше имя"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floating-phone">Телефон</Label>
                    <Input
                      id="floating-phone"
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
                      id="floating-agree"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked === true)}
                    />
                    <Label htmlFor="floating-agree" className="text-xs leading-normal text-muted-foreground">
                      Согласен на{" "}
                      <Link href="/privacy" className="underline hover:text-foreground">
                        обработку персональных данных
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!agreed || !isPhoneValid}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Отправить
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
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
    </>
  );
}
