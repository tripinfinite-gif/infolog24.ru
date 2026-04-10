"use client";

import { useState } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// -- Component ----------------------------------------------------------------

function ProfileTab() {
  const [form, setForm] = useState({
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Профиль</CardTitle>
        <CardDescription>Ваши личные данные</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Сохранить</Button>
      </CardFooter>
    </Card>
  );
}

function CompanyTab() {
  const [form, setForm] = useState({
    companyName: "ООО «ТрансЛогистик»",
    inn: "7712345678",
    ogrn: "1027700123456",
    address: "г. Москва, ул. Логистическая, д. 1",
    okved: "49.41",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Компания</CardTitle>
        <CardDescription>Данные вашей организации</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Название компании</Label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="inn">ИНН</Label>
            <Input
              id="inn"
              value={form.inn}
              onChange={(e) => update("inn", e.target.value)}
              maxLength={12}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogrn">ОГРН</Label>
            <Input
              id="ogrn"
              value={form.ogrn}
              onChange={(e) => update("ogrn", e.target.value)}
              maxLength={15}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Юридический адрес</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="okved">ОКВЭД</Label>
          <Input
            id="okved"
            value={form.okved}
            onChange={(e) => update("okved", e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Сохранить</Button>
      </CardFooter>
    </Card>
  );
}

function SecurityTab() {
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [twoFA, setTwoFA] = useState(false);

  function updatePassword(field: string, value: string) {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Смена пароля</CardTitle>
          <CardDescription>Обновите пароль для входа в систему</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Текущий пароль</Label>
            <Input
              id="current"
              type="password"
              value={passwords.current}
              onChange={(e) => updatePassword("current", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Новый пароль</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => updatePassword("newPassword", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Подтвердите новый пароль</Label>
            <Input
              id="confirm"
              type="password"
              value={passwords.confirm}
              onChange={(e) => updatePassword("confirm", e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Изменить пароль</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Двухфакторная аутентификация</CardTitle>
          <CardDescription>
            Дополнительная защита вашего аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {twoFA ? "2FA включена" : "2FA отключена"}
              </p>
              <p className="text-sm text-muted-foreground">
                {twoFA
                  ? "Вход защищён кодом из приложения-аутентификатора"
                  : "Рекомендуем включить для повышения безопасности"}
              </p>
            </div>
            <Button
              variant={twoFA ? "outline" : "default"}
              onClick={() => setTwoFA(!twoFA)}
            >
              {twoFA ? "Отключить" : "Включить"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    telegram: false,
    push: true,
  });

  function toggle(key: keyof typeof channels) {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const channelLabels: { key: keyof typeof channels; label: string; description: string }[] = [
    { key: "email", label: "Email", description: "Уведомления на электронную почту" },
    { key: "sms", label: "SMS", description: "SMS-уведомления на телефон" },
    { key: "telegram", label: "Telegram", description: "Уведомления в Telegram-бот" },
    { key: "push", label: "Push-уведомления", description: "Уведомления в браузере" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Каналы уведомлений</CardTitle>
        <CardDescription>
          Настройте, как вы хотите получать уведомления
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {channelLabels.map((ch, i) => (
          <div key={ch.key}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{ch.label}</p>
                <p className="text-sm text-muted-foreground">
                  {ch.description}
                </p>
              </div>
              <Button
                variant={channels[ch.key] ? "default" : "outline"}
                size="sm"
                onClick={() => toggle(ch.key)}
              >
                {channels[ch.key] ? "Вкл" : "Выкл"}
              </Button>
            </div>
            {i < channelLabels.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button>Сохранить</Button>
      </CardFooter>
    </Card>
  );
}

// -- Page ---------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Настройки</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="company" className="mt-4">
          <CompanyTab />
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
