import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

// Наши таблицы во множественном числе (users / sessions / accounts /
// verifications / two_factors). Better Auth внутри ищет модели как
// по дефолтным singular именам, так и по кастомным modelName, в
// зависимости от пути кода. Передаём оба варианта ключей в schema
// объекте, чтобы попасть в любой lookup.
const drizzleSchema = {
  user: schema.users,
  users: schema.users,
  session: schema.sessions,
  sessions: schema.sessions,
  account: schema.accounts,
  accounts: schema.accounts,
  verification: schema.verifications,
  verifications: schema.verifications,
  twoFactor: schema.twoFactors,
  two_factors: schema.twoFactors,
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: drizzleSchema,
  }),
  user: {
    modelName: "users",
    // Кастомные колонки в users, которые мы хотим видеть в session.user.
    // Без этого Better Auth не читает их и role у партнёра в session
    // остаётся undefined → verifyPartnerRoleAction отвечает «не партнёр».
    additionalFields: {
      role: { type: "string", input: false },
      phone: { type: "string", input: false },
      company: { type: "string", input: false },
      inn: { type: "string", input: false },
    },
  },
  session: {
    modelName: "sessions",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  account: { modelName: "accounts" },
  verification: { modelName: "verifications" },
  emailAndPassword: {
    enabled: true,
    // Тестовый режим: email/SMS подтверждение пока не подключаем —
    // подключим позже отдельной задачей. Аккаунт активен сразу.
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  // twoFactor plugin отключён: для его работы в users нужна колонка
  // twoFactorEnabled, которой пока нет в schema.ts. Подключим вместе
  // с миграцией, когда дойдём до 2FA. На текущем этапе тестового режима
  // он не нужен — таблица two_factors остаётся пустой.
  plugins: [],
  // Наши id-колонки имеют тип uuid с DEFAULT gen_random_uuid().
  // Better Auth по умолчанию генерирует id как nanoid-строку, что
  // ломает PostgreSQL ("invalid input syntax for type uuid"). Переопределяем
  // генерацию через crypto.randomUUID() — стандартный UUID v4.
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});

export type Session = typeof auth.$Infer.Session;
