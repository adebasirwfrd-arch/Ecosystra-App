# Checklist penyelarasan backend — `shadboard/full-kit` → `modal.md`

Dokumen ini memecah acuan [`modal.md`](./modal.md) menjadi **milestone yang bisa dicentang** per modul. Lingkup kode: **`shadboard/full-kit`**. Centang item ketika perilaku produksi sesuai kriteria “Selesai”.

**Dokumen pendukung di repo:** `shadboard/full-kit/docs/session-and-auth.md`, `…/api-route-auth-inventory.md`, `…/trusted-user-id-from-body.md`, `…/middleware-auth-smoke.md`.

### Batch terakhir dijalankan (satu per satu)

- [x] **A1** — model sesi tertulis (`docs/session-and-auth.md`).
- [x] **A2** — inventaris pola auth per route (`docs/api-route-auth-inventory.md`).
- [x] **A2b** — Chat API: `requireChatEcoUser` + `jsonOk`/`jsonError` (`src/lib/api/chat-route-session.ts` + `app/api/chat/**`).
- [x] **A3** (dok + langkah uji) — `docs/middleware-auth-smoke.md` (eksekusi manual oleh developer/CI).
- [x] **A4** — audit `userId` dari body (`docs/trusted-user-id-from-body.md`).
- [x] **B1 + B2** (parsial) — `POST /api/error-logs` memakai `jsonOk` / `jsonFromZodError` + Zod.
- [x] **B1** (parsial chat) — respons chat memakai helper HTTP yang sama.
- [x] **B2** (chat JSON) — `src/lib/api/chat-request-schemas.ts` + `jsonFromZodError` di route chat yang menerima body.
- [x] **C4** — PostgREST untuk `crm_project`, `crm_activity`, `crm_feedback`, `crm_sales_rep` (`crm-entities-supabase.ts` + `/api/crm/*` bila `CRM_USE_SUPABASE=1`).
- [x] **D2** (parsial) — komentar depresiasi mutasi email GraphQL di `resolvers.ts` (hapus kode setelah tidak ada pemakai).
- [x] **G1** (parsial email) — `src/lib/query-keys/email.ts` (siap dipakai saat email pakai TanStack Query).
- [x] **D1** — `.env.example` mengaktifkan `NEXT_PUBLIC_EMAIL_API=rest` (salin ke `.env.local` untuk perilaku sama).

---

## Legenda acuan

| Rujukan | Isi |
|--------|-----|
| **§1** | Prinsip inti (satu sesi, API tipis, cache, realtime selektif) |
| **§2.1–2.7** | Stack backend, Supabase SSR, middleware, Route Handlers, pola data, migrasi/tipe, eksternal |

---

## A. Auth & sesi (§1, §2.2, §2.3, §2.4)

| # | Item | Selesai bila |
|---|------|----------------|
| A1 | **Satu sumber kebenaran sesi** terdokumentasi (NextAuth vs Supabase Auth): keputusan tertulis + diagram singkat alur login | **Selesai (fase dok):** `shadboard/full-kit/docs/session-and-auth.md`. Target “satu sesi Supabase-only” masih terbuka. |
| A2 | Route Handler privat memakai **satu** pola verifikasi (`getUser()` Supabase *atau* NextAuth session), tidak campur tanpa alasan | **Selesai (fase chat):** `requireChatEcoUser` + inventaris diperbarui. GraphQL & route lain tetap dicatat. |
| A3 | Middleware: refresh Supabase + daftar publik/protected **tetap** selaras dengan A2 | **Langkah uji:** `docs/middleware-auth-smoke.md` — centang setelah dijalankan di lingkungan Anda. |
| A4 | Tidak mempercayai `userId` dari body tanpa verifikasi server | **Selesai (fase audit):** `docs/trusted-user-id-from-body.md` |

---

## B. API & boundary (§2.1, §2.4, §2.7)

| # | Item | Selesai bila |
|---|------|----------------|
| B1 | **JSON konsisten** (`jsonOk` / `{ error }` / Zod 422) di semua Route Handler baru | Lint/grep: handler tanpa helper diseragamkan atau dikecualikan sengaja |
| B2 | **Zod** (atau setara) di setiap POST/PATCH yang menerima body | Checklist per-route di `app/api/` |
| B3 | Secret & service role **hanya** server env; tidak pernah `NEXT_PUBLIC_*` untuk kunci sensitif | Scan env + client bundle |
| B4 | GraphQL (`/api/graphql`) **dikurangi** per domain: domain selesai = tidak ada pemanggilan client ke GQL untuk domain itu | Email: `NEXT_PUBLIC_EMAIL_API=rest` + tidak ada fallback GQL mutasi |

