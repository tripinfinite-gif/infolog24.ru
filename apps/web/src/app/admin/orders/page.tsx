import { getAdminOrders, getManagers } from "@/lib/dal/admin";
import { OrdersListClient } from "./_components/orders-list-client";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    zone?: string;
    search?: string;
    managerId?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const status = params.status ?? undefined;
  const zone = params.zone ?? undefined;
  const search = params.search ?? undefined;
  const managerId = params.managerId ?? undefined;

  const [result, managers] = await Promise.all([
    getAdminOrders({ page, pageSize: 20, status, zone, search, managerId }),
    getManagers(),
  ]);

  const serializedOrders = result.data.map((o) => ({
    id: o.id,
    type: o.type,
    zone: o.zone,
    status: o.status,
    price: o.price,
    discount: o.discount,
    tags: o.tags,
    createdAt: o.createdAt.toISOString(),
    clientName: o.user?.name ?? o.user?.email ?? "---",
    clientCompany: o.user?.company ?? "",
    managerName: o.manager?.name ?? null,
    managerId: o.managerId,
    vehiclePlate: o.vehicle?.licensePlate ?? "---",
  }));

  const serializedManagers = managers
    .filter((m) => m.role === "manager")
    .map((m) => ({
      id: m.id,
      name: m.name ?? m.email,
    }));

  return (
    <OrdersListClient
      orders={serializedOrders}
      managers={serializedManagers}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      currentFilters={{
        status: status ?? "",
        zone: zone ?? "",
        search: search ?? "",
        managerId: managerId ?? "",
      }}
    />
  );
}
