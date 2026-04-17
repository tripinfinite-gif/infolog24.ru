"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  claimReferralFromCookieAction,
  completeClientProfileAction,
} from "../_actions";

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
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

    if (form.phone.trim().length < 5) {
      setError("Укажите корректный телефон");
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

      // Сохраняем телефон отдельным шагом — Better Auth не знает про
      // дополнительные поля в schema.users.
      const profileResult = await completeClientProfileAction({
        phone: form.phone,
      });

      if (!profileResult.ok) {
        // Регистрация прошла, но телефон не сохранился — не блокируем вход.
        toast.warning(profileResult.error);
      } else {
        toast.success("Аккаунт создан");
      }

      // Реферальная программа: если в cookie лежит ref_code — фиксируем
      // запись "друг пришёл по ссылке". Ошибки не блокируют регистрацию.
      try {
        await claimReferralFromCookieAction();
      } catch {
        // ignore — реферал вторичен
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      const message = "Произошла ошибка. Попробуйте позже.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Регистрация</CardTitle>
        <CardDescription>
          Создайте аккаунт для работы с личным кабинетом
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
            <Label htmlFor="name">Имя</Label>
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
              placeholder="mail@example.com"
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
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Название компании заполнять необязательно — попросим позже,
            когда дойдём до оформления заявки.
          </p>
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-4 border-t pt-6">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