---

## C. Data & Supabase (§2.1, §2.2, §2.5, §2.6)

**Langkah dev konkret (install → `.env.local` → `db:push` → seed → dashboard):** `shadboard/full-kit/docs/local-supabase-and-db-setup.md`.

| # | Item | Selesai bila |
|---|------|----------------|
| C1 | Migrasi skema: **`supabase/migrations/`** sebagai sumber perubahan DDL yang disepakati (bukan hanya Prisma drift) | Kebijakan doc: “DDL baru lewat file migrasi X” |
| C2 | **`pnpm supabase:types`** menghasilkan `Database` yang mencakup schema domain (mis. `shadboard_content` untuk CRM) | CI atau docs: perintah gen + commit types |
| C3 | CRM **deals**: path Prisma vs PostgREST jelas (`CRM_USE_SUPABASE`); probe `pnpm crm:probe-postgrest` lulus di lingkungan dev | README langkah + output probe disimpan (opsional) |
| C4 | CRM **projects / activities / feedback / reps**: lapisan PostgREST + serializer sama seperti deals | **Selesai (kode):** `src/lib/data/crm/crm-entities-supabase.ts` + route terkait; aktif dengan `CRM_USE_SUPABASE=1`. |
| C5 | **RLS** pada tabel sensitif + policy uji manual; hilangkan ketergantungan service_role kecuali admin/cron | Daftar tabel + policy; env `CRM_SUPABASE_MODE=user_session` layak dipakai |

---

## D. Email (§2.4, §1 API tipis)

| # | Item | Selesai bila |
|---|------|----------------|
| D1 | Baca + mutasi inbox lewat **`/api/email/*`** (REST) | **Selesai:** `NEXT_PUBLIC_EMAIL_API=rest` di `.env.example` |
| D2 | Resolver GraphQL email **deprecated** atau dihapus setelah D1 stabil | **Parsial:** catatan depresiasi di `resolvers.ts`; resolver tetap untuk fallback non-REST. |

---

## E. Board / task / domain Ecosystra (§2.4, B4)

| # | Item | Selesai bila |
|---|------|----------------|
| E1 | Inventaris query/mutasi yang masih lewat **`/api/graphql`** | Tabel: nama operasi → calon route REST |
| E2 | Prioritas migrasi (mis. task → item → board) + satu Route Handler per resource | PR per slice, bukan big bang |

---

## F. Chat & Realtime (§1, §2.5)

| # | Item | Selesai bila |
|---|------|----------------|
| F1 | **Realtime** hanya pada channel/tabel yang perlu; dokumentasi subscribe + `invalidateQueries` / state minimal | File + alasan per subscription |
| F2 | Tidak subscribe global ke semua tabel | Review `channel` / `postgres_changes` |

---

## G. TanStack Query (§1, §2.5)

| # | Item | Selesai bila |
|---|------|----------------|
| G1 | **Query key factory** untuk domain yang sudah REST (CRM, email, …) | CRM: `src/lib/query-keys/crm.ts`. Email: `src/lib/query-keys/email.ts` (UI belum wajib TanStack Query). |
| G2 | Mutasi memanggil **`invalidateQueries`** untuk key yang relevan | Uji dua tab: data ikut segar |

---

## H. Observabilitas & kualitas (§4 checklist modal)

| # | Item | Selesai bila |
|---|------|----------------|
| H1 | Error production → Sentry (atau setara) + sampling | Env + init di app |
| H2 | **`.env.example`** lengkap tanpa secret; variabel baru didokumentasikan | Review tiap PR yang menambah env |

---

## Urutan kerja yang disarankan

1. **A + B** (auth + konsistensi API) — mengurangi utang sebelum migrasi data besar.  
2. **D + G** (email REST default + query keys) — dampak UX cepat, risiko terbatas.  
3. **C** (CRM penuh ke PostgREST + RLS) — setelah schema exposed & types.  
4. **E** (kurangi GraphQL per domain).  
5. **F + H** (realtime disiplin + observability).

---

*Perbarui dokumen ini saat item selesai; tautkan PR atau commit hash di kolom catatan tim jika perlu audit trail.*
