"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { requireRole } from "@/lib/auth/session";
import { moderateReview } from "@/lib/dal/reviews";

const schema = z.object({
  reviewId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
});

export type ModerateReviewInput = z.infer<typeof schema>;

export type ModerateReviewResult =
  | { ok: true }
  | { ok: false; error: string };

export async function moderateReviewAction(
  input: ModerateReviewInput,
): Promise<ModerateReviewResult> {
  let session;
  try {
    session = await requireRole("admin", "manager");
  } catch {
    return { ok: false, error: "Нет прав" };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Некорректные параметры" };
  }

  try {
    const status = parsed.data.action === "approve" ? "approved" : "rejected";
    const row = await moderateReview(parsed.data.reviewId, status, session.user.id);
    if (!row) return { ok: false, error: "Отзыв не найден" };

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    logger.error({ err }, "moderateReviewAction failed");
    return { ok: false, error: "Не удалось обновить отзыв" };
  }
}
