import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  company: string;
  text: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "fill-accent text-accent"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function Testimonials({ testimonials, className }: TestimonialsProps) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground sm:text-4xl">
          Отзывы клиентов
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4">
                <StarRating rating={testimonial.rating} />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &laquo;{testimonial.text}&raquo;
                </p>
                <div className="mt-auto border-t pt-4">
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
