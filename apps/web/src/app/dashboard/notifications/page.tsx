"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

// -- Mock data ----------------------------------------------------------------

interface Notification {
  id: string;
  icon: ElementType;
  iconColor: string;
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
  type: string;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    title: "Заявка ORD-2024-001 принята в работу",
    body: "Ваша заявка на пропуск МКАД (дневной) передана менеджеру. Ожидаемый срок обработки — 3 рабочих дня.",
    timeAgo: "5 минут назад",
    read: false,
    type: "order",
  },
  {
    id: "n2",
    icon: CreditCard,
    iconColor: "text-amber-500",
    title: "Ожидается оплата по заявке ORD-2024-002",
    body: "Для продолжения обработки заявки на пропуск ТТК необходимо произвести оплату в размере 15 000 ₽.",
    timeAgo: "2 часа назад",
    read: false,
    type: "payment",
  },
  {
    id: "n3",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    title: "Пропуск ПР-2024-0045 истекает через 15 дней",
    body: "Рекомендуем заблаговременно оформить продление пропуска на МКАД для ТС К 123 АА 77.",
    timeAgo: "1 день назад",
    read: false,
    type: "permit",
  },
  {
    id: "n4",
    icon: FileText,
    iconColor: "text-red-500",
    title: "Документ отклонён",
    body: "Водительское удостоверение по заявке ORD-2024-002 отклонено. Причина: нечитаемый скан. Пожалуйста, загрузите документ повторно.",
    timeAgo: "2 дня назад",
    read: true,
    type: "document",
  },
  {
    id: "n5",
    icon: ShieldCheck,
    iconColor: "text-green-500",
    title: "Пропуск ПР-2024-0078 выдан",
    body: "Пропуск на МКАД (ночной) для ТС А 789 СС 50 успешно оформлен и действует до 15.06.2026.",
    timeAgo: "3 дня назад",
    read: true,
    type: "permit",
  },
  {
    id: "n6",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    title: "Оплата подтверждена",
    body: "Оплата по заявке ORD-2024-003 в размере 3 500 ₽ успешно проведена.",
    timeAgo: "5 дней назад",
    read: true,
    type: "payment",
  },
  {
    id: "n7",
    icon: Bell,
    iconColor: "text-blue-500",
    title: "Добро пожаловать в Инфологистик-24!",
    body: "Ваш аккаунт успешно создан. Добавьте транспортные средства и создайте первую заявку на пропуск.",
    timeAgo: "1 неделю назад",
    read: true,
    type: "system",
  },
];

// -- Component ----------------------------------------------------------------

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  }

  function renderList(items: Notification[]) {
    if (items.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          Нет уведомлений
        </div>
      );
    }

    return (
      <div className="divide-y">
        {items.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={cn(
                "flex gap-4 p-4 transition-colors",
                !notification.read && "bg-primary/5"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-muted",
                  notification.iconColor
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={cn(
                      "text-sm",
                      !notification.read && "font-semibold"
                    )}
                  >
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <Badge className="shrink-0 px-1.5 py-0 text-[10px]">
                      Новое
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.body}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.timeAgo}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Уведомления</h1>
          {unreadCount > 0 && (
            <Badge>{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Отметить все как прочитанные
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-4 pt-4">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="unread">
                  Непрочитанные
                  {unreadCount > 0 && (
                    <Badge className="ml-1 px-1.5 py-0 text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="mt-0">
              {renderList(notifications)}
            </TabsContent>
            <TabsContent value="unread" className="mt-0">
              {renderList(notifications.filter((n) => !n.read))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
