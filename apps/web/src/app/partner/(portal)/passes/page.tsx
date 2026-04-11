import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, FileText, Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getSession } from "@/lib/auth/session";
import * as partnersDAL from "@/lib/dal/partners";
import {
  ORDER_TYPE_LABELS,
  ORDER_ZONE_LABELS,
  type OrderType,
  type OrderZone,
} from "@/lib/documents/required-docs";
import { formatRub } from "@/lib/partner/commission";

export const metadata: Metadata = {
  title: "Заявки — Партнёрский портал",
};

type SubmissionsResult = Awaited<
  ReturnType<typeof partnersDAL.getPartnerSubmissions>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubmissionRow = any;

export default async function PartnerPassesPage() {
  const session = await getSession();
  if (!session) redirect("/partner/login");

  const partnerId = session.user.id;
  const submissions: SubmissionsResult = await partnersDAL.getPartnerSubmissions(
    partnerId,
    { page: 1, pageSize: 50 },
  );

  const rows = submissions.data as SubmissionRow[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Заявки</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Здесь отображаются все заявки на пропуска, поданные через ваш аккаунт
          </p>
        </div>
        <Button asChild>
          <Link href="/partner/passes/new">
            <Plus className="size-4" />
            Новая заявка
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 py-12 text-center">
            <FileText className="mx-auto size-10 text-muted-foreground" />
            <h3 className="font-semibold">Заявок пока нет</h3>
            <p className="text-sm text-muted-foreground">
              Создайте первую заявку — загрузите архив с документами клиента
            </p>
            <Button asChild className="mt-2">
              <Link href="/partner/passes/new">
                <Plus className="size-4" />
                Создать первую заявку
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Все заявки</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип / Зона</TableHead>
                  <TableHead>ТС</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Комиссия</TableHead>
                  <TableHead className="w-[1%] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const order = row.order;
                  const typeLabel = order
                    ? (ORDER_TYPE_LABELS[order.type as OrderType] ??
                      order.type)
                    : null;
                  const zoneLabel = order
                    ? (ORDER_ZONE_LABELS[order.zone as OrderZone] ??
                      order.zone)
                    : null;
                  const targetId = order?.id ?? row.id;
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {new Date(row.createdAt).toLocaleDateString("ru-RU")}
                      </TableCell>
                      <TableCell>
                        {order ? `${typeLabel} • ${zoneLabel}` : "—"}
                      </TableCell>
                      <TableCell>
                        {order?.vehicle?.licensePlate ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {typeof row.commission === "number" && row.commission > 0
                          ? formatRub(row.commission)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/partner/passes/${targetId}`}>
                            Открыть
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Ожидает",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    confirmed: {
      label: "Подтверждена",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    paid: {
      label: "Выплачена",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
  };
  const c = config[status] ?? { label: status, className: "" };
  return (
    <Badge variant="secondary" className={c.className}>
      {c.label}
    </Badge>
  );
}
