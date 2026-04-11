"use client";

import {
  ArrowRight,
  Bot,
  HelpCircle,
  MessageSquare,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { companyInfo } from "@/content/company";
import { faqCategories, faqItems } from "@/content/faq";

const maxUrl = companyInfo.social.find((s) => s.name === "MAX")?.url;

const categoryIcons: Record<string, string> = {
  general: "📋",
  documents: "📄",
  process: "⚙️",
  pricing: "💰",
  legal: "⚖️",
  technical: "🔧",
};

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

  const groupedItems = useMemo(() => {
    if (activeCategory || search.trim()) return null;

    const groups: Record<string, typeof faqItems> = {};
    for (const item of filteredItems) {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredItems, activeCategory, search]);

  return (
    <>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Ответы на частые вопросы
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Всё, что нужно знать о пропусках в Москву для грузового транспорта
          </p>

          {/* Search bar */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Найти вопрос... например, «какие документы нужны»"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim()) setActiveCategory(null);
              }}
              className="h-12 rounded-2xl bg-card pl-12 text-base shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-10 bg-background/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              Все ({faqItems.length})
            </Button>
            {faqCategories.map((cat) => {
              const count = faqItems.filter(
                (i) => i.category === cat.id
              ).length;
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearch("");
                  }}
                >
                  <span className="mr-1">{categoryIcons[cat.id]}</span>
                  {cat.title}
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-card p-6 sm:p-8">
          {/* Results count when searching */}
          {(search.trim() || activeCategory) && (
            <p className="mb-6 text-sm text-muted-foreground">
              {filteredItems.length === 0
                ? "Ничего не найдено. Попробуйте другие ключевые слова."
                : `Найдено вопросов: ${filteredItems.length}`}
            </p>
          )}

          {/* Grouped by category (default view) */}
          {groupedItems
            ? faqCategories.map((cat) => {
                const items = groupedItems[cat.id];
                if (!items?.length) return null;
                return (
                  <FadeIn key={cat.id}>
                    <div className="mb-10">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-2xl">
                          {categoryIcons[cat.id]}
                        </span>
                        <div>
                          <h2 className="text-lg font-bold text-foreground">
                            {cat.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <Accordion type="single" collapsible>
                        {items.map((item) => (
                          <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="text-left text-base font-medium">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="leading-relaxed text-muted-foreground">
                                {item.answer}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </FadeIn>
                );
              })
            : /* Flat list (filtered/searched) */
              filteredItems.length > 0 && (
                <Accordion type="single" collapsible>
                  {filteredItems.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left text-base font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="leading-relaxed text-muted-foreground">
                            {item.answer}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {
                              faqCategories.find((c) => c.id === item.category)
                                ?.title
                            }
                          </Badge>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

          {/* No results */}
          {filteredItems.length === 0 && (
            <div className="py-12 text-center">
              <HelpCircle className="mx-auto size-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                По вашему запросу ничего не найдено.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Попробуйте другие ключевые слова или{" "}
                <Link href="/contacts" className="text-primary underline">
                  свяжитесь с нами
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* "Не нашли ответ?" CTA */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-6 sm:p-8 lg:p-12">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
                Не нашли ответ на свой вопрос?
              </h2>
              <p className="mt-3 text-primary-foreground/70">
                Спросите нас напрямую — ответим за 5 минут в рабочее время
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border-0 bg-primary-foreground/10 shadow-none transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/20">
                    <Bot className="size-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">
                      AI-ассистент
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        window.dispatchEvent(new Event("infopilot:open"))
                      }
                      className="text-sm text-accent hover:underline"
                    >
                      Открыть чат
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 bg-primary-foreground/10 shadow-none transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/20">
                    <MessageSquare className="size-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">
                      MAX
                    </p>
                    {maxUrl && (
                      <a
                        href={maxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        Написать
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 bg-primary-foreground/10 shadow-none transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/20">
                    <Phone className="size-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">
                      Телефон
                    </p>
                    <a
                      href={`tel:${companyInfo.contacts.phoneTel}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {companyInfo.contacts.phoneFormatted}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Related Services */}
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild variant="outline">
                <Link href="/services">
                  Наши услуги
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">
                  Цены и тарифы
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/contacts">
                  Оставить заявку
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
