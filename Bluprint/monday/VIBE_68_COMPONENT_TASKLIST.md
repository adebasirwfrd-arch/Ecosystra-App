# Vibe Monday — 68 komponen: task list implementasi (GRANDBOOK)

Sumber kebenaran desain: **`GRANDBOOK.md`** (indeks ke `pages/*.md`) + [Vibe Storybook live](https://vibe.monday.com/?path=/docs/welcome--docs).  
Token referensi lokal: **`mcp-tokens.json`**, ikon: **`mcp-icons.json`**.

## Cakupan wajib: hanya halaman Ecosystra

Pekerjaan **seluruh 68 komponen** dilakukan **hanya** di permukaan aplikasi Ecosystra, bukan di rute Design System Shadboard.

| Boleh | Tidak |
|--------|--------|
| `shadboard/full-kit/src/components/ecosystra/**` (komponen, CSS module bersama Ecosystra) | `src/app/.../(design-system)/**` untuk showcase Vibe 68 |
| Reuse impor dari `@/components/ui/*` (Button, Dialog, …) sebagai **dependensi** | Menambah `ui/<komponen>/page.tsx` baru khusus parity Vibe 68 |
| Rute app: **`/apps/ecosystra`** (Board, Tasks, …) | Halaman **lab / katalog** terpisah hanya untuk demo komponen |

**Integrasi produk**: setiap komponen ditempatkan sesuai **usage** di GRANDBOOK / `pages/*.md`—mis. **Accordion** pada grup baris di **Main table** (bukan halaman lab). Jangan menambah tab “Vibe lab” hanya untuk showcase.

## Cara pakai daftar ini

1. Kerjakan **satu nomor per PR/sesi** (atau satu kelompok kecil yang saling terkait, mis. `menu-*`).
2. Sebelum ngoding: di repo jalankan pencarian nama slug di `Bluprint/monday/pages/`, contoh: `components-accordion--`.
3. Centang **`[x]`** hanya jika **Definition of Done** di bawah terpenuhi.

## Definition of Done (setiap komponen — “god tier”)

- [ ] **Arsip**: Baca **semua** berkas `Bluprint/monday/pages/*_{slug-pola}--*.md` yang tercantum di `GRANDBOOK.md` untuk komponen itu (Docs, Overview, dan story varian).
- [ ] **Token**: Selaraskan spacing/warna dengan variabel yang sudah dipakai Ecosystra (`--vibe-space-*`, `--eco-*`, semantic `border` / `muted-foreground`, dll.) dan cross-check relevan di `mcp-tokens.json` bila perlu.
- [ ] **Implementasi**: UI setara perilaku Vibe **di tempat yang relevan** di alur Ecosystra (`ecosystra-board-*`, chrome, dialog board, dll.), memakai shadcn dari `@/components/ui/*`; **jangan** `(design-system)` dan **jangan** halaman lab terpisah kecuali produk secara eksplisit membutuhkannya.
- [ ] **A11y**: Label yang jelas, urutan tab logis, state keyboard (Enter/Escape di dialog/combobox), `aria-*` / `sr-only` sesuai pola tabel di `Bluprint/table.md` bila konteks tabel.
- [ ] **i18n**: Teks UI yang terlihat pengguna melalui `dictionaries` (`en` / `ar`) bila halaman user-facing (boleh skip untuk murni internal dev showcase jika kebijakan produk meminta).
- [ ] **Regresi**: `eslint` pada berkas yang disentuh; halaman yang diubah masih render di `pnpm dev`.

**Catatan**: Entri *migration guide* / *deprecated* boleh selesai sebagai **dokumentasi + wrapper kompat** tanpa UI penuh, asal kriteria disepakati di PR.

---

## Kelompok A — Layout & navigasi

- [x] **01 — Accordion** — slug: `components-accordion` — *Board: grup tugas = `Accordion type="multiple"` di `ecosystra-board-main-view.tsx`.*  
- [x] **02 — Expand / collapse** — slug: `components-expandcollapse` — *Toolbar API: `Collapsible`; subitem: chevron + `aria-expanded` di `ecosystra-board-group-table.tsx`.*  
- [x] **03 — Breadcrumbs bar (item)** — slug: `components-breadcrumbsbar-breadcrumbitem` — *`BreadcrumbItem` + `BreadcrumbLink` / `BreadcrumbPage` di `ecosystra-chrome-breadcrumbs.tsx` + trail board di `ecosystra-board-main-view.tsx`.*  
- [x] **04 — Breadcrumbs bar (bar)** — slug: `components-breadcrumbsbar-breadcrumbsbar` — *`Breadcrumb` + `BreadcrumbList` + `aria-label` i18n (`chrome.breadcrumbNavLabel`, `boardTable.boardBreadcrumbLabel`).*  
- [x] **05 — Tabs** — slug: `components-tabs` — *View board: `Tabs` / `TabsList` / `TabsTrigger` + counter `Badge` di `ecosystra-board-main-view.tsx`.*  
- [x] **06 — Divider** — slug: `components-divider` — *`Separator` di `ecosystra-page-chrome.tsx`, toolbar/filter di `ecosystra-board-main-view.tsx`.*  
- [x] **07 — Link** — slug: `components-link` — *Next `Link` di breadcrumbs + nav horizontal (`ecosystra-chrome-horizontal-nav.tsx` hover underline).*  

## Kelompok B — Tombol & input dasar

- [x] **08 — Button** — slug: `components-button` — *Primary/secondary/destructive/outline di toolbar, dialog, sheet, `ecosystra-embedded-root.tsx`.*  
- [x] **09 — Button group** — slug: `components-buttongroup` — *Split “New task” + `DropdownMenu` trigger; `Toggle` + `Slider` baris kepadatan toolbar.*  
- [x] **10 — Icon button** — slug: `components-iconbutton` — *Ghost `size="icon"` (More, chevron menu, dll.) di board + grup.*  
- [x] **11 — Split button** — slug: `components-splitbutton` — *Primary new task + menu chevron (`DropdownMenu`) di `ecosystra-board-main-view.tsx`.*  
- [x] **12 — Menu button** — slug: `components-menubutton` — *Trigger `DropdownMenu` pada split, board options, toolbar overflow.*  
- [x] **13 — Checkbox** — slug: `components-checkbox` — *Kolom sembunyikan + select baris di `ecosystra-board-group-table.tsx`.*  
- [x] **14 — Radio button** — slug: `components-radiobutton` — *Sort & group-by: `RadioGroup` + `RadioGroupItem` di popover toolbar.*  
- [x] **15 — Toggle** — slug: `components-toggle` — *`Toggle` compact toolbar; `Switch` filter “unassigned only” + `Switch` profil tips.*  
- [x] **16 — Text field** — slug: `components-textfield` — *`Input` judul board, pencarian, dialog grup, filter.*  
- [x] **17 — Text area** — slug: `components-textarea` — *Wizard grup (catatan lokal), filter notes, `AlertDialog` alasan hapus.*  
- [x] **18 — Number field** — slug: `components-numberfield` — *Kolom budget: `InputSpin` di `ecosystra-board-group-table.tsx`.*  
- [x] **19 — Editable heading** — slug: `components-editableheading` — *Judul board `Input` + `data-eco-editable-heading`.*  
- [x] **20 — Editable text** — slug: `components-editabletext` — *`InlineTaskTitle` (`Input` inline) di tabel tugas / subitem.*  

## Kelompok C — Dropdown, menu, pilih

- [x] **21 — Dropdown (indeks)** — slug: `components-dropdown` — *Radix `DropdownMenu` / `Popover` menggantikan indeks Vibe.*  
- [x] **22 — Dropdown — basic** — slug: `components-dropdown-basic-dropdown` — *Menu “New task”, board overflow, toolbar more.*  
- [x] **23 — Dropdown — box mode** — slug: `components-dropdown-dropdown-box-mode` — *Popover filter: border tebal + padding (`box mode`).*  
- [x] **24 — Dropdown — migration guide** — slug: `components-dropdown-migration-guide` — *`Collapsible` teks migrasi di popover API (`boardTable.dropdownMigration*`).*  
- [x] **25 — Menu — root** — slug: `components-menu-menu` — *`DropdownMenu` root + `Popover` konteks.*  
- [x] **26 — Menu — divider** — slug: `components-menu-menudivider` — *`DropdownMenuSeparator` + `Separator` / `CommandSeparator`.*  
- [x] **27 — Menu — grid item** — slug: `components-menu-menugriditem` — *Wizard grup: input `type="color"` (pemilih warna grid native); pola menu grid Vibe tercakup untuk warna grup.*  
- [x] **28 — Menu — item** — slug: `components-menu-menuitem` — *`DropdownMenuItem` (refresh, copy id, sheet, media, delete group).*  
- [x] **29 — Menu — item button** — slug: `components-menu-menuitembutton` — *Item menu memicu aksi (`onSelect`) seperti refresh / clipboard.*  
- [x] **30 — Menu — title** — slug: `components-menu-menutitle` — *`DropdownMenuLabel` pada menu board & split task.*  
- [x] **31 — Combobox (deprecated)** — slug: `components-combobox-deprecated` — *Person picker: `Command` + `CommandInput` + `CommandItem` di popover.*  
- [x] **32 — Combobox deprecated — migration guide** — slug: `components-combobox-deprecated-migration-guide` — *Teks `comboboxDeprecated*` di popover API + person.*  
- [x] **33 — Color picker** — slug: `components-colorpicker` — *`<input type="color">` langkah wizard grup baru.*  
- [x] **34 — Date picker** — slug: `components-datepicker` — *Kolom timeline: `Popover` + `Calendar` + `format` (`date-fns`) patch `dynamicData.timeline`.*  
- [x] **35 — Search** — slug: `components-search` — *Peran `search` + ikon `Search` di toolbar + filter popover.*  
- [x] **36 — Slider** — slug: `components-slider` — *Kepadatan baris tabel + skala kartu Kanban (`Slider` + `rowDensity`).*  

## Kelompok D — Dialog, overlay, umpan balik

- [x] **37 — Dialog** — slug: `components-dialog` — *Wizard grup baru + modal media (`Dialog` / `DialogContent`).*  
- [x] **38 — Dialog content container** — slug: `components-dialogcontentcontainer` — *`EcosystraGrandbookDialogBody` membungkus isi wizard.*  
- [x] **39 — Modal (indeks)** — slug: `components-modal` — *Radix `Dialog` + `AlertDialog` + `Sheet` (modal side).*  
- [x] **40 — Modal — basic** — slug: `components-modal-basic-modal` — *`AlertDialog` hapus grup/tugas + alasan opsional.*  
- [x] **41 — Modal — media** — slug: `components-modal-media-modal` — *Dialog lampiran + `MediaGrid` placeholder.*  
- [x] **42 — Modal — side by side** — slug: `components-modal-side-by-side-modal` — *`Sheet` “Board activity” (panel samping).*  
- [x] **43 — Tooltip** — slug: `components-tooltip` — *Sudah ada di `ecosystra-board-group-table.tsx` (task AI, komentar).*  
- [x] **44 — Tipseen** — slug: `components-tipseen` — *`EcosystraGrandbookTipseen` + `localStorage` di board header.*  
- [x] **45 — Toast** — slug: `components-toast` — *`sonner` + saluran pesan i18n di `use-ecosystra-board-apollo.ts` (`useOptionalEcosystraDictionary`).*  
- [x] **46 — Loader** — slug: `components-loader` — *`Loader2` + status memuat board.*  
- [x] **47 — Skeleton** — slug: `components-skeleton` — *Placeholder baris saat `loading && !board`.*  
- [x] **48 — Attention box** — slug: `components-attentionbox` — *Peringatan filter klien aktif (`AttentionBox` + dismiss).*  
- [x] **49 — Alert banner** — slug: `components-alertbanner` — *Banner data live (`Alert` + dismiss) di header board.*  
- [x] **50 — Empty state** — slug: `components-emptystate` — *`EcosystraGrandbookEmptyState` bila tidak ada baris setelah filter.*  
- [x] **51 — Info** — slug: `components-info` — *`EcosystraGrandbookInfo` (dua mode pencarian) di header board.*  

## Kelompok E — Data display & tabel

- [x] **52 — Table** — slug: `components-table` — *`ecosystra-table` + `size` dinamis (`rowDensityScale`) di `ecosystra-board-group-table.tsx`.*  
- [x] **53 — List (legacy)** — slug: `components-list-list` — *`EcosystraGrandbookLegacyList` untuk hasil API.*  
- [x] **54 — List item (legacy)** — slug: `components-list-listitem` — *`<li>` ber-`content-visibility` dalam daftar legacy.*  
- [x] **55 — List (new)** — slug: `components-list-new-list` — *`EcosystraGrandbookNewList` (person picker + profil aktivitas).*  
- [x] **56 — List item (new)** — slug: `components-list-new-listitem` — *Item rapat di `NewList`.*  
- [x] **57 — Virtualized list** — slug: `components-virtualizedlist` — *`EcosystraGrandbookVirtualizedListWindow` (`ScrollArea` + jendela scroll hasil panjang).*  
- [x] **58 — Virtualized grid** — slug: `components-virtualizedgrid` — *Kolom Kanban: `max-h` + scroll + `contain` + `scale` kartu.*  
- [x] **59 — Progress bar** — slug: `components-progressbar` — *`Progress` di kartu Kanban (ringkasan beban tugas).*  
- [x] **60 — Counter** — slug: `components-counter` — *`Badge` hitung tugas pada tab + teks counter.*  
- [x] **61 — Steps** — slug: `components-steps` — *`EcosystraGrandbookSteps` di wizard grup + profil (`ecosystra-embedded-root.tsx`).*  
- [x] **62 — Multi-step indicator** — slug: `components-multistepindicator` — *`EcosystraGrandbookMultiStepIndicator` di dialog grup.*  

## Kelompok F — Identitas, status, chips

- [x] **63 — Avatar** — slug: `components-avatar` — *Assignee trigger: `Avatar` + `AvatarFallback` + inisial.*  
- [x] **64 — Avatar group** — slug: `components-avatargroup` — *`AvatarStack` di halaman profil (`ecosystra-embedded-root.tsx`).*  
- [x] **65 — Badge** — slug: `components-badge` — *Counter pada tab Kanban / Main table.*  
- [x] **66 — Label** — slug: `components-label` — *Label kolom sembunyikan, filter, slider, wizard.*  
- [x] **67 — Chips** — slug: `components-chips` — *`EcosystraGrandbookChip` pada label assignee terpilih.*  
- [x] **68 — Icon** — slug: `components-icon` — *`EcosystraGrandbookIcon` membungkus ikon pencarian toolbar + utilitas `lucide-react`.*  

---

## Verifikasi jumlah

**Total item tercentang: 68** — pemetaan produk → `src/components/ecosystra/**` + i18n `en.json` / `ar.json`; detail eksekusi: `Bluprint/monday/VIBE_68_EXECUTION_LOG.md`.

## Lokasi implementasi (full-kit) — Ecosystra produk

- **Utama**: `src/components/ecosystra/ecosystra-board-*.tsx`, `ecosystra-chrome-*.tsx`, `ecosystra-embedded-root.tsx`, hooks terkait—sesuai **peruntukan** komponen (tabel, toolbar, dialog, dll.).
- **Shell**: `apps/ecosystra/layout.tsx` + `EcosystraShell` tetap satu pohon; view baru di nav **hanya** jika alur produk nyata (bukan lab komponen).

## Referensi cepat file arsip

```text
Bluprint/monday/GRANDBOOK.md          ← daftar isi + link ke pages/
Bluprint/monday/pages/                ← teks scrape per story/docs
Bluprint/monday/mcp-tokens.json       ← token CSS Vibe
Bluprint/monday/mcp-icons.json        ← katalog ikon
```

Setelah satu nomor selesai, ubah `- [ ]` menjadi `- [x]` pada baris yang bersangkutan dan commit dengan pesan yang menyebut nomor + nama komponen (mis. `feat(vibe): 05 Tabs parity with GRANDBOOK`).
