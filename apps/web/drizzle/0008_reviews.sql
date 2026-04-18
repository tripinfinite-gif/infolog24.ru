-- Отзывы клиентов: автосбор после выдачи пропуска + модерация в админке.
--
-- Поток:
--   1. Cron /api/cron/request-reviews находит permits, issuedAt 2–4 дня назад.
--   2. Для каждого создаётся запись reviews со status='pending' + token.
--   3. Клиенту отправляется email со ссылкой /review/{token}.
--   4. Клиент открывает ссылку, заполняет форму → запись получает имя/рейтинг/текст.
--   5. Админ в /admin/reviews approve/reject → запись появляется на /reviews.
--
-- Применять на проде вручную: psql $DATABASE_URL -f drizzle/0008_reviews.sql

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE "public"."review_status" AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid REFERENCES "orders"("id") ON DELETE SET NULL,
  "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "author_name" varchar(255) NOT NULL DEFAULT '',
  "company" varchar(255),
  "rating" integer NOT NULL DEFAULT 0,
  "content" text NOT NULL DEFAULT '',
  "status" "review_status" NOT NULL DEFAULT 'pending',
  "token" varchar(64),
  "submitted_at" timestamp with time zone,
  "moderated_by" uuid REFERENCES "users"("id"),
  "moderated_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "reviews_rating_range" CHECK ("rating" >= 0 AND "rating" <= 5)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_token_unique'
  ) THEN
    ALTER TABLE "reviews"
      ADD CONSTRAINT "reviews_token_unique" UNIQUE ("token");
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_reviews_status_created"
  ON "reviews" USING btree ("status", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_reviews_token"
  ON "reviews" USING btree ("token");

CREATE INDEX IF NOT EXISTS "idx_reviews_order_id"
  ON "reviews" USING btree ("order_id");
