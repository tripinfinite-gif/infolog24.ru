import { ArrowRight, MessageCircle } from "lucide-react";
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

function LavenderBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[12px] font-semibold text-secondary-foreground">
      {children}
    </span>
  );
}

export function FaqMini({ items, className }: FaqMiniProps) {
  return (
    <section
      className={cn(
        "rounded-3xl bg-card p-6 sm:p-10 lg:p-14",
        className
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-3 flex justify-center">
          <LavenderBadge>
            <MessageCircle className="size-3.5" />
            FAQ
          </LavenderBadge>
        </div>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Частые вопросы
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Вопросы, которые задают перед заказом
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="border-border/30"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-secondary p-6 text-center">
        <MessageCircle className="mx-auto size-7 text-accent" />
        <h3 className="mt-3 text-base font-semibold text-foreground">
          Не нашли ответ?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Смотрите все вопросы или напишите нам — ответим за 5 минут
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/faq">
              Все вопросы
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full"
          >
            <Link href="#zayavka">Задать свой</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
