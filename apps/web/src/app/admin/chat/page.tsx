import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import {
  emptyChatAnalyticsData,
  getChatAnalyticsData,
  type ChatAnalyticsData,
} from "@/lib/dal/chat-analytics";
import { ChatDashboardClient } from "./_components/chat-dashboard-client";

export const metadata: Metadata = {
  title: "AI-чат",
};

interface ChatAdminPageProps {
  searchParams: Promise<{
    window?: string;
  }>;
}

/**
 * /admin/chat — дашборд аналитики AI-чата.
 *
 * Показывает:
 *   1. Обзор (KPI cards: сообщения за 7 дней, средняя стоимость разговора,
 *      % fallback к KB, % положительных фидбеков, конверсия в заявку).
 *   2. Топ-50 вопросов клиентов за 30 дней.
 *   3. Последние 50 fallback queries (где KB не нашёл ответа).
 *   4. Последние 50 негативных фидбеков (для разбора багов).
 *
 * Доступ: только роль `admin`. Менеджерам редиректим на /admin.
 */
export default async function ChatAdminPage({ searchParams }: ChatAdminPageProps) {
  const session = await getSession();
  // layout уже проверил admin|manager, здесь дополнительно ограничиваем admin.
  const role = session?.user
    ? ((session.user as Record<string, unknown>).role as string | undefined)
    : undefined;
  if (role !== "admin") {
    redirect("/admin");
  }

  const params = await searchParams;
  const windowDays = parseWindow(params.window);

  let data: ChatAnalyticsData;
  try {
    data = await getChatAnalyticsData(windowDays);
  } catch (error) {
    console.error("[admin/chat] failed to load analytics", error);
    data = emptyChatAnalyticsData();
  }

  return <ChatDashboardClient data={data} windowDays={windowDays} />;
}

function parseWindow(value: string | undefined): number {
  const parsed = Number(value);
  if (parsed === 7 || parsed === 30 || parsed === 90) return parsed;
  return 30;
}
