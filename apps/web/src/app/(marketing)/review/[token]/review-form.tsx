"use client";

import { CheckCircle2, Loader2, Star } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitReviewAction } from "./_actions";

interface ReviewFormProps {
  token: string;
}

export function ReviewForm({ token }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2
          className="mx-auto size-14 text-primary"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-heading text-2xl font-bold">
          Спасибо за отзыв!
        </h2>
        <p className="mt-3 text-muted-foreground">
          Мы отправили его на модерацию. После проверки он появится на странице{" "}
          <a href="/reviews" className="underline font-medium">
            /reviews
          </a>
          . Обычно это занимает до 24 часов.
        </p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Выберите оценку от 1 до 5 звёзд.");
      return;
    }
    if (authorName.trim().length < 2) {
      setError("Укажите имя (минимум 2 символа).");
      return;
    }
    if (content.trim().length < 20) {
      setError("Расскажите подробнее — минимум 20 символов.");
      return;
    }

    startTransition(async () => {
      const result = await submitReviewAction({
        token,
        authorName: authorName.trim(),
        company: company.trim() || undefined,
        rating,
        content: content.trim(),
      });
      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  }

  const displayRating = hover || rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border bg-card p-6 sm:p-8"
    >
      <div>
        <Label className="text-base font-medium">Ваша оценка</Label>
        <div
          className="mt-3 flex gap-1"
          role="radiogroup"
          aria-label="Оценка от 1 до 5 звёзд"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} звёзд`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Star
                className={`size-10 transition-colors ${
                  n <= displayRating
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="author-name">Ваше имя *</Label>
          <Input
            id="author-name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Алексей Иванов"
            autoComplete="name"
            maxLength={120}
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Компания (опционально)</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="ООО «ТрансЛогик»"
            autoComplete="organization"
            maxLength={200}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Как всё прошло? *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Расскажите, что понравилось, что можно было сделать лучше. Минимум 20 символов."
          rows={6}
          maxLength={5000}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {content.length}/5000 символов
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Отправляем…
          </>
        ) : (
          "Оставить отзыв"
        )}
      </Button>
    </form>
  );
}
