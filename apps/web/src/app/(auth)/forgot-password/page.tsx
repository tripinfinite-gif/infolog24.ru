"use client";

import { useState } from "react";
import Link from "next/link";
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
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Подключить реальный API сброса пароля
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
    } catch {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="mb-2 size-12 text-green-500" />
          <CardTitle className="text-2xl">Письмо отправлено</CardTitle>
          <CardDescription>
            Мы отправили ссылку для сброса пароля на {email}. Проверьте
            почту.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link href="/login">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Вернуться ко входу
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Сброс пароля</CardTitle>
        <CardDescription>
          Введите email, и мы отправим ссылку для сброса пароля
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Отправка..." : "Отправить ссылку для сброса"}
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-3" />
            Вернуться ко входу
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
