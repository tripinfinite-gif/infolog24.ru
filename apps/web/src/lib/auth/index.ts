import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

// Наши таблицы во множественном числе (users / sessions / accounts /
// verifications / two_factors). Better Auth по умолчанию ищет таблицы
// в единственном числе — без явного маппинга падает с
// "model 'user' was not found in the schema object".
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      twoFactor: schema.twoFactors,
    },
  }),
  user: { modelName: "users" },
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
  plugins: [
    twoFactor({
      schema: {
        twoFactor: { modelName: "two_factors" },
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
