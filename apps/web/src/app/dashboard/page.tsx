import {
  FileText,
  ShieldCheck,
  CreditCard,
  Bell,
  Plus,
  Upload,
  Truck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSession } from "@/lib/auth/session";
import { getActiveOrdersCount, getRecentOrders } from "@/lib/dal/orders";
import { getActivePermitsCount, getExpiringPermits } from "@/lib/dal/permits";
import { getUnreadCount } from "@/lib/dal/notifications";
import { getPendingPaymentsCount } from "@/lib/dal/payments";

export const metadata: Metadata = {
  title: "Дашборд",
};

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "Черновик", variant: "secondary" },
  documents_pending: { label: "Ожидает документов", variant: "outline" },
  payment_pending: { label: "Ожидает оплаты", variant: "destructive" },
  processing: { label: "В работе", variant: "default" },
  submitted: { label: "Подана", variant: "default" },
  approved: { label: "Одобрена", variant: "secondary" },
  rejected: { label: "Отклонена", variant: "destructive" },
  cancelled: { label: "Отменена", variant: "secondary" },
};

const typeLabels: Record<string, string> = {
  mkad_day: "МКАД дневной",
  mkad_night: "МКАД ночной",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "СК",
};

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(kopeks: number): string {
  return new Intl.NumberFormat("ru-RU").format(kopeks) + " \u20BD";
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [activeOrders, activePermits, unreadNotifications, pendingPayments, recentOrders, expiringPermits] =
    await Promise.all([
      getActiveOrdersCount(userId),
      getActivePermitsCount(userId),
      getUnreadCount(userId),
      getPendingPaymentsCount(userId),
      getRecentOrders(userId, 5),
      getExpiringPermits(userId, 30),
    ]);

  // Последняя заявка с привязанным ТС — берём её для кнопки «Повторить»
  // в quick actions. Это самый частый сценарий: транспортная компания
  // оформляет один и тот же тип пропуска для одной и той же машины.
  const lastOrderForRepeat = recentOrders.find((o) => o.vehicleId);
  const repeatHref = lastOrderForRepeat
    ? `/dashboard/orders/new?type=${lastOrderForRepeat.type}&vehicleId=${lastOrderForRepeat.vehicleId}`
    : null;

  const kpiCards = [
    {
      title: "Активные заявки",
      value: activeOrders,
      icon: FileText,
      href: "/dashboard/orders",
      color: "text-blue-600",
    },
    {
      title: "Действующие пропуска",
      value: activePermits,
      icon: ShieldCheck,
      href: "/dashboard/permits",
      color: "text-green-600",
    },
    {
      title: "Ожидает оплаты",
      value: pendingPayments,
      icon: CreditCard,
      href: "/dashboard/payments",
      color: "text-amber-600",
    },
    {
      title: "Уведомления",
      value: unreadNotifications,
      icon: Bell,
      href: "/dashboard/notifications",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardDescription>{card.title}</CardDescription>
                  <Icon className={`size-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Expiring permits alert */}
      {expiringPermits.length > 0 && (
        <Alert>
          <AlertTriangle className="size-4 text-amber-500" />
          <AlertTitle>Пропуска истекают в ближайшие 30 дней</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 space-y-1">
              {expiringPermits.map((p) => (
                <li key={p.id}>
                  {p.permitNumber} ({zoneLabels[p.zone] ?? p.zone}) — до{" "}
                  {formatDate(p.validUntil)}
                </li>
              ))}
            </ul>
            <Link href="/dashboard/permits">
              <Button variant="link" className="mt-1 h-auto p-0 text-sm">
                Подробнее
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Последние заявки</CardTitle>
            <CardDescription>
              {recentOrders.length > 0
                ? `${recentOrders.length} последних заявок`
                : "У вас пока нет заявок"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => {
                    const s = statusMap[order.status];
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="hover:underline"
                          >
                            {formatDate(order.createdAt)}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {typeLabels[order.type] ?? order.type}
                        </TableCell>
                        <TableCell>
                          <Badge variant={s?.variant}>{s?.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(order.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {order.vehicleId && (
                            <Link
                              href={`/dashboard/orders/new?type=${order.type}&vehicleId=${order.vehicleId}`}
                              title="Повторить заявку"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                              >
                                <RefreshCw className="size-3.5" />
                              </Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                Создайте первую заявку, чтобы начать работу
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/dashboard/orders/new">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Plus className="size-4" />
                Новая заявка
              </Button>
            </Link>
            {repeatHref && (
              <Link href={repeatHref}>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <RefreshCw className="size-4" />
                  Повторить последнюю
                </Button>
              </Link>
            )}
            <Link href="/dashboard/documents">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Upload className="size-4" />
                Загрузить документы
              </Button>
            </Link>
            <Link href="/dashboard/vehicles/new">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Truck className="size-4" />
                Добавить ТС
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
