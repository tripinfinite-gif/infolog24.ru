import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getVehiclesByUser } from "@/lib/dal/vehicles";
import { VehiclesList } from "./_components/vehicles-list";

export const metadata: Metadata = {
  title: "Транспорт",
};

export default async function VehiclesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vehicles = await getVehiclesByUser(session.user.id);

  return <VehiclesList vehicles={vehicles} />;
}
