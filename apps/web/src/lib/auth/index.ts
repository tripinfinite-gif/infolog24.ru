import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
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
