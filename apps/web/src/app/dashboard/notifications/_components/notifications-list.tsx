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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: Date | string | null;
  createdAt: Date | string;
}

function getIconForType(type: string): { icon: ElementType; color: string } {
  switch (type) {
    case "order_status":
    case "order_created":
      return { icon: CheckCircle2, color: "text-green-500" };
    case "payment_required":
    case "payment_succeeded":
      return { icon: CreditCard, color: "text-amber-500" };
    case "permit_expiring":
    case "permit_issued":
      return { icon: ShieldCheck, color: "text-green-500" };
    case "document_rejected":
    case "document_approved":
      return { icon: FileText, color: "text-red-500" };
    case "permit_warning":
      return { icon: AlertTriangle, color: "text-amber-500" };
    default:
      return { icon: Bell, color: "text-blue-500" };
  }
}

function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} дн. назад`;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface NotificationsListProps {
  notifications: NotificationItem[];
}

export function NotificationsList({
  notifications: initialNotifications,
}: NotificationsListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
        ),
      );
    } catch {
      // Silently fail
    }
  }

  async function markAllAsRead() {
    // Mark each one individually via API
    const unread = notifications.filter((n) => !n.readAt);
    try {
      await Promise.all(
        unread.map((n) =>
          fetch(`/api/notifications/${n.id}/read`, { method: "PATCH" }),
        ),
      );
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          readAt: n.readAt ?? new Date().toISOString(),
        })),
      );
      toast.success("Все уведомления отмечены как прочитанные");
    } catch {
      toast.error("Не удалось отметить уведомления");
    }
  }

  function renderList(items: NotificationItem[]) {
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
          const { icon: Icon, color } = getIconForType(notification.type);
          const isUnread = !notification.readAt;

          return (
            <div
              key={notification.id}
              className={cn(
                "flex cursor-pointer gap-4 p-4 transition-colors hover:bg-muted/50",
                isUnread && "bg-primary/5",
              )}
              onClick={() => {
                if (isUnread) markAsRead(notification.id);
              }}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-muted",
                  color,
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={cn("text-sm", isUnread && "font-semibold")}
                  >
                    {notification.title}
                  </h3>
                  {isUnread && (
                    <Badge className="shrink-0 px-1.5 py-0 text-[10px]">
                      Новое
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.body}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(notification.createdAt)}
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
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
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
              {renderList(notifications.filter((n) => !n.readAt))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
