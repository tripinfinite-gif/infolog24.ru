import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/dal/orders";
import { getManagers } from "@/lib/dal/admin";
import { OrderDetailClient } from "./_components/order-detail-client";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const [order, managers] = await Promise.all([
    getOrderById(id),
    getManagers(),
  ]);

  if (!order) {
    notFound();
  }

  const serializedOrder = {
    id: order.id,
    type: order.type,
    zone: order.zone,
    status: order.status,
    price: order.price,
    discount: order.discount,
    promoCode: order.promoCode,
    estimatedReadyDate: order.estimatedReadyDate,
    notes: order.notes,
    tags: order.tags,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    client: order.user
      ? {
          id: order.user.id,
          name: order.user.name ?? order.user.email,
          email: order.user.email,
          phone: order.user.phone,
          company: order.user.company,
        }
      : null,
    manager: order.manager
      ? {
          id: order.manager.id,
          name: order.manager.name ?? order.manager.email,
        }
      : null,
    vehicle: order.vehicle
      ? {
          brand: order.vehicle.brand,
          model: order.vehicle.model,
          licensePlate: order.vehicle.licensePlate,
          ecoClass: order.vehicle.ecoClass,
          maxWeight: order.vehicle.maxWeight,
        }
      : null,
    documents: (order.documents ?? []).map((d) => ({
      id: d.id,
      type: d.type,
      fileName: d.fileName,
      fileUrl: d.fileUrl,
      fileSize: d.fileSize,
      status: d.status,
      rejectionReason: d.rejectionReason,
      createdAt: d.createdAt.toISOString(),
    })),
    payments: (order.payments ?? []).map((p) => ({
      id: p.id,
      amount: p.amount,
      status: p.status,
      provider: p.provider,
      paidAt: p.paidAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
    })),
    statusHistory: (order.statusHistory ?? []).map((h) => ({
      id: h.id,
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      changedBy: h.changedBy,
      comment: h.comment,
      createdAt: h.createdAt.toISOString(),
    })),
    permits: (order.permits ?? []).map((p) => ({
      id: p.id,
      permitNumber: p.permitNumber,
      zone: p.zone,
      status: p.status,
      validFrom: p.validFrom,
      validUntil: p.validUntil,
    })),
  };

  const serializedManagers = managers
    .filter((m) => m.role === "manager")
    .map((m) => ({ id: m.id, name: m.name ?? m.email }));

  return (
    <OrderDetailClient
      order={serializedOrder}
      managers={serializedManagers}
    />
  );
}
