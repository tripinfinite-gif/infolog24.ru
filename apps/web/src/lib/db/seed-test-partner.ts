/**
 * Сидер тестового партнёра для проверки партнёрского кабинета.
 *
 * Создаёт пользователя через `auth.api.signUpEmail()` (правильный
 * scrypt-хеш Better Auth — простым SHA-256 в общем seed.ts войти нельзя)
 * и доводит его до полноценного партнёра:
 *
 *   1) signUp.email → юзер + accounts.password (хеш Better Auth)
 *   2) UPDATE users SET role='partner', phone, company, inn
 *   3) ensurePartnerReferralCode → запись в partner_referrals
 *
 * Скрипт идемпотентен: при повторном запуске находит существующего
 * партнёра по email и обновляет поля, не создавая дубликат.
 *
 * Запуск:
 *   pnpm --filter @infolog24/web db:seed:partner
 *
 * Credentials, которые он выпускает:
 *   email:    partner@infolog24.ru
 *   password: PartnerTest123!
 *   логин на /partner/login
 */
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ensurePartnerReferralCode } from "@/lib/dal/partners";

const TEST_PARTNER = {
  email: "partner@infolog24.ru",
  password: "PartnerTest123!",
  name: "Иван Тестов",
  phone: "+79161234567",
  company: 'ООО "Тестовая партнёрская"',
  inn: "7707123456",
};

async function seedTestPartner() {
  console.log("→ Сид тестового партнёра");
  console.log(`  email:    ${TEST_PARTNER.email}`);
  console.log(`  password: ${TEST_PARTNER.password}`);

  // 1. Проверяем, существует ли уже такой пользователь
  const existing = await db.query.users.findFirst({
    where: eq(users.email, TEST_PARTNER.email),
  });

  let userId: string;

  if (existing) {
    console.log("  ✓ Пользователь уже существует, обновляем поля");
    userId = existing.id;
  } else {
    // 2. Создаём через Better Auth — он сам захеширует пароль (scrypt)
    //    и положит запись в accounts с providerId='credential'.
    const result = await auth.api.signUpEmail({
      body: {
        email: TEST_PARTNER.email,
        password: TEST_PARTNER.password,
        name: TEST_PARTNER.name,
      },
    });

    if (!result?.user?.id) {
      throw new Error("auth.api.signUpEmail вернул пустой результат");
    }

    userId = result.user.id;
    console.log(`  ✓ Создан пользователь ${userId}`);
  }

  // 3. Промотируем до партнёра + заполняем профиль
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

  console.log("  ✓ Проставлена роль partner, phone/company/inn заполнены");

  // 4. Реферальный код (создаст или вернёт существующий)
  const referralCode = await ensurePartnerReferralCode(userId);
  console.log(`  ✓ Реферальный код: ${referralCode}`);
  console.log(`  ✓ Реф. ссылка:     https://inlog24.ru/?ref=${referralCode}`);

  console.log("\n✓ Сид завершён.\nЛогин: /partner/login\n");
}

seedTestPartner()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Сид упал:", err);
    process.exit(1);
  });
