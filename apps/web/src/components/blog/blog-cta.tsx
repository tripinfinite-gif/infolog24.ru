"use client";

import { useState } from "react";

import { QuickLeadModal } from "@/components/forms/quick-lead-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { companyInfo } from "@/content/company";

interface BlogCtaProps {
  articleTitle: string;
  articleSlug: string;
}

export function BlogCta({ articleTitle, articleSlug }: BlogCtaProps) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="mt-12">
      <CardContent className="p-6 sm:p-8 text-center">
        <h3 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Поможем с оформлением пропуска?
        </h3>
        <p className="mt-2 text-muted-foreground">
          Рассчитаем стоимость и оформим за 3-4 дня. Без скрытых доплат.
        </p>
        <Button size="lg" onClick={() => setOpen(true)} className="mt-6">
          Оставить заявку
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          или позвоните{" "}
          <a href={`tel:${companyInfo.contacts.phoneTel}`} className="underline hover:text-foreground">
            {companyInfo.contacts.phone}
          </a>
        </p>
      </CardContent>
      <QuickLeadModal
        open={open}
        onOpenChange={setOpen}
        title="Получить расчёт пропуска"
        description="Оставьте контакты — перезвоним в течение 5 минут с точной ценой и сроками."
        source={`blog_${articleSlug.slice(0, 80)}`}
        context={{ source_article: articleTitle.slice(0, 300) }}
        submitLabel="Получить расчёт"
      />
    </Card>
  );
}
