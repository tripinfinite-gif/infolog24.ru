import { type NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { isVoiceEnabled, recognizeSpeech } from "@/lib/chat/voice";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
const MAX_AUDIO = 4 * 1024 * 1024; // 4 MB

export async function POST(req: NextRequest) {
  if (!isVoiceEnabled()) {
    return NextResponse.json(
      {
        enabled: false,
        message: "Голосовой режим временно недоступен.",
      },
      { status: 503 },
    );
  }
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("audio");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }
    if (file.size > MAX_AUDIO) {
      return NextResponse.json({ error: "Аудио больше 4 MB" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await recognizeSpeech(buffer, "oggopus");
    return NextResponse.json({ enabled: true, text: result.text });
  } catch (error) {
    logger.error({ error }, "STT endpoint failed");
    return NextResponse.json({ error: "Не удалось распознать речь" }, { status: 500 });
  }
}
