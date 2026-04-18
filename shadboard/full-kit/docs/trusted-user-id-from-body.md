# Checklist A4: `userId` dari client

**Aturan modal:** jangan mempercayai `userId` dari body untuk menentukan **siapa** yang beraksi; selalu derivasi dari sesi server / JWT terverifikasi.

## Audit singkat (`app/api`)

| Area | Hasil |
|------|--------|
| CRM REST | Identitas dari `requireApiSession` → `upsertEcoUserIdFromEmail` / Prisma; body hanya field domain. |
| Email REST | Sama — tidak ada `userId` di body untuk “jadi user lain”. |
| Chat `POST …/threads` | Body berisi `memberUserIds` (anggota tambahan). **Creator** tetap dari `ensureEcoUserFromSession(session)`. |
| GraphQL | `userId` berasal dari **payload JWT** (`jose.jwtVerify`) atau sesi NextAuth, bukan field bebas di body GraphQL untuk impersonation. |

Tidak ditemukan pola “`userId` di JSON body langsung dipakai sebagai subjek aksi” pada route yang diaudit.

**Pembaruan:** ulangi grep `req.json` + skema Zod saat menambah endpoint baru.
