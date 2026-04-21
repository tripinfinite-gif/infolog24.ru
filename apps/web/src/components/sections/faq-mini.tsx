import { ArrowRight, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FaqMiniItem {
  question: string;
  answer: string;
}

interface FaqMiniProps {
  items: FaqMiniItem[];
  className?: string;
}

export function FaqMini({ items, className }: FaqMiniProps) {
  return (
    <section className={cn("relative mx-auto w-full max-w-7xl", className)}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="eyebrow">faq · essentials</span>
          <h2 className="section-title mt-6 text-foreground">
            Частые{" "}
            <span className="display-italic gradient-text">вопросы</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Вопросы, которые задают перед заказом. Если ответа нет —
            напишите, отвечаем за 5 минут.
          </p>

          <div className="glass mt-8 rounded-2xl p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-foreground/5 text-[var(--cyan)] ring-1 ring-border/80">
              <MessageCircle className="size-5" />
            </div>
            <h3 className="mt-3 text-base font-bold text-foreground">
              Не нашли ответ?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Смотрите все вопросы или напишите нам — ответим за 5 минут.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/faq">
                  Все вопросы
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="#zayavka">Задать свой</Link>
              </Button>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="glass rounded-2xl border-0 px-5 transition-all data-[state=open]:ring-neon-cyan"
            >
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--violet)]/15 text-[var(--violet)]">
                    <HelpCircle className="size-3.5" />
                  </span>
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-9 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
