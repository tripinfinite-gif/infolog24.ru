-- Chat feedback: 👍/👎 ratings on assistant messages
CREATE TYPE "public"."chat_feedback_rating" AS ENUM('up', 'down');

CREATE TABLE IF NOT EXISTS "chat_feedback" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "conversation_id" uuid REFERENCES "chat_conversations"("id") ON DELETE CASCADE,
  "message_id" varchar(128) NOT NULL,
  "rating" "chat_feedback_rating" NOT NULL,
  "user_id" uuid REFERENCES "users"("id"),
  "ip" varchar(45),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_chat_feedback_message_id" ON "chat_feedback" USING btree ("message_id");
