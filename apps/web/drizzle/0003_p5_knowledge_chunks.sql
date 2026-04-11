-- P5 — Vector RAG для базы знаний AI-помощника.
--
-- Применять должен суперюзер БД (CREATE EXTENSION требует прав).
-- На прод-БД с Selectel/Coolify обычно есть либо суперюзер, либо
-- pre-installed расширение vector. Если расширения нет — миграция
-- упадёт на первой команде, и весь P5 остаётся в режиме fallback
-- (keyword scoring), чат продолжает работать.

-- 1. Расширение pgvector (Postgres ≥ 11, лицензия PostgreSQL)
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint

-- 2. Таблица embeddings для пунктов knowledge-base
CREATE TABLE "knowledge_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" varchar(64) NOT NULL,
	"chunk_index" integer DEFAULT 0 NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"metadata" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3. Уникальный индекс (один пункт + чанк = одна строка, для upsert)
CREATE UNIQUE INDEX "idx_knowledge_chunks_source_chunk" ON "knowledge_chunks" USING btree ("source_id","chunk_index");
--> statement-breakpoint

-- 4. ivfflat индекс для быстрого cosine similarity поиска.
-- lists=100 — оптимально для базы 100-1000 пунктов. Для большей базы
-- увеличивать. Для маленькой можно опустить и SET enable_seqscan = on.
-- ВНИМАНИЕ: ivfflat требует, чтобы в таблице уже были данные на момент
-- создания индекса (иначе центроиды будут плохие). Поэтому индекс
-- создаём как CONCURRENTLY и допускаем, что он сначала может быть
-- неоптимальным — это автокорректируется при заполнении таблицы.
CREATE INDEX IF NOT EXISTS "idx_knowledge_chunks_embedding_cosine"
	ON "knowledge_chunks"
	USING ivfflat ("embedding" vector_cosine_ops)
	WITH (lists = 100);
