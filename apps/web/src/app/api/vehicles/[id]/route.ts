import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as vehiclesDAL from "@/lib/dal/vehicles";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const updateVehicleSchema = z.object({
  brand: z.string().min(1).max(100).optional(),
  model: z.string().min(1).max(100).optional(),
  licensePlate: z.string().min(1).max(20).optional(),
  vin: z.string().max(17).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  ecoClass: z
    .enum(["euro0", "euro1", "euro2", "euro3", "euro4", "euro5", "euro6"])
    .optional(),
  maxWeight: z.number().int().positive().optional(),
  category: z.string().max(50).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const vehicle = await vehiclesDAL.getVehicleById(id);

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 },
      );
    }

    if (vehicle.userId !== session.user.id) {
      const userRole = (session.user as Record<string, unknown>).role as string;
      if (!["manager", "admin"].includes(userRole)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    logger.error(error, "Failed to get vehicle");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const vehicle = await vehiclesDAL.getVehicleById(id);

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 },
      );
    }

    if (vehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateVehicleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await vehiclesDAL.updateVehicle(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    logger.error(error, "Failed to update vehicle");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const vehicle = await vehiclesDAL.getVehicleById(id);

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 },
      );
    }

    if (vehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await vehiclesDAL.deleteVehicle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error, "Failed to delete vehicle");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
