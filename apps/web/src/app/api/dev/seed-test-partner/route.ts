/**
 * Временный API-эндпоинт для создания тестового партнёра.
 *
 * Используется для ручной проверки партнёрского кабинета на проде, пока
 * не настроен email/SMS поток. Идемпотентен: при повторном вызове
 * находит существующего партнёра и обновляет поля.
 *
 * Защищён hard-coded токеном (короткий срок жизни — этот роут будет
 * удалён сразу после первого использования).
 *
 *   POST /api/dev/seed-test-partner?token=infolog24-seed-2026-temp
 *
 * Возвращает JSON с email + password + referralCode.
 *
 * ⚠️ Удалить после первого успешного запуска.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ensurePartnerReferralCode } from "@/lib/dal/partners";
import { logger } from "@/lib/logger";
import { absoluteUrl } from "@/lib/utils/base-url";

const SEED_TOKEN = "infolog24-seed-2026-temp";

const TEST_PARTNER = {
  email: "partner@infolog24.ru",
  password: "PartnerTest123!",
  name: "Иван Тестов",
  phone: "+79161234567",
  company: 'ООО "Тестовая партнёрская"',
  inn: "7707123456",
} as const;

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== SEED_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, TEST_PARTNER.email),
    });

    let userId: string;
    let created = false;

    if (existing) {
      userId = existing.id;
    } else {
      const result = await auth.api.signUpEmail({
        body: {
          email: TEST_PARTNER.email,
          password: TEST_PARTNER.password,
          name: TEST_PARTNER.name,
        },
      });

      if (!result?.user?.id) {
        return NextResponse.json(
          { error: "auth.api.signUpEmail returned empty result" },
          { status: 500 },
        );
      }

      userId = result.user.id;
      created = true;
    }

    await db
      .update(users)
      .set({
        role: "partner",
        phone: TEST_PARTNER.phone,
        company: TEST_PARTNER.company,
        inn: TEST_PARTNER.inn,
        name: TEST_PARTNER.name,
        emailVerified: true,
      })
      .where(eq(users.id, userId));

    const referralCode = await ensurePartnerReferralCode(userId);

    logger.info(
      { userId, created, referralCode },
      "Test partner seeded via dev endpoint",
    );

    return NextResponse.json({
      ok: true,
      created,
      credentials: {
        email: TEST_PARTNER.email,
        password: TEST_PARTNER.password,
        loginUrl: "/partner/login",
      },
      partner: {
        userId,
        name: TEST_PARTNER.name,
        phone: TEST_PARTNER.phone,
        company: TEST_PARTNER.company,
        inn: TEST_PARTNER.inn,
        referralCode,
        referralLink: absoluteUrl(`/?ref=${referralCode}`),
      },
    });
  } catch (err) {
    logger.error({ err }, "Test partner seed failed");
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Seed failed", details: message },
      { status: 500 },
    );
  }
}
