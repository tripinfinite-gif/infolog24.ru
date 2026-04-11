"use client";

import { Sparkles } from "lucide-react";

export interface ChatSuggestion {
  id: string;
  category: string;
  question: string;
  short: string;
}

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSelect: (suggestion: ChatSuggestion) => void;
}

/**
 * P2.2 — Smart suggestions overlay над input полем чата.
 * Появляется, пока клиент печатает, если /api/chat/suggest вернул
 * непустой список. Клик по подсказке отправляет вопрос как обычное
 * сообщение через sendMessage.
 */
export function ChatSuggestions({
  suggestions,
  onSelect,
}: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="border-t bg-muted/30 px-3 py-2">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="size-3" />
        <span>Похожие вопросы</span>
      </div>
      <div className="flex flex-col gap-1">
        {suggestions.slice(0, 3).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className="rounded-lg border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
          >
            <div className="font-medium text-foreground">{s.question}</div>
            <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {s.short}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
