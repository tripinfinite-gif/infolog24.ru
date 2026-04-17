"use client";

import Link from "next/link";
import { AlertTriangle, MessageCircle, ThumbsDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ChatAnalyticsData } from "@/lib/dal/chat-analytics";
import { formatDateTime } from "../../_components/format-utils";

interface ChatDashboardClientProps {
  data: ChatAnalyticsData;
  windowDays: number;
}

const WINDOW_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 7, label: "7 дней" },
  { value: 30, label: "30 дней" },
  { value: 90, label: "90 дней" },
];

export function ChatDashboardClient({
  data,
  windowDays,
}: ChatDashboardClientProps) {
  const { overview, topQuestions, fallbackQueries, negativeFeedback, degraded } =
    data;

  const overviewCards = [
    {
      label: "Сообщения (7 дней)",
      value: formatNumber(overview.totalMessages7d),
      hint: "chat_messages за неделю",
    },
    {
      label: "Средняя стоимость разговора",
      value: formatUsd(overview.avgCostPerConversation),
      hint: "средний ∑cost_usd по conversation",
    },
    {
      label: "Fallback к KB",
      value: `${formatPercent(overview.kbFallbackRate)}%`,
      hint: "где knowledge base не нашёл ответа",
    },
    {
      label: "Положительные фидбеки",
      value: `${formatPercent(overview.positiveFeedbackRate)}%`,
      hint: `из ${overview.totalFeedback} оценок`,
    },
    {
      label: "Конверсия из чата",
      value: `${formatPercent(overview.conversionRate)}%`,
      hint: `${overview.conversionCount} заявок/callback`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <MessageCircle className="size-6 text-primary" />
            AI-чат — аналитика
          </h1>
          <p className="text-sm text-muted-foreground">
            Статистика ответов ассистента, фидбеки и пробелы в knowledge base.
          </p>
        </div>

        {/* Window filter */}
        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
          {WINDOW_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/admin/chat?window=${opt.value}`}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                windowDays === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {degraded && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">Часть данных недоступна</p>
            <p>
              Возможно, миграции таблиц chat_* не применены или БД временно
              недоступна. Проверьте логи сервера.
            </p>
          </div>
        </div>
      )}

      {/* Block 1 — Overview cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {overviewCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="mt-1 text-xs font-medium text-foreground">
                {card.label}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {card.hint}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Block 2 — Top questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Топ-50 вопросов клиентов</span>
            <Badge variant="secondary">за {windowDays} дн.</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Вопрос</TableHead>
                <TableHead className="w-20 text-center">Раз</TableHead>
                <TableHead className="w-20 text-center">% от total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topQuestions.map((q, idx) => (
                <TableRow key={`${q.question}-${idx}`}>
                  <TableCell className="text-center text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{q.question}</TableCell>
                  <TableCell className="text-center">{q.count}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {formatPercent(q.percent)}%
                  </TableCell>
                </TableRow>
              ))}
              {topQuestions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Данных пока нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Block 3 — Fallback queries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fallback queries — нужно добавить в KB</span>
            <Badge
              variant="outline"
              className="border-amber-300 bg-amber-50 text-amber-900"
            >
              {fallbackQueries.length} запросов
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Запросы, где <code>kb_fallback = true</code>. Это готовый список
            пробелов knowledge base — добавь соответствующие секции в{" "}
            <code>knowledge-base.ts</code>.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Вопрос</TableHead>
                <TableHead className="w-32">Провайдер</TableHead>
                <TableHead className="w-44">Когда</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fallbackQueries.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.question}</TableCell>
                  <TableCell>
                    {q.provider ? (
                      <Badge variant="secondary">{q.provider}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(q.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {fallbackQueries.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Нет fallback-запросов — knowledge base справляется
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Block 4 — Negative feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ThumbsDown className="size-5 text-red-500" />
              Негативные фидбеки
            </span>
            <Badge
              variant="outline"
              className="border-red-300 bg-red-50 text-red-900"
            >
              {negativeFeedback.length}
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Последние отметки 👎 за {windowDays} дней. «Вопрос» и «Ответ» —
            последние из того же разговора (messageId — строка от AI SDK, не
            связана с chat_messages напрямую).
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Вопрос</TableHead>
                <TableHead>Ответ</TableHead>
                <TableHead className="w-28">User</TableHead>
                <TableHead className="w-40">Когда</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {negativeFeedback.map((fb) => (
                <TableRow key={fb.feedbackId} className="align-top">
                  <TableCell className="max-w-sm whitespace-pre-wrap break-words text-sm">
                    {fb.question ?? (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-pre-wrap break-words text-sm text-muted-foreground">
                    {fb.answer ? (
                      truncate(fb.answer, 500)
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {fb.userId ? (
                      <span className="font-mono">{fb.userId.slice(0, 8)}</span>
                    ) : fb.ip ? (
                      <span className="font-mono">{fb.ip}</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(fb.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {negativeFeedback.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Негативных фидбеков нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n);
}

function formatUsd(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "$0.00";
  return `$${value.toFixed(4)}`;
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return value >= 10 ? value.toFixed(0) : value.toFixed(1);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}
