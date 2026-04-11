"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  formatDateTime,
  ACTION_LABELS,
  ACTION_COLORS,
} from "../../_components/format-utils";

interface SerializedAuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
  userName: string;
  userId: string;
}

interface FilterOptions {
  actions: string[];
  users: Array<{ id: string; name: string }>;
}

interface AuditListClientProps {
  entries: SerializedAuditEntry[];
  total: number;
  page: number;
  totalPages: number;
  filterOptions: FilterOptions;
  currentAction: string;
  currentUserId: string;
}

export function AuditListClient({
  entries,
  total,
  page,
  totalPages,
  filterOptions,
  currentAction,
  currentUserId,
}: AuditListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in updates)) params.delete("page");
      router.push(`/admin/audit?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Журнал аудита ({total})</h1>

      {/* Filters */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* User filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {currentUserId
                    ? filterOptions.users.find(
                        (u) => u.id === currentUserId,
                      )?.name ?? "Пользователь"
                    : "Пользователь"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => updateFilters({ userId: "" })}
                >
                  Все пользователи
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {filterOptions.users.map((u) => (
                  <DropdownMenuItem
                    key={u.id}
                    onClick={() => updateFilters({ userId: u.id })}
                  >
                    {u.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Action filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {currentAction
                    ? ACTION_LABELS[currentAction] ?? currentAction
                    : "Действие"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => updateFilters({ action: "" })}
                >
                  Все действия
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {filterOptions.actions.map((a) => (
                  <DropdownMenuItem
                    key={a}
                    onClick={() => updateFilters({ action: a })}
                  >
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
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(entry.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.userName}
                  </TableCell>
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
                      {entry.entityId.slice(0, 8)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm">
                    {typeof entry.details === "string"
                      ? entry.details
                      : entry.details
                        ? JSON.stringify(entry.details)
                        : "---"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {entry.ipAddress ?? "---"}
                  </TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Записи не найдены
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
