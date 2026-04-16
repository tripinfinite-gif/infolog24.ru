import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { createChatTools } from "@/lib/chat/tools";
import type { ClientContext } from "@/lib/chat/types";
import { isHandoverActive } from "@/lib/dal/chat-handover";
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
import { chatAnalytics, chatConversations, chatMessages } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

/**
 * Выбор модели по env:
 * - ANTHROPIC_API_KEY → Claude Sonnet 4.6 (рекомендуется: лучший русский, длиннее контекст)
 * - OPENAI_API_KEY → gpt-4o-mini (fallback, дешевле)
 * Если оба ключа, приоритет у Anthropic.
 */
function getChatModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      model: anthropic("claude-sonnet-4-20250514"),
      provider: "anthropic" as const,
      maxOutputTokens: 1500,
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      model: openai("gpt-4o-mini"),
      provider: "openai" as const,
      maxOutputTokens: 1000,
    };
  }
  return null;
}

export const runtime = "nodejs";

const MAX_HISTORY = 20;

/**
 * Серверная санитизация ClientContext, который пришёл от чат-виджета.
 * Никогда не доверяем body как есть — клиент может прислать что угодно.
 * Жёсткие лимиты на длину и набор полей.
 */
function sanitizeClientContext(
  raw: ClientContext | undefined,
): ClientContext | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const route = typeof raw.route === "string" ? raw.route.slice(0, 256) : null;
  if (!route || !route.startsWith("/")) return undefined;

  const section =
    typeof raw.section === "string" ? raw.section.slice(0, 128) : undefined;

  const entity = (() => {
    if (!raw.entity || typeof raw.entity !== "object") return undefined;
    const e = raw.entity as { kind?: unknown; id?: unknown; slug?: unknown };
    if (typeof e.kind !== "string") return undefined;
    switch (e.kind) {
      case "order":
      case "vehicle":
      case "permit":
      case "document":
        return typeof e.id === "string" && e.id.length <= 64
          ? ({ kind: e.kind, id: e.id } as ClientContext["entity"])
          : undefined;
      case "service":
      case "blog":
        return typeof e.slug === "string" && e.slug.length <= 128
          ? ({ kind: e.kind, slug: e.slug } as ClientContext["entity"])
          : undefined;
      case "new_order_form":
      case "new_vehicle_form":
        return { kind: e.kind } as ClientContext["entity"];
      default:
        return undefined;
    }
  })();

  return { route, section, entity };
}

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
  const chatModel = getChatModel();
  if (!chatModel) {
    logger.warn("No AI API key configured (ANTHROPIC_API_KEY or OPENAI_API_KEY) — chat is disabled");
    return new Response(
      JSON.stringify({
        error:
          "AI-ассистент временно недоступен. Пожалуйста, свяжитесь с менеджером: +7 (499) 110-55-49.",
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
      clientContext?: ClientContext;
    };
    const messages = body.messages;
    const initialConversationId = body.conversationId ?? null;
    const clientContext = sanitizeClientContext(body.clientContext);

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

    // P2.5 — Manual override menedjer'om: если в этом разговоре активен
    // handover, ассистент молчит, отвечает только живой человек.
    if (conversationId) {
      const handoverActive = await isHandoverActive(conversationId);
      if (handoverActive) {
        // Сохраняем сообщение клиента для истории, но не зовём LLM.
        const inputTokens = estimateTokens(lastUserText);
        await saveUserMessage(conversationId, lastUserText, inputTokens);

        const text =
          "На связи живой менеджер — он ответит здесь же через несколько минут. Если очень срочно — звоните +7 (499) 110-55-49.";

        await saveAssistantMessage(conversationId, text, estimateTokens(text));

        // Возвращаем простой JSON, чтобы клиент мог отобразить сообщение
        // как обычный assistant message без streaming.
        return new Response(
          JSON.stringify({
            handover: true,
            message: text,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const estimatedInputTokens = estimateTokens(
      sanitizedMessages.map((m) => extractUserText(m)).join(" "),
    );
    await saveUserMessage(conversationId, lastUserText, estimatedInputTokens);

    const modelMessages = await convertToModelMessages(sanitizedMessages);
    const tools = createChatTools({ userId });

    const result = streamText({
      model: chatModel.model,
      system: buildSystemPrompt(clientContext),
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(3),
      maxOutputTokens: chatModel.maxOutputTokens,
      onFinish: async ({ text, usage, steps }) => {
        const outTokens = usage?.outputTokens ?? estimateTokens(text ?? "");
        const inTokens = usage?.inputTokens ?? estimatedInputTokens;
        const costUsd = estimateCostUsd(inTokens, outTokens);

        logger.info(
          {
            conversationId,
            userId,
            provider: chatModel.provider,
            inputTokens: inTokens,
            outputTokens: outTokens,
            costUsd,
          },
          "Chat completion",
        );

        await saveAssistantMessage(conversationId, text ?? "", outTokens);

        // --- Analytics ---
        try {
          const toolsCalled = steps
            .flatMap((s) => s.toolCalls ?? [])
            .map((tc) => tc.toolName);
          const uniqueTools = [...new Set(toolsCalled)];
          const kbFallback =
            uniqueTools.includes("searchKnowledge") &&
            !toolsCalled.some((t) => t !== "searchKnowledge");
          const convertedTo = uniqueTools.includes("createOrderDraft")
            ? "order"
            : uniqueTools.includes("requestCallback")
              ? "callback"
              : null;

          await db.insert(chatAnalytics).values({
            conversationId,
            userId,
            userQuestion: lastUserText.slice(0, 500) || null,
            provider: chatModel.provider,
            toolsCalled: uniqueTools.length > 0 ? uniqueTools.join(",") : null,
            kbFallback,
            convertedTo,
            inputTokens: inTokens,
            outputTokens: outTokens,
            costUsd: costUsd.toFixed(6),
            ip,
          });
        } catch (analyticsError) {
          logger.warn({ error: analyticsError }, "Failed to save chat analytics");
        }
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
