import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getVehiclesByUser } from "@/lib/dal/vehicles";
import { NewOrderForm } from "./_components/new-order-form";

export const metadata: Metadata = {
  title: "Новая заявка",
};

interface NewOrderPageProps {
  searchParams: Promise<{
    type?: string;
    vehicleId?: string;
  }>;
}

export default async function NewOrderPage({
  searchParams,
}: NewOrderPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const vehicles = await getVehiclesByUser(session.user.id);

  return (
    <NewOrderForm
      vehicles={vehicles.map((v) => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        licensePlate: v.licensePlate,
      }))}
      initialType={params.type ?? null}
      initialVehicleId={params.vehicleId ?? null}
    />
  );
}
