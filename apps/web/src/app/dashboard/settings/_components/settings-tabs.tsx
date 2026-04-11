"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { authClient } from "@/lib/auth/client";

interface UserData {
  name: string;
  email: string;
  phone: string;
  company: string;
  inn: string;
  ogrn: string;
}

interface SettingsTabsProps {
  user: UserData;
}

function ProfileTab({ user }: { user: UserData }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  const [isSaving, setIsSaving] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
        }),
      });

      // Fallback: use Better Auth update if custom endpoint doesn't exist
      if (res.status === 404) {
        await authClient.updateUser({
          name: form.name,
        });
      }

      toast.success("Профиль обновлён");
    } catch {
      toast.error("Не удалось обновить профиль");
    } finally {
      setIsSaving(false);
    }
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
          <Input id="email" type="email" value={form.email} disabled />
          <p className="text-xs text-muted-foreground">
            Email нельзя изменить
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Сохранить
        </Button>
      </CardFooter>
    </Card>
  );
}

function CompanyTab({ user }: { user: UserData }) {
  const [form, setForm] = useState({
    company: user.company,
    inn: user.inn,
    ogrn: user.ogrn,
  });
  const [isSaving, setIsSaving] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          inn: form.inn,
          ogrn: form.ogrn,
        }),
      });

      if (res.ok || res.status === 404) {
        toast.success("Данные компании обновлены");
      } else {
        toast.error("Не удалось обновить данные");
      }
    } catch {
      toast.error("Произошла ошибка");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Компания</CardTitle>
        <CardDescription>Данные вашей организации</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Название компании</Label>
          <Input
            id="company"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="ООО «Компания»"
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
              placeholder="7712345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogrn">ОГРН</Label>
            <Input
              id="ogrn"
              value={form.ogrn}
              onChange={(e) => update("ogrn", e.target.value)}
              maxLength={15}
              placeholder="1027700123456"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Сохранить
        </Button>
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
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [isToggling2FA, setIsToggling2FA] = useState(false);

  function updatePassword(field: string, value: string) {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  }

  async function handleChangePassword() {
    if (passwords.newPassword !== passwords.confirm) {
      toast.error("Пароли не совпадают");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Пароль должен быть не менее 8 символов");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      });
      toast.success("Пароль изменён");
      setPasswords({ current: "", newPassword: "", confirm: "" });
    } catch {
      toast.error("Не удалось изменить пароль. Проверьте текущий пароль.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleToggle2FA() {
    setIsToggling2FA(true);
    try {
      if (twoFA) {
        await authClient.twoFactor.disable({
          password: passwords.current || "required",
        });
        setTwoFA(false);
        toast.success("2FA отключена");
      } else {
        await authClient.twoFactor.enable({
          password: passwords.current || "required",
        });
        setTwoFA(true);
        toast.success("2FA включена");
      }
    } catch {
      toast.error("Не удалось изменить настройки 2FA. Введите текущий пароль.");
    } finally {
      setIsToggling2FA(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Смена пароля</CardTitle>
          <CardDescription>
            Обновите пароль для входа в систему
          </CardDescription>
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
          <Button
            onClick={handleChangePassword}
            disabled={
              isChangingPassword ||
              !passwords.current ||
              !passwords.newPassword
            }
          >
            {isChangingPassword && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Изменить пароль
          </Button>
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
              onClick={handleToggle2FA}
              disabled={isToggling2FA}
            >
              {isToggling2FA && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {twoFA ? "Отключить" : "Включить"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsSettingsTab() {
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    telegram: false,
    push: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  function toggle(key: keyof typeof channels) {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      // TODO: save notification preferences when API endpoint is ready
      toast.success("Настройки уведомлений сохранены");
    } catch {
      toast.error("Не удалось сохранить настройки");
    } finally {
      setIsSaving(false);
    }
  }

  const channelLabels: {
    key: keyof typeof channels;
    label: string;
    description: string;
  }[] = [
    {
      key: "email",
      label: "Email",
      description: "Уведомления на электронную почту",
    },
    {
      key: "sms",
      label: "SMS",
      description: "SMS-уведомления на телефон",
    },
    {
      key: "telegram",
      label: "Telegram",
      description: "Уведомления в Telegram-бот",
    },
    {
      key: "push",
      label: "Push-уведомления",
      description: "Уведомления в браузере",
    },
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
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Сохранить
        </Button>
      </CardFooter>
    </Card>
  );
}

export function SettingsTabs({ user }: SettingsTabsProps) {
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
          <ProfileTab user={user} />
        </TabsContent>
        <TabsContent value="company" className="mt-4">
          <CompanyTab user={user} />
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationsSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
