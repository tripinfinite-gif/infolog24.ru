import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getPaymentsByUser, getPaymentStats } from "@/lib/dal/payments";
import { PaymentsList } from "./_components/payments-list";

export const metadata: Metadata = {
  title: "Оплата",
};

export default async function PaymentsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const [payments, stats] = await Promise.all([
    getPaymentsByUser(session.user.id),
    getPaymentStats(session.user.id),
  ]);

  return <PaymentsList payments={payments} stats={stats} />;
}
