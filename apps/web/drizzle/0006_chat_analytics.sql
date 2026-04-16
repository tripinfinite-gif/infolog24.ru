-- Chat analytics: track questions, tool usage, conversions
CREATE TABLE IF NOT EXISTS "chat_analytics" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "conversation_id" uuid REFERENCES "chat_conversations"("id") ON DELETE CASCADE,
  "user_id" uuid REFERENCES "users"("id"),
  "user_question" varchar(500),
  "provider" varchar(32),
  "tools_called" varchar(500),
  "kb_fallback" boolean DEFAULT false,
  "converted_to" varchar(32),
  "input_tokens" integer,
  "output_tokens" integer,
  "cost_usd" varchar(16),
  "ip" varchar(45),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_chat_analytics_created_at" ON "chat_analytics" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "idx_chat_analytics_conversation_id" ON "chat_analytics" USING btree ("conversation_id");
