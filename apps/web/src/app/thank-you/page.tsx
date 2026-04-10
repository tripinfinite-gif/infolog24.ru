import { ArrowRight, CheckCircle, Clock, FileText, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Спасибо за заявку | Инфологистик-24",
  description: "Ваша заявка принята. Мы свяжемся с вами в ближайшее время.",
};

const nextSteps = [
  {
    icon: Phone,
    title: "Мы вам перезвоним",
    description: "В течение 15 минут в рабочее время наш менеджер свяжется с вами для уточнения деталей.",
  },
  {
    icon: FileText,
    title: "Подготовьте документы",
    description: "СТС, ПТС, доверенность, договор на перевозку, выписка ЕГРЮЛ/ЕГРИП — копии в виде сканов или фото.",
  },
  {
    icon: Clock,
    title: "Получите пропуск",
    description: "После проверки документов и оплаты мы подадим заявку. Среднее время оформления — 3 рабочих дня.",
  },
];

export default function ThankYouPage() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle className="mx-auto size-20 text-primary" />
        <h1 className="mt-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Спасибо за заявку!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Ваша заявка принята и уже обрабатывается. Мы свяжемся с вами в
          ближайшее время.
        </p>

        <div className="mt-12 space-y-4 text-left">
          <h2 className="text-center text-xl font-semibold text-foreground">
            Что дальше
          </h2>
          {nextSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <CardContent className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href="/">
              <ArrowRight className="mr-2 size-4" />
              На главную
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
