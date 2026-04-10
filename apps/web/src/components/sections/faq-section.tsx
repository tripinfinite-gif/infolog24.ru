"use client";

import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  className?: string;
}

export function FaqSection({ items, className }: FaqSectionProps) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [items, search]);

  return (
    <div
      className={cn(
        "rounded-3xl bg-card p-6 sm:p-8 lg:p-10",
        className
      )}
    >
      <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Частые вопросы
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ответы на популярные вопросы о пропусках в Москву
      </p>

      {/* Search */}
      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Найти вопрос..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="mt-6">
        {filteredItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
            <AccordionTrigger className="text-left text-base hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filteredItems.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          По вашему запросу ничего не найдено.
        </p>
      )}

      {/* Mini CTA */}
      <div className="mt-8 rounded-2xl bg-muted/50 p-6 text-center">
        <MessageCircle className="mx-auto size-7 text-primary" />
        <h3 className="mt-3 text-base font-semibold text-foreground">
          Не нашли ответ?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Ответим на любой вопрос за 5 минут
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
          >
            <Link href="/contacts">Задать вопрос</Link>
          </Button>
          <a
            href="tel:+74951234567"
            className="text-sm font-medium text-foreground hover:underline"
          >
            +7 (495) XXX-XX-XX
          </a>
        </div>
      </div>
    </div>
  );
}
