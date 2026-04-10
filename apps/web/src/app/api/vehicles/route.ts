import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as vehiclesDAL from "@/lib/dal/vehicles";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const createVehicleSchema = z.object({
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  licensePlate: z.string().min(1).max(20),
  vin: z.string().max(17).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  ecoClass: z
    .enum(["euro0", "euro1", "euro2", "euro3", "euro4", "euro5", "euro6"])
    .optional(),
  maxWeight: z.number().int().positive().optional(),
  category: z.string().max(50).optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vehicles = await vehiclesDAL.getVehiclesByUser(session.user.id);
    return NextResponse.json(vehicles);
  } catch (error) {
    logger.error(error, "Failed to list vehicles");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createVehicleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const vehicle = await vehiclesDAL.createVehicle(
      session.user.id,
      parsed.data,
    );
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    logger.error(error, "Failed to create vehicle");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
