import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
  className?: string;
}

export function HowItWorks({ steps, className }: HowItWorksProps) {
  return (
    <section
      className={cn(
        "bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24",
        className
      )}
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground sm:text-4xl">
          Как это работает
        </h2>
        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {/* Connecting line (desktop) */}
          <div
            className="absolute top-10 right-0 left-0 hidden h-0.5 bg-border lg:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connecting line (mobile) */}
              {index < steps.length - 1 && (
                <div
                  className="absolute top-20 left-1/2 h-8 w-0.5 -translate-x-1/2 bg-border md:hidden"
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10 flex size-20 items-center justify-center rounded-full border-2 border-primary bg-background text-2xl font-bold text-primary">
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
