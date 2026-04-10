import Link from "next/link";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Детали заявки",
};

// -- Mock data ----------------------------------------------------------------

const orderData = {
  id: "ORD-2024-001",
  type: "МКАД дневной",
  zone: "МКАД",
  status: "processing",
  price: "10 000 ₽",
  createdAt: "09.04.2026",
  estimatedReadyDate: "14.04.2026",
  vehicle: "MAN TGX 18.510 — К 123 АА 77",
};

const statusSteps = [
  { key: "draft", label: "Черновик", date: "09.04.2026 10:00" },
  { key: "documents_pending", label: "Загрузка документов", date: "09.04.2026 10:15" },
  { key: "payment_pending", label: "Оплата", date: "09.04.2026 11:00" },
  { key: "processing", label: "В обработке", date: "09.04.2026 11:30" },
  { key: "submitted", label: "Подана в Дептранс", date: null },
  { key: "approved", label: "Одобрена", date: null },
];

const documents = [
  { name: "СТС_К123АА77.pdf", status: "approved", type: "СТС" },
  { name: "ПТС_К123АА77.pdf", status: "approved", type: "ПТС" },
  { name: "Доверенность.pdf", status: "pending", type: "Доверенность" },
];

const statusHistory = [
  { date: "09.04.2026 11:30", from: "Ожидает оплаты", to: "В обработке", comment: "Оплата подтверждена" },
  { date: "09.04.2026 11:00", from: "Ожидает документов", to: "Ожидает оплаты", comment: "Документы проверены" },
  { date: "09.04.2026 10:15", from: "Черновик", to: "Ожидает документов", comment: "Заявка создана" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Черновик", variant: "secondary" },
  documents_pending: { label: "Ожидает документов", variant: "outline" },
  payment_pending: { label: "Ожидает оплаты", variant: "destructive" },
  processing: { label: "В обработке", variant: "default" },
  submitted: { label: "Подана", variant: "default" },
  approved: { label: "Одобрена", variant: "secondary" },
  rejected: { label: "Отклонена", variant: "destructive" },
  cancelled: { label: "Отменена", variant: "secondary" },
};

const docStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "На проверке", variant: "outline" },
  approved: { label: "Одобрен", variant: "secondary" },
  rejected: { label: "Отклонён", variant: "destructive" },
};

// -- Component ----------------------------------------------------------------

const currentStatusIndex = statusSteps.findIndex(
  (s) => s.key === orderData.status
);

export default function OrderDetailPage() {
  const s = statusConfig[orderData.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Заявка {orderData.id}</h1>
          <p className="text-sm text-muted-foreground">
            Создана {orderData.createdAt}
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
            <div className="text-lg font-semibold">{orderData.type}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Зона</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">
              {orderData.zone}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Транспорт</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{orderData.vehicle}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Стоимость</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-primary">
              {orderData.price}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      <Card>
        <CardHeader>
          <CardTitle>Прогресс заявки</CardTitle>
          <CardDescription>
            Ориентировочная дата готовности: {orderData.estimatedReadyDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            {statusSteps.map((step, i) => (
              <div
                key={step.key}
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
                  {i < statusSteps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        i < currentStatusIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
                <span className="mt-2 hidden text-xs sm:block">
                  {step.label}
                </span>
                {step.date && (
                  <span className="hidden text-[10px] text-muted-foreground sm:block">
                    {step.date}
                  </span>
                )}
              </div>
            ))}
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
            <div className="space-y-3">
              {documents.map((doc) => {
                const ds = docStatusConfig[doc.status];
                return (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.type}
                      </div>
                    </div>
                    <Badge variant={ds?.variant}>{ds?.label}</Badge>
                  </div>
                );
              })}
            </div>
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
              <span className="text-lg font-bold">{orderData.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Статус:</span>
              <Badge variant="secondary">Оплачено</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Дата оплаты:</span>
              <span className="text-sm">09.04.2026 11:00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            История статусов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusHistory.map((entry, i) => (
              <div key={i}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-2 shrink-0 rounded-full bg-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {entry.from} &rarr; {entry.to}
                      </span>
                    </div>
                    {entry.comment && (
                      <p className="text-xs text-muted-foreground">
                        {entry.comment}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {entry.date}
                    </p>
                  </div>
                </div>
                {i < statusHistory.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
