import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";

import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { chatTools } from "@/lib/chat/tools";
import { checkChatRateLimit } from "@/lib/chat/rate-limit";
import { logger } from "@/lib/logger";

/** Очистка пользовательского ввода от HTML-тегов и ограничение длины */
function sanitizeContent(content: string): string {
  return content.replace(/<[^>]*>/g, "").slice(0, 1000);
}

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

    const { messages } = (await req.json()) as { messages: UIMessage[] };

    // Ограничиваем историю 20 сообщениями (защита от context stuffing)
    const recentMessages = messages.slice(-20);

    // Санитизируем пользовательский ввод
    const sanitizedMessages = recentMessages.map((msg) => {
      if (msg.role === "user" && msg.parts) {
        return {
          ...msg,
          parts: msg.parts.map((part) =>
            part.type === "text"
              ? { ...part, text: sanitizeContent(part.text) }
              : part,
          ),
        };
      }
      return msg;
    });

    // Конвертируем UI-сообщения в формат модели (AI SDK v6)
    const modelMessages = await convertToModelMessages(sanitizedMessages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
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
