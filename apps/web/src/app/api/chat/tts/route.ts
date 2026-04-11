import { type NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { isVoiceEnabled, synthesizeSpeech } from "@/lib/chat/voice";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isVoiceEnabled()) {
    return new Response(JSON.stringify({ enabled: false }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
    }

    const body = (await req.json()) as { text?: string };
    const text = (body.text ?? "").trim().slice(0, 2000);
    if (!text) {
      return NextResponse.json({ error: "Пустой текст" }, { status: 400 });
    }

    const audio = await synthesizeSpeech(text);
    return new Response(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/ogg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error({ error }, "TTS endpoint failed");
    return NextResponse.json({ error: "Не удалось синтезировать речь" }, { status: 500 });
  }
}
