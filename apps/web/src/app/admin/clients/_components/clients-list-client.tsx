"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatPriceRub } from "../../_components/format-utils";
import { ExportButton } from "../../_components/export-button";

interface SerializedClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  inn: string;
  orderCount: number;
  totalRevenue: number;
  createdAt: string;
  tier: string;
  tierLabel: string;
  lastOrderAt: string | null;
  lastLoginAt: string | null;
}

interface ClientsListClientProps {
  clients: SerializedClient[];
  total: number;
  page: number;
  totalPages: number;
  currentSearch: string;
  currentTier: string;
}

const TIER_COLORS: Record<string, string> = {
  T1: "bg-slate-100 text-slate-700",
  T2: "bg-blue-100 text-blue-700",
  T3: "bg-emerald-100 text-emerald-700",
  T4: "bg-amber-100 text-amber-700",
  T5: "bg-purple-100 text-purple-700",
};

const TIER_OPTIONS = [
  { value: "", label: "Все тиры" },
  { value: "T5", label: "T5 · VIP" },
  { value: "T4", label: "T4 · Постоянный" },
  { value: "T3", label: "T3 · Активный" },
  { value: "T2", label: "T2 · Развивающийся" },
  { value: "T1", label: "T1 · Новичок" },
];

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "сегодня";
  if (days === 1) return "вчера";
  if (days < 7) return `${days} дн.`;
  if (days < 30) return `${Math.floor(days / 7)} нед.`;
  if (days < 365) return `${Math.floor(days / 30)} мес.`;
  return `${Math.floor(days / 365)} г.`;
}

export function ClientsListClient({
  clients,
  total,
  page,
  totalPages,
  currentSearch,
  currentTier,
}: ClientsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in updates)) params.delete("page");
      router.push(`/admin/clients?${params.toString()}`);
    },
    [router, searchParams],
  );

  function handleSearch() {
    updateFilters({ search });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Клиенты ({total})</h1>
        <ExportButton
          data={clients as unknown as Record<string, unknown>[]}
          filename="clients"
          columns={[
            { key: "name", label: "Имя" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Телефон" },
            { key: "company", label: "Компания" },
            { key: "inn", label: "ИНН" },
            { key: "orderCount", label: "Заявок" },
            { key: "totalRevenue", label: "Выручка" },
            { key: "createdAt", label: "Дата регистрации" },
          ]}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени, email, компании, ИНН..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              Искать
            </Button>
            <select
              value={currentTier}
              onChange={(e) => updateFilters({ tier: e.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TIER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Тир</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead className="text-center">Заявок</TableHead>
                <TableHead className="text-right">LTV</TableHead>
                <TableHead>Посл. заказ</TableHead>
                <TableHead>Посл. вход</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {client.name}
                    </Link>
                    {client.company !== "---" && (
                      <p className="text-xs text-muted-foreground">
                        {client.company}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(TIER_COLORS[client.tier])}
                    >
                      {client.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {client.orderCount}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {formatPriceRub(client.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatRelative(client.lastOrderAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatRelative(client.lastLoginAt)}
                  </TableCell>
                </TableRow>
              ))}
              {clients.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Клиенты не найдены
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
