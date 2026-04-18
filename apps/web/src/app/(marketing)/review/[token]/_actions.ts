"use server";

import { z } from "zod";

import { logger } from "@/lib/logger";
import { submitReview } from "@/lib/dal/reviews";

const schema = z.object({
  token: z.string().min(16).max(64),
  authorName: z.string().trim().min(2).max(120),
  company: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().trim().min(20).max(5000),
});

export type SubmitReviewInput = z.infer<typeof schema>;

export type SubmitReviewResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Публичный server action: приём отзыва по токену.
 * Не требует авторизации — токен это и есть авторизация.
 */
export async function submitReviewAction(
  input: SubmitReviewInput,
): Promise<SubmitReviewResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ??
        "Проверьте заполнение полей — какое-то поле введено некорректно.",
    };
  }

  try {
    const review = await submitReview(parsed.data.token, {
      authorName: parsed.data.authorName,
      company: parsed.data.company ?? null,
      rating: parsed.data.rating,
      content: parsed.data.content,
    });
    if (!review) {
      return {
        ok: false,
        error:
          "Ссылка недействительна или отзыв уже был отправлен ранее. Если это ошибка — напишите нам.",
      };
    }
    return { ok: true };
  } catch (err) {
    logger.error({ err }, "submitReviewAction failed");
    return {
      ok: false,
      error: "Не удалось сохранить отзыв. Попробуйте ещё раз через минуту.",
    };
  }
}
