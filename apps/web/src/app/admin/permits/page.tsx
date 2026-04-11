import { getAdminPermits } from "@/lib/dal/admin";
import { PermitsListClient } from "./_components/permits-list-client";

export default async function PermitsPage() {
  const result = await getAdminPermits();

  const serializedPermits = result.data.map((p) => ({
    id: p.id,
    permitNumber: p.permitNumber,
    zone: p.zone,
    type: p.type,
    status: p.status,
    validFrom: p.validFrom,
    validUntil: p.validUntil,
    orderId: p.orderId,
    userId: p.userId,
    clientName: p.user?.name ?? p.user?.email ?? "---",
    vehiclePlate: p.order?.vehicle?.licensePlate ?? "---",
  }));

  return (
    <PermitsListClient
      permits={serializedPermits}
      stats={result.stats}
    />
  );
}
