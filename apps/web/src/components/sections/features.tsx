import type { ElementType } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Feature {
  icon: ElementType;
  title: string;
  description: string;
}

interface FeaturesProps {
  features: Feature[];
  className?: string;
}

export function Features({ features, className }: FeaturesProps) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-border/50 transition-shadow hover:shadow-md"
              >
                <CardContent className="flex flex-col items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
