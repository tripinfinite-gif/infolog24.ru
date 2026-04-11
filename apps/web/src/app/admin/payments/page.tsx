import { getAdminPayments } from "@/lib/dal/admin";
import { PaymentsListClient } from "./_components/payments-list-client";

interface PaymentsPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

export default async function PaymentsPage({
  searchParams,
}: PaymentsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const status = params.status ?? undefined;

  const result = await getAdminPayments({ page, pageSize: 20, status });

  const serializedPayments = result.data.map((p) => ({
    id: p.id,
    orderId: p.orderId,
    amount: p.amount,
    status: p.status,
    provider: p.provider,
    paidAt: p.paidAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    clientName: p.user?.name ?? p.user?.email ?? "---",
    clientId: p.userId,
  }));

  return (
    <PaymentsListClient
      payments={serializedPayments}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      summary={result.summary}
      currentStatus={status ?? ""}
    />
  );
}
