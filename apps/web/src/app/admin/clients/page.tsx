"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CLIENTS,
  ORDERS,
  PERMITS,
  formatDate,
} from "../_components/mock-data";
import { ExportButton } from "../_components/export-button";

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const clientsWithStats = useMemo(() => {
    return CLIENTS.map((client) => {
      const clientOrders = ORDERS.filter((o) => o.userId === client.id);
      const clientPermits = PERMITS.filter((p) => p.userId === client.id);
      return {
        ...client,
        orderCount: clientOrders.length,
        permitCount: clientPermits.length,
      };
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return clientsWithStats;
    const q = search.toLowerCase();
    return clientsWithStats.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.inn.includes(q)
    );
  }, [search, clientsWithStats]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Клиенты</h1>
        <ExportButton
          data={filtered as unknown as Record<string, unknown>[]}
          filename="clients"
          columns={[
            { key: "name", label: "Имя" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Телефон" },
            { key: "company", label: "Компания" },
            { key: "inn", label: "ИНН" },
            { key: "orderCount", label: "Заявок" },
            { key: "permitCount", label: "Пропусков" },
            { key: "createdAt", label: "Дата регистрации" },
          ]}
        />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-0">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени, email, компании, ИНН..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
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
                <TableHead className="text-center">Пропусков</TableHead>
                <TableHead>Дата регистрации</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.email}</TableCell>
                  <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {client.inn}
                  </TableCell>
                  <TableCell className="text-center">{client.orderCount}</TableCell>
                  <TableCell className="text-center">{client.permitCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Клиенты не найдены
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
