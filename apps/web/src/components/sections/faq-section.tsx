"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <section
      className={cn(
        "bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24",
        className
      )}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground sm:text-4xl">
          Частые вопросы
        </h2>

        {/* Search */}
        <div className="relative mt-8">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Найти вопрос..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="mt-8">
          {filteredItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredItems.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            По вашему запросу ничего не найдено. Попробуйте другие ключевые слова.
          </p>
        )}
      </div>
    </section>
  );
}
