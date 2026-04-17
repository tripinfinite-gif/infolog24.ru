/**
 * DAL для админ-дашборда AI-чата.
 *
 * Читает данные из таблиц chat_analytics, chat_feedback, chat_conversations,
 * chat_messages. Графически всё это показывается в /admin/chat.
 *
 * Graceful fallback: если таблиц ещё нет (миграции не применены в локальном
 * dev'е), возвращаем пустые структуры — чтобы страница не падала, а показывала
 * «Данных пока нет».
 */
import { and, count, desc, eq, gte, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  chatAnalytics,
  chatConversations,
  chatFeedback,
  chatMessages,
} from "@/lib/db/schema";

export interface ChatOverview {
  totalMessages7d: number;
  avgCostPerConversation: number; // в USD, среднее cost_usd по разговору
  kbFallbackRate: number; // 0..100, % запросов где KB не справился
  positiveFeedbackRate: number; // 0..100, % 👍 от всех оценок
  conversionRate: number; // 0..100, % запросов, приведших к converted_to != null
  conversionCount: number;
  totalFeedback: number;
}

export interface TopQuestion {
  question: string;
  count: number;
  percent: number;
}

export interface FallbackQuery {
  id: string;
  question: string;
  provider: string | null;
  createdAt: string; // ISO
}

export interface NegativeFeedback {
  feedbackId: string;
  messageId: string;
  question: string | null;
  answer: string | null;
  userId: string | null;
  ip: string | null;
  createdAt: string; // ISO
}

export interface ChatAnalyticsData {
  overview: ChatOverview;
  topQuestions: TopQuestion[];
  fallbackQueries: FallbackQuery[];
  negativeFeedback: NegativeFeedback[];
  /** true, если хотя бы один запрос упал (таблицы могут отсутствовать в dev) */
  degraded: boolean;
}

const EMPTY_OVERVIEW: ChatOverview = {
  totalMessages7d: 0,
  avgCostPerConversation: 0,
  kbFallbackRate: 0,
  positiveFeedbackRate: 0,
  conversionRate: 0,
  conversionCount: 0,
  totalFeedback: 0,
};

/**
 * Главная точка: агрегирует всю статистику для дашборда /admin/chat.
 * @param windowDays окно анализа в днях (по умолчанию 30)
 */
export async function getChatAnalyticsData(
  windowDays = 30,
): Promise<ChatAnalyticsData> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let degraded = false;

  const [
    overview,
    topQuestions,
    fallbackQueries,
    negativeFeedback,
  ] = await Promise.all([
    loadOverview(windowStart, weekStart).catch((error) => {
      console.error("[chat-analytics] overview failed", error);
      degraded = true;
      return EMPTY_OVERVIEW;
    }),
    loadTopQuestions(windowStart).catch((error) => {
      console.error("[chat-analytics] topQuestions failed", error);
      degraded = true;
      return [] as TopQuestion[];
    }),
    loadFallbackQueries(windowStart).catch((error) => {
      console.error("[chat-analytics] fallbackQueries failed", error);
      degraded = true;
      return [] as FallbackQuery[];
    }),
    loadNegativeFeedback(windowStart).catch((error) => {
      console.error("[chat-analytics] negativeFeedback failed", error);
      degraded = true;
      return [] as NegativeFeedback[];
    }),
  ]);

  return {
    overview,
    topQuestions,
    fallbackQueries,
    negativeFeedback,
    degraded,
  };
}

/**
 * Блок 1 — Обзор.
 *
 * - totalMessages7d: COUNT chat_messages за последние 7 дней.
 * - avgCostPerConversation: для каждого conversation_id суммируем cost_usd,
 *   усредняем по разговорам (cost_usd хранится строкой, парсим).
 * - kbFallbackRate: % строк chat_analytics, где kb_fallback = true.
 * - positiveFeedbackRate: % rating='up' от всех оценок.
 * - conversionRate: % строк chat_analytics, где converted_to IS NOT NULL.
 */
async function loadOverview(
  windowStart: Date,
  weekStart: Date,
): Promise<ChatOverview> {
  const [messagesRow] = await db
    .select({ c: count() })
    .from(chatMessages)
    .where(gte(chatMessages.createdAt, weekStart));

  const [analyticsAggregate] = await db
    .select({
      total: count(),
      fallbackCount: sql<number>`SUM(CASE WHEN ${chatAnalytics.kbFallback} = true THEN 1 ELSE 0 END)`,
      convertedCount: sql<number>`SUM(CASE WHEN ${chatAnalytics.convertedTo} IS NOT NULL THEN 1 ELSE 0 END)`,
    })
    .from(chatAnalytics)
    .where(gte(chatAnalytics.createdAt, windowStart));

  // Средняя стоимость на разговор: сначала сумма costUsd в рамках conversation_id,
  // затем среднее по этим суммам.
  const perConversation = await db
    .select({
      conversationId: chatAnalytics.conversationId,
      sumCost: sql<string>`COALESCE(SUM(CAST(NULLIF(${chatAnalytics.costUsd}, '') AS NUMERIC)), 0)`,
    })
    .from(chatAnalytics)
    .where(
      and(
        gte(chatAnalytics.createdAt, windowStart),
        isNotNull(chatAnalytics.conversationId),
      ),
    )
    .groupBy(chatAnalytics.conversationId);

  const convCount = perConversation.length;
  const totalCost = perConversation.reduce(
    (acc, row) => acc + Number(row.sumCost ?? 0),
    0,
  );
  const avgCostPerConversation = convCount > 0 ? totalCost / convCount : 0;

  const [feedbackAggregate] = await db
    .select({
      total: count(),
      upCount: sql<number>`SUM(CASE WHEN ${chatFeedback.rating} = 'up' THEN 1 ELSE 0 END)`,
    })
    .from(chatFeedback)
    .where(gte(chatFeedback.createdAt, windowStart));

  const total = Number(analyticsAggregate?.total ?? 0);
  const fallbackCount = Number(analyticsAggregate?.fallbackCount ?? 0);
  const convertedCount = Number(analyticsAggregate?.convertedCount ?? 0);
  const totalFeedback = Number(feedbackAggregate?.total ?? 0);
  const upCount = Number(feedbackAggregate?.upCount ?? 0);

  return {
    totalMessages7d: Number(messagesRow?.c ?? 0),
    avgCostPerConversation,
    kbFallbackRate: total > 0 ? (fallbackCount / total) * 100 : 0,
    positiveFeedbackRate:
      totalFeedback > 0 ? (upCount / totalFeedback) * 100 : 0,
    conversionRate: total > 0 ? (convertedCount / total) * 100 : 0,
    conversionCount: convertedCount,
    totalFeedback,
  };
}

