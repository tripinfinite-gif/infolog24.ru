"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PAYMENTS,
  formatPrice,
  formatDateTime,
} from "../_components/mock-data";
import { ExportButton } from "../_components/export-button";

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  succeeded: "Оплачено",
  pending: "Ожидание",
  cancelled: "Отменено",
  refunded: "Возврат",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  succeeded: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-gray-100 text-gray-700",
  refunded: "bg-red-100 text-red-700",
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let result = [...PAYMENTS];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.clientName.toLowerCase().includes(q) ||
          String(p.orderNumber).includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [search, statusFilter]);

  // Stats
  const totalPayments = PAYMENTS.length;
  const totalAmount = PAYMENTS.filter((p) => p.status === "succeeded").reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const pendingAmount = PAYMENTS.filter((p) => p.status === "pending").reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const refundedAmount = PAYMENTS.filter((p) => p.status === "refunded").reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Платежи</h1>
        <ExportButton
          data={filtered as unknown as Record<string, unknown>[]}
          filename="payments"
          columns={[
            { key: "createdAt", label: "Дата" },
            { key: "orderNumber", label: "Заявка №" },
            { key: "clientName", label: "Клиент" },
            { key: "amount", label: "Сумма" },
            { key: "status", label: "Статус" },
            { key: "provider", label: "Способ оплаты" },
          ]}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{totalPayments}</p>
            <p className="text-xs text-muted-foreground">Всего оплат</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(totalAmount)}
            </p>
            <p className="text-xs text-muted-foreground">Сумма (оплачено)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-amber-600">
              {formatPrice(pendingAmount)}
            </p>
            <p className="text-xs text-muted-foreground">Ожидает оплаты</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-red-600">
              {formatPrice(refundedAmount)}
            </p>
            <p className="text-xs text-muted-foreground">Возвраты</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по клиенту или номеру заявки..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {statusFilter ? PAYMENT_STATUS_LABELS[statusFilter] : "Статус"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("")}>
                  Все статусы
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Заявка №</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Способ оплаты</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(payment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${payment.orderId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      #{payment.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{payment.clientName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={PAYMENT_STATUS_COLORS[payment.status]}
                    >
                      {PAYMENT_STATUS_LABELS[payment.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {payment.provider}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Платежи не найдены
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
