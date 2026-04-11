import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";

import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { createChatTools } from "@/lib/chat/tools";
import {
  checkChatRateLimitAsync,
  getClientIp,
} from "@/lib/chat/rate-limit";
import {
  MAX_INPUT_LENGTH,
  estimateCostUsd,
  estimateTokens,
  sanitizeUserInput,
} from "@/lib/chat/security";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { chatConversations, chatMessages } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const MAX_OUTPUT_TOKENS = 1000;
const MAX_HISTORY = 20;

function extractUserText(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { type: "text"; text: string }).text)
    .join(" ");
}

async function ensureConversation(
  conversationId: string | null,
  userId: string | null,
): Promise<string | null> {
  try {
    if (conversationId) return conversationId;
    const [created] = await db
      .insert(chatConversations)
      .values({
        userId,
        source: "web",
        status: "active",
      })
      .returning({ id: chatConversations.id });
    return created?.id ?? null;
  } catch (error) {
    logger.warn({ error }, "Failed to create chat conversation");
    return null;
  }
}

async function saveUserMessage(
  conversationId: string | null,
  content: string,
  tokenCount: number,
): Promise<void> {
  if (!conversationId || !content) return;
  try {
    await db.insert(chatMessages).values({
      conversationId,
      role: "user",
      content,
      tokenCount,
    });
  } catch (error) {
    logger.warn({ error }, "Failed to persist user message");
  }
}

async function saveAssistantMessage(
  conversationId: string | null,
  content: string,
  tokenCount: number,
): Promise<void> {
  if (!conversationId || !content) return;
  try {
    await db.insert(chatMessages).values({
      conversationId,
      role: "assistant",
      content,
      tokenCount,
    });
  } catch (error) {
    logger.warn({ error }, "Failed to persist assistant message");
  }
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    logger.warn("OPENAI_API_KEY not configured — chat is disabled");
    return new Response(
      JSON.stringify({
        error:
          "AI-ассистент временно недоступен. Пожалуйста, свяжитесь с менеджером: +7 (495) XXX-XX-XX.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const session = await getSession();
    const userId = session?.user?.id ?? null;
    const ip = getClientIp(req);

    const rl = await checkChatRateLimitAsync({ userId, ip });
    if (!rl.allowed) {
      const message =
        rl.reason === "day"
          ? "Достигнут дневной лимит запросов. Попробуйте завтра или свяжитесь с менеджером."
          : "Слишком много запросов. Попробуйте через минуту.";
      return new Response(JSON.stringify({ error: message }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as {
      messages: UIMessage[];
      conversationId?: string;
    };
    const messages = body.messages;
    const initialConversationId = body.conversationId ?? null;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Сообщения не переданы." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const recentMessages = messages.slice(-MAX_HISTORY);

    // Sanitize input and detect prompt-injection attempts
    let blockedInjection = false;
    const sanitizedMessages = recentMessages.map((msg) => {
      if (msg.role !== "user" || !msg.parts) return msg;
      return {
        ...msg,
        parts: msg.parts.map((part) => {
          if (part.type !== "text") return part;
          const { sanitized, suspicious, truncated } = sanitizeUserInput(
            part.text,
          );
          if (suspicious) blockedInjection = true;
          if (truncated) {
            logger.info(
              { userId, ip, length: part.text.length },
              "Chat input truncated",
            );
          }
          return { ...part, text: sanitized };
        }),
      };
    });

    if (blockedInjection) {
      logger.warn({ userId, ip }, "Chat input flagged for prompt injection");
      return new Response(
        JSON.stringify({
          error:
            "Сообщение содержит запрещённые инструкции. Перефразируйте запрос или свяжитесь с менеджером.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const lastUserMessage = [...sanitizedMessages]
      .reverse()
      .find((m) => m.role === "user");
    const lastUserText = lastUserMessage ? extractUserText(lastUserMessage) : "";

    if (lastUserText.length > MAX_INPUT_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `Сообщение слишком длинное. Максимум ${MAX_INPUT_LENGTH} символов.`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const conversationId = await ensureConversation(
      initialConversationId,
      userId,
    );

    const estimatedInputTokens = estimateTokens(
      sanitizedMessages.map((m) => extractUserText(m)).join(" "),
    );
    await saveUserMessage(conversationId, lastUserText, estimatedInputTokens);

    const modelMessages = await convertToModelMessages(sanitizedMessages);
    const tools = createChatTools({ userId });

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(3),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      onFinish: async ({ text, usage }) => {
        const outTokens = usage?.outputTokens ?? estimateTokens(text ?? "");
        const inTokens = usage?.inputTokens ?? estimatedInputTokens;
        const costUsd = estimateCostUsd(inTokens, outTokens);

        logger.info(
          {
            conversationId,
            userId,
            inputTokens: inTokens,
            outputTokens: outTokens,
            costUsd,
          },
          "Chat completion",
        );

        await saveAssistantMessage(conversationId, text ?? "", outTokens);
      },
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
