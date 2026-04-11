import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

import { getSession } from "@/lib/auth/session";
import { loadCabinetSummary } from "@/lib/chat/cabinet-summary";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const MAX_TOKENS = 250;

const ANON_GREETING =
  "Здравствуйте! Я AI-помощник Инфолог24. Помогу с пропусками в Москву (МКАД, ТТК, Садовое), штрафами, ГосЛогом, ЭТрН, УКЭП и другой регуляторикой грузоперевозок. Что подсказать?";

/**
 * Возвращает первое сообщение ассистента при открытии чата.
 * Для авторизованного клиента — персонализированное приветствие
 * с учётом текущих заявок, истекающих пропусков и т. п.
 * Для анонима — короткое статическое приветствие.
 *
 * Контракт: всегда 200 OK с JSON { message: string }, чтобы фронт
 * не разбирал коды ошибок.
 */
export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return jsonOk(ANON_GREETING);
  }

  try {
    const session = await getSession();
    const userId = session?.user?.id ?? null;

    if (!userId) {
      return jsonOk(ANON_GREETING);
    }

    const summary = await loadCabinetSummary(userId);
    if (!summary.authenticated) {
      return jsonOk(ANON_GREETING);
    }

    // Готовим компактную сводку для LLM
    const facts: string[] = [];
    if (summary.user.name) facts.push(`Имя клиента: ${summary.user.name}`);
    if (summary.user.company) facts.push(`Компания: ${summary.user.company}`);
    facts.push(`Грузовиков в кабинете: ${summary.counts.vehicles}`);
    facts.push(`Активных заявок: ${summary.counts.activeOrders}`);
    facts.push(`Действующих пропусков: ${summary.counts.activePermits}`);

    if (summary.expiringSoon.length > 0) {
      facts.push(
        `Истекают в ближайшие 30 дней (${summary.expiringSoon.length} шт.):`,
      );
      for (const p of summary.expiringSoon.slice(0, 3)) {
        facts.push(
          `  - Пропуск ${p.permitNumber} (${p.zone}) до ${p.validUntil}, осталось ${p.daysLeft} дн.`,
        );
      }
    }

    if (summary.activeOrdersPreview.length > 0) {
      facts.push("Активные заявки:");
      for (const o of summary.activeOrdersPreview.slice(0, 3)) {
        facts.push(`  - ${o.zone}, статус: ${o.status}`);
      }
    }

    const welcomePrompt = `Ты — AI-помощник «Инфолог24». Сейчас клиент открыл чат в личном кабинете. Напиши ОДНО короткое (3-5 предложений) персональное приветствие на русском, основываясь на его данных:

${facts.join("\n")}

Правила приветствия:
- Поздоровайся по имени, если оно есть.
- ЕСЛИ есть истекающие пропуска — обязательно упомяни самый ближайший с конкретной цифрой дней и предложи помочь с продлением.
- ЕСЛИ нет истекающих, но есть активные заявки — кратко скажи, что следишь за их статусом.
- ЕСЛИ ничего активного нет — тёплое приветствие и предложение помощи (новая заявка / вопросы по регуляторике).
- БЕЗ markdown, БЕЗ списков, БЕЗ заголовков.
- БЕЗ канцелярита и AI-клише («с радостью помогу!», «отличный вопрос!»).
- Тон — дружелюбный, конкретный, как опытный менеджер, который знает клиента.

Только текст приветствия, без префиксов и кавычек.`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: welcomePrompt,
      maxOutputTokens: MAX_TOKENS,
    });

    const message = (result.text ?? "").trim() || ANON_GREETING;
    logger.info({ userId, length: message.length }, "Chat welcome generated");
    return jsonOk(message);
  } catch (error) {
    logger.warn({ error }, "Chat welcome generation failed");
    return jsonOk(ANON_GREETING);
  }
}

function jsonOk(message: string) {
  return new Response(JSON.stringify({ message }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
