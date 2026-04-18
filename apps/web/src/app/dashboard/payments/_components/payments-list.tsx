"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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
import { analytics } from "@/lib/analytics/events";

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  succeeded: { label: "Оплачен", variant: "secondary" },
  pending: { label: "Ожидает", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
  refunded: { label: "Возврат", variant: "destructive" },
};

interface PaymentItem {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  paidAt: Date | string | null;
  createdAt: Date | string;
}

interface PaymentStats {
  totalCount: number;
  paidAmount: number;
  pendingAmount: number;
}

function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount) + " \u20BD";
}

interface PaymentsListProps {
  payments: PaymentItem[];
  stats: PaymentStats;
}

export function PaymentsList({ payments, stats }: PaymentsListProps) {
  const router = useRouter();
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  async function handlePay(orderId: string, amount: number) {
    setPayingOrderId(orderId);
    analytics.paymentStarted(amount);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          returnUrl: `${window.location.origin}/dashboard/payments`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Не удалось создать платёж");
        return;
      }

      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        toast.success("Платёж создан");
        router.refresh();
      }
    } catch {
      toast.error("Произошла ошибка");
    } finally {
      setPayingOrderId(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Оплата</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Всего платежей</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Оплачено</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(stats.paidAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ожидает оплаты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatPrice(stats.pendingAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments table */}
      <Card>
        <CardHeader>
          <CardTitle>История платежей</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Платежей пока нет
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const sc = statusConfig[payment.status];
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sc?.variant}>
                          {sc?.label ?? payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === "pending" ? (
                          <Button
                            size="sm"
                            onClick={() => handlePay(payment.orderId, payment.amount)}
                            disabled={payingOrderId === payment.orderId}
                          >
                            {payingOrderId === payment.orderId ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <CreditCard className="size-3" />
                            )}
                            Оплатить
                          </Button>
                        ) : payment.status === "succeeded" ? (
                          <Button variant="ghost" size="sm" disabled>
                            <Download className="size-3" />
                            Скачать счёт
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
