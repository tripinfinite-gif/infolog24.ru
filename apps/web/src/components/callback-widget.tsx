"use client";

import { Phone } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CallbackWidgetProps {
  className?: string;
}

export function CallbackWidget({ className }: CallbackWidgetProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrate with backend
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
    }, 2000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon-lg"
          className={cn(
            "fixed bottom-6 right-6 z-40 size-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 lg:bottom-8 lg:right-8",
            className
          )}
          aria-label="Перезвоните мне"
        >
          <Phone className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Перезвоните мне</DialogTitle>
          <DialogDescription>
            Оставьте номер, и мы перезвоним вам в удобное время.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold text-foreground">Спасибо!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Мы перезвоним вам в ближайшее время.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="callback-name">Имя</Label>
              <Input
                id="callback-name"
                name="name"
                placeholder="Ваше имя"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callback-phone">Телефон</Label>
              <Input
                id="callback-phone"
                name="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callback-time">Удобное время</Label>
              <Select name="time" defaultValue="any">
                <SelectTrigger id="callback-time" className="w-full">
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любое время</SelectItem>
                  <SelectItem value="morning">Утро (9:00-12:00)</SelectItem>
                  <SelectItem value="afternoon">День (12:00-17:00)</SelectItem>
                  <SelectItem value="evening">Вечер (17:00-20:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Отправить
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
