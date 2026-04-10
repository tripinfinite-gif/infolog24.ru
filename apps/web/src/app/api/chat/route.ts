import { stepCountIs, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { chatTools } from "@/lib/chat/tools";
import { checkChatRateLimit } from "@/lib/chat/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "anonymous";

    if (!checkChatRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "Слишком много запросов. Попробуйте через минуту.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages,
      tools: chatTools,
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    logger.error({ error }, "Chat API error");
    return new Response(
      JSON.stringify({ error: "Произошла ошибка. Попробуйте позже." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const runtime = "nodejs";
