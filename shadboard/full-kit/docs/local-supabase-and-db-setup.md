# Setup lokal: Supabase + database (`full-kit`)

Urutan ini menyelaraskan lingkungan dev dengan [`modal/modal.md`](../../../modal/modal.md) dan checklist [`modal/ecosystra-full-kit-alignment-checklist.md`](../../../modal/ecosystra-full-kit-alignment-checklist.md). **Isi `.env.local` sendiri** (secret tidak boleh di-commit).

---

## Prasyarat

- Node **≥ 22**, **pnpm ≥ 10** (lihat `package.json` / `packageManager`).
- Proyek **Supabase** (Postgres) + string koneksi (disarankan **pooler** `:6543` dari dashboard).

---

## 1. Dependensi

Dari **akar monorepo** `Ecosystra/` (disarankan, karena `pnpm-workspace.yaml`):

```bash
cd /path/ke/Ecosystra
pnpm install
```

Atau hanya paket app (setara):

```bash
cd /path/ke/Ecosystra
pnpm install --filter shadboard-nextjs-full-kit
```

---

## 2. Environment

```bash
cd shadboard/full-kit
cp .env.example .env.local
```

Edit `.env.local` minimal:

| Variabel | Keterangan |
|----------|------------|
| `DATABASE_URL` | Connection string Postgres Supabase (sering pooler `…:6543/postgres?pgbouncer=true`). Dipakai `pnpm db:push` / Prisma. |
| `BASE_URL`, `NEXTAUTH_URL` | Samakan dengan origin browser (mis. `http://localhost:3002` jika `pnpm dev:3002`). |
| `NEXTAUTH_SECRET` | String acak untuk JWT NextAuth. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard Supabase → **Settings → API**. |
| `NEXT_PUBLIC_HOME_PATHNAME` | Sudah ada contoh di `.env.example`. |

Opsional sesuai fitur: `GOOGLE_*`, `SUPABASE_SERVICE_ROLE_KEY` (upload chat), `CRM_USE_SUPABASE`, `NEXT_PUBLIC_GRAPHQL_URL`, dll. — lihat komentar di `.env.example`.

---

## 3. Skema database (cara utama: Prisma)

Dari folder **`shadboard/full-kit`** (script memuat `.env.local`):

```bash
pnpm db:push
```

Ini membuat/memperbarui tabel di schema **`nextauth`**, **`shadboard_content`**, **`public`** sesuai `prisma/schema.prisma`.

Lalu generate client (juga jalan otomatis lewat `postinstall` / `pnpm build`):

```bash
pnpm exec prisma generate
```

---

## 4. Seed (opsional)

```bash
pnpm db:seed-page-content
pnpm db:seed-crm
```

CRM seed mengisi dari JSON modul; lihat komentar di `scripts/seed-crm-tables.ts` (termasuk `--force`).

---

## 5. Konfigurasi dashboard Supabase

1. **Storage:** bucket publik **`chat-attachments`** jika memakai upload lampiran chat (`SUPABASE_SERVICE_ROLE_KEY` di server).
2. **PostgREST / CRM:** **Project Settings → API → Exposed schemas** → tambahkan **`shadboard_content`** bila memakai `CRM_USE_SUPABASE=1`.
3. **RLS (setelah tabel CRM ada):** jalankan sekali isi  
   `supabase/migrations/20260418140000_crm_rls_baseline.sql`  
   di **SQL Editor** (atau alur migrasi Supabase CLI tim Anda).

---

## 6. Chat: jika `db:push` dari laptop sering gagal

Gunakan panduan SQL Editor + file SQL yang sudah disiapkan:

- [`prisma/sql/MANUAL-SUPABASE-CHAT.md`](../prisma/sql/MANUAL-SUPABASE-CHAT.md)

---

## 7. Jalankan dev

```bash
pnpm dev:3002
```

Sesuaikan port dengan `BASE_URL` / `NEXTAUTH_URL`.

---

## 8. Verifikasi cepat

- **NextAuth / sesi:** login lewat UI yang tersedia; pastikan tidak ada error session di terminal.
- **Supabase cookie:** `GET /api/session/supabase` (setelah login Supabase jika dipakai).
- **CRM PostgREST:** `pnpm crm:probe-postgrest` (dengan env CRM yang relevan).

---

*Perbarui dokumen ini bila skrip atau nama env berubah.*
