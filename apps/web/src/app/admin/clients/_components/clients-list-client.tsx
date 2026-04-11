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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceRub, formatDate } from "../../_components/format-utils";
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
}

interface ClientsListClientProps {
  clients: SerializedClient[];
  total: number;
  page: number;
  totalPages: number;
  currentSearch: string;
}

export function ClientsListClient({
  clients,
  total,
  page,
  totalPages,
  currentSearch,
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

      {/* Search */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex gap-3 max-w-md">
            <div className="relative flex-1">
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
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Компания</TableHead>
                <TableHead>ИНН</TableHead>
                <TableHead className="text-center">Заявок</TableHead>
                <TableHead className="text-right">Выручка</TableHead>
                <TableHead>Регистрация</TableHead>
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
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.phone}
                  </TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {client.inn}
                  </TableCell>
                  <TableCell className="text-center">
                    {client.orderCount}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {formatPriceRub(client.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.createdAt)}
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
