"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface OpenChatTriggerProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Тонкая клиентская обёртка вокруг любого UI-блока, которая по клику
 * открывает встроенный AI-чат-виджет (ChatWidget).
 *
 * Виджет слушает global event `infopilot:open` (см. chat-widget.tsx),
 * поэтому открыть его можно из любого места — в т.ч. из server components,
 * обернув свой блок в `<OpenChatTrigger>`.
 */
export function OpenChatTrigger({
  children,
  className,
  ariaLabel = "Открыть AI-ассистента",
}: OpenChatTriggerProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("infopilot:open"));
        }
      }}
      aria-label={ariaLabel}
      className={cn(
        "block w-full cursor-pointer text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {children}
    </button>
  );
}
