"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusLabel, getStatusColor } from "@/lib/automation/order-state-machine";
import { cn } from "@/lib/utils";
import {
  CLIENTS,
  ORDERS,
  PERMITS,
  PAYMENTS,
  DOCUMENTS,
  ORDER_TYPE_LABELS,
  ZONE_LABELS,
  DOCUMENT_TYPE_LABELS,
  formatPrice,
  formatDate,
  formatDateTime,
} from "../../_components/mock-data";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const client = CLIENTS.find((c) => c.id === clientId);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ text: string; date: string }[]>([
    { text: "VIP клиент, приоритетное обслуживание", date: "2026-03-15T10:00:00Z" },
  ]);

  if (!client) {
    return (
      <div className="space-y-4">
        <Link href="/admin/clients" className="flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" /> Назад к клиентам
        </Link>
        <p className="text-muted-foreground">Клиент не найден</p>
      </div>
    );
  }

  const clientOrders = ORDERS.filter((o) => o.userId === clientId);
  const clientPermits = PERMITS.filter((p) => p.userId === clientId);
  const clientPayments = PAYMENTS.filter((p) => p.userId === clientId);
  const clientDocuments = DOCUMENTS.filter((d) => d.userId === clientId);
  const totalSpend = clientPayments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  function addNote() {
    if (!note.trim()) return;
    setNotes((prev) => [
      ...prev,
      { text: note.trim(), date: new Date().toISOString() },
    ]);
    setNote("");
  }

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
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-sm text-muted-foreground">{client.company}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order history */}
          <Card>
            <CardHeader>
              <CardTitle>Заявки ({clientOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Зона</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientOrders.map((order) => (
                    <TableRow key={order.id}>
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
                      <TableCell>{ORDER_TYPE_LABELS[order.type]}</TableCell>
                      <TableCell>{ZONE_LABELS[order.zone]}</TableCell>
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
                      <TableCell className="text-right font-medium">
                        {formatPrice(order.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Нет заявок
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Active permits */}
          <Card>
            <CardHeader>
              <CardTitle>Действующие пропуска ({clientPermits.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {clientPermits.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет действующих пропусков</p>
              ) : (
                <div className="space-y-3">
                  {clientPermits.map((permit) => (
                    <div
                      key={permit.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium font-mono text-sm">
                          {permit.permitNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ZONE_LABELS[permit.zone]} | {permit.vehiclePlate} |{" "}
                          {formatDate(permit.validFrom)} - {formatDate(permit.validUntil)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          permit.status === "active" && "bg-green-100 text-green-700",
                          permit.status === "expired" && "bg-gray-100 text-gray-700",
                          permit.status === "revoked" && "bg-red-100 text-red-700"
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
              <CardTitle>Документы ({clientDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {clientDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет документов</p>
              ) : (
                <div className="space-y-2">
                  {clientDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {DOCUMENT_TYPE_LABELS[doc.type]} | {formatDate(doc.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          doc.status === "approved" && "bg-green-100 text-green-700",
                          doc.status === "pending" && "bg-amber-100 text-amber-700",
                          doc.status === "rejected" && "bg-red-100 text-red-700"
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
                  {clientPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${p.orderId}`}
                          className="text-primary hover:underline"
                        >
                          #{p.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(p.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            p.status === "succeeded" && "bg-green-100 text-green-700",
                            p.status === "pending" && "bg-amber-100 text-amber-700",
                            p.status === "cancelled" && "bg-gray-100 text-gray-700",
                            p.status === "refunded" && "bg-red-100 text-red-700"
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
                  {clientPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
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
                  <dd className="font-medium">{client.phone}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Компания</dt>
                  <dd className="font-medium">{client.company}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">ИНН</dt>
                  <dd className="font-medium font-mono">{client.inn}</dd>
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
                  <dd className="font-bold">{clientOrders.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Пропусков</dt>
                  <dd className="font-bold">{clientPermits.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Общая сумма</dt>
                  <dd className="font-bold text-green-600">
                    {formatPrice(totalSpend)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Заметки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notes.map((n, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(n.date)}
                  </p>
                </div>
              ))}
              <div className="flex gap-2">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Добавить заметку..."
                  className="min-h-[60px] resize-none"
                />
                <Button
                  size="icon"
                  onClick={addNote}
                  disabled={!note.trim()}
                  className="shrink-0 self-end"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
