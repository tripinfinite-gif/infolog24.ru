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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusLabel, getStatusColor } from "@/lib/automation/order-state-machine";
import type { OrderStatus } from "@/lib/automation/order-state-machine";
import { cn } from "@/lib/utils";
import { formatPriceRub, formatDate, ZONE_LABELS } from "./format-utils";

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  byStatus: Record<string, number>;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  activePermits: number;
  newClientsMonth: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  type: string;
  zone: string;
  status: string;
  price: number;
  createdAt: string;
  clientName: string;
  managerName: string | null;
  vehiclePlate: string;
}

interface ManagerWorkloadItem {
  id: string;
  name: string;
  activeOrders: number;
  totalOrders: number;
}

interface StaleOrder {
  id: string;
  status: string;
  updatedAt: string;
  clientName: string;
}

interface AdminDashboardClientProps {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  managerWorkload: ManagerWorkloadItem[];
  staleOrders: StaleOrder[];
}

export function AdminDashboardClient({
  stats,
  recentOrders,
  managerWorkload,
  staleOrders,
}: AdminDashboardClientProps) {
  const KPI_CARDS = [
    {
      label: "Новые заявки (сегодня)",
      value: stats.todayOrders,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "В работе",
      value: (stats.byStatus.processing ?? 0) + (stats.byStatus.submitted ?? 0),
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Ожидают действий",
      value: stats.pendingOrders,
      icon: CreditCard,
      color: "text-orange-600",
    },
    {
      label: "Активных пропусков",
      value: stats.activePermits,
      icon: ArrowUpRight,
      color: "text-green-600",
    },
    {
      label: "Выручка (месяц)",
      value: formatPriceRub(stats.revenueMonth),
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      label: "Новых клиентов",
      value: stats.newClientsMonth,
      icon: Users,
      color: "text-indigo-600",
    },
  ];

  // Status distribution for simple bars
  const statusEntries = Object.entries(stats.byStatus).filter(
    ([, v]) => v > 0,
  );

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
        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Заявки по статусам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusEntries.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      getStatusColor(status as OrderStatus),
                    )}
                  >
                    {getStatusLabel(status as OrderStatus)}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            (count / Math.max(stats.totalOrders, 1)) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
              {statusEntries.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет данных
                </p>
              )}
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
                <div key={m.id} className="flex items-center justify-between">
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
              {managerWorkload.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет менеджеров
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-emerald-600">
              {formatPriceRub(stats.revenueToday)}
            </p>
            <p className="text-xs text-muted-foreground">Выручка сегодня</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-emerald-600">
              {formatPriceRub(stats.revenueWeek)}
            </p>
            <p className="text-xs text-muted-foreground">Выручка за неделю</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-emerald-600">
              {formatPriceRub(stats.revenueMonth)}
            </p>
            <p className="text-xs text-muted-foreground">Выручка за месяц</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {staleOrders.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="size-5" />
              Требуют внимания
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium text-amber-700">
                {staleOrders.length} заявок
              </span>{" "}
              без обновлений более 24 часов
            </p>
            <div className="space-y-1">
              {staleOrders.slice(0, 5).map((o) => (
                <p key={o.id} className="text-xs text-muted-foreground">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-primary hover:underline"
                  >
                    {o.clientName}
                  </Link>{" "}
                  — {getStatusLabel(o.status as OrderStatus)} — обновлено{" "}
                  {formatDate(o.updatedAt)}
                </p>
              ))}
            </div>
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
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.clientName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {ZONE_LABELS[order.zone] ?? order.zone.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        getStatusColor(order.status as OrderStatus),
                      )}
                    >
                      {getStatusLabel(order.status as OrderStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.managerName ?? "---"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPriceRub(order.price)}
                  </TableCell>
                </TableRow>
              ))}
              {recentOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Нет заявок
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
