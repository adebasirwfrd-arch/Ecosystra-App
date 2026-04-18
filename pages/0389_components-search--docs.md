---
id: components-search--docs
type: docs
title: "Components/Search"
name: "Docs"
importPath: "./src/pages/components/Search/Search.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-search--docs&viewMode=docs
extractedWith: mcp-user-vibe-fallback
scrapedAt: 2026-04-17T17:05:00.000Z
note: "Halaman MDX ini tidak menampilkan konten di iframe Storybook produksi (elemen #storybook-docs tetap hidden). Isi di bawah disusun dari MCP Vibe (metadata, contoh Storybook, dan aksesibilitas)."
---

# Components / Search — dokumentasi (fallback MCP)

## Ringkasan

Komponen `Search` dari `@vibe/core` menyediakan input pencarian dengan ikon cari, opsi clear, ukuran, debounce, dan integrasi hasil pencarian lewat ARIA.

**Import:** `import { Search } from "@vibe/core"`

## Props (ringkasan dari metadata MCP)

| Area | Props utama |
|------|-------------|
| Nilai & placeholder | `value`, `placeholder`, `onChange`, `debounceRate` (default 400) |
| Ukuran & status | `size` (small \| medium \| large), `disabled`, `loading`, `autoFocus` |
| Ikon | `searchIconName`, `clearIconName`, `showClearIcon`, `clearIconLabel` |
| Aksi tambahan | `renderAction`, `hideRenderActionOnInput` |
| Aksesibilitas | `inputAriaLabel`, `searchResultsContainerId`, `currentAriaResultId`, `aria-expanded`, `aria-haspopup` |
| Lainnya | `autoComplete`, `className`, `data-testid`, `id`, callbacks `onBlur`, `onFocus`, `onClear`, `onKeyDown` |

Definisi prop lengkap dengan tipe TypeScript tersedia melalui alat MCP `get-vibe-component-metadata` untuk komponen `Search`.

## Contoh kode (dari MCP — Storybook)

### Ukuran

```tsx
<>
  <Search id="sizes-small" inputAriaLabel="Small search input" placeholder="Small" size="small" />
  <Search id="sizes-medium" inputAriaLabel="Medium search input" placeholder="Medium" size="medium" />
  <Search id="sizes-large" inputAriaLabel="Large search input" placeholder="Large" size="large" />
</>
```

### Dengan aksi tambahan

```tsx
<Search
  id="search-with-action"
  inputAriaLabel="Search with filter action"
  placeholder="Search with icon"
  renderAction={
    <IconButton id="filter-action-button" icon={FilterIcon} aria-label="Filter results" size="small" />
  }
/>
```

### Filter di Combobox (contoh terkait)

```tsx
<Combobox
  id="filter-combobox"
  searchInputAriaLabel="Filter options"
  placeholder="Placeholder text here"
  options={options}
  size="small"
  optionLineHeight={28}
/>
```

## Aksesibilitas (dari MCP)

1. Menggunakan `id` sangat disarankan untuk asosiasi label.
2. Gunakan `inputAriaLabel` untuk nama aksesibel yang jelas.
3. Gunakan `searchResultsContainerId` untuk menghubungkan input ke container hasil.
4. Gunakan `currentAriaResultId` untuk hasil yang aktif/fokus.
5. Gunakan `ariaExpanded` saat dropdown hasil terbuka tertutup.
6. Gunakan `ariaHasPopup` untuk jenis popup hasil (mis. listbox).
7. Gunakan `clearIconLabel` untuk nama aksesibel tombol clear.
