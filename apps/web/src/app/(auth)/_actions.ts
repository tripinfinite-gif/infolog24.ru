"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";

import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

const completeClientProfileSchema = z.object({
  phone: z.string().min(5).max(20),
});

export type CompleteClientProfileInput = z.infer<
  typeof completeClientProfileSchema
>;

export type CompleteClientProfileResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Дополнить только что созданный аккаунт клиента телефоном.
 *
 * Better Auth сохраняет только email, password и name. Телефон у нас
 * хранится в users.phone и заполняется отдельным запросом сразу после
 * успешного authClient.signUp.email(...).
 *
 * Компания на этом этапе не запрашивается — её попросим позже,
 * при первом инициированном финансовом взаимодействии.
 */
export async function completeClientProfileAction(
  input: CompleteClientProfileInput,
): Promise<CompleteClientProfileResult> {
  let session;
  try {
    session = await requireSession();
  } catch {
    return { ok: false, error: "Сессия не найдена. Войдите и повторите." };
  }

  const parsed = completeClientProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Некорректный телефон" };
  }

  try {
    await db
      .update(users)
      .set({
        phone: parsed.data.phone,
        // На этапе регистрации роль всегда client — это страховка от того,
        // что Better Auth по какой-то причине не выставил дефолт.
        role: "client",
      })
      .where(eq(users.id, session.user.id));

    logger.info(
      { userId: session.user.id },
      "Client profile completed (phone saved)",
    );

    return { ok: true };
  } catch (err) {
    logger.error(
      { err, userId: session.user.id },
      "completeClientProfileAction failed",
    );
    return {
      ok: false,
      error: "Не удалось сохранить телефон. Зайдите в профиль и заполните вручную.",
    };
  }
}
