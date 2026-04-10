"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ChevronDown,
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
  ORDERS,
  MANAGERS,
  ORDER_TYPE_LABELS,
  ZONE_LABELS,
  TAG_STYLES,
  formatPrice,
  formatDate,
  type MockOrder,
} from "../_components/mock-data";
import { ExportButton } from "../_components/export-button";

type SortKey = keyof MockOrder;
type SortDir = "asc" | "desc";

const ALL_STATUSES = Object.keys(ORDER_STATES) as OrderStatus[];
const ALL_ZONES = ["mkad", "ttk", "sk"] as const;
const ALL_MANAGERS_LIST = MANAGERS.filter((m) => m.role === "manager");

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Set<OrderStatus>>(new Set());
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleStatus(status: OrderStatus) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll(ids: string[]) {
    setSelectedIds((prev) => {
      if (ids.every((id) => prev.has(id))) return new Set();
      return new Set(ids);
    });
  }

  const filtered = useMemo(() => {
    let result = [...ORDERS];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.clientName.toLowerCase().includes(q) ||
          o.clientCompany.toLowerCase().includes(q) ||
          String(o.orderNumber).includes(q)
      );
    }

    // Status filter
    if (selectedStatuses.size > 0) {
      result = result.filter((o) => selectedStatuses.has(o.status));
    }

    // Zone filter
    if (selectedZone) {
      result = result.filter((o) => o.zone === selectedZone);
    }

    // Manager filter
    if (selectedManager) {
      result = result.filter((o) => o.managerId === selectedManager);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, selectedStatuses, selectedZone, selectedManager, sortKey, sortDir]);

  const allFilteredIds = filtered.map((o) => o.id);
  const allSelected =
    filtered.length > 0 && filtered.every((o) => selectedIds.has(o.id));

  function SortableHead({
    label,
    column,
  }: {
    label: string;
    column: SortKey;
  }) {
    return (
      <TableHead
        className="cursor-pointer select-none"
        onClick={() => toggleSort(column)}
      >
        <span className="flex items-center gap-1">
          {label}
          <ArrowUpDown className="size-3 text-muted-foreground" />
        </span>
      </TableHead>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Заявки</h1>
        <ExportButton
          data={filtered as unknown as Record<string, unknown>[]}
          filename="orders"
          columns={[
            { key: "orderNumber", label: "Номер" },
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
                placeholder="Поиск по клиенту или номеру..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status multi-select */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  Статус
                  {selectedStatuses.size > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedStatuses.size}
                    </Badge>
                  )}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {ALL_STATUSES.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleStatus(s);
                    }}
                  >
                    <Checkbox
                      checked={selectedStatuses.has(s)}
                      className="mr-2"
                    />
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        getStatusColor(s)
                      )}
                    >
                      {getStatusLabel(s)}
                    </span>
                  </DropdownMenuItem>
                ))}
                {selectedStatuses.size > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedStatuses(new Set())}>
                      Сбросить
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Zone */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {selectedZone ? ZONE_LABELS[selectedZone] : "Зона"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedZone("")}>
                  Все зоны
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {ALL_ZONES.map((z) => (
                  <DropdownMenuItem key={z} onClick={() => setSelectedZone(z)}>
                    {ZONE_LABELS[z]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Manager */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {selectedManager
                    ? ALL_MANAGERS_LIST.find((m) => m.id === selectedManager)?.name ?? "Менеджер"
                    : "Менеджер"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedManager("")}>
                  Все менеджеры
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {ALL_MANAGERS_LIST.map((m) => (
                  <DropdownMenuItem key={m.id} onClick={() => setSelectedManager(m.id)}>
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
              <Button size="sm" variant="outline">
                <UserPlus className="size-4 mr-1" />
                Назначить менеджера
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ALL_MANAGERS_LIST.map((m) => (
                <DropdownMenuItem key={m.id}>{m.name}</DropdownMenuItem>
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
                    onCheckedChange={() => toggleSelectAll(allFilteredIds)}
                  />
                </TableHead>
                <SortableHead label="№" column="orderNumber" />
                <SortableHead label="Дата" column="createdAt" />
                <TableHead>Клиент</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Зона</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Менеджер</TableHead>
                <SortableHead label="Цена" column="price" />
                <TableHead>Теги</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(order.id)}
                      onCheckedChange={() => toggleSelect(order.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.clientCompany}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {ORDER_TYPE_LABELS[order.type]}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ZONE_LABELS[order.zone]}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        getStatusColor(order.status)
                      )}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.managerName ?? "---"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(order.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {order.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                            TAG_STYLES[tag] ?? "bg-gray-100 text-gray-700"
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    Заявки не найдены
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
