import { getDashboardStats, getRecentOrders, getManagerWorkload, getStaleOrders } from "@/lib/dal/admin";
import { AdminDashboardClient } from "./_components/admin-dashboard-client";

export default async function AdminDashboardPage() {
  const [stats, recentOrders, managerWorkload, staleOrders] =
    await Promise.all([
      getDashboardStats(),
      getRecentOrders(10),
      getManagerWorkload(),
      getStaleOrders(24),
    ]);

  // Serialize dates for client component
  const serializedOrders = recentOrders.map((o) => ({
    id: o.id,
    type: o.type,
    zone: o.zone,
    status: o.status,
    price: o.price,
    createdAt: o.createdAt.toISOString(),
    clientName: o.user?.name ?? o.user?.email ?? "---",
    managerName: o.manager?.name ?? null,
    vehiclePlate: o.vehicle?.licensePlate ?? "---",
  }));

  const serializedStale = staleOrders.map((o) => ({
    id: o.id,
    status: o.status,
    updatedAt: o.updatedAt.toISOString(),
    clientName: o.user?.name ?? o.user?.email ?? "---",
  }));

  return (
    <AdminDashboardClient
      stats={stats}
      recentOrders={serializedOrders}
      managerWorkload={managerWorkload}
      staleOrders={serializedStale}
    />
  );
}
