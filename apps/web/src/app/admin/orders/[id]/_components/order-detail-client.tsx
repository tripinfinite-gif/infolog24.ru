"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  FileIcon,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  formatPriceRub,
  formatDate,
  formatDateTime,
  ORDER_TYPE_LABELS,
  ZONE_LABELS,
  DOCUMENT_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "../../../_components/format-utils";

interface SerializedOrder {
  id: string;
  type: string;
  zone: string;
  status: string;
  price: number;
  discount: number;
  promoCode: string | null;
  estimatedReadyDate: string | null;
  notes: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
  } | null;
  manager: { id: string; name: string } | null;
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
    ecoClass: string | null;
    maxWeight: number | null;
  } | null;
  documents: Array<{
    id: string;
    type: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    status: string;
    rejectionReason: string | null;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    provider: string;
    paidAt: string | null;
    createdAt: string;
  }>;
  statusHistory: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string;
    changedBy: string;
    comment: string | null;
    createdAt: string;
  }>;
  permits: Array<{
    id: string;
    permitNumber: string;
    zone: string;
    status: string;
    validFrom: string;
    validUntil: string;
  }>;
}

interface OrderDetailClientProps {
  order: SerializedOrder;
  managers: Array<{ id: string; name: string }>;
}

export function OrderDetailClient({
  order,
  managers,
}: OrderDetailClientProps) {
  const router = useRouter();
  const [statusComment, setStatusComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const nextStatuses = getNextStatuses(order.status as OrderStatus);
  const sortedHistory = [...order.statusHistory].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  function handleStatusChange(newStatus: OrderStatus) {
    setPendingStatus(newStatus);
    setDialogOpen(true);
  }

  async function confirmStatusChange() {
    if (!pendingStatus || !statusComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: pendingStatus,
          comment: statusComment.trim(),
        }),
      });

      if (res.ok) {
        setDialogOpen(false);
        setPendingStatus(null);
        setStatusComment("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignManager(managerId: string) {
    await fetch("/api/admin/orders/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: [order.id], managerId }),
    });
    router.refresh();
  }

  async function handleDocumentAction(docId: string, action: "approved" | "rejected") {
    // Placeholder: would call an API to update document status
    void docId;
    void action;
    router.refresh();
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
              Заявка #{order.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {order.client?.company ?? order.client?.name ?? "---"} |{" "}
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            getStatusColor(order.status as OrderStatus),
          )}
        >
          {getStatusLabel(order.status as OrderStatus)}
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
                  <dd className="font-medium">
                    {order.client ? (
                      <Link
                        href={`/admin/clients/${order.client.id}`}
                        className="text-primary hover:underline"
                      >
                        {order.client.name}
                      </Link>
                    ) : (
                      "---"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Компания</dt>
                  <dd className="font-medium">
                    {order.client?.company ?? "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Телефон</dt>
                  <dd className="font-medium">
                    {order.client?.phone ?? "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">
                    {order.client?.email ?? "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Тип пропуска</dt>
                  <dd className="font-medium">
                    {ORDER_TYPE_LABELS[order.type] ?? order.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Зона</dt>
                  <dd className="font-medium">
                    {ZONE_LABELS[order.zone] ?? order.zone}
                  </dd>
                </div>
                {order.vehicle && (
                  <>
                    <div>
                      <dt className="text-muted-foreground">Транспорт</dt>
                      <dd className="font-medium">
                        {order.vehicle.brand} {order.vehicle.model} (
                        {order.vehicle.licensePlate})
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        Экокласс / масса
                      </dt>
                      <dd className="font-medium">
                        {order.vehicle.ecoClass ?? "---"} /{" "}
                        {order.vehicle.maxWeight
                          ? `${order.vehicle.maxWeight} кг`
                          : "---"}
                      </dd>
                    </div>
                  </>
                )}
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
                  <dd className="font-medium">
                    {formatPriceRub(order.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Скидка</dt>
                  <dd className="font-medium">
                    {order.discount > 0
                      ? `${formatPriceRub(order.discount)}${order.promoCode ? ` (${order.promoCode})` : ""}`
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
                Документы ({order.documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Документы не загружены
                </p>
              ) : (
                <div className="space-y-3">
                  {order.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileIcon className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type} |{" "}
                            {(doc.fileSize / 1024 / 1024).toFixed(1)} МБ
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-green-600"
                              onClick={() =>
                                handleDocumentAction(doc.id, "approved")
                              }
                            >
                              <Check className="size-3" /> Одобрить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-red-600"
                              onClick={() =>
                                handleDocumentAction(doc.id, "rejected")
                              }
                            >
                              <X className="size-3" /> Отклонить
                            </Button>
                          </>
                        )}
                        {doc.status === "approved" && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            <CheckCircle2 className="size-3 mr-1" /> Одобрен
                          </Badge>
                        )}
                        {doc.status === "rejected" && (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-700"
                            >
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
              {order.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Нет данных об оплате
                </p>
              ) : (
                <div className="space-y-3">
                  {order.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {formatPriceRub(p.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.provider} | {formatDateTime(p.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          PAYMENT_STATUS_COLORS[p.status] ?? ""
                        }
                      >
                        {PAYMENT_STATUS_LABELS[p.status] ?? p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permits */}
          {order.permits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Пропуска</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.permits.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-mono font-medium text-sm">
                          {p.permitNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ZONE_LABELS[p.zone] ?? p.zone} |{" "}
                          {formatDate(p.validFrom)} -{" "}
                          {formatDate(p.validUntil)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          p.status === "active" &&
                            "bg-green-100 text-green-700",
                          p.status === "expired" &&
                            "bg-gray-100 text-gray-700",
                          p.status === "revoked" &&
                            "bg-red-100 text-red-700",
                        )}
                      >
                        {p.status === "active" && "Активен"}
                        {p.status === "expired" && "Истёк"}
                        {p.status === "revoked" && "Отозван"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                  {order.manager?.name ?? "Не назначен"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="size-4 mr-1" />
                      {order.manager ? "Переназначить" : "Назначить"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {managers.map((m) => (
                      <DropdownMenuItem
                        key={m.id}
                        onClick={() => handleAssignManager(m.id)}
                      >
                        {m.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {order.tags && order.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Теги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status history timeline */}
          <Card>
            <CardHeader>
              <CardTitle>История статусов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedHistory.map((entry, i) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "size-3 rounded-full border-2",
                          i === sortedHistory.length - 1
                            ? "border-primary bg-primary"
                            : "border-muted-foreground bg-background",
                        )}
                      />
                      {i < sortedHistory.length - 1 && (
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
                        {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {sortedHistory.length === 0 && (
                  <p className="text-sm text-muted-foreground">Нет истории</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status change dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус</DialogTitle>
            <DialogDescription>
              {pendingStatus &&
                `Перевести заявку в статус "${getStatusLabel(pendingStatus)}"`}
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
              disabled={!statusComment.trim() || loading}
            >
              {loading ? "Сохранение..." : "Подтвердить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
