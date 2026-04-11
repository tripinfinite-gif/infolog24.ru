import { getAdminAuditLog } from "@/lib/dal/admin";
import { AuditListClient } from "./_components/audit-list-client";

interface AuditPageProps {
  searchParams: Promise<{
    page?: string;
    action?: string;
    userId?: string;
  }>;
}

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const action = params.action ?? undefined;
  const userId = params.userId ?? undefined;

  const result = await getAdminAuditLog({ page, pageSize: 50, action, userId });

  const serializedEntries = result.data.map((entry) => ({
    id: entry.id,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    details: entry.details as string | null,
    ipAddress: entry.ipAddress,
    createdAt: entry.createdAt.toISOString(),
    userName: entry.user?.name ?? entry.user?.email ?? "---",
    userId: entry.userId,
  }));

  return (
    <AuditListClient
      entries={serializedEntries}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      filterOptions={result.filterOptions}
      currentAction={action ?? ""}
      currentUserId={userId ?? ""}
    />
  );
}
