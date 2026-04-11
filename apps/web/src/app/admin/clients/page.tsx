import { getAdminClients } from "@/lib/dal/admin";
import { ClientsListClient } from "./_components/clients-list-client";

interface ClientsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const search = params.search ?? undefined;

  const result = await getAdminClients({ page, pageSize: 20, search });

  const serializedClients = result.data.map((c) => ({
    id: c.id,
    name: c.name ?? c.email,
    email: c.email,
    phone: c.phone ?? "---",
    company: c.company ?? "---",
    inn: c.inn ?? "---",
    orderCount: c.orderCount,
    totalRevenue: c.totalRevenue,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <ClientsListClient
      clients={serializedClients}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      currentSearch={search ?? ""}
    />
  );
}
