-- Реферальная программа: персональный код в таблице users.
-- Генерируется лениво при первом заходе клиента на /dashboard/referral.
-- Применить на проде вручную: psql $DATABASE_URL -f drizzle/0007_user_referral_code.sql

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referral_code" varchar(12);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_referral_code_unique'
  ) THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "users_referral_code_unique" UNIQUE ("referral_code");
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_users_referral_code"
  ON "users" USING btree ("referral_code");