/**
 * Блок 2 — топ вопросов.
 *
 * GROUP BY user_question с COUNT. Только непустые вопросы, сортировка по
 * количеству, top-50.
 */
async function loadTopQuestions(windowStart: Date): Promise<TopQuestion[]> {
  const rows = await db
    .select({
      question: chatAnalytics.userQuestion,
      c: count(),
    })
    .from(chatAnalytics)
    .where(
      and(
        gte(chatAnalytics.createdAt, windowStart),
        isNotNull(chatAnalytics.userQuestion),
      ),
    )
    .groupBy(chatAnalytics.userQuestion)
    .orderBy(desc(count()))
    .limit(50);

  const total = rows.reduce((acc, r) => acc + Number(r.c), 0);
  return rows
    .filter((r) => r.question !== null)
    .map((r) => ({
      question: r.question as string,
      count: Number(r.c),
      percent: total > 0 ? (Number(r.c) / total) * 100 : 0,
    }));
}

/**
 * Блок 3 — fallback queries.
 *
 * kb_fallback = true значит searchKnowledge() не нашёл релевантного контента.
 * Это прямой сигнал куда расширять knowledge-base.ts.
 */
async function loadFallbackQueries(
  windowStart: Date,
): Promise<FallbackQuery[]> {
  const rows = await db
    .select({
      id: chatAnalytics.id,
      question: chatAnalytics.userQuestion,
      provider: chatAnalytics.provider,
      createdAt: chatAnalytics.createdAt,
    })
    .from(chatAnalytics)
    .where(
      and(
        gte(chatAnalytics.createdAt, windowStart),
        eq(chatAnalytics.kbFallback, true),
        isNotNull(chatAnalytics.userQuestion),
      ),
    )
    .orderBy(desc(chatAnalytics.createdAt))
    .limit(50);

  return rows.map((r) => ({
    id: r.id,
    question: r.question ?? "",
    provider: r.provider,
    createdAt: r.createdAt.toISOString(),
  }));
}

/**
 * Блок 4 — негативные фидбеки (👎).
 *
 * messageId в chat_feedback это varchar(128) — ID сообщения от AI SDK, не uuid
 * chat_messages.id. Поэтому напрямую JOIN по PK невозможен. В качестве «вопроса»
 * берём последний user_question из chat_analytics того же conversation_id,
 * «ответ» — последнее assistant chat_messages до момента feedback'а.
 */
async function loadNegativeFeedback(
  windowStart: Date,
): Promise<NegativeFeedback[]> {
  const feedbackRows = await db
    .select({
      id: chatFeedback.id,
      messageId: chatFeedback.messageId,
      conversationId: chatFeedback.conversationId,
      userId: chatFeedback.userId,
      ip: chatFeedback.ip,
      createdAt: chatFeedback.createdAt,
    })
    .from(chatFeedback)
    .where(
      and(
        gte(chatFeedback.createdAt, windowStart),
        eq(chatFeedback.rating, "down"),
      ),
    )
    .orderBy(desc(chatFeedback.createdAt))
    .limit(50);

  if (feedbackRows.length === 0) return [];

  // Для каждого фидбека подтягиваем ближайшие question/answer по conversationId.
  const enriched = await Promise.all(
    feedbackRows.map(async (fb) => {
      let question: string | null = null;
      let answer: string | null = null;

      if (fb.conversationId) {
        const [lastQuestion] = await db
          .select({ q: chatAnalytics.userQuestion })
          .from(chatAnalytics)
          .where(
            and(
              eq(chatAnalytics.conversationId, fb.conversationId),
              isNotNull(chatAnalytics.userQuestion),
            ),
          )
          .orderBy(desc(chatAnalytics.createdAt))
          .limit(1);
        question = lastQuestion?.q ?? null;

        const [lastAssistant] = await db
          .select({ content: chatMessages.content })
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.conversationId, fb.conversationId),
              eq(chatMessages.role, "assistant"),
            ),
          )
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);
        answer = lastAssistant?.content ?? null;
      }

      return {
        feedbackId: fb.id,
        messageId: fb.messageId,
        question,
        answer,
        userId: fb.userId,
        ip: fb.ip,
        createdAt: fb.createdAt.toISOString(),
      };
    }),
  );

  return enriched;
}

/**
 * Возвращает «пустой» граф для случая, когда данных нет совсем.
 * Используется не напрямую, а через getChatAnalyticsData (catch-блоки).
 */
export function emptyChatAnalyticsData(): ChatAnalyticsData {
  return {
    overview: EMPTY_OVERVIEW,
    topQuestions: [],
    fallbackQueries: [],
    negativeFeedback: [],
    degraded: true,
  };
}
