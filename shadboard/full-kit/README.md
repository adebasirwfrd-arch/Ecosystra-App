# Ecosystra

Aplikasi Next.js (App Router) dengan **Sign-in**, **Ecosystra**, **Email**, **Chat**, dan **Calendar**.

## Menjalankan lokal

Dari monorepo root `Ecosystra/`:

```bash
pnpm install
pnpm dev:3002
```

Buka `http://localhost:3002` — setelah login, redirect beranda mengarah ke **Ecosystra** (`/:lang/apps/ecosystra`, mis. `/en/apps/ecosystra`).

## Lingkungan

Salin `.env.example` → `.env.local` dan isi minimal:

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL`
- `HOME_PATHNAME` dan `NEXT_PUBLIC_HOME_PATHNAME` = `/apps/ecosystra` (setelah login / redirect beranda)

## Database

Dari **`shadboard/full-kit`** (memuat `.env.local`):

```bash
# Opsi A — terapkan migrasi SQL (disarankan untuk CI / production)
pnpm migrate:deploy

# Opsi B — sinkronkan schema Prisma ke DB tanpa riwayat migrasi interaktif
pnpm db:push

pnpm db:seed-page-content
```

Dari **root monorepo** `Ecosystra/`: `pnpm migrate:deploy` atau `pnpm db:push` (delegasi ke full-kit).

Schema utama: `prisma/schema.prisma`. Migrasi **`20260419180000_drop_crm_shadboard_content`** men-drop tabel `crm_*` di schema **`shadboard_content`**. File **`supabase/migrations/20260419180000_drop_crm_tables.sql`** isinya setara untuk dijalankan di **SQL Editor** Supabase bila Anda tidak memakai Prisma Migrate di lingkungan itu.
