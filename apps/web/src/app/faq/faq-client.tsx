"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faqCategories, faqItems } from "@/content/faq";

export function FaqClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let items = faqItems;

    if (activeCategory) {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return items;
  }, [search, activeCategory]);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Частые вопросы
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ответы на самые популярные вопросы о пропусках в Москву
          </p>
        </div>

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

        {/* Category Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            Все
          </Button>
          {faqCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.title}
            </Button>
          ))}
        </div>

        {/* Results count */}
        <p className="mt-4 text-sm text-muted-foreground">
          {filteredItems.length === 0
            ? "Ничего не найдено"
            : `Найдено вопросов: ${filteredItems.length}`}
        </p>

        {/* Accordion */}
        <Accordion type="single" collapsible className="mt-4">
          {filteredItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-2">
                  <p>{item.answer}</p>
                  <Badge variant="secondary" className="text-xs">
                    {faqCategories.find((c) => c.id === item.category)?.title}
                  </Badge>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredItems.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            По вашему запросу ничего не найдено. Попробуйте другие ключевые
            слова или{" "}
            <a href="/contacts" className="text-primary underline">
              свяжитесь с нами
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
