"use client";

import { useState } from "react";
import {
  CheckCircle,
  ClipboardCopy,
  Clock,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

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

// ── Mock data ──────────────────────────────────────────────────────────────

const PARTNER_CODE = "P1A2B3C4";
const REFERRAL_LINK = `https://infolog24.ru/?ref=${PARTNER_CODE}`;

const kpi = {
  totalClients: 47,
  activeOrders: 12,
  totalEarned: 284_500,
  availableBalance: 42_300,
};

const monthlyReferrals = [
  { month: "Окт", count: 3 },
  { month: "Ноя", count: 5 },
  { month: "Дек", count: 7 },
  { month: "Янв", count: 4 },
  { month: "Фев", count: 9 },
  { month: "Мар", count: 11 },
  { month: "Апр", count: 8 },
];

const recentReferrals = [
  {
    id: "1",
    date: "2026-04-08",
    client: "Ив***в И.С.",
    order: "МКАД дневной",
    status: "confirmed" as const,
    commission: 5_500,
  },
  {
    id: "2",
    date: "2026-04-06",
    client: "Пе***в А.В.",
    order: "ТТК",
    status: "pending" as const,
    commission: null,
  },
  {
    id: "3",
    date: "2026-04-03",
    client: "Си***а Е.М.",
    order: "СК",
    status: "confirmed" as const,
    commission: 8_200,
  },
  {
    id: "4",
    date: "2026-03-29",
    client: "Ко***в Д.А.",
    order: "МКАД ночной",
    status: "paid" as const,
    commission: 4_800,
  },
  {
    id: "5",
    date: "2026-03-25",
    client: "Но***а Т.Р.",
    order: "МКАД дневной",
    status: "paid" as const,
    commission: 5_500,
  },
  {
    id: "6",
    date: "2026-03-21",
    client: "Бе***в О.И.",
    order: "ТТК",
    status: "paid" as const,
    commission: 8_200,
  },
  {
    id: "7",
    date: "2026-03-18",
    client: "Гр***а Н.П.",
    order: "МКАД дневной",
    status: "confirmed" as const,
    commission: 5_500,
  },
  {
    id: "8",
    date: "2026-03-14",
    client: "Ле***в В.С.",
    order: "Временный",
    status: "paid" as const,
    commission: 3_200,
  },
  {
    id: "9",
    date: "2026-03-10",
    client: "Ма***а К.Д.",
    order: "СК",
    status: "paid" as const,
    commission: 8_200,
  },
  {
    id: "10",
    date: "2026-03-05",
    client: "Та***в Р.Г.",
    order: "МКАД ночной",
    status: "paid" as const,
    commission: 4_800,
  },
];

const statusLabels: Record<string, string> = {
  pending: "Ожидание",
  confirmed: "Подтверждён",
  paid: "Выплачено",
};

const statusVariants: Record<string, "default" | "secondary" | "outline"> = {
  pending: "outline",
  confirmed: "secondary",
  paid: "default",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PartnerDashboardPage() {
  const [copied, setCopied] = useState(false);

  const maxCount = Math.max(...monthlyReferrals.map((r) => r.count));

  function handleCopyLink() {
    navigator.clipboard.writeText(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Партнёрский дашборд</h1>
        <p className="text-muted-foreground">
          Обзор вашей партнёрской активности
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Привлечённые клиенты</CardDescription>
            <CardTitle className="text-2xl">{kpi.totalClients}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>За всё время</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Активные заявки</CardDescription>
            <CardTitle className="text-2xl">{kpi.activeOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>В работе</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Заработано (всего)</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(kpi.totalEarned)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>Комиссии</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Доступно к выводу</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(kpi.availableBalance)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wallet className="size-4" />
              <span>Баланс</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Ваша реферальная ссылка</CardTitle>
          <CardDescription>
            Делитесь ссылкой с клиентами для получения комиссии
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm">
              {REFERRAL_LINK}
            </code>
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              {copied ? (
                <CheckCircle className="size-4 text-green-600" />
              ) : (
                <ClipboardCopy className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Код партнёра: <strong>{PARTNER_CODE}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Chart + Recent referrals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Рефералы по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3" style={{ height: 160 }}>
              {monthlyReferrals.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium">{item.count}</span>
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{
                      height: `${(item.count / maxCount) * 120}px`,
                      minHeight: 8,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent referrals */}
        <Card>
          <CardHeader>
            <CardTitle>Последние рефералы</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Комиссия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReferrals.map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell className="text-muted-foreground">
                      {ref.date}
                    </TableCell>
                    <TableCell>{ref.client}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[ref.status]}>
                        {statusLabels[ref.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {ref.commission
                        ? formatCurrency(ref.commission)
                        : "\u2014"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
