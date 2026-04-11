"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  formatPriceRub,
  formatDateTime,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "../../_components/format-utils";
import { ExportButton } from "../../_components/export-button";

interface SerializedPayment {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  provider: string;
  paidAt: string | null;
  createdAt: string;
  clientName: string;
  clientId: string;
}

interface PaymentsSummary {
  totalCount: number;
  succeededAmount: number;
  pendingAmount: number;
  refundedAmount: number;
}

interface PaymentsListClientProps {
  payments: SerializedPayment[];
  total: number;
  page: number;
  totalPages: number;
  summary: PaymentsSummary;
  currentStatus: string;
}

export function PaymentsListClient({
  payments,
  total: _total,
  page,
  totalPages,
  summary,
  currentStatus,
}: PaymentsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refundLoading, setRefundLoading] = useState<string | null>(null);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in updates)) params.delete("page");
      router.push(`/admin/payments?${params.toString()}`);
    },
    [router, searchParams],
  );

  async function handleRefund(paymentId: string) {
    setRefundLoading(paymentId);
    try {
      await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      router.refresh();
    } finally {
      setRefundLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Платежи</h1>
        <ExportButton
          data={payments as unknown as Record<string, unknown>[]}
          filename="payments"
          columns={[
            { key: "createdAt", label: "Дата" },
            { key: "clientName", label: "Клиент" },
            { key: "amount", label: "Сумма" },
            { key: "status", label: "Статус" },
            { key: "provider", label: "Провайдер" },
          ]}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{summary.totalCount}</p>
            <p className="text-xs text-muted-foreground">Всего оплат</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-green-600">
              {formatPriceRub(summary.succeededAmount)}
            </p>
            <p className="text-xs text-muted-foreground">Сумма (оплачено)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-amber-600">
              {formatPriceRub(summary.pendingAmount)}
            </p>
            <p className="text-xs text-muted-foreground">Ожидает оплаты</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-red-600">
              {formatPriceRub(summary.refundedAmount)}
            </p>
            <p className="text-xs text-muted-foreground">Возвраты</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {currentStatus
                    ? PAYMENT_STATUS_LABELS[currentStatus]
                    : "Статус"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => updateFilters({ status: "" })}>
                  Все статусы
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => updateFilters({ status: key })}
                  >
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
                <TableHead>Заявка</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Провайдер</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(payment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${payment.orderId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      Заявка
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/clients/${payment.clientId}`}
                      className="hover:underline"
                    >
                      {payment.clientName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPriceRub(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={PAYMENT_STATUS_COLORS[payment.status] ?? ""}
                    >
                      {PAYMENT_STATUS_LABELS[payment.status] ?? payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {payment.provider}
                  </TableCell>
                  <TableCell>
                    {payment.status === "succeeded" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        disabled={refundLoading === payment.id}
                        onClick={() => handleRefund(payment.id)}
                      >
                        {refundLoading === payment.id
                          ? "..."
                          : "Возврат"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Платежи не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Страница {page} из {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateFilters({ page: String(page - 1) })}
            >
              <ChevronLeft className="size-4" /> Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateFilters({ page: String(page + 1) })}
            >
              Вперёд <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
