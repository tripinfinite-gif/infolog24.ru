"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Search,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  type OrderStatus,
  getStatusLabel,
  getStatusColor,
  ORDER_STATES,
} from "@/lib/automation/order-state-machine";
import { cn } from "@/lib/utils";
import {
  formatPriceRub,
  formatDate,
  ORDER_TYPE_LABELS,
  ZONE_LABELS,
} from "../../_components/format-utils";
import { ExportButton } from "../../_components/export-button";

interface SerializedOrder {
  id: string;
  type: string;
  zone: string;
  status: string;
  price: number;
  discount: number;
  tags: string[] | null;
  createdAt: string;
  clientName: string;
  clientCompany: string;
  managerName: string | null;
  managerId: string | null;
  vehiclePlate: string;
}

interface Manager {
  id: string;
  name: string;
}

interface OrdersListClientProps {
  orders: SerializedOrder[];
  managers: Manager[];
  total: number;
  page: number;
  totalPages: number;
  currentFilters: {
    status: string;
    zone: string;
    search: string;
    managerId: string;
  };
}

const ALL_STATUSES = Object.keys(ORDER_STATES) as OrderStatus[];
const ALL_ZONES = ["mkad", "ttk", "sk"] as const;

export function OrdersListClient({
  orders,
  managers,
  total,
  page,
  totalPages,
  currentFilters,
}: OrdersListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState(currentFilters.search);
  const [bulkLoading, setBulkLoading] = useState(false);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset to page 1 on filter change
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/admin/orders?${params.toString()}`);
    },
    [router, searchParams],
  );

  function handleSearch() {
    updateFilters({ search });
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (orders.every((o) => selectedIds.has(o.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  }

  async function handleBulkAssign(managerId: string) {
    setBulkLoading(true);
    try {
      await fetch("/api/admin/orders/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: Array.from(selectedIds),
          managerId,
        }),
      });
      setSelectedIds(new Set());
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  }

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Заявки ({total})</h1>
        <ExportButton
          data={orders as unknown as Record<string, unknown>[]}
          filename="orders"
          columns={[
            { key: "createdAt", label: "Дата" },
            { key: "clientName", label: "Клиент" },
            { key: "type", label: "Тип" },
            { key: "zone", label: "Зона" },
            { key: "status", label: "Статус" },
            { key: "managerName", label: "Менеджер" },
            { key: "price", label: "Цена" },
          ]}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по клиенту, компании, телефону..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              Искать
            </Button>

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {currentFilters.status
                    ? getStatusLabel(currentFilters.status as OrderStatus)
                    : "Статус"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() => updateFilters({ status: "" })}
                >
                  Все статусы
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {ALL_STATUSES.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => updateFilters({ status: s })}
                  >
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        getStatusColor(s),
                      )}
                    >
                      {getStatusLabel(s)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Zone filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {currentFilters.zone
                    ? ZONE_LABELS[currentFilters.zone]
                    : "Зона"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => updateFilters({ zone: "" })}>
                  Все зоны
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {ALL_ZONES.map((z) => (
                  <DropdownMenuItem
                    key={z}
                    onClick={() => updateFilters({ zone: z })}
                  >
                    {ZONE_LABELS[z]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Manager filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {currentFilters.managerId
                    ? managers.find((m) => m.id === currentFilters.managerId)
                        ?.name ?? "Менеджер"
                    : "Менеджер"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => updateFilters({ managerId: "" })}
                >
                  Все менеджеры
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {managers.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => updateFilters({ managerId: m.id })}
                  >
                    {m.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium">
            Выбрано: {selectedIds.size}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" disabled={bulkLoading}>
                <UserPlus className="size-4 mr-1" />
                Назначить менеджера
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {managers.map((m) => (
                <DropdownMenuItem
                  key={m.id}
                  onClick={() => handleBulkAssign(m.id)}
                >
                  {m.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedIds(new Set())}
          >
            Сбросить выбор
          </Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Зона</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Менеджер</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(order.id)}
                      onCheckedChange={() => toggleSelect(order.id)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {order.clientName}
                      </Link>
                      {order.clientCompany && (
                        <p className="text-xs text-muted-foreground">
                          {order.clientCompany}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {ORDER_TYPE_LABELS[order.type] ?? order.type}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ZONE_LABELS[order.zone] ?? order.zone}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        getStatusColor(order.status as OrderStatus),
                      )}
                    >
                      {getStatusLabel(order.status as OrderStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.managerName ?? "---"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPriceRub(order.price)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/orders/${order.id}`}>
                          <DropdownMenuItem>
                            <Eye className="size-4" />
                            Просмотр
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Заявки не найдены
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
            Страница {page} из {totalPages} (всего {total})
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() =>
                updateFilters({ page: String(page - 1) })
              }
            >
              <ChevronLeft className="size-4" />
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                updateFilters({ page: String(page + 1) })
              }
            >
              Вперёд
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
