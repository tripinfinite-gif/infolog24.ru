import { Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  heading: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  phone?: string;
  className?: string;
}

export function CtaSection({
  heading,
  description,
  ctaText,
  ctaHref,
  phone = "+7 (495) 123-45-67",
  className,
}: CtaSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-primary px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24",
        className
      )}
    >
      <div
        className="absolute -right-24 -top-24 size-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-2 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-80"
          >
            <Phone className="size-5" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  );
}
