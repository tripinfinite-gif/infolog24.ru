"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Mock data ──────────────────────────────────────────────────────────────

type ReferralStatus = "pending" | "confirmed" | "paid";
type OrderStatus =
  | "processing"
  | "submitted"
  | "approved"
  | "rejected"
  | "cancelled";
type PayoutStatus = "pending" | "paid" | "none";

interface Referral {
  id: string;
  date: string;
  client: string;
  orderType: string;
  orderStatus: OrderStatus;
  commission: number | null;
  referralStatus: ReferralStatus;
  payoutStatus: PayoutStatus;
}

const mockReferrals: Referral[] = [
  { id: "1", date: "2026-04-08", client: "Ив***в И.С.", orderType: "МКАД дневной", orderStatus: "processing", commission: 5_500, referralStatus: "confirmed", payoutStatus: "none" },
  { id: "2", date: "2026-04-06", client: "Пе***в А.В.", orderType: "ТТК", orderStatus: "submitted", commission: null, referralStatus: "pending", payoutStatus: "none" },
  { id: "3", date: "2026-04-03", client: "Си***а Е.М.", orderType: "СК", orderStatus: "approved", commission: 8_200, referralStatus: "confirmed", payoutStatus: "none" },
  { id: "4", date: "2026-03-29", client: "Ко***в Д.А.", orderType: "МКАД ночной", orderStatus: "approved", commission: 4_800, referralStatus: "paid", payoutStatus: "paid" },
  { id: "5", date: "2026-03-25", client: "Но***а Т.Р.", orderType: "МКАД дневной", orderStatus: "approved", commission: 5_500, referralStatus: "paid", payoutStatus: "paid" },
  { id: "6", date: "2026-03-21", client: "Бе***в О.И.", orderType: "ТТК", orderStatus: "approved", commission: 8_200, referralStatus: "paid", payoutStatus: "paid" },
  { id: "7", date: "2026-03-18", client: "Гр***а Н.П.", orderType: "МКАД дневной", orderStatus: "processing", commission: 5_500, referralStatus: "confirmed", payoutStatus: "none" },
  { id: "8", date: "2026-03-14", client: "Ле***в В.С.", orderType: "Временный", orderStatus: "approved", commission: 3_200, referralStatus: "paid", payoutStatus: "paid" },
  { id: "9", date: "2026-03-10", client: "Ма***а К.Д.", orderType: "СК", orderStatus: "approved", commission: 8_200, referralStatus: "paid", payoutStatus: "paid" },
  { id: "10", date: "2026-03-05", client: "Та***в Р.Г.", orderType: "МКАД ночной", orderStatus: "rejected", commission: null, referralStatus: "pending", payoutStatus: "none" },
  { id: "11", date: "2026-02-28", client: "Фи***а М.Л.", orderType: "МКАД дневной", orderStatus: "approved", commission: 5_500, referralStatus: "paid", payoutStatus: "paid" },
  { id: "12", date: "2026-02-20", client: "Ха***в С.Н.", orderType: "ТТК", orderStatus: "approved", commission: 8_200, referralStatus: "paid", payoutStatus: "paid" },
  { id: "13", date: "2026-02-15", client: "Ше***а А.Р.", orderType: "СК", orderStatus: "cancelled", commission: null, referralStatus: "pending", payoutStatus: "none" },
  { id: "14", date: "2026-02-10", client: "Як***в П.М.", orderType: "МКАД дневной", orderStatus: "approved", commission: 5_500, referralStatus: "paid", payoutStatus: "paid" },
  { id: "15", date: "2026-02-03", client: "Ор***а Д.С.", orderType: "Временный", orderStatus: "approved", commission: 3_200, referralStatus: "paid", payoutStatus: "paid" },
];

const referralStatusLabels: Record<ReferralStatus, string> = {
  pending: "Ожидание",
  confirmed: "Подтверждён",
  paid: "Выплачено",
};

const referralStatusVariants: Record<ReferralStatus, "default" | "secondary" | "outline"> = {
  pending: "outline",
  confirmed: "secondary",
  paid: "default",
};

const orderStatusLabels: Record<OrderStatus, string> = {
  processing: "В обработке",
  submitted: "Подана",
  approved: "Одобрена",
  rejected: "Отклонена",
  cancelled: "Отменена",
};

const payoutStatusLabels: Record<PayoutStatus, string> = {
  pending: "Ожидание",
  paid: "Выплачено",
  none: "\u2014",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ReferralsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");

  const filtered = mockReferrals.filter((r) => {
    if (statusFilter !== "all" && r.referralStatus !== statusFilter) return false;
    if (periodFilter !== "all") {
      const d = new Date(r.date);
      const now = new Date("2026-04-10");
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (periodFilter === "7d" && diff > 7) return false;
      if (periodFilter === "30d" && diff > 30) return false;
      if (periodFilter === "90d" && diff > 90) return false;
    }
    return true;
  });

  const totalReferrals = mockReferrals.length;
  const confirmedOrPaid = mockReferrals.filter(
    (r) => r.referralStatus === "confirmed" || r.referralStatus === "paid"
  ).length;
  const conversionRate = Math.round((confirmedOrPaid / totalReferrals) * 100);
  const commissions = mockReferrals
    .filter((r) => r.commission !== null)
    .map((r) => r.commission as number);
  const avgCommission =
    commissions.length > 0
      ? Math.round(commissions.reduce((a, b) => a + b, 0) / commissions.length)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Рефералы</h1>
        <p className="text-muted-foreground">
          Все привлечённые клиенты и статусы их заявок
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Всего рефералов</CardDescription>
            <CardTitle className="text-2xl">{totalReferrals}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Конверсия</CardDescription>
            <CardTitle className="text-2xl">{conversionRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Средняя комиссия</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(avgCommission)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все время</SelectItem>
            <SelectItem value="7d">7 дней</SelectItem>
            <SelectItem value="30d">30 дней</SelectItem>
            <SelectItem value="90d">90 дней</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидание</SelectItem>
            <SelectItem value="confirmed">Подтверждён</SelectItem>
            <SelectItem value="paid">Выплачено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Заявка</TableHead>
                <TableHead>Статус заявки</TableHead>
                <TableHead className="text-right">Комиссия</TableHead>
                <TableHead>Статус выплаты</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ref) => (
                <TableRow key={ref.id}>
                  <TableCell className="text-muted-foreground">
                    {ref.date}
                  </TableCell>
                  <TableCell>{ref.client}</TableCell>
                  <TableCell>{ref.orderType}</TableCell>
                  <TableCell>{orderStatusLabels[ref.orderStatus]}</TableCell>
                  <TableCell className="text-right">
                    {ref.commission ? formatCurrency(ref.commission) : "\u2014"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={referralStatusVariants[ref.referralStatus]}>
                      {referralStatusLabels[ref.referralStatus]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Нет рефералов за выбранный период
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
