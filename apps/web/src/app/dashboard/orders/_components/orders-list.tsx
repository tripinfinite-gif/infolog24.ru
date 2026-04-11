"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "Черновик", variant: "secondary" },
  documents_pending: { label: "Ожидает документов", variant: "outline" },
  payment_pending: { label: "Ожидает оплаты", variant: "destructive" },
  processing: { label: "В работе", variant: "default" },
  submitted: { label: "Подана", variant: "default" },
  approved: { label: "Одобрена", variant: "secondary" },
  rejected: { label: "Отклонена", variant: "destructive" },
  cancelled: { label: "Отменена", variant: "secondary" },
};

const typeLabels: Record<string, string> = {
  mkad_day: "МКАД дневной",
  mkad_night: "МКАД ночной",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "СК",
};

function formatDate(date: Date | string): string {
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

interface OrderItem {
  id: string;
  type: string;
  zone: string;
  status: string;
  price: number;
  createdAt: Date | string;
  vehicle?: { brand: string; model: string; licensePlate: string } | null;
}

interface OrdersListProps {
  orders: OrderItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentStatus?: string;
}

export function OrdersList({
  orders,
  total,
  page,
  totalPages,
  currentStatus,
}: OrdersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function navigate(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    startTransition(() => {
      router.push(`/dashboard/orders?${sp.toString()}`);
    });
  }

  function handleStatusFilter(value: string) {
    navigate({
      status: value === "all" ? undefined : value,
      page: "1",
    });
  }

  function handlePageChange(newPage: number) {
    navigate({ page: String(newPage) });
  }

  const filteredOrders = search
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          (typeLabels[o.type] ?? o.type)
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
    : orders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Заявки</h1>
        <Link href="/dashboard/orders/new">
          <Button>
            <Plus className="size-4" />
            Новая заявка
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру или типу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={currentStatus ?? "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="documents_pending">
                  Ожидает документов
                </SelectItem>
                <SelectItem value="payment_pending">Ожидает оплаты</SelectItem>
                <SelectItem value="processing">В работе</SelectItem>
                <SelectItem value="submitted">Подана</SelectItem>
                <SelectItem value="approved">Одобрена</SelectItem>
                <SelectItem value="rejected">Отклонена</SelectItem>
                <SelectItem value="cancelled">Отменена</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className={isPending ? "opacity-50" : ""}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип пропуска</TableHead>
                  <TableHead>Зона</TableHead>
                  <TableHead>ТС</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Цена</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Заявки не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const s = statusMap[order.status];
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="hover:underline"
                          >
                            {formatDate(order.createdAt)}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {typeLabels[order.type] ?? order.type}
                        </TableCell>
                        <TableCell>
                          {zoneLabels[order.zone] ?? order.zone}
                        </TableCell>
                        <TableCell className="text-sm">
                          {order.vehicle
                            ? `${order.vehicle.brand} ${order.vehicle.model}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={s?.variant}>{s?.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(order.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              Открыть
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Всего: {total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Назад
                </Button>
                <span className="flex items-center px-2 text-sm">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Далее
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
