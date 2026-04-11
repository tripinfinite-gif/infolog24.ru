import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // Тестовый режим: email/SMS подтверждение пока не подключаем —
    // подключим позже отдельной задачей. Аккаунт активен сразу.
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  plugins: [twoFactor()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;
