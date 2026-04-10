"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUDIT_LOG, formatDateTime } from "../_components/mock-data";

const ACTION_LABELS: Record<string, string> = {
  login: "Вход",
  logout: "Выход",
  status_change: "Смена статуса",
  document_review: "Проверка документа",
  settings_change: "Изменение настроек",
  assign_manager: "Назначение менеджера",
  payment_confirm: "Подтверждение оплаты",
  comment_add: "Добавление комментария",
  user_create: "Создание пользователя",
  export_data: "Экспорт данных",
};

const ACTION_COLORS: Record<string, string> = {
  login: "bg-green-100 text-green-700",
  logout: "bg-gray-100 text-gray-700",
  status_change: "bg-blue-100 text-blue-700",
  document_review: "bg-amber-100 text-amber-700",
  settings_change: "bg-purple-100 text-purple-700",
  assign_manager: "bg-indigo-100 text-indigo-700",
  payment_confirm: "bg-emerald-100 text-emerald-700",
  comment_add: "bg-sky-100 text-sky-700",
  user_create: "bg-pink-100 text-pink-700",
  export_data: "bg-orange-100 text-orange-700",
};

const uniqueActions = [...new Set(AUDIT_LOG.map((a) => a.action))];
const uniqueUsers = [...new Set(AUDIT_LOG.map((a) => a.userName))];

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const filtered = useMemo(() => {
    let result = [...AUDIT_LOG];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.details.toLowerCase().includes(q) ||
          a.userName.toLowerCase().includes(q) ||
          a.entityId.toLowerCase().includes(q)
      );
    }
    if (actionFilter) {
      result = result.filter((a) => a.action === actionFilter);
    }
    if (userFilter) {
      result = result.filter((a) => a.userName === userFilter);
    }
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [search, actionFilter, userFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Аудит</h1>

      {/* Filters */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по описанию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* User filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {userFilter || "Пользователь"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setUserFilter("")}>
                  Все пользователи
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {uniqueUsers.map((u) => (
                  <DropdownMenuItem key={u} onClick={() => setUserFilter(u)}>
                    {u}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Action filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {actionFilter ? (ACTION_LABELS[actionFilter] ?? actionFilter) : "Действие"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setActionFilter("")}>
                  Все действия
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {uniqueActions.map((a) => (
                  <DropdownMenuItem key={a} onClick={() => setActionFilter(a)}>
                    {ACTION_LABELS[a] ?? a}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>Объект</TableHead>
                <TableHead>Детали</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(entry.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">{entry.userName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={ACTION_COLORS[entry.action] ?? ""}
                    >
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="capitalize">{entry.entityType}</span>
                    <span className="text-xs ml-1 font-mono">
                      {entry.entityId}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm">
                    {entry.details}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {entry.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Записи не найдены
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
