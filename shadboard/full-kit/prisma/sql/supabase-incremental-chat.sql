-- =============================================================================
-- CHAT — migrasi INCREMENTAL untuk Supabase (aman dijalankan berulang)
-- Pakai: Dashboard → SQL Editor → New query → tempel SELURUH isi file ini → Run
--
-- Prasyarat: tabel public."ChatThread", "ChatMember", "ChatMessage" sudah ada.
--            Jika belum pernah dibuat, jalankan SATU KALI: apply-public-chat-tables.sql
--            (jangan diulang jika tabel sudah ada — akan error "already exists").
-- =============================================================================

-- --- A) ChatMember: mute / block (header chat: Mute, Block, daftar blocked) ---
ALTER TABLE "public"."ChatMember" ADD COLUMN IF NOT EXISTS "muted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."ChatMember" ADD COLUMN IF NOT EXISTS "blocked" BOOLEAN NOT NULL DEFAULT false;

-- --- B) ChatMessage: edit, soft delete, reply, forward ---
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

-- --- C) ChatThread: tautan opsional ke task (EcoItem / public."Item") ---
ALTER TABLE "public"."ChatThread" ADD COLUMN IF NOT EXISTS "ecoItemId" TEXT;
CREATE INDEX IF NOT EXISTS "ChatThread_ecoItemId_idx" ON "public"."ChatThread"("ecoItemId");
ALTER TABLE "public"."ChatThread" DROP CONSTRAINT IF EXISTS "ChatThread_ecoItemId_fkey";
ALTER TABLE "public"."ChatThread" ADD CONSTRAINT "ChatThread_ecoItemId_fkey"
  FOREIGN KEY ("ecoItemId") REFERENCES "public"."Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Selesai. Pesan "Success. No rows returned" adalah normal untuk DDL.
