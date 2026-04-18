"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Bot,
  MessageCircle,
  Mic,
  Minus,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics/events";
import { parsePathnameToContext } from "@/lib/chat/page-context";
import { cn } from "@/lib/utils";

import { ChatMessages, type ChatMessageFeedback } from "./chat-messages";
import {
  ChatSuggestions,
  type ChatSuggestion,
} from "./chat-suggestions";

type ChatWidgetProps = {
  /**
   * Известно ли изначально, что юзер авторизован. Влияет только на
   * приоритет показа proactive opener — endpoint /api/chat/welcome
   * сам решит, какое приветствие отдать (анонимам — статичное).
   */
  isAuthenticated?: boolean;
};

export function ChatWidget({ isAuthenticated: _isAuthenticated = false }: ChatWidgetProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  // P4.2 — Voice push-to-talk: флаг включённости по /api/chat/voice-status,
  // isRecording — активная запись, ref'ы на MediaRecorder/stream/chunks.
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Гарантия идемпотентности: welcome загружается один раз за жизнь компонента,
  // чтобы при повторных открытиях не дёргать endpoint.
  const welcomeFetchedRef = useRef(false);
  // Analytics: трекаем открытие чата один раз за жизнь компонента (за сессию).
  const chatOpenedTrackedRef = useRef(false);
  // P4.1 — Vision OCR: флаг включённости по /api/chat/vision-status,
  // ref на скрытый input[type=file] для прикрепления фото документов,
  // isOcrLoading — активная обработка изображения на сервере.
  const [visionEnabled, setVisionEnabled] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Feedback state: messageId → "up" | "down"
  const [feedbackState, setFeedbackState] = useState<Record<string, "up" | "down">>({});

  const pathname = usePathname() ?? "/";

  // Transport пересобирается при смене маршрута, чтобы каждое сообщение
  // отправлялось со свежим clientContext (page-aware ассистент знает,
  // на какой странице сейчас клиент и какую сущность смотрит).
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { clientContext: parsePathnameToContext(pathname) },
      }),
    [pathname],
  );

  const { messages, sendMessage, setMessages, status, error } = useChat({
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

  // Analytics: первое открытие чата за сессию.
  useEffect(() => {
    if (isOpen && !chatOpenedTrackedRef.current) {
      chatOpenedTrackedRef.current = true;
      analytics.chatOpened();
    }
  }, [isOpen]);

  // Global event listener: позволяет открывать виджет из любого компонента
  // через window.dispatchEvent(new Event("infopilot:open"))
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("infopilot:open", handleOpen);
    return () => window.removeEventListener("infopilot:open", handleOpen);
  }, []);

  // P4.2 — Voice: проверяем включён ли голосовой режим на сервере.
  // Если ключей Yandex SpeechKit нет — endpoint вернёт enabled:false и кнопку
  // микрофона рендерить не будем. Делаем однократно при mount.
  useEffect(() => {
    let aborted = false;
    fetch("/api/chat/voice-status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean } | null) => {
        if (!aborted && data?.enabled) setVoiceEnabled(true);
      })
      .catch(() => {
        // Тихая деградация — микрофон просто не появится.
      });
    return () => {
      aborted = true;
    };
  }, []);

  // P4.2 — cleanup при unmount: остановить запись и снять дорожки.
  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // ignore
        }
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      mediaRecorderRef.current = null;
    };
  }, []);

  // Action card "contact_manager" handler (P1.3 + P1.4):
  // Когда клиент кликает кнопку «Связаться с менеджером» под ответом
  // ассистента, ActionCardList диспатчит CustomEvent "infopilot:contact-manager"
  // с detail = { reason, priority }. Виджет открывает чат (если закрыт)
  // и отправляет от имени пользователя сообщение, по которому ассистент
  // понимает контекст и вызывает requestCallback с нужным priority.
  useEffect(() => {
    function handleContactManager(event: Event) {
      const detail = (event as CustomEvent<{ reason?: string; priority?: "normal" | "high" }>).detail ?? {};
      const reason = detail.reason?.trim();
      const priority = detail.priority ?? "normal";

      setIsOpen(true);

      const text =
        priority === "high"
          ? `Хочу срочно связаться с менеджером${reason ? `: ${reason}` : ""}.`
          : `Свяжитесь со мной${reason ? ` по теме: ${reason}` : ""}.`;

      // Небольшая задержка, чтобы виджет успел открыться
      // и transport был готов к отправке.
      window.setTimeout(() => {
        sendMessage({ text });
      }, 50);
    }

    window.addEventListener(
      "infopilot:contact-manager",
      handleContactManager as EventListener,
    );
    return () =>
      window.removeEventListener(
        "infopilot:contact-manager",
        handleContactManager as EventListener,
      );
  }, [sendMessage]);

  // Proactive opener (P1.2): при первом открытии чата — фетч персонального
  // приветствия с /api/chat/welcome. Endpoint сам разбирается с авторизацией:
  // для авторизованных — генерирует приветствие через LLM на основе
  // данных кабинета (имя, истекающие пропуска, активные заявки), для
  // анонимов — отдаёт статичный текст. Идемпотентно — один welcome за сессию.
  useEffect(() => {
    if (!isOpen) return;
    if (welcomeFetchedRef.current) return;
    if (messages.length > 0) return;

    welcomeFetchedRef.current = true;
    const controller = new AbortController();

    fetch("/api/chat/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { message?: string } | null) => {
        const message = data?.message?.trim();
        if (!message) return;
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            role: "assistant",
            parts: [{ type: "text", text: message }],
          },
        ]);
      })
      .catch((err: unknown) => {
        if ((err as Error)?.name === "AbortError") return;
        // Молчаливо игнорируем — пользователь просто не увидит приветствие,
        // обычный поток чата продолжит работать.
      });

    return () => controller.abort();
    // Намеренно зависим только от isOpen — messages в зависимостях
    // дёрнули бы повторный фетч после первого setMessages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    setSuggestions([]);
    sendMessage({ text });
  }, [input, isStreaming, sendMessage]);

  const handleQuickAction = useCallback(
    (question: string) => {
      if (isStreaming) return;
      sendMessage({ text: question });
    },
    [isStreaming, sendMessage],
  );

  const handleFeedback = useCallback(
    (fb: ChatMessageFeedback) => {
      setFeedbackState((prev) => {
        // Toggle: повторный клик убирает оценку
        if (prev[fb.messageId] === fb.rating) {
          const next = { ...prev };
          delete next[fb.messageId];
          return next;
        }
        return { ...prev, [fb.messageId]: fb.rating };
      });
      // Отправляем на сервер (fire-and-forget)
      fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: fb.messageId,
          rating: fb.rating,
        }),
      }).catch(() => {
        // Тихая деградация — feedback не критичен
      });
    },
    [],
  );

  // P4.2 — Voice push-to-talk: начать запись при pointerdown.
  // Запрашиваем getUserMedia, подбираем поддерживаемый mimeType
  // (webm/opus приоритетно, ogg/opus как fallback), запускаем MediaRecorder.
  const startRecording = useCallback(async () => {
    if (isRecording || isStreaming) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      window.alert("Ваш браузер не поддерживает запись аудио.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      const preferredMime = "audio/webm;codecs=opus";
      const fallbackMime = "audio/ogg;codecs=opus";
      const mimeType =
        typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(preferredMime)
          ? preferredMime
          : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(fallbackMime)
            ? fallbackMime
            : undefined;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];
        const type = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks, { type });
        // Глушим все дорожки, чтобы снять индикатор микрофона у браузера.
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        if (blob.size === 0) return;
        const formData = new FormData();
        const ext = type.includes("ogg") ? "ogg" : "webm";
        formData.append("audio", blob, `voice.${ext}`);
        fetch("/api/chat/stt", { method: "POST", body: formData })
          .then((res) => (res.ok ? res.json() : null))
          .then((data: { text?: string } | null) => {
            const recognized = data?.text?.trim();
            if (recognized) {
              setInput((prev) => (prev ? `${prev} ${recognized}` : recognized));
              inputRef.current?.focus();
            }
          })
          .catch(() => {
            // Тихая деградация — пользователь просто не увидит результат.
          });
      };
      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);
    } catch {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      window.alert("Разрешите доступ к микрофону.");
    }
  }, [isRecording, isStreaming]);

  // P4.2 — Остановить запись. В onstop blob отправится в STT.
  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  }, []);

  // P4.1 — Vision feature flag fetch. Проверяем один раз при монтировании,
  // показывать ли кнопку Paperclip. Если env OPENAI_VISION_ENABLED !== "true"
  // или нет ключа OPENAI_API_KEY — кнопка в рендере скрыта полностью.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat/vision-status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean } | null) => {
        if (!cancelled) setVisionEnabled(Boolean(data?.enabled));
      })
      .catch(() => {
        // Молчаливо: кнопка просто не появится.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // P4.1 — Обработка выбранного файла: шлём в /api/chat/ocr,
  // на основе ответа формируем pre-filled текст в input, который
  // клиент правит и отправляет сам. Не вызываем sendMessage автоматически,
  // чтобы у клиента оставался контроль: он может добавить комментарий,
  // уточнить вопрос, отменить.
  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // Сбрасываем значение input сразу, чтобы повторный выбор того же
      // файла триггерил onChange (иначе браузер считает value тем же).
      e.target.value = "";
      if (!file || isOcrLoading) return;

      setIsOcrLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", "auto");

        const response = await fetch("/api/chat/ocr", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string; message?: string }
            | null;
          const errorText =
            data?.error ??
            data?.message ??
            "Не удалось распознать документ. Попробуйте ещё раз или свяжитесь с менеджером.";
          setInput(errorText);
          return;
        }

        const data = (await response.json()) as {
          enabled?: boolean;
          result?:
            | {
                documentType: "sts" | "pts" | "unknown";
                licensePlate: string | null;
                brand: string | null;
                model: string | null;
                year: number | null;
                ecoClass: string | null;
                maxWeightKg: number | null;
                confidence: "high" | "medium" | "low";
              }
            | {
                documentType: "fine_postanovlenie";
                koapArticle: string | null;
                amountRub: number | null;
                issueDate: string | null;
                postanovlenieNumber: string | null;
                confidence: "high" | "medium" | "low";
              };
        };

        const result = data.result;
        if (!result) {
          setInput(
            "Не удалось распознать документ. Попробуйте фото лучшего качества.",
          );
          return;
        }

        if (result.documentType === "fine_postanovlenie") {
          const parts: string[] = [];
          if (result.koapArticle) parts.push(`ст. ${result.koapArticle} КоАП`);
          if (result.amountRub !== null)
            parts.push(`сумма ${result.amountRub}₽`);
          if (result.issueDate) parts.push(`от ${result.issueDate}`);
          const summary =
            parts.length > 0
              ? parts.join(", ")
              : "постановление частично распознано";
          setInput(`Распознал постановление: ${summary}. Помогите обжаловать?`);
        } else if (
          result.documentType === "sts" ||
          result.documentType === "pts"
        ) {
          const docLabel = result.documentType === "sts" ? "СТС" : "ПТС";
          const parts: string[] = [];
          if (result.licensePlate) parts.push(result.licensePlate);
          if (result.brand || result.model)
            parts.push([result.brand, result.model].filter(Boolean).join(" "));
          if (result.year) parts.push(String(result.year));
          if (result.ecoClass && result.ecoClass !== "unknown")
            parts.push(`экокласс ${result.ecoClass}`);
          if (result.maxWeightKg) parts.push(`${result.maxWeightKg} кг`);
          const summary =
            parts.length > 0
              ? parts.join(", ")
              : "данные частично распознаны";
          setInput(
            `Распознал данные с ${docLabel}: ${summary}. Добавьте в кабинет?`,
          );
        } else {
          setInput(
            "Документ не распознан. Прикрепите фото лучшего качества или опишите вопрос текстом.",
          );
        }

        // Вернём фокус в input, чтобы клиент мог сразу отредактировать.
        inputRef.current?.focus();
      } catch {
        setInput(
          "Ошибка при обработке изображения. Попробуйте ещё раз или свяжитесь с менеджером.",
        );
      } finally {
        setIsOcrLoading(false);
      }
    },
    [isOcrLoading],
  );

  const handleAttachClick = useCallback(() => {
    if (isOcrLoading) return;
    fileInputRef.current?.click();
  }, [isOcrLoading]);

  // P2.2 — Smart suggestions: пока клиент печатает, debounce 250ms,
  // запрос к /api/chat/suggest. Идёт без LLM, чисто keyword search.
  useEffect(() => {
    if (!isOpen) return;
    const text = input.trim();
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const handle = window.setTimeout(() => {
      fetch(`/api/chat/suggest?q=${encodeURIComponent(text)}`, {
        signal: controller.signal,
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { suggestions?: ChatSuggestion[] } | null) => {
          if (Array.isArray(data?.suggestions)) {
            setSuggestions(data.suggestions);
          }
        })
        .catch((err: unknown) => {
          if ((err as Error)?.name !== "AbortError") {
            // Тихая деградация — пользователь просто не увидит подсказки.
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(handle);
      controller.abort();
    };
  }, [input, isOpen]);

  const handleSuggestionSelect = useCallback(
    (suggestion: ChatSuggestion) => {
      if (isStreaming) return;
      setInput("");
      setSuggestions([]);
      sendMessage({ text: suggestion.question });
    },
    [isStreaming, sendMessage],
  );

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
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl",
            "bottom-24 right-6 h-[600px] w-[400px] lg:bottom-28 lg:right-8",
            "max-sm:inset-0 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none",
            "animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out",
          )}
        >
          {/* Header — ИнфоПилот branding */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1c1c1e] to-[#2d2d30] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Bot className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#1c1c1e] bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">ИнфоПилот</p>
                <p className="flex items-center gap-1 text-[11px] text-white/60">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Онлайн · отвечу за 5 сек
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
                aria-label="Свернуть"
              >
                <Minus className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <ChatMessages
              messages={messages}
              isStreaming={isStreaming}
              onQuickAction={handleQuickAction}
              onFeedback={handleFeedback}
              feedbackState={feedbackState}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="border-t bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              Ошибка соединения. Попробуйте ещё раз.
            </div>
          )}

          {/* P2.2 — Smart suggestions поверх input */}
          <ChatSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
          />

          {/* Input area */}
          <div className="border-t bg-background/80 p-3 backdrop-blur-sm max-sm:pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Задайте вопрос о пропусках..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent/30"
              />
              {/* P4.1 — Paperclip attach для фото документов (OCR).
                  Рендерится только при visionEnabled === true. Скрытый
                  input[type=file] висит рядом и триггерится кликом. */}
              {visionEnabled && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isOcrLoading || isStreaming}
                    className="size-9 shrink-0 rounded-xl"
                    aria-label="Прикрепить фото документа"
                    title="Прикрепить фото документа"
                    onClick={handleAttachClick}
                  >
                    <Paperclip
                      className={cn(
                        "size-4",
                        isOcrLoading && "animate-pulse",
                      )}
                    />
                  </Button>
                </>
              )}
              {/* P4.2 — Voice push-to-talk. Кнопка микрофона:
                  при зажатии (pointerdown/touchstart) — запускает MediaRecorder,
                  при отпускании/уходе pointer — останавливает и отправляет
                  запись в /api/chat/stt. Результат подставляется в input.
                  Рендерится только при voiceEnabled === true. */}
              {voiceEnabled && (
                <Button
                  type="button"
                  variant={isRecording ? "default" : "outline"}
                  size="icon"
                  disabled={isStreaming}
                  className={cn(
                    "size-10 shrink-0 rounded-xl",
                    isRecording && "animate-pulse",
                  )}
                  aria-label={isRecording ? "Отпустите, чтобы отправить" : "Удерживайте, чтобы говорить"}
                  aria-pressed={isRecording}
                  title={isRecording ? "Отпустите, чтобы отправить" : "Удерживайте, чтобы говорить"}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    void startRecording();
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    stopRecording();
                  }}
                  onPointerLeave={() => {
                    if (isRecording) stopRecording();
                  }}
                  onPointerCancel={() => {
                    if (isRecording) stopRecording();
                  }}
                >
                  <Mic className="size-4" />
                </Button>
              )}
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
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                <Sparkles className="size-3" />
                ИнфоПилот AI
              </span>
              <a
                href="tel:+74991105549"
                className="text-[11px] text-muted-foreground transition-colors hover:text-accent"
              >
                +7 (499) 110-55-49
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating button — ИнфоПилот */}
      {!isOpen && (
        <div className="fixed z-40 bottom-6 right-6 lg:bottom-8 lg:right-8 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Открыть чат с ИнфоПилот"
            className="group relative flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 active:scale-95"
          >
            <MessageCircle className="size-6 transition-transform duration-200 group-hover:scale-110" />
            {/* Pulse ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" style={{ animationDuration: "3s" }} />
          </button>
        </div>
      )}
    </>
  );
}
