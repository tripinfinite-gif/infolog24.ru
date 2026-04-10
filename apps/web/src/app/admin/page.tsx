"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CreditCard,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
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
import { getStatusLabel, getStatusColor } from "@/lib/automation/order-state-machine";
import { cn } from "@/lib/utils";
import {
  ORDERS,
  MANAGERS,
  formatPrice,
  formatDate,
  TAG_STYLES,
} from "./_components/mock-data";

// ── KPI data ──────────────────────────────────────────────────────────────

const todayOrders = ORDERS.filter(
  (o) => o.createdAt.startsWith("2026-04-10")
).length;
const inProgressOrders = ORDERS.filter(
  (o) => o.status === "processing" || o.status === "submitted"
).length;
const paymentPendingOrders = ORDERS.filter(
  (o) => o.status === "payment_pending"
).length;
const approvedThisMonth = ORDERS.filter(
  (o) => o.status === "approved" && o.updatedAt.startsWith("2026-04")
).length;
const monthRevenue = 597000;
const avgCheck = 59700;

const KPI_CARDS = [
  { label: "Новые заявки (сегодня)", value: todayOrders, icon: FileText, color: "text-blue-600" },
  { label: "В работе", value: inProgressOrders, icon: Clock, color: "text-amber-600" },
  { label: "Ожидают оплаты", value: paymentPendingOrders, icon: CreditCard, color: "text-orange-600" },
  { label: "Одобрено (месяц)", value: approvedThisMonth, icon: ArrowUpRight, color: "text-green-600" },
  { label: "Выручка (месяц)", value: formatPrice(monthRevenue), icon: TrendingUp, color: "text-emerald-600" },
  { label: "Средний чек", value: formatPrice(avgCheck), icon: Users, color: "text-indigo-600" },
];

// ── Chart mock data ───────────────────────────────────────────────────────

const CHART_DATA = [
  { day: "Пн", value: 12 },
  { day: "Вт", value: 18 },
  { day: "Ср", value: 15 },
  { day: "Чт", value: 22 },
  { day: "Пт", value: 28 },
  { day: "Сб", value: 8 },
  { day: "Вс", value: 5 },
];
const maxChart = Math.max(...CHART_DATA.map((d) => d.value));

// ── Manager workload ──────────────────────────────────────────────────────

const managerWorkload = MANAGERS.filter((m) => m.role === "manager").map((m) => ({
  name: m.name,
  activeOrders: ORDERS.filter(
    (o) =>
      o.managerId === m.id &&
      !["approved", "rejected", "cancelled"].includes(o.status)
  ).length,
  totalOrders: ORDERS.filter((o) => o.managerId === m.id).length,
}));

// ── Alerts ────────────────────────────────────────────────────────────────

const staleOrders = ORDERS.filter((o) => {
  if (["approved", "rejected", "cancelled"].includes(o.status)) return false;
  const updated = new Date(o.updatedAt).getTime();
  const now = new Date("2026-04-10T12:00:00Z").getTime();
  return now - updated > 24 * 60 * 60 * 1000;
});

const pendingDocs = ORDERS.filter((o) => o.status === "documents_pending");

// ── Recent orders ─────────────────────────────────────────────────────────

const recentOrders = [...ORDERS]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 10);

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Дашборд</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Icon className={cn("size-5", kpi.color)} />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Заявки за неделю</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {CHART_DATA.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">{d.value}</span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${(d.value / maxChart) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manager workload */}
        <Card>
          <CardHeader>
            <CardTitle>Нагрузка менеджеров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {managerWorkload.map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min((m.activeOrders / 8) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {m.activeOrders} акт. / {m.totalOrders}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(staleOrders.length > 0 || pendingDocs.length > 0) && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="size-5" />
              Требуют внимания
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {staleOrders.length > 0 && (
              <p className="text-sm">
                <span className="font-medium text-amber-700">
                  {staleOrders.length} заявок
                </span>{" "}
                без обновлений более 24 часов:{" "}
                {staleOrders.map((o) => `#${o.orderNumber}`).join(", ")}
              </p>
            )}
            {pendingDocs.length > 0 && (
              <p className="text-sm">
                <span className="font-medium text-amber-700">
                  {pendingDocs.length} заявок
                </span>{" "}
                ожидают проверки документов:{" "}
                {pendingDocs.map((o) => `#${o.orderNumber}`).join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Последние заявки</CardTitle>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              Все заявки
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Зона</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Менеджер</TableHead>
                <TableHead className="text-right">Цена</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{order.zone.toUpperCase()}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        getStatusColor(order.status)
                      )}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.managerName ?? "---"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(order.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
