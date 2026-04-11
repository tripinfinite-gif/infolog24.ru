import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/auth/session";
import { getOrderById } from "@/lib/dal/orders";

export const metadata: Metadata = {
  title: "Детали заявки",
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "Черновик", variant: "secondary" },
  documents_pending: { label: "Ожидает документов", variant: "outline" },
  payment_pending: { label: "Ожидает оплаты", variant: "destructive" },
  processing: { label: "В обработке", variant: "default" },
  submitted: { label: "Подана", variant: "default" },
  approved: { label: "Одобрена", variant: "secondary" },
  rejected: { label: "Отклонена", variant: "destructive" },
  cancelled: { label: "Отменена", variant: "secondary" },
};

const docStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "На проверке", variant: "outline" },
  approved: { label: "Одобрен", variant: "secondary" },
  rejected: { label: "Отклонён", variant: "destructive" },
};

const paymentStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Ожидает оплаты", variant: "outline" },
  succeeded: { label: "Оплачено", variant: "secondary" },
  cancelled: { label: "Отменён", variant: "destructive" },
  refunded: { label: "Возврат", variant: "destructive" },
};

const typeLabels: Record<string, string> = {
  mkad_day: "МКАД дневной",
  mkad_night: "МКАД ночной",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "СК",
};

const docTypeLabels: Record<string, string> = {
  pts: "ПТС",
  sts: "СТС",
  driver_license: "Водительское удостоверен��е",
  power_of_attorney: "Доверенность",
  application: "Заявление",
  contract: "Договор",
  other: "Другое",
};

const statusStepOrder = [
  "draft",
  "documents_pending",
  "payment_pending",
  "processing",
  "submitted",
  "approved",
];

const statusStepLabels: Record<string, string> = {
  draft: "Черновик",
  documents_pending: "Загрузка документов",
  payment_pending: "Оплата",
  processing: "В обработке",
  submitted: "Подана в Дептранс",
  approved: "Одобрена",
};

function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount) + " \u20BD";
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  // Verify ownership for client role
  const userRole = (session.user as Record<string, unknown>).role as string;
  if (userRole === "client" && order.userId !== session.user.id) {
    notFound();
  }

  const s = statusConfig[order.status];
  const currentStatusIndex = statusStepOrder.indexOf(order.status);

  // Find the latest payment
  const latestPayment = order.payments?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Заявка</h1>
          <p className="text-sm text-muted-foreground">
            Создана {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={s?.variant} className="ml-auto text-sm">
          {s?.label}
        </Badge>
      </div>

      {/* Order info */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Тип пропуска</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {typeLabels[order.type] ?? order.type}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Зона</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">
              {zoneLabels[order.zone] ?? order.zone}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Транспорт</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {order.vehicle
                ? `${order.vehicle.brand} ${order.vehicle.model} — ${order.vehicle.licensePlate}`
                : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Стоимость</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-primary">
              {formatPrice(order.price)}
              {order.discount > 0 && (
                <span className="ml-2 text-sm text-green-600">
                  (скидка {formatPrice(order.discount)})
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      <Card>
        <CardHeader>
          <CardTitle>Прогресс заявки</CardTitle>
          {order.estimatedReadyDate && (
            <CardDescription>
              Ориентировочная дата готовности: {formatDate(order.estimatedReadyDate)}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            {statusStepOrder.map((stepKey, i) => {
              // Find matching history entry for this step
              const historyEntry = order.statusHistory?.find(
                (h) => h.toStatus === stepKey,
              );

              return (
                <div
                  key={stepKey}
                  className="flex flex-1 flex-col items-center text-center"
                >
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          i <= currentStatusIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                    <div className="flex-shrink-0">
                      {i < currentStatusIndex ? (
                        <CheckCircle2 className="size-6 text-primary" />
                      ) : i === currentStatusIndex ? (
                        <Clock className="size-6 text-primary" />
                      ) : (
                        <Circle className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    {i < statusStepOrder.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          i < currentStatusIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <span className="mt-2 hidden text-xs sm:block">
                    {statusStepLabels[stepKey]}
                  </span>
                  {historyEntry && (
                    <span className="hidden text-[10px] text-muted-foreground sm:block">
                      {formatDateTime(historyEntry.createdAt)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Документы
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.documents && order.documents.length > 0 ? (
              <div className="space-y-3">
                {order.documents.map((doc) => {
                  const ds = docStatusConfig[doc.status];
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {doc.fileName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {docTypeLabels[doc.type] ?? doc.type}
                        </div>
                      </div>
                      <Badge variant={ds?.variant}>{ds?.label}</Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Документы не загружены
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Оплата
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Сумма:</span>
              <span className="text-lg font-bold">{formatPrice(order.price)}</span>
            </div>
            {latestPayment ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Статус:</span>
                  <Badge variant={paymentStatusConfig[latestPayment.status]?.variant}>
                    {paymentStatusConfig[latestPayment.status]?.label}
                  </Badge>
                </div>
                {latestPayment.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Дата оплаты:</span>
                    <span className="text-sm">
                      {formatDateTime(latestPayment.paidAt)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Оплата ещё не производилась
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Permits */}
      {order.permits && order.permits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Выданные пропуска</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.permits.map((permit) => (
                <div
                  key={permit.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {permit.permitNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {zoneLabels[permit.zone] ?? permit.zone} |{" "}
                      {formatDate(permit.validFrom)} —{" "}
                      {formatDate(permit.validUntil)}
                    </div>
                  </div>
                  <Badge
                    variant={
                      permit.status === "active"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {permit.status === "active"
                      ? "Действует"
                      : permit.status === "expired"
                        ? "Истёк"
                        : "Аннулирован"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status history */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              История статусов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.statusHistory.map((entry, i) => (
                <div key={entry.id}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-2 shrink-0 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {entry.fromStatus
                            ? `${statusConfig[entry.fromStatus]?.label ?? entry.fromStatus} \u2192 ${statusConfig[entry.toStatus]?.label ?? entry.toStatus}`
                            : statusConfig[entry.toStatus]?.label ?? entry.toStatus}
                        </span>
                      </div>
                      {entry.comment && (
                        <p className="text-xs text-muted-foreground">
                          {entry.comment}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                  {i < order.statusHistory!.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
