"use client";

import type { UIMessage } from "ai";
import {
  Bot,
  Calculator,
  Clock,
  FileText,
  MapPin,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";

import { ActionCardList } from "@/components/chat/action-card-list";
import { extractActionsFromResult } from "@/lib/chat/action-cards";
import { cn } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
        <Bot className="size-4 text-muted-foreground" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
          <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
          <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ToolResultCard({ result }: { result: unknown }) {
  if (!result || typeof result !== "object") return null;

  const data = result as Record<string, unknown>;

  // Price calculation result
  if ("total" in data && "zone" in data) {
    return (
      <div className="rounded-xl border bg-card p-3 text-sm shadow-sm">
        <div className="mb-2 font-medium text-card-foreground">
          Расчёт стоимости
        </div>
        <div className="space-y-1 text-muted-foreground">
          <div>
            Зона: <span className="text-foreground">{String(data.zone)}</span>
          </div>
          <div>
            Тип: <span className="text-foreground">{String(data.type)}</span>
          </div>
          {Number(data.vehicleCount) > 1 && (
            <div>
              Машин:{" "}
              <span className="text-foreground">
                {String(data.vehicleCount)}
              </span>
            </div>
          )}
          {typeof data.discountText === "string" && (
            <div className="text-green-600">{String(data.discountText)}</div>
          )}
          <div className="mt-2 border-t pt-2 text-base font-semibold text-foreground">
            Итого: {Number(data.total).toLocaleString("ru-RU")} руб.
          </div>
        </div>
      </div>
    );
  }

  // Callback request result
  if ("success" in data && "message" in data) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-950">
        <div className="text-green-800 dark:text-green-200">
          {String(data.message)}
        </div>
      </div>
    );
  }

  // Order status result
  if ("orderNumber" in data && "label" in data) {
    return (
      <div className="rounded-xl border bg-card p-3 text-sm shadow-sm">
        <div className="mb-2 font-medium text-card-foreground">
          Статус заявки {String(data.orderNumber)}
        </div>
        <div className="space-y-1 text-muted-foreground">
          <div>
            Статус:{" "}
            <span className="font-medium text-foreground">
              {String(data.label)}
            </span>
          </div>
          <div>{String(data.description)}</div>
          {typeof data.note === "string" && data.note && (
            <div className="mt-2 text-xs">{data.note}</div>
          )}
        </div>
      </div>
    );
  }

  // Documents list result
  if ("documents" in data && Array.isArray(data.documents)) {
    return (
      <div className="rounded-xl border bg-card p-3 text-sm shadow-sm">
        <div className="mb-2 font-medium text-card-foreground">
          Документы для {String(data.zone)} ({String(data.type)})
        </div>
        <ul className="space-y-1 text-muted-foreground">
          {(data.documents as string[]).map((doc, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-0.5 text-xs">&#8226;</span>
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Error result
  if ("error" in data && data.error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950">
        <div className="text-red-800 dark:text-red-200">
          {String(data.message ?? "Произошла ошибка")}
        </div>
      </div>
    );
  }

  return null;
}

const QUICK_ACTIONS = [
  { icon: Calculator, label: "Рассчитать стоимость", question: "Сколько стоит пропуск на МКАД?" },
  { icon: Clock, label: "Сроки оформления", question: "Сколько времени занимает оформление пропуска?" },
  { icon: FileText, label: "Какие документы нужны?", question: "Какие документы нужны для пропуска?" },
  { icon: MapPin, label: "Зоны пропусков", question: "Какие зоны пропусков бывают?" },
];

export interface ChatMessageFeedback {
  messageId: string;
  rating: "up" | "down";
}

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming: boolean;
  onQuickAction?: (question: string) => void;
  onFeedback?: (feedback: ChatMessageFeedback) => void;
  feedbackState?: Record<string, "up" | "down">;
}

export function ChatMessages({
  messages,
  isStreaming,
  onQuickAction,
  onFeedback,
  feedbackState,
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10">
          <Bot className="size-7 text-accent" />
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-foreground">
            ИнфоПилот
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Помогу с пропусками, ценами, документами и сроками
          </p>
        </div>
        {onQuickAction && (
          <div className="mt-2 grid w-full grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onQuickAction(action.question)}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-left text-xs transition-all hover:border-accent/40 hover:bg-accent/5 hover:shadow-sm"
              >
                <action.icon className="size-4 shrink-0 text-accent" />
                <span className="text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => {
        const isUser = message.role === "user";

        // Extract text from parts
        const textParts = message.parts.filter(
          (p): p is { type: "text"; text: string } => p.type === "text",
        );
        const textContent = textParts.map((p) => p.text).join("");

        // Extract tool parts
        const toolParts = message.parts.filter(
          (p) =>
            p.type !== "text" &&
            p.type !== "step-start" &&
            "state" in p &&
            p.state === "output-available",
        );

        return (
          <div key={message.id}>
            {/* Text content */}
            {textContent && (
              <div
                className={cn(
                  "flex items-start gap-2",
                  isUser && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    isUser ? "bg-primary" : "bg-muted",
                  )}
                >
                  {isUser ? (
                    <User className="size-4 text-primary-foreground" />
                  ) : (
                    <Bot className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-muted text-foreground",
                  )}
                >
                  {textContent}
                </div>
              </div>
            )}

            {/* Tool results */}
            {toolParts.map((part) => {
              const toolCallId =
                "toolCallId" in part ? String(part.toolCallId) : undefined;
              const output = "output" in part ? part.output : undefined;
              const result =
                output ??
                ("result" in part
                  ? (part as { result?: unknown }).result
                  : undefined);
              if (!toolCallId) return null;
              const actions = extractActionsFromResult(result);
              return (
                <div key={toolCallId} className="ml-9 mt-2">
                  <ToolResultCard result={result} />
                  <ActionCardList actions={actions} />
                </div>
              );
            })}

            {/* Feedback buttons for assistant messages */}
            {!isUser && textContent && !isStreaming && onFeedback && (
              <div className="ml-9 mt-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    onFeedback({ messageId: message.id, rating: "up" })
                  }
                  className={cn(
                    "rounded-md p-1 transition-colors",
                    feedbackState?.[message.id] === "up"
                      ? "text-emerald-600"
                      : "text-muted-foreground/40 hover:text-emerald-600",
                  )}
                  aria-label="Полезный ответ"
                >
                  <ThumbsUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onFeedback({ messageId: message.id, rating: "down" })
                  }
                  className={cn(
                    "rounded-md p-1 transition-colors",
                    feedbackState?.[message.id] === "down"
                      ? "text-red-500"
                      : "text-muted-foreground/40 hover:text-red-500",
                  )}
                  aria-label="Неполезный ответ"
                >
                  <ThumbsDown className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {isStreaming && <TypingIndicator />}
    </div>
  );
}
