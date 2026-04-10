import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";
import type { NewVehicle, Vehicle } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function createVehicle(
  userId: string,
  data: Omit<NewVehicle, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Vehicle> {
  const [vehicle] = await db
    .insert(vehicles)
    .values({ ...data, userId })
    .returning();

  if (!vehicle) throw new Error("Failed to create vehicle");

  logger.info({ vehicleId: vehicle.id, userId }, "Vehicle created");
  return vehicle;
}

export async function getVehiclesByUser(userId: string): Promise<Vehicle[]> {
  return db.query.vehicles.findMany({
    where: eq(vehicles.userId, userId),
  });
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const vehicle = await db.query.vehicles.findFirst({
    where: eq(vehicles.id, id),
  });
  return vehicle ?? null;
}

export async function updateVehicle(
  id: string,
  data: Partial<Omit<NewVehicle, "id" | "userId" | "createdAt" | "updatedAt">>,
): Promise<Vehicle> {
  const [updated] = await db
    .update(vehicles)
    .set(data)
    .where(eq(vehicles.id, id))
    .returning();

  if (!updated) throw new Error("Vehicle not found");

  logger.info({ vehicleId: id }, "Vehicle updated");
  return updated;
}

export async function deleteVehicle(id: string): Promise<void> {
  const result = await db
    .delete(vehicles)
    .where(eq(vehicles.id, id))
    .returning({ id: vehicles.id });

  if (result.length === 0) throw new Error("Vehicle not found");

  logger.info({ vehicleId: id }, "Vehicle deleted");
}
