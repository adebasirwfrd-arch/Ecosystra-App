# Model sesi & autentikasi (`full-kit`)

Dokumen ini memenuhi **checklist A1** (`modal/ecosystra-full-kit-alignment-checklist.md`): keputusan eksplisit agar perilaku backend selaras dengan prinsip **satu sumber kebenaran** di [`modal/modal.md`](../../../modal/modal.md) §1 dan §2.2.

## Keadaan saat ini (faktual)

| Mekanisme | Peran |
|-----------|--------|
| **NextAuth** | Sumber utama identitas untuk **Route Handlers** privat: `getServerSession` / `requireApiSession` → `session.user.id` + email. |
| **JWT HS256** (`Authorization: Bearer`) | Dipakai **`/api/graphql`** lewat `resolveAuth()` — token diverifikasi dengan `NEXTAUTH_SECRET` (bukan `userId` mentah dari body). |
| **Supabase Auth + cookie** | Middleware memanggil `updateSupabaseSession` (polar `@supabase/ssr`) agar cookie Supabase tetap segar; **`GET /api/session/supabase`** memakai `supabase.auth.getUser()` untuk diagnosis. |
| **Header dev** `x-dev-user-email` | Hanya **`NODE_ENV !== "production"`** di `resolveAuth` — tidak untuk produksi. |

## Implikasi

- **Tidak ada** “satu-satunya” sesi Supabase Auth yang mengunci semua API; **NextAuth** mengunci `/api/crm/*`, `/api/email/*`, dll.
- Migrasi ke pola modal penuh (“cookie Supabase + `getUser()` di handler”) berarti **menyatukan** gate auth: atau menggantikan NextAuth untuk route tersebut, atau menjembatani Supabase user ↔ NextAuth user dengan aturan jelas.

## Rujukan kode

- `src/middleware.ts` — refresh Supabase + proteksi locale/NextAuth.
- `src/lib/api/route-session.ts` — `requireApiSession`, `requireSessionWithEmail`.
- `src/lib/api/chat-route-session.ts` — `requireChatEcoUser` (chat API).
- `src/lib/auth.ts` — `getSession()` (alias `getServerSession`).
- `src/lib/ecosystra/auth.ts` — `resolveAuth` untuk GraphQL.
- `src/app/api/session/supabase/route.ts` — probe Supabase user.

**Pembaruan:** ubah dokumen ini ketika pola gate auth berubah (satu PR = satu keputusan tercatat).
