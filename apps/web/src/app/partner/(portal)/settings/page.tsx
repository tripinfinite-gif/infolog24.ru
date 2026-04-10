"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// ── Component ──────────────────────────────────────────────────────────────

export default function PartnerSettingsPage() {
  const [name, setName] = useState("Алексей Партнёров");
  const [email, setEmail] = useState("partner@example.com");
  const [phone, setPhone] = useState("+7 (999) 123-45-67");
  const [company, setCompany] = useState("ООО Логистик-Партнёр");

  const [payoutMethod, setPayoutMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("4276 **** **** 1234");
  const [bankAccount, setBankAccount] = useState("");

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyTelegram, setNotifyTelegram] = useState(true);
  const [notifyNewReferral, setNotifyNewReferral] = useState(true);
  const [notifyPayout, setNotifyPayout] = useState(true);
  const [notifyStatusChange, setNotifyStatusChange] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Управление профилем и параметрами партнёрского аккаунта
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
          <CardDescription>Основная информация о партнёре</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button>Сохранить профиль</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment details */}
      <Card>
        <CardHeader>
          <CardTitle>Реквизиты для выплат</CardTitle>
          <CardDescription>
            Укажите способ получения партнёрского вознаграждения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Способ выплаты</Label>
              <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Банковская карта</SelectItem>
                  <SelectItem value="bank">Расчётный счёт</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {payoutMethod === "card" ? (
              <div className="space-y-2">
                <Label htmlFor="card">Номер карты</Label>
                <Input
                  id="card"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="bank-account">
                  Реквизиты (БИК, р/с, к/с, банк)
                </Label>
                <Input
                  id="bank-account"
                  placeholder="БИК, расчётный счёт, корр. счёт, наименование банка"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
            )}

            <Button>Сохранить реквизиты</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Уведомления</CardTitle>
          <CardDescription>
            Настройте каналы и типы уведомлений
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Каналы уведомлений</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-email"
                    checked={notifyEmail}
                    onCheckedChange={(v) => setNotifyEmail(v === true)}
                  />
                  <Label htmlFor="notify-email">Email</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-telegram"
                    checked={notifyTelegram}
                    onCheckedChange={(v) => setNotifyTelegram(v === true)}
                  />
                  <Label htmlFor="notify-telegram">Telegram</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-3">Типы уведомлений</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-new-referral"
                    checked={notifyNewReferral}
                    onCheckedChange={(v) => setNotifyNewReferral(v === true)}
                  />
                  <Label htmlFor="notify-new-referral">
                    Новый реферал зарегистрировался
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-payout"
                    checked={notifyPayout}
                    onCheckedChange={(v) => setNotifyPayout(v === true)}
                  />
                  <Label htmlFor="notify-payout">Выплата проведена</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notify-status"
                    checked={notifyStatusChange}
                    onCheckedChange={(v) => setNotifyStatusChange(v === true)}
                  />
                  <Label htmlFor="notify-status">
                    Изменение статуса заявки реферала
                  </Label>
                </div>
              </div>
            </div>

            <Button>Сохранить настройки</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
