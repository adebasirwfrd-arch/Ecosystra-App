-- Juga tersedia dalam satu file: supabase-incremental-chat.sql (bagian A)
-- Panduan: MANUAL-SUPABASE-CHAT.md

ALTER TABLE "public"."ChatMember" ADD COLUMN IF NOT EXISTS "muted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."ChatMember" ADD COLUMN IF NOT EXISTS "blocked" BOOLEAN NOT NULL DEFAULT false;
