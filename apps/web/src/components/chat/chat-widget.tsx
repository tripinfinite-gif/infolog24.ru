"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Minus, Send, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ChatMessages } from "./chat-messages";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage({ text });
  }, [input, isStreaming, sendMessage]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl",
            "bottom-24 right-6 h-[600px] w-[400px] lg:bottom-28 lg:right-8",
            "max-sm:inset-0 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              <div>
                <p className="text-sm font-semibold">AI-консультант</p>
                <p className="text-xs opacity-80">Инфологистик-24</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
                aria-label="Свернуть"
              >
                <Minus className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} isStreaming={isStreaming} />
          </div>

          {/* Error message */}
          {error && (
            <div className="border-t bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              Ошибка соединения. Попробуйте ещё раз.
            </div>
          )}

          {/* Input area */}
          <div className="border-t p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Задайте вопрос..."
                rows={1}
                className="flex-1 resize-none rounded-xl border bg-muted/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Button
                type="button"
                size="icon"
                disabled={!input.trim() || isStreaming}
                className="size-10 shrink-0 rounded-xl"
                aria-label="Отправить"
                onClick={handleSend}
              >
                <Send className="size-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-center">
              <a
                href="tel:+74950000000"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Связаться с менеджером: +7 (495) XXX-XX-XX
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <Button
        size="icon-lg"
        className={cn(
          "fixed z-40 size-14 rounded-full shadow-lg",
          "bottom-24 right-6 lg:bottom-28 lg:right-8",
          isOpen && "hidden",
        )}
        onClick={() => setIsOpen(true)}
        aria-label="Открыть чат с AI-консультантом"
      >
        <MessageCircle className="size-6" />
      </Button>
    </>
  );
}
