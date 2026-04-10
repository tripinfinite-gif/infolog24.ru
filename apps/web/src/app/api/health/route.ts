import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: "pending",
      redis: "pending",
    },
  };

  // TODO: Add actual DB and Redis checks when configured

  return NextResponse.json(checks);
}
