import { NextResponse } from "next/server";

import { isVoiceEnabled } from "@/lib/chat/voice";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ enabled: isVoiceEnabled() });
}
