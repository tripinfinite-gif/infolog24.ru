"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const AVAILABLE_BALANCE = 42_300;

type PayoutMethod = "card" | "bank";
type PayoutStatus = "pending" | "processing" | "completed" | "rejected";

interface Payout {
  id: string;
  date: string;
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
}

const mockPayouts: Payout[] = [
  { id: "1", date: "2026-03-28", amount: 25_000, method: "card", status: "completed" },
  { id: "2", date: "2026-03-15", amount: 18_700, method: "bank", status: "completed" },
  { id: "3", date: "2026-02-27", amount: 30_000, method: "card", status: "completed" },
  { id: "4", date: "2026-02-14", amount: 22_500, method: "card", status: "completed" },
  { id: "5", date: "2026-01-30", amount: 15_000, method: "bank", status: "completed" },
  { id: "6", date: "2026-01-15", amount: 20_000, method: "card", status: "completed" },
];

const methodLabels: Record<PayoutMethod, string> = {
  card: "Банковская карта",
  bank: "Расчётный счёт",
};

const statusLabels: Record<PayoutStatus, string> = {
  pending: "Ожидание",
  processing: "В обработке",
  completed: "Выполнено",
  rejected: "Отклонено",
};

const statusVariants: Record<PayoutStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  processing: "secondary",
  completed: "default",
  rejected: "destructive",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PayoutsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>("card");
  const [details, setDetails] = useState("");

  function handleSubmit() {
    // Mock submit - would call API in real implementation
    setDialogOpen(false);
    setAmount("");
    setDetails("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Выплаты</h1>
        <p className="text-muted-foreground">
          Управление выводом средств
        </p>
      </div>

      {/* Balance card */}
      <Card>
        <CardHeader>
          <CardDescription>Доступно к выводу</CardDescription>
          <CardTitle className="text-3xl">
            {formatCurrency(AVAILABLE_BALANCE)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Wallet className="size-4" />
                Запросить вывод
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Запрос на вывод средств</DialogTitle>
                <DialogDescription>
                  Доступно: {formatCurrency(AVAILABLE_BALANCE)}. Минимальная
                  сумма вывода: 5 000 ₽.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма (₽)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Способ вывода</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Банковская карта</SelectItem>
                      <SelectItem value="bank">Расчётный счёт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">
                    {method === "card"
                      ? "Номер карты"
                      : "Реквизиты (БИК, р/с, к/с)"}
                  </Label>
                  <Input
                    id="details"
                    placeholder={
                      method === "card"
                        ? "0000 0000 0000 0000"
                        : "БИК, расчётный счёт"
                    }
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSubmit}>Отправить запрос</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Payout history */}
      <Card>
        <CardHeader>
          <CardTitle>История выплат</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Способ</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="text-muted-foreground">
                    {payout.date}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell>{methodLabels[payout.method]}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[payout.status]}>
                      {statusLabels[payout.status]}
                    </Badge>
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
