-- Verifikasi: Covering (INCLUDE), Partial (WHERE), Materialized View
-- Jalankan di Supabase SQL Editor (hasil: baris bukti; tanpa error = OK).
--
-- PEMETAAN ke contoh umum:
-- | Teknik              | Contoh slide (generik)              | Ecosystra (public) |
-- |---------------------|-------------------------------------|----------------------|
-- | Covering + INCLUDE  | tasks(board_id) INCLUDE (name,status) | "Item"("boardId"/"groupId") INCLUDE ("name","dynamicData",...) — status board ada di JSON dynamicData, bukan kolom terpisah |
-- | Partial index       | incidents WHERE status = 'open'   | "Item" WHERE "parentItemId" IS NULL; "TaskAssigneeInvite" WHERE status='PENDING'; "Notification" WHERE "isRead" = false |
-- | Materialized view   | dashboard HSE agregat             | "BoardTaskRollup" — agregat count per boardId (opsional jika masih dipakai) |
-- | Summary table + trg | accounting-style incremental      | "BoardTaskSummary" — delta counter via trigger pada "Item" |

-- 1) Indeks kita (semua yang diawali ecosystra_ + MV unique; termasuk GIN / expression setelah migrasi jsonb)
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND (
    indexname LIKE 'ecosystra_%'
    OR indexname = 'BoardTaskRollup_boardId_key'
  )
ORDER BY indexname;

-- 2) Bukti INCLUDE / WHERE ada di definisi (covering + partial)
SELECT indexname,
       indexdef LIKE '%INCLUDE%' AS has_include,
       indexdef ILIKE '%WHERE%' AS has_where
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'ecosystra_%'
ORDER BY indexname;

-- 3) Materialized view terdaftar + contoh baris
SELECT schemaname, matviewname
FROM pg_matviews
WHERE schemaname = 'public' AND matviewname = 'BoardTaskRollup';

SELECT * FROM "public"."BoardTaskRollup" ORDER BY "boardId" LIMIT 25;

-- 3b) Tabel ringkasan inkremental (Level 5) — bandingkan counts dengan MV jika keduanya ada
SELECT * FROM "public"."BoardTaskSummary" ORDER BY "boardId" LIMIT 25;

SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgrelid = 'public."Item"'::regclass
  AND tgname = 'ecosystra_item_board_task_summary_trg';

-- 4) Contoh EXPLAIN: pola mirip "task per board" (root items saja)
EXPLAIN (ANALYZE, BUFFERS)
SELECT i."name", i."dynamicData" AS status_json
FROM "public"."Item" AS i
WHERE i."boardId" = (
    SELECT i2."boardId" FROM "public"."Item" AS i2
    WHERE i2."parentItemId" IS NULL
    LIMIT 1
  )
  AND i."parentItemId" IS NULL
ORDER BY i."createdAt" ASC
LIMIT 50;
