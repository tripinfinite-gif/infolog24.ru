import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClientDetail } from "@/lib/dal/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusLabel, getStatusColor } from "@/lib/automation/order-state-machine";
import type { OrderStatus } from "@/lib/automation/order-state-machine";
import { cn } from "@/lib/utils";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatPriceRub(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  mkad_day: "МКАД (дневной)",
  mkad_night: "МКАД (ночной)",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

const ZONE_LABELS: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "СК",
};

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  pts: "ПТС",
  sts: "СТС",
  driver_license: "ВУ",
  power_of_attorney: "Доверенность",
  application: "Заявление",
  contract: "Договор",
  other: "Другое",
};

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { id } = await params;
  const data = await getClientDetail(id);

  if (!data) {
    notFound();
  }

  const { client, orders, vehicles, payments, documents, permits, totalSpend } =
    data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/clients"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {client.name ?? client.email}
          </h1>
          <p className="text-sm text-muted-foreground">
            {client.company ?? "Без компании"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order history */}
          <Card>
            <CardHeader>
              <CardTitle>Заявки ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Зона</TableHead>
                    <TableHead>ТС</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="text-muted-foreground">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-primary hover:underline"
                        >
                          {formatDate(order.createdAt)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {ORDER_TYPE_LABELS[order.type] ?? order.type}
                      </TableCell>
                      <TableCell>
                        {ZONE_LABELS[order.zone] ?? order.zone}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.vehicle?.licensePlate ?? "---"}
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
                      <TableCell className="text-right font-medium">
                        {formatPriceRub(order.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-4 text-muted-foreground"
                      >
                        Нет заявок
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle>Транспорт ({vehicles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет ТС</p>
              ) : (
                <div className="space-y-3">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {v.brand} {v.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {v.licensePlate} | {v.ecoClass ?? "---"} |{" "}
                          {v.maxWeight ? `${v.maxWeight} кг` : "---"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permits */}
          <Card>
            <CardHeader>
              <CardTitle>Пропуска ({permits.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {permits.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Нет пропусков
                </p>
              ) : (
                <div className="space-y-3">
                  {permits.map((permit) => (
                    <div
                      key={permit.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium font-mono text-sm">
                          {permit.permitNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ZONE_LABELS[permit.zone] ?? permit.zone} |{" "}
                          {formatDate(permit.validFrom)} -{" "}
                          {formatDate(permit.validUntil)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          permit.status === "active" &&
                            "bg-green-100 text-green-700",
                          permit.status === "expired" &&
                            "bg-gray-100 text-gray-700",
                          permit.status === "revoked" &&
                            "bg-red-100 text-red-700",
                        )}
                      >
                        {permit.status === "active" && "Активен"}
                        {permit.status === "expired" && "Истёк"}
                        {permit.status === "revoked" && "Отозван"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Документы ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет документов</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type} |{" "}
                          {formatDate(doc.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          doc.status === "approved" &&
                            "bg-green-100 text-green-700",
                          doc.status === "pending" &&
                            "bg-amber-100 text-amber-700",
                          doc.status === "rejected" &&
                            "bg-red-100 text-red-700",
                        )}
                      >
                        {doc.status === "approved" && "Одобрен"}
                        {doc.status === "pending" && "На проверке"}
                        {doc.status === "rejected" && "Отклонён"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment history */}
          <Card>
            <CardHeader>
              <CardTitle>История платежей</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Заявка</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${p.orderId}`}
                          className="text-primary hover:underline"
                        >
                          Заявка
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPriceRub(p.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            p.status === "succeeded" &&
                              "bg-green-100 text-green-700",
                            p.status === "pending" &&
                              "bg-amber-100 text-amber-700",
                            p.status === "cancelled" &&
                              "bg-gray-100 text-gray-700",
                            p.status === "refunded" &&
                              "bg-red-100 text-red-700",
                          )}
                        >
                          {p.status === "succeeded" && "Оплачено"}
                          {p.status === "pending" && "Ожидание"}
                          {p.status === "cancelled" && "Отменено"}
                          {p.status === "refunded" && "Возврат"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-4 text-muted-foreground"
                      >
                        Нет платежей
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{client.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Телефон</dt>
                  <dd className="font-medium">{client.phone ?? "---"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Компания</dt>
                  <dd className="font-medium">{client.company ?? "---"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">ИНН</dt>
                  <dd className="font-medium font-mono">
                    {client.inn ?? "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Регистрация</dt>
                  <dd className="font-medium">{formatDate(client.createdAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Всего заявок</dt>
                  <dd className="font-bold">{orders.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Пропусков</dt>
                  <dd className="font-bold">{permits.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Транспорт</dt>
                  <dd className="font-bold">{vehicles.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Общая сумма</dt>
                  <dd className="font-bold text-green-600">
                    {formatPriceRub(totalSpend)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
