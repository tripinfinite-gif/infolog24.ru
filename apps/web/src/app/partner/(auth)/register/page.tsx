"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck } from "lucide-react";

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

export default function PartnerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock: would call auth API, create user with role=partner, redirect to /partner
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2">
            <Truck className="size-6 text-primary" />
            <span className="text-lg font-bold">Инфологистик-24</span>
          </div>
          <CardTitle>Регистрация партнёра</CardTitle>
          <CardDescription>
            Создайте аккаунт для участия в партнёрской программе
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя и фамилия</Label>
                <Input
                  id="name"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="partner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">
                  Компания <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company"
                  placeholder="ООО Ваша Компания"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Обязательное поле для партнёров
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 8 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link
                href="/partner/login"
                className="font-medium text-primary hover:underline"
              >
                Войти
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
