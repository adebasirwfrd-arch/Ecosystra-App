# Blueprint — Supabase & migrasi data Ecosystra

## Di mana secret disimpan?

**Semua secret (connection string Supabase, JWT, Pusher) hanya boleh ada di:**

`shadboard/full-kit/.env.local` (atau `.env` server Anda)

File ini **gitignored** — jangan commit. **Jangan** menempel password atau URL lengkap ke file markdown ini atau ke Git.

Isi minimal:

| Variabel | Fungsi |
|----------|--------|
| `DATABASE_URL` | Postgres Supabase lewat **pooler** (biasanya port **6543**, bisa `?pgbouncer=true`) — dipakai runtime API + Prisma Client |
| `DIRECT_URL` | Koneksi **langsung** (biasanya port **5432**) — untuk `prisma migrate` / `db push` |
| `JWT_SECRET` | Token API |
| `PUSHER_*` | Realtime (opsional) |

Ambil string koneksi dari Supabase Dashboard → **Project Settings → Database**.

## Sinkronisasi skema ke Supabase (struktur tabel)

Dari folder API:

```bash
cd shadboard/full-kit
pnpm db:generate
npx prisma db push
# atau alur migrasi file: pnpm migrate
```

Ini menerapkan `prisma/schema.prisma` ke database (Workspace, Board, Group, Item, User domain, Notification, Member, …). **Tanpa** ini, API GraphQL tidak punya tabel yang benar.

## Migrasi *isi* data dari database lain

- **Postgres → Postgres (domain Ecosystra):** `pg_dump` / `pg_restore` untuk schema `public`, atau tool DMS.
- **SQLite lama (NextAuth Shadboard):** dari `shadboard/full-kit`, set `DATABASE_URL`/`DIRECT_URL` ke Supabase di `.env.local`, lalu jalankan:

  `pnpm db:migrate-from-sqlite`

  Skrip membaca `auth-dev.db`, `prisma/dev.db`, atau `dev.db` di folder full-kit (atau path absolut lewat `SQLITE_MIGRATE_SOURCE`), lalu mengisi tabel di schema Postgres `nextauth`. Setelah sukses, hapus file `.db` lokal; koneksi aplikasi hanya lewat Supabase.

Data baru setelah API menyala tersimpan ke Supabase lewat GraphQL → Prisma.

## Aplikasi web (Shadboard full-kit)

Pastikan `NEXT_PUBLIC_GRAPHQL_URL` di `.env.local` mengarah ke API Anda, mis. `http://localhost:4000/graphql` (dev).

## Keamanan

Jika secret pernah tertulis di chat atau file ter-track, **rotasi password database** dan **key** di Supabase / Pusher.
