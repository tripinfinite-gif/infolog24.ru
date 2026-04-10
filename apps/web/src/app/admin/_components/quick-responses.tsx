"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TEMPLATES = [
  "Ожидаем документы от клиента.",
  "Требуется доплата. Пожалуйста, проверьте счёт.",
  "Заявка одобрена, пропуск готов.",
  "Документы проверены, всё в порядке.",
  "Необходимо обновить доверенность.",
  "Заявка подана в ЦОДД, ожидаем решения.",
  "Заявка отклонена ЦОДД, требуется корректировка.",
  "Клиент не отвечает, повторная попытка связи.",
  "Пропуск действителен, отправлен клиенту.",
  "Возврат средств оформлен.",
];

interface QuickResponsesProps {
  onSelect: (text: string) => void;
}

export function QuickResponses({ onSelect }: QuickResponsesProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="size-4 mr-1" />
          Быстрый ответ
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        {TEMPLATES.map((template, i) => (
          <DropdownMenuItem key={i} onClick={() => onSelect(template)}>
            <span className="truncate">{template}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
