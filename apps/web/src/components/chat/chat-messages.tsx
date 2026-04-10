"use client";

import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";

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

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming: boolean;
}

export function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Bot className="size-6 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">AI-консультант</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Задайте вопрос о пропусках, ценах, документах или сроках
            оформления.
          </p>
        </div>
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
              if (!toolCallId) return null;
              return (
                <div key={toolCallId} className="ml-9 mt-2">
                  <ToolResultCard result={output} />
                </div>
              );
            })}
          </div>
        );
      })}

      {isStreaming && <TypingIndicator />}
    </div>
  );
}
