/**
 * Ecosystra table column model — aligned with Vibe **Table** / `TableColumn` (GRANDBOOK → `components-table--docs`).
 * `loadingStateType` drives skeleton cell shape when using `EcosystraTableSkeletonRows`.
 */

import type { ReactNode } from "react"

export type EcosystraTableRowSize = "small" | "medium" | "large"

/** Pixel row heights from Vibe: small 32, medium 40 (default), large 48 */
export const ECOSYSTRA_TABLE_ROW_HEIGHT: Record<EcosystraTableRowSize, number> = {
  small: 32,
  medium: 40,
  large: 48,
}

export type EcosystraTableLoadingStateType =
  | "medium-text"
  | "long-text"
  | "short-text"
  | "circle"

export type EcosystraTableColumnWidth = number | { min: number; max: number }

export type EcosystraTableColumn = {
  id: string
  title: ReactNode
  /** Used by skeleton rows to pick placeholder shape */
  loadingStateType: EcosystraTableLoadingStateType
  width?: EcosystraTableColumnWidth
  /** Tooltip body for header info icon (Vibe `infoContent`) */
  infoContent?: string
  /** If set, show icon in header — Vibe: use icons on all headers or none (do/don’t) */
  icon?: ReactNode
}

export type EcosystraTableDataState = {
  isLoading?: boolean
  isError?: boolean
}

export type EcosystraTableSortState = "none" | "asc" | "desc"
