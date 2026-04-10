"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  FileIcon,
  Trash2,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getStatusLabel,
  getStatusColor,
  getNextStatuses,
  type OrderStatus,
} from "@/lib/automation/order-state-machine";
import { cn } from "@/lib/utils";
import {
  ORDERS,
  DOCUMENTS,
  PAYMENTS,
  STATUS_HISTORY,
  COMMENTS,
  MANAGERS,
  AUDIT_LOG,
  ORDER_TYPE_LABELS,
  ZONE_LABELS,
  DOCUMENT_TYPE_LABELS,
  TAG_STYLES,
  formatPrice,
  formatDate,
  formatDateTime,
} from "../../_components/mock-data";
import { OrderComments } from "../../_components/order-comments";
import { QuickResponses } from "../../_components/quick-responses";

const ALL_TAGS = ["срочно", "VIP", "проблемный", "повторный"];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = ORDERS.find((o) => o.id === orderId);

  const [statusComment, setStatusComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [orderTags, setOrderTags] = useState<string[]>(order?.tags ?? []);

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" /> Назад к заявкам
        </Link>
        <p className="text-muted-foreground">Заявка не найдена</p>
      </div>
    );
  }

  const orderDocuments = DOCUMENTS.filter((d) => d.orderId === orderId);
  const orderPayments = PAYMENTS.filter((p) => p.orderId === orderId);
  const orderHistory = STATUS_HISTORY.filter((h) => h.orderId === orderId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const orderComments = COMMENTS.filter((c) => c.orderId === orderId);
  const orderAudit = AUDIT_LOG.filter((a) => a.entityId === orderId);
  const nextStatuses = getNextStatuses(order.status);
  const managersList = MANAGERS.filter((m) => m.role === "manager");

  function handleStatusChange(newStatus: OrderStatus) {
    setPendingStatus(newStatus);
    setDialogOpen(true);
  }

  function confirmStatusChange() {
    // Mock: would call API
    setDialogOpen(false);
    setPendingStatus(null);
    setStatusComment("");
  }

  function toggleTag(tag: string) {
    setOrderTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Заявка #{order.orderNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              {order.clientCompany} | {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            getStatusColor(order.status)
          )}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order details */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о заявке</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Клиент</dt>
                  <dd className="font-medium">{order.clientName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Компания</dt>
                  <dd className="font-medium">{order.clientCompany}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Тип пропуска</dt>
                  <dd className="font-medium">{ORDER_TYPE_LABELS[order.type]}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Зона</dt>
                  <dd className="font-medium">{ZONE_LABELS[order.zone]}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Транспорт</dt>
                  <dd className="font-medium">{order.vehiclePlate}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Планируемая дата</dt>
                  <dd className="font-medium">
                    {order.estimatedReadyDate
                      ? formatDate(order.estimatedReadyDate)
                      : "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Цена</dt>
                  <dd className="font-medium">{formatPrice(order.price)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Скидка</dt>
                  <dd className="font-medium">
                    {order.discount > 0
                      ? `${formatPrice(order.discount)}${order.promoCode ? ` (${order.promoCode})` : ""}`
                      : "---"}
                  </dd>
                </div>
                {order.notes && (
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Заметки</dt>
                    <dd className="font-medium">{order.notes}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Status change */}
          {nextStatuses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Изменить статус</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {nextStatuses.map((ns) => (
                    <Button
                      key={ns}
                      variant="outline"
                      onClick={() => handleStatusChange(ns)}
                      className={cn("gap-1", getStatusColor(ns))}
                    >
                      {getStatusLabel(ns)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>
                Документы ({orderDocuments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Документы не загружены</p>
              ) : (
                <div className="space-y-3">
                  {orderDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileIcon className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {DOCUMENT_TYPE_LABELS[doc.type]} |{" "}
                            {(doc.fileSize / 1024 / 1024).toFixed(1)} МБ
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="gap-1 text-green-600">
                              <Check className="size-3" /> Одобрить
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-red-600">
                              <X className="size-3" /> Отклонить
                            </Button>
                          </>
                        )}
                        {doc.status === "approved" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle2 className="size-3 mr-1" /> Одобрен
                          </Badge>
                        )}
                        {doc.status === "rejected" && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-red-100 text-red-700">
                              <XCircle className="size-3 mr-1" /> Отклонён
                            </Badge>
                            {doc.rejectionReason && (
                              <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                                {doc.rejectionReason}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Оплата</CardTitle>
            </CardHeader>
            <CardContent>
              {orderPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет данных об оплате</p>
              ) : (
                <div className="space-y-3">
                  {orderPayments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{formatPrice(p.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.provider} | {formatDateTime(p.createdAt)}
                        </p>
                      </div>
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Внутренние комментарии</CardTitle>
                <QuickResponses onSelect={() => {}} />
              </div>
            </CardHeader>
            <CardContent>
              <OrderComments comments={orderComments} />
            </CardContent>
          </Card>
        </div>

        {/* Right column - sidebar */}
        <div className="space-y-6">
          {/* Manager */}
          <Card>
            <CardHeader>
              <CardTitle>Менеджер</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {order.managerName ?? "Не назначен"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="size-4 mr-1" />
                      {order.managerName ? "Переназначить" : "Назначить"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {managersList.map((m) => (
                      <DropdownMenuItem key={m.id}>{m.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Теги</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => {
                  const isActive = orderTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                        isActive
                          ? TAG_STYLES[tag]
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {tag}
                      {isActive && <X className="size-3 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Status history timeline */}
          <Card>
            <CardHeader>
              <CardTitle>История статусов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderHistory.map((entry, i) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "size-3 rounded-full border-2",
                          i === orderHistory.length - 1
                            ? "border-primary bg-primary"
                            : "border-muted-foreground bg-background"
                        )}
                      />
                      {i < orderHistory.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">
                        {getStatusLabel(entry.toStatus as OrderStatus)}
                      </p>
                      {entry.comment && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {entry.comment}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {entry.changedByName} | {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {orderHistory.length === 0 && (
                  <p className="text-sm text-muted-foreground">Нет истории</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Audit log for this order */}
          {orderAudit.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Аудит</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {orderAudit.map((entry) => (
                    <div key={entry.id} className="text-xs">
                      <p className="font-medium">{entry.details}</p>
                      <p className="text-muted-foreground">
                        {entry.userName} | {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Status change dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус</DialogTitle>
            <DialogDescription>
              {pendingStatus &&
                `Перевести заявку #${order.orderNumber} в статус "${getStatusLabel(pendingStatus)}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Комментарий <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Укажите причину изменения статуса..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={!statusComment.trim()}
            >
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
