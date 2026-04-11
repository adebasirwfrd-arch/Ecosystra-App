# Chat + Prisma: pakai SQL Editor (tanpa `db push` dari laptop)

Kalau `prisma db push` dari mesin Anda sering gagal (timeout, P1001, pooler lambat), **itu wajar** — yang penting **database Supabase** sudah punya kolom/tabel yang sama dengan `prisma/schema.prisma`. Cara paling andal: **jalankan SQL di Supabase SQL Editor**, lalu **generate client** di lokal.

---

## Ringkasan urutan (jangan lompat)

| Langkah | Di mana | Wajib? |
|--------|---------|--------|
| 1. `prisma generate` | Laptop (folder `full-kit`) | **Wajib** setiap kali `schema.prisma` berubah |
| 2. SQL migrasi chat | Supabase → SQL Editor | **Wajib** jika belum pernah / kolom baru |
| 3. Restart `next dev` | Laptop | Disarankan setelah generate |

---

## Langkah 1 — Generate Prisma Client (lokal, **tanpa** koneksi DB)

Di terminal, dari folder **`shadboard/full-kit`**:

```bash
pnpm exec prisma generate
```

Ini hanya membaca `prisma/schema.prisma` dan memperbarui `src/generated/prisma`. **Tidak** membutuhkan internet ke Postgres.

---

## Langkah 2 — Samakan database dengan skema (Supabase SQL Editor)

### 2a. Apakah tabel chat **sudah** pernah dibuat?

Di Supabase: **SQL Editor** → new query → jalankan:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('ChatThread', 'ChatMember', 'ChatMessage');
```

- **Tiga baris muncul** → lanjut **2b** (incremental saja).
- **Kosong / belum lengkap** → jalankan **sekali saja** file  
  `prisma/sql/apply-public-chat-tables.sql`  
  (buat tabel + FK). **Jangan** dijalankan ulang jika tabel sudah ada — akan error `already exists`.

### 2b. Kolom tambahan (mute, block, edit, reply, forward, soft delete)

Jalankan **satu kali** (boleh diulang — isinya idempotent) file:

**`prisma/sql/supabase-incremental-chat.sql`**

1. Buka file itu di editor, **salin seluruh isinya**.
2. Supabase → **SQL Editor** → **New query** → tempel → **Run**.

Hasil yang benar: **Success** / **No rows returned** untuk perintah `ALTER` — itu normal.

### 2c. Kalau ada error

| Pesan | Arti / tindakan |
|-------|------------------|
| `relation "ChatMessage" does not exist` | Tabel belum ada — jalankan dulu `apply-public-chat-tables.sql` (sekali). |
| `constraint ... already exists` | Jarang terjadi karena pakai `DROP IF EXISTS`; coba jalankan lagi hanya bagian yang gagal atau hubungi tim dengan pesan penuh. |
| `foreign key` ke `User` | Pastikan tabel `public."User"` (user Eco/NextAuth) sudah ada seperti di skema Prisma. |

---

## Langkah 3 — Aplikasi Next.js

Setelah `prisma generate` dan SQL sukses:

```bash
# contoh
pnpm dev:3002
```

Restart dev server agar tidak memakai Prisma client lama di cache.

---

## Catatan `DATABASE_URL` / pooler

- **`prisma db push`** memakai `DATABASE_URL` dari `.env.local` (sekarang **tanpa** `directUrl` wajib di `schema.prisma`).
- Jika push dari laptop tetap gagal, **tidak masalah** selama langkah SQL Editor di atas sudah dijalankan dan **`pnpm prisma generate`** sudah jalan.

---

## File mana yang dipakai?

| File | Kapan |
|------|--------|
| `apply-public-chat-tables.sql` | **Pertama kali** saja — belum ada `ChatThread` / `ChatMember` / `ChatMessage`. |
| `supabase-incremental-chat.sql` | Setiap ada penambahan kolom chat (mute, blocked, editedAt, reply, dll.) — **aman diulang**. |
| `alter-chat-member-preferences.sql` | Isi sudah digabung ke `supabase-incremental-chat.sql` (bagian A). |
| `alter-chat-message-actions.sql` | Isi sudah digabung ke `supabase-incremental-chat.sql` (bagian B). |

---

## Checklist cepat

- [ ] `pnpm exec prisma generate` di `full-kit`
- [ ] SQL incremental di Supabase tanpa error
- [ ] Dev server di-restart
- [ ] Buka `/apps/chat` dan coba fitur yang pakai kolom baru (mute, reply, dll.)

---

## Error: `Unknown argument 'blocked'` / `deletedAt` (PrismaClientValidationError)

Artinya **runtime** memakai Prisma Client **lama** (belum mengenal field baru), bukan masalah SQL di Supabase.

1. Di folder `full-kit`: `pnpm exec prisma generate`
2. **Hentikan** dev server sepenuhnya, jalankan lagi (`pnpm dev:3002` atau `npm run dev:3002`).
3. Kalau masih error: hapus cache Next — `rm -rf .next` — lalu start dev lagi.

Repo juga menaikkan nama singleton global di `src/lib/prisma.ts` (mis. `prismaShadboardV9`) supaya HMR tidak menahan instance Prisma lawas; setelah pull kode terbaru, restart dev wajib.
