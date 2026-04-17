"use client";

import { Copy, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareCardProps {
  referralUrl: string;
}

const WHATSAPP_TEMPLATE =
  "Оформляю пропуска для грузового транспорта через Инфолог24. По моей ссылке ты получишь скидку:";
const TELEGRAM_TEMPLATE =
  "Сервис Инфолог24 оформляет пропуска в Москву. По моей ссылке — бонус на первый заказ:";

export function ShareCard({ referralUrl }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success("Ссылка скопирована");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать. Выделите текст вручную.");
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `${WHATSAPP_TEMPLATE} ${referralUrl}`,
  )}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(
    referralUrl,
  )}&text=${encodeURIComponent(TELEGRAM_TEMPLATE)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          readOnly
          value={referralUrl}
          aria-label="Ваша реферальная ссылка"
          className="font-mono text-sm"
          onFocus={(e) => e.currentTarget.select()}
        />
        <Button
          type="button"
          onClick={handleCopy}
          className="shrink-0"
          variant={copied ? "secondary" : "default"}
        >
          <Copy className="size-4" />
          {copied ? "Скопировано" : "Скопировать"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Поделиться ссылкой в WhatsApp"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline">
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Поделиться ссылкой в Telegram"
          >
            <Send className="size-4" />
            Telegram
          </a>
        </Button>
      </div>
    </div>
  );
}
