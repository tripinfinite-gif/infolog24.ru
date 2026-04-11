"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";

import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import * as partnersDAL from "@/lib/dal/partners";
import { logger } from "@/lib/logger";

const becomePartnerSchema = z.object({
  phone: z.string().min(5).max(20),
  company: z.string().min(1).max(255),
  inn: z
    .string()
    .regex(/^(\d{10}|\d{12})$/, "ИНН — 10 или 12 цифр"),
});

export type BecomePartnerInput = z.infer<typeof becomePartnerSchema>;

export type BecomePartnerResult =
  | { ok: true; referralCode: string }
  | { ok: false; error: string };

/**
 * Превратить свежесозданный аккаунт в партнёрский:
 * 1) Проставляет role='partner' и сохраняет phone/company/inn.
 * 2) Выпускает реферальный код (создаёт запись-заглушку в partner_referrals).
 *
 * Вызывается из клиентской формы регистрации партнёра сразу после
 * успешного authClient.signUp.email(...).
 */
export async function becomePartnerAction(
  input: BecomePartnerInput,
): Promise<BecomePartnerResult> {
  let session;
  try {
    session = await requireSession();
  } catch {
    return { ok: false, error: "Сессия не найдена. Войдите и повторите." };
  }

  const parsed = becomePartnerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Некорректные данные" };
  }

  try {
    await db
      .update(users)
      .set({
        role: "partner",
        phone: parsed.data.phone,
        company: parsed.data.company,
        inn: parsed.data.inn,
      })
      .where(eq(users.id, session.user.id));

    const referralCode = await partnersDAL.ensurePartnerReferralCode(
      session.user.id,
    );

    logger.info(
      { userId: session.user.id, referralCode },
      "User became partner",
    );

    return { ok: true, referralCode };
  } catch (err) {
    logger.error({ err, userId: session.user.id }, "becomePartnerAction failed");
    return {
      ok: false,
      error: "Не удалось оформить партнёрский аккаунт. Попробуйте позже.",
    };
  }
}

export type VerifyPartnerRoleResult = {
  ok: boolean;
  role?: string;
};

/**
 * Проверить, что текущий пользователь имеет роль 'partner'.
 * Используется на странице входа: если зашёл клиент — мы его разлогиним.
 */
export async function verifyPartnerRoleAction(): Promise<VerifyPartnerRoleResult> {
  try {
    const session = await requireSession();
    const userObj = session.user as Record<string, unknown>;
    const role = userObj.role as string | undefined;
    logger.info(
      {
        userId: session.user.id,
        email: session.user.email,
        role,
        userKeys: Object.keys(userObj),
        userObj,
      },
      "verifyPartnerRoleAction debug",
    );
    return { ok: role === "partner", role };
  } catch (err) {
    logger.error({ err }, "verifyPartnerRoleAction failed");
    return { ok: false };
  }
}
