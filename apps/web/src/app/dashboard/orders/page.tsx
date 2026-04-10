"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// -- Mock data ----------------------------------------------------------------

interface Order {
  id: string;
  date: string;
  type: string;
  zone: string;
  status: string;
  price: string;
}

const mockOrders: Order[] = [
  { id: "ORD-2024-001", date: "09.04.2026", type: "МКАД дневной", zone: "МКАД", status: "processing", price: "10 000 ₽" },
  { id: "ORD-2024-002", date: "07.04.2026", type: "ТТК", zone: "ТТК", status: "payment_pending", price: "15 000 ₽" },
  { id: "ORD-2024-003", date: "05.04.2026", type: "Временный МКАД", zone: "МКАД", status: "approved", price: "3 500 ₽" },
  { id: "ORD-2024-004", date: "03.04.2026", type: "Садовое кольцо", zone: "СК", status: "documents_pending", price: "20 000 ₽" },
  { id: "ORD-2024-005", date: "01.04.2026", type: "МКАД ночной", zone: "МКАД", status: "approved", price: "8 000 ₽" },
  { id: "ORD-2024-006", date: "28.03.2026", type: "ТТК", zone: "ТТК", status: "draft", price: "15 000 ₽" },
  { id: "ORD-2024-007", date: "25.03.2026", type: "МКАД дневной", zone: "МКАД", status: "rejected", price: "10 000 ₽" },
  { id: "ORD-2024-008", date: "20.03.2026", type: "Временный ТТК", zone: "ТТК", status: "approved", price: "5 000 ₽" },
  { id: "ORD-2024-009", date: "15.03.2026", type: "Садовое кольцо", zone: "СК", status: "cancelled", price: "20 000 ₽" },
  { id: "ORD-2024-010", date: "10.03.2026", type: "МКАД дневной", zone: "МКАД", status: "submitted", price: "10 000 ₽" },
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

const tabFilters: Record<string, string[]> = {
  all: [],
  drafts: ["draft"],
  in_progress: ["documents_pending", "payment_pending", "processing", "submitted"],
  completed: ["approved", "rejected", "cancelled"],
};

// -- Component ----------------------------------------------------------------

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>№</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Тип пропуска</TableHead>
          <TableHead>Зона</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Цена</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              Заявки не найдены
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => {
            const s = statusMap[order.status];
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.zone}</TableCell>
                <TableCell>
                  <Badge variant={s?.variant}>{s?.label}</Badge>
                </TableCell>
                <TableCell className="text-right">{order.price}</TableCell>
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
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  function filterOrders(tab: string) {
    const statuses = tabFilters[tab] ?? [];
    return mockOrders.filter((order) => {
      const matchesTab = statuses.length === 0 || statuses.includes(order.status);
      const matchesSearch =
        search === "" ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesTab && matchesSearch && matchesStatus;
    });
  }

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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="documents_pending">Ожидает документов</SelectItem>
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
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="drafts">Черновики</TabsTrigger>
              <TabsTrigger value="in_progress">В работе</TabsTrigger>
              <TabsTrigger value="completed">Завершённые</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <OrdersTable orders={filterOrders("all")} />
            </TabsContent>
            <TabsContent value="drafts" className="mt-4">
              <OrdersTable orders={filterOrders("drafts")} />
            </TabsContent>
            <TabsContent value="in_progress" className="mt-4">
              <OrdersTable orders={filterOrders("in_progress")} />
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <OrdersTable orders={filterOrders("completed")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
