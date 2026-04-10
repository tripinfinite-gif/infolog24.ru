import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-primary px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36",
        className
      )}
    >
      {/* Decorative gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-foreground/90 opacity-90"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 right-0 size-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 left-0 size-96 rounded-full bg-accent/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
          {secondaryCtaText && secondaryCtaHref && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-primary-foreground/30 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
