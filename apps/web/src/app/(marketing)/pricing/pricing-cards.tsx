"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PricingTier } from "@/content/pricing";

interface PricingCardsProps {
  tiers: PricingTier[];
}

export function PricingCards({ tiers }: PricingCardsProps) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Тарифы на оформление пропусков
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Единая цена для всех зон. Временный пропуск — для разовых поездок.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={`${tier.zone}-${tier.type}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={`flex h-full flex-col rounded-2xl border-0 shadow-sm ${
                  tier.popular
                    ? "relative bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent px-3 py-1 text-accent-foreground">
                      Популярный
                    </Badge>
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col gap-4 p-6 sm:p-8 pt-6">
                  <div>
                    <h3 className={`text-xl font-bold ${tier.popular ? "text-primary-foreground" : "text-foreground"}`}>
                      {tier.title}
                    </h3>
                    <p className={`text-sm ${tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {tier.subtitle}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm ${tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>от</span>
                    <span className={`text-3xl font-bold ${tier.popular ? "text-accent" : "text-foreground"}`}>
                      {tier.price.toLocaleString("ru-RU")}
                    </span>
                    <span className={`text-lg ${tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {tier.priceUnit}
                    </span>
                  </div>

                  <p className={`text-sm ${tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {tier.processingDays}
                  </p>

                  <ul className="mt-2 flex-1 space-y-2.5">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-2 text-sm ${tier.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                      >
                        <Check className={`mt-0.5 size-4 shrink-0 ${tier.popular ? "text-accent" : "text-green-600"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={
                      tier.popular
                        ? "mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                        : "mt-4"
                    }
                    variant={tier.popular ? "default" : "outline"}
                  >
                    <Link href="/contacts">
                      Оформить
                      <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
