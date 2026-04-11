import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { getSession } from "@/lib/auth/session";
import * as ordersDAL from "@/lib/dal/orders";
import {
  DOCUMENT_TYPE_LABELS,
  ORDER_TYPE_LABELS,
  ORDER_ZONE_LABELS,
  findMissingDocuments,
  type OrderType,
  type OrderZone,
} from "@/lib/documents/required-docs";
import {
  calculatePartnerCommission,
  formatRub,
} from "@/lib/partner/commission";
import type { DocumentType } from "@/lib/documents/zip-parser";

export const metadata: Metadata = {
  title: "Заявка — Партнёрский портал",
};

export default async function PassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect("/partner/login");

  const order = await ordersDAL.getOrderById(id);
  if (!order) notFound();
  // Партнёр может смотреть только заявки, связанные с его аккаунтом
  if (order.userId !== session.user.id) notFound();

  const orderType = order.type as OrderType;
  const presentDocTypes = Array.from(
    new Set((order.documents ?? []).map((d) => d.type)),
  ).filter((t) => t !== "other") as DocumentType[];
  const missingReport = findMissingDocuments(presentDocTypes, orderType);
  const commission = calculatePartnerCommission({
    orderType,
    zone: order.zone as OrderZone,
    price: order.price,
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/partner/passes">
            <ArrowLeft className="size-4" />К списку заявок
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Заявка №{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ORDER_TYPE_LABELS[orderType]} •{" "}
          {ORDER_ZONE_LABELS[order.zone as OrderZone]}
        </p>
      </div>

      {/* Статус и комиссия */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Статус заявки</CardDescription>
            <CardTitle className="text-xl">
              <OrderStatusBadge status={order.status} />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ваша комиссия (предварительно)</CardDescription>
            <CardTitle className="text-xl">
              {formatRub(commission.commission)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {Math.round(commission.rate * 100)}% от{" "}
            {formatRub(commission.basePrice)}
          </CardContent>
        </Card>
      </div>

      {/* Недостающие документы */}
      {!missingReport.isComplete && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertTriangle className="size-4 text-yellow-700" />
          <AlertTitle className="text-yellow-900">
            Не хватает документов
          </AlertTitle>
          <AlertDescription className="text-yellow-900">
            Дозагрузите следующие документы:{" "}
            {missingReport.missing
              .map((t) => DOCUMENT_TYPE_LABELS[t])
              .join(", ")}
          </AlertDescription>
        </Alert>
      )}
      {missingReport.isComplete && (order.documents?.length ?? 0) > 0 && (
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertTitle>Все документы на месте</AlertTitle>
          <AlertDescription>
            Заявка передана в обработку нашими менеджерами
          </AlertDescription>
        </Alert>
      )}

      {/* ТС */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Транспортное средство</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <Field
            label="Госномер"
            value={order.vehicle?.licensePlate ?? "—"}
          />
          <Field
            label="Марка/модель"
            value={`${order.vehicle?.brand ?? ""} ${order.vehicle?.model ?? ""}`.trim() || "—"}
          />
          {order.vehicle?.vin && (
            <Field label="VIN" value={order.vehicle.vin} />
          )}
        </CardContent>
      </Card>

      {/* Документы */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Загруженные документы</CardTitle>
          <CardDescription>
            {order.documents?.length ?? 0} файл(ов)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!order.documents || order.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Документы не загружены
            </p>
          ) : (
            <ul className="divide-y">
              {order.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {DOCUMENT_TYPE_LABELS[doc.type]} •{" "}
                        {Math.round(doc.fileSize / 1024)} КБ
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {doc.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Срок действия */}
      {order.permits?.[0] && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Срок действия пропуска
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <Field
              label="С"
              value={new Date(order.permits[0].validFrom).toLocaleDateString(
                "ru-RU",
              )}
            />
            <Field
              label="По"
              value={new Date(order.permits[0].validUntil).toLocaleDateString(
                "ru-RU",
              )}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    draft: { label: "Черновик", className: "bg-gray-100 text-gray-800" },
    documents_pending: {
      label: "Ожидает документы",
      className: "bg-yellow-100 text-yellow-800",
    },
    payment_pending: {
      label: "Ожидает оплату",
      className: "bg-orange-100 text-orange-800",
    },
    processing: {
      label: "В обработке",
      className: "bg-blue-100 text-blue-800",
    },
    submitted: {
      label: "Подана",
      className: "bg-purple-100 text-purple-800",
    },
    approved: { label: "Одобрена", className: "bg-green-100 text-green-800" },
    rejected: { label: "Отклонена", className: "bg-red-100 text-red-800" },
    cancelled: { label: "Отменена", className: "bg-gray-100 text-gray-600" },
  };
  const c = config[status] ?? { label: status, className: "" };
  return (
    <Badge variant="secondary" className={c.className}>
      {c.label}
    </Badge>
  );
}
