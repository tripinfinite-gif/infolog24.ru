import { logger } from "@/lib/logger";

const STT_URL = "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize";
const TTS_URL = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesizeBeta";

export function isVoiceEnabled(): boolean {
  return Boolean(
    process.env.YANDEX_SPEECHKIT_API_KEY && process.env.YANDEX_SPEECHKIT_FOLDER_ID,
  );
}

export type SttResult = { text: string };

export async function recognizeSpeech(
  audioBuffer: Buffer,
  format: "oggopus" | "lpcm" = "oggopus",
  sampleRateHz?: number,
): Promise<SttResult> {
  if (!isVoiceEnabled()) {
    throw new Error("Voice not configured");
  }
  const folderId = process.env.YANDEX_SPEECHKIT_FOLDER_ID!;
  const apiKey = process.env.YANDEX_SPEECHKIT_API_KEY!;

  const params = new URLSearchParams({
    lang: "ru-RU",
    topic: "general",
    folderId,
    format,
  });
  if (format === "lpcm" && sampleRateHz) {
    params.set("sampleRateHertz", String(sampleRateHz));
  }

  const res = await fetch(`${STT_URL}?${params.toString()}`, {
    method: "POST",
    headers: {
      Authorization: `Api-Key ${apiKey}`,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(audioBuffer),
  });

  if (!res.ok) {
    const txt = await res.text();
    logger.error({ status: res.status, body: txt }, "Yandex STT failed");
    throw new Error(`STT failed: ${res.status}`);
  }
  const data = (await res.json()) as { result?: string };
  return { text: data.result ?? "" };
}

export async function synthesizeSpeech(text: string, voice = "oksana"): Promise<Buffer> {
  if (!isVoiceEnabled()) {
    throw new Error("Voice not configured");
  }
  const folderId = process.env.YANDEX_SPEECHKIT_FOLDER_ID!;
  const apiKey = process.env.YANDEX_SPEECHKIT_API_KEY!;

  const form = new URLSearchParams();
  form.set("text", text);
  form.set("lang", "ru-RU");
  form.set("voice", voice);
  form.set("format", "oggopus");
  form.set("folderId", folderId);

  const res = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Api-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const txt = await res.text();
    logger.error({ status: res.status, body: txt }, "Yandex TTS failed");
    throw new Error(`TTS failed: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
