import { getAdminClients } from "@/lib/dal/admin";
import { ClientsListClient } from "./_components/clients-list-client";

interface ClientsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tier?: string;
  }>;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const search = params.search ?? undefined;
  const tierFilter = params.tier ?? undefined;

  // Тиры считаются на стороне DAL по выручке клиента — без отдельного
  // SQL-фильтра. Чтобы не ломать пагинацию по `users`, фильтруем уже после
  // сборки агрегатов на странице.
  const result = await getAdminClients({ page, pageSize: 20, search });

  const filteredData = tierFilter
    ? result.data.filter((c) => c.tier.tier === tierFilter)
    : result.data;

  const serializedClients = filteredData.map((c) => ({
    id: c.id,
    name: c.name ?? c.email,
    email: c.email,
    phone: c.phone ?? "---",
    company: c.company ?? "---",
    inn: c.inn ?? "---",
    orderCount: c.orderCount,
    totalRevenue: c.totalRevenue,
    createdAt: c.createdAt.toISOString(),
    tier: c.tier.tier,
    tierLabel: c.tier.label,
    lastOrderAt: c.lastOrderAt ? c.lastOrderAt.toISOString() : null,
    lastLoginAt: c.lastLoginAt ? c.lastLoginAt.toISOString() : null,
  }));

  return (
    <ClientsListClient
      clients={serializedClients}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      currentSearch={search ?? ""}
      currentTier={tierFilter ?? ""}
    />
  );
}
