import {
  FileText,
  ShieldCheck,
  CreditCard,
  Bell,
  Plus,
  Upload,
  Truck,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Дашборд",
};

// -- Mock data ----------------------------------------------------------------

const kpiCards = [
  {
    title: "Активные заявки",
    value: 4,
    icon: FileText,
    href: "/dashboard/orders",
    color: "text-blue-600",
  },
  {
    title: "Действующие пропуска",
    value: 7,
    icon: ShieldCheck,
    href: "/dashboard/permits",
    color: "text-green-600",
  },
  {
    title: "Ожидает оплаты",
    value: 2,
    icon: CreditCard,
    href: "/dashboard/payments",
    color: "text-amber-600",
  },
  {
    title: "Уведомления",
    value: 3,
    icon: Bell,
    href: "/dashboard/notifications",
    color: "text-purple-600",
  },
];

const recentOrders = [
  {
    id: "ORD-2024-001",
    date: "09.04.2026",
    type: "МКАД дневной",
    zone: "МКАД",
    status: "processing" as const,
    price: "10 000 ₽",
  },
  {
    id: "ORD-2024-002",
    date: "07.04.2026",
    type: "ТТК",
    zone: "ТТК",
    status: "payment_pending" as const,
    price: "15 000 ₽",
  },
  {
    id: "ORD-2024-003",
    date: "05.04.2026",
    type: "Временный МКАД",
    zone: "МКАД",
    status: "approved" as const,
    price: "3 500 ₽",
  },
  {
    id: "ORD-2024-004",
    date: "03.04.2026",
    type: "Садовое кольцо",
    zone: "СК",
    status: "documents_pending" as const,
    price: "20 000 ₽",
  },
  {
    id: "ORD-2024-005",
    date: "01.04.2026",
    type: "МКАД ночной",
    zone: "МКАД",
    status: "approved" as const,
    price: "8 000 ₽",
  },
];

const expiringPermits = [
  {
    number: "ПР-2024-0045",
    zone: "МКАД",
    expiresAt: "25.04.2026",
    vehicle: "К 123 АА 77",
  },
  {
    number: "ПР-2024-0032",
    zone: "ТТК",
    expiresAt: "30.04.2026",
    vehicle: "М 456 ВВ 99",
  },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Черновик", variant: "secondary" },
  documents_pending: { label: "Ожидает документов", variant: "outline" },
  payment_pending: { label: "Ожидает оплаты", variant: "destructive" },
  processing: { label: "В работе", variant: "default" },
  submitted: { label: "Подана", variant: "default" },
  approved: { label: "Одобрена", variant: "secondary" },
  rejected: { label: "Отклонена", variant: "destructive" },
  cancelled: { label: "Отменена", variant: "secondary" },
};

// -- Component ----------------------------------------------------------------

export default function DashboardPage() {
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
                <li key={p.number}>
                  {p.number} ({p.zone}, {p.vehicle}) — до {p.expiresAt}
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
            <CardDescription>5 последних заявок</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Цена</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const s = statusMap[order.status];
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="hover:underline"
                        >
                          {order.id}
                        </Link>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>
                        <Badge variant={s?.variant}>{s?.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.price}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
