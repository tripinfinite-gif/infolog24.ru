"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { becomePartnerAction } from "../_actions";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  inn: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  inn: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (form.password.length < 8) {
      setError("Пароль должен быть не менее 8 символов");
      return;
    }
    if (!/^(\d{10}|\d{12})$/.test(form.inn)) {
      setError("ИНН должен содержать 10 или 12 цифр");
      return;
    }
    if (!form.agree) {
      setError("Необходимо согласиться с условиями партнёрской программы");
      return;
    }

    setLoading(true);

    try {
      const signUpResult = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });

      if (signUpResult.error) {
        const message = signUpResult.error.message ?? "Ошибка регистрации";
        setError(message);
        toast.error(message);
        return;
      }

      const actionResult = await becomePartnerAction({
        phone: form.phone,
        company: form.company,
        inn: form.inn,
      });

      if (!actionResult.ok) {
        setError(actionResult.error);
        toast.error(actionResult.error);
        return;
      }

      toast.success("Партнёрский аккаунт создан");
      router.push("/partner");
      router.refresh();
    } catch (err) {
      const message = "Произошла ошибка. Попробуйте позже.";
      setError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex items-center gap-2">
              <Truck className="size-6 text-primary" />
              <span className="text-lg font-bold">Инфолог24</span>
            </div>
            <CardTitle>Регистрация партнёра</CardTitle>
            <CardDescription>
              Создайте партнёрский аккаунт и начните зарабатывать на рекомендациях
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">ФИО</Label>
                <Input
                  id="name"
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="partner@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">
                  Компания <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company"
                  placeholder="ООО «Ваша компания»"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  required
                  autoComplete="organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inn">
                  ИНН <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="inn"
                  inputMode="numeric"
                  placeholder="10 или 12 цифр"
                  value={form.inn}
                  onChange={(e) =>
                    update("inn", e.target.value.replace(/\D/g, ""))
                  }
                  required
                  maxLength={12}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 8 символов"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Повторите пароль"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 cursor-pointer accent-primary"
                  checked={form.agree}
                  onChange={(e) => update("agree", e.target.checked)}
                />
                <span>
                  Я согласен с{" "}
                  <Link
                    href="#"
                    className="text-primary hover:underline"
                  >
                    условиями партнёрской программы
                  </Link>
                </span>
              </label>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Регистрация..." : "Стать партнёром"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Уже партнёр?{" "}
                <Link
                  href="/partner/login"
                  className="font-medium text-primary hover:underline"
                >
                  Войти
                </Link>
              </p>
              <Link
                href="/"
                className="text-center text-xs text-muted-foreground hover:text-primary"
              >
                ← Вернуться на сайт
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
