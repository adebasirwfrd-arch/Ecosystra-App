-- Juga tersedia dalam satu file: supabase-incremental-chat.sql (bagian B)
-- Panduan: MANUAL-SUPABASE-CHAT.md

ALTER TABLE "public"."ChatMessage" ADD COLUMN IF NOT EXISTS "editedAt" TIMESTAMP(3);
ALTER TABLE "public"."ChatMessage" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "public"."ChatMessage" ADD COLUMN IF NOT EXISTS "replyToMessageId" TEXT;
ALTER TABLE "public"."ChatMessage" ADD COLUMN IF NOT EXISTS "forwardedFromMessageId" TEXT;

CREATE INDEX IF NOT EXISTS "ChatMessage_replyToMessageId_idx" ON "public"."ChatMessage"("replyToMessageId");
CREATE INDEX IF NOT EXISTS "ChatMessage_forwardedFromMessageId_idx" ON "public"."ChatMessage"("forwardedFromMessageId");

ALTER TABLE "public"."ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_replyToMessageId_fkey";
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_replyToMessageId_fkey"
  FOREIGN KEY ("replyToMessageId") REFERENCES "public"."ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_forwardedFromMessageId_fkey";
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_forwardedFromMessageId_fkey"
  FOREIGN KEY ("forwardedFromMessageId") REFERENCES "public"."ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
