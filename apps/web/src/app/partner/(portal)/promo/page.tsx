"use client";

import { useState } from "react";
import { CheckCircle, ClipboardCopy, Code, Image as ImageIcon, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ── Data ───────────────────────────────────────────────────────────────────

const PARTNER_CODE = "P1A2B3C4";
const BASE_URL = "https://infolog24.ru";

const banners = [
  {
    id: "1",
    title: "Баннер 728x90",
    width: 728,
    height: 90,
    description: "Для размещения на сайтах (горизонтальный)",
  },
  {
    id: "2",
    title: "Баннер 300x250",
    width: 300,
    height: 250,
    description: "Для боковой панели сайта",
  },
  {
    id: "3",
    title: "Баннер 1080x1080",
    width: 1080,
    height: 1080,
    description: "Для социальных сетей (квадрат)",
  },
];

const textSnippets = [
  {
    id: "1",
    title: "Для MAX / мессенджеров",
    text: `Оформляете пропуск в Москву? Сервис Инфолог24 оформит пропуск на МКАД, ТТК или Садовое кольцо за вас — быстро и с гарантией. Работают с 2016 года.\n\nОставьте заявку: ${BASE_URL}/?ref=${PARTNER_CODE}`,
  },
  {
    id: "2",
    title: "Для email-рассылки",
    text: `Уважаемые коллеги!\n\nРекомендуем проверенный сервис по оформлению пропусков в Москву — Инфолог24. Компания берёт на себя всю работу: от подготовки документов до подачи заявки. Оформление от 3 дней.\n\nПодробности: ${BASE_URL}/?ref=${PARTNER_CODE}`,
  },
  {
    id: "3",
    title: "Короткий пост для соцсетей",
    text: `Пропуск в Москву для грузового транспорта — без очередей и отказов. Сервис Инфолог24: быстро, надёжно, с гарантией.\n\n${BASE_URL}/?ref=${PARTNER_CODE}`,
  },
];

const WIDGET_CODE = `<iframe
  src="${BASE_URL}/widget/calculator?ref=${PARTNER_CODE}"
  width="100%"
  height="400"
  frameborder="0"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
></iframe>`;

const UTM_LINKS = [
  {
    label: "MAX",
    url: `${BASE_URL}/?ref=${PARTNER_CODE}&utm_source=max&utm_medium=message&utm_campaign=partner`,
  },
  {
    label: "Email",
    url: `${BASE_URL}/?ref=${PARTNER_CODE}&utm_source=email&utm_medium=newsletter&utm_campaign=partner`,
  },
  {
    label: "Сайт",
    url: `${BASE_URL}/?ref=${PARTNER_CODE}&utm_source=website&utm_medium=banner&utm_campaign=partner`,
  },
];

// ── Component ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <CheckCircle className="size-4 text-green-600" />
          Скопировано
        </>
      ) : (
        <>
          <ClipboardCopy className="size-4" />
          Копировать
        </>
      )}
    </Button>
  );
}

export default function PromoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Промо-материалы</h1>
        <p className="text-muted-foreground">
          Готовые материалы для привлечения клиентов
        </p>
      </div>

      {/* Banners */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5" />
            <CardTitle>Баннеры</CardTitle>
          </div>
          <CardDescription>
            Скачайте баннеры для размещения на сайтах и в соцсетях
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <div key={banner.id} className="space-y-3">
                {/* Placeholder banner */}
                <div
                  className="flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-sm text-muted-foreground"
                  style={{
                    aspectRatio: `${banner.width}/${banner.height}`,
                    maxHeight: 200,
                  }}
                >
                  {banner.width}x{banner.height}
                </div>
                <div>
                  <p className="text-sm font-medium">{banner.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {banner.description}
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Скачать
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Text snippets */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            <CardTitle>Готовые тексты</CardTitle>
          </div>
          <CardDescription>
            Тексты с вашей реферальной ссылкой для рассылок и постов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {textSnippets.map((snippet) => (
              <div key={snippet.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{snippet.title}</p>
                  <CopyButton text={snippet.text} />
                </div>
                <pre className="whitespace-pre-wrap rounded-md border bg-muted p-3 text-sm">
                  {snippet.text}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Widget embed */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="size-5" />
            <CardTitle>Виджет для сайта</CardTitle>
          </div>
          <CardDescription>
            Вставьте код на свой сайт для встраиваемого калькулятора
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-end">
              <CopyButton text={WIDGET_CODE} />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border bg-muted p-3 text-sm font-mono">
              {WIDGET_CODE}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* UTM links */}
      <Card>
        <CardHeader>
          <CardTitle>Реферальные ссылки с UTM-метками</CardTitle>
          <CardDescription>
            Используйте разные ссылки для отслеживания каналов привлечения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {UTM_LINKS.map((link) => (
              <div
                key={link.label}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{link.label}</p>
                  <code className="block truncate text-xs text-muted-foreground">
                    {link.url}
                  </code>
                </div>
                <CopyButton text={link.url} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
