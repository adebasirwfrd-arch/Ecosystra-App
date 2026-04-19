-- =============================================================================
-- Refresh berkala: "BoardTaskRollup" (Materialized View)
-- =============================================================================
--
-- ERROR: schema "cron" does not exist  →  modul pg_cron belum aktif di project
-- ini. Skema `cron` dibuat oleh extension pg_cron; tanpa itu, `cron.schedule`
-- tidak bisa dipanggil.
--
-- ── Opsi A (paling andal, Supabase Dashboard) ─────────────────────────────
-- Integrations → Cron → New job
--   Schedule: */5 * * * *   (setiap 5 menit)
--   Command / SQL:
--     REFRESH MATERIALIZED VIEW CONCURRENTLY "public"."BoardTaskRollup";
-- Dokumentasi: https://supabase.com/docs/guides/cron
--
-- ── Opsi B ─────────────────────────────────────────────────────────────────
-- Database → Extensions → aktifkan "pg_cron", lalu jalankan BAGIAN (2) di
-- bawah (bisa lewat SQL Editor).
--
-- ── Opsi C ─────────────────────────────────────────────────────────────────
-- Jika role SQL Editor punya hak membuat extension, jalankan BAGIAN (1)
-- sekali, lalu BAGIAN (2).

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ BAGIAN (1) — satu kali: pasang pg_cron (abaikan error jika sudah aktif) │
-- └─────────────────────────────────────────────────────────────────────────┘
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Verifikasi skema cron sudah ada (harus true):
SELECT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'cron') AS cron_schema_ready;

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ BAGIAN (2) — jadwal refresh MV (butuh unique index pada BoardTaskRollup) │
-- └─────────────────────────────────────────────────────────────────────────┘

-- Hapus job lama dengan nama sama (opsional): lihat jobid lalu unschedule.
-- SELECT jobid, jobname, schedule, command FROM cron.job;
-- SELECT cron.unschedule(<jobid>);

SELECT cron.schedule(
  'ecosystra_refresh_board_task_rollup',
  '*/5 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY "public"."BoardTaskRollup";$$
);

-- Cek:
-- SELECT jobid, jobname, schedule, command, active FROM cron.job
-- WHERE jobname = 'ecosystra_refresh_board_task_rollup';
