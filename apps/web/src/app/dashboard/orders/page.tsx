import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getOrdersByUser } from "@/lib/dal/orders";
import { OrdersList } from "./_components/orders-list";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Заявки",
};

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

async function OrdersContent({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const status = params.status as
    | "draft"
    | "documents_pending"
    | "payment_pending"
    | "processing"
    | "submitted"
    | "approved"
    | "rejected"
    | "cancelled"
    | undefined;

  const result = await getOrdersByUser(session.user.id, {
    page,
    pageSize: 10,
    status: status ?? undefined,
  });

  return (
    <OrdersList
      orders={result.data}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      totalPages={result.totalPages}
      currentStatus={status}
    />
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function OrdersPage(props: Props) {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent {...props} />
    </Suspense>
  );
}
