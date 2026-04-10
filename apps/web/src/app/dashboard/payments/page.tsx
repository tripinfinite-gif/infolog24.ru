import type { Metadata } from "next";
import { Download, CreditCard } from "lucide-react";
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

export const metadata: Metadata = {
  title: "Оплата",
};

// -- Mock data ----------------------------------------------------------------

const mockPayments = [
  { id: "p1", date: "09.04.2026", orderId: "ORD-2024-001", amount: "10 000 ₽", status: "succeeded" },
  { id: "p2", date: "07.04.2026", orderId: "ORD-2024-002", amount: "15 000 ₽", status: "pending" },
  { id: "p3", date: "05.04.2026", orderId: "ORD-2024-003", amount: "3 500 ₽", status: "succeeded" },
  { id: "p4", date: "03.04.2026", orderId: "ORD-2024-004", amount: "20 000 ₽", status: "pending" },
  { id: "p5", date: "01.04.2026", orderId: "ORD-2024-005", amount: "8 000 ₽", status: "succeeded" },
  { id: "p6", date: "25.03.2026", orderId: "ORD-2024-006", amount: "15 000 ₽", status: "cancelled" },
  { id: "p7", date: "20.03.2026", orderId: "ORD-2024-008", amount: "5 000 ₽", status: "succeeded" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  succeeded: { label: "Оплачен", variant: "secondary" },
  pending: { label: "Ожидает", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
  refunded: { label: "Возврат", variant: "destructive" },
};

const stats = {
  total: "76 500 ₽",
  paid: "26 500 ₽",
  pending: "35 000 ₽",
  count: 7,
};

// -- Component ----------------------------------------------------------------

export default function PaymentsPage() {
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
            <div className="text-2xl font-bold">{stats.count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Оплачено</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.paid}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ожидает оплаты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Заявка</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => {
                const sc = statusConfig[payment.status];
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="font-medium">
                      {payment.orderId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sc?.variant}>{sc?.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "pending" ? (
                        <Button size="sm">
                          <CreditCard className="size-3" />
                          Оплатить
                        </Button>
                      ) : payment.status === "succeeded" ? (
                        <Button variant="ghost" size="sm">
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
        </CardContent>
      </Card>
    </div>
  );
}
