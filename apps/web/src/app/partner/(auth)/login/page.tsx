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
import { verifyPartnerRoleAction } from "../_actions";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        const message = result.error.message ?? "Ошибка авторизации";
        setError(message);
        toast.error(message);
        return;
      }

      const verify = await verifyPartnerRoleAction();
      if (!verify.ok) {
        await authClient.signOut();
        const message =
          "Этот аккаунт не является партнёрским. Зарегистрируйтесь как партнёр.";
        setError(message);
        toast.error(message);
        return;
      }

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
            <CardTitle>Вход в партнёрский портал</CardTitle>
            <CardDescription>
              Войдите, чтобы управлять рефералами и выплатами
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="partner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter className="mt-6 flex-col gap-3 border-t pt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Вход..." : "Войти"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Нет аккаунта?{" "}
                <Link
                  href="/partner/register"
                  className="font-medium text-primary hover:underline"
                >
                  Стать партнёром
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
