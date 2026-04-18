"use client"

/**
 * Ecosystra **Table** — Vibe **Components/Table** (GRANDBOOK → `components-table--docs` … `components-table--highlighted-row`).
 *
 * **Usage**
 * - Organize dense data; keep **horizontal row borders** — do not remove row separators (Vibe do/don’t).
 * - **Outer border** optional (`withoutBorder`); inside modals prefer borderless outer frame.
 * - **Icons in headers**: either **all** columns get an icon or **none** (consistency).
 * - **Attention box / alert banner**: use for different scopes per GRANDBOOK — table is for tabular data.
 *
 * **API** — `columns` defines `colgroup` + skeleton shapes; pass **`emptyState` / `errorState`** (Vibe required).
 * **`dataState.isError`** → root renders `errorState` only. Loading / empty are composed with **`EcosystraTableSkeletonRows`**
 * and a `colSpan` empty row (see module examples).
 *
 * **Sizes** — `small` (32px), `medium` (40px default), `large` (48px).
 */

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Info,
} from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react"

import type { ComponentProps, CSSProperties, ReactNode } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/utils"

import type {
  EcosystraTableColumn,
  EcosystraTableDataState,
  EcosystraTableLoadingStateType,
  EcosystraTableRowSize,
  EcosystraTableSortState,
} from "./ecosystra-table-types"
import styles from "./ecosystra-table.module.css"

export type {
  EcosystraTableColumn,
  EcosystraTableDataState,
  EcosystraTableLoadingStateType,
  EcosystraTableRowSize,
  EcosystraTableSortState,
} from "./ecosystra-table-types"
export { ECOSYSTRA_TABLE_ROW_HEIGHT } from "./ecosystra-table-types"

const TableCtx = createContext<{ size: EcosystraTableRowSize }>({
  size: "medium",
})

function useEcosystraTableSize() {
  return useContext(TableCtx).size
}

function colWidthStyle(
  width: EcosystraTableColumn["width"]
): CSSProperties | undefined {
  if (width == null) return undefined
  if (typeof width === "number") return { width, minWidth: width }
  return {
    minWidth: width.min,
    maxWidth: width.max,
    width: "auto",
  }
}

export type EcosystraTableProps = {
  id?: string
  /** Required — drives `<colgroup>` widths and skeleton column shapes */
  columns: EcosystraTableColumn[]
  /** Required — shown when `dataState.isError` */
  errorState: ReactNode
  /**
   * Required (Vibe parity) — pass the same node you render inside `EcosystraTableEmptyRow`
   * when there are no data rows (the root does not inject it automatically).
   */
  emptyState: ReactNode
  dataState?: EcosystraTableDataState
  size?: EcosystraTableRowSize
  withoutBorder?: boolean
  /** Scroll region max height — Vibe scroll story */
  maxHeight?: number | string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function EcosystraTable({
  id,
  columns,
  errorState,
  emptyState: _emptyState,
  dataState,
  size = "medium",
  withoutBorder = false,
  maxHeight,
  className,
  style,
  children,
}: EcosystraTableProps) {
  const ctx = useMemo(() => ({ size }), [size])

  if (dataState?.isError) {
    return (
      <div
        role="alert"
        className={cn(styles.shell, styles.errorWrap, className)}
        style={style}
      >
        {errorState}
      </div>
    )
  }

  const scrollStyle: CSSProperties | undefined =
    maxHeight != null
      ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
      : undefined

  return (
    <TableCtx.Provider value={ctx}>
      <div
        data-ecosystra-table=""
        className={cn(
          styles.shell,
          !withoutBorder && styles.shellWithBorder,
          size === "small" && styles.sizeSmall,
          size === "medium" && styles.sizeMedium,
          size === "large" && styles.sizeLarge,
          className
        )}
        style={style}
      >
        <TooltipProvider delayDuration={200}>
        <div className={styles.scroll} style={scrollStyle}>
          <table
            id={id}
            className={styles.table}
            data-table-size={size}
            data-without-border={withoutBorder ? "true" : undefined}
          >
            <colgroup>
              {columns.map((c) => (
                <col key={c.id} style={colWidthStyle(c.width)} />
              ))}
            </colgroup>
            {children}
          </table>
        </div>
        </TooltipProvider>
      </div>
    </TableCtx.Provider>
  )
}

export function EcosystraTableHeader({
  className,
  ...props
}: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="ecosystra-table-header"
      className={cn(styles.headerRow, className)}
      {...props}
    />
  )
}

export type EcosystraTableHeaderCellProps = Omit<
  ComponentProps<"th">,
  "title"
> & {
  title: ReactNode
  icon?: ReactNode
  infoContent?: string
  sortState?: EcosystraTableSortState
  onSortClicked?: (direction: EcosystraTableSortState) => void
  /** Vibe default: "Sort" */
  sortButtonAriaLabel?: string
  sticky?: boolean
}

export function EcosystraTableHeaderCell({
  title,
  icon,
  infoContent,
  sortState = "none",
  onSortClicked,
  sortButtonAriaLabel = "Sort",
  sticky,
  className,
  ...props
}: EcosystraTableHeaderCellProps) {
  const cycleSort = useCallback(() => {
    if (!onSortClicked) return
    const next: EcosystraTableSortState =
      sortState === "none"
        ? "asc"
        : sortState === "asc"
          ? "desc"
          : "none"
    onSortClicked(next)
  }, [onSortClicked, sortState])

  const SortIcon =
    sortState === "asc"
      ? ArrowUp
      : sortState === "desc"
        ? ArrowDown
        : ArrowUpDown

  return (
    <th
      scope="col"
      data-slot="ecosystra-table-header-cell"
      className={cn(
        styles.th,
        styles.cell,
        sticky && styles.stickyHeaderCell,
        className
      )}
      {...props}
    >
      <div className={styles.headerInner}>
        {icon ? <span className="shrink-0 text-muted-foreground">{icon}</span> : null}
        <span className="min-w-0 truncate font-[inherit]">{title}</span>
        {infoContent ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={infoContent}
              >
                <Info className="size-3.5" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              {infoContent}
            </TooltipContent>
          </Tooltip>
        ) : null}
        {onSortClicked ? (
          <button
            type="button"
            className={styles.sortBtn}
            aria-label={sortButtonAriaLabel}
            onClick={cycleSort}
          >
            <SortIcon className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </th>
  )
}

export function EcosystraTableBody({
  className,
  ...props
}: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="ecosystra-table-body"
      className={className}
      {...props}
    />
  )
}

export type EcosystraTableRowProps = ComponentProps<"tr"> & {
  highlighted?: boolean
}

export function EcosystraTableRow({
  highlighted,
  className,
  ...props
}: EcosystraTableRowProps) {
  return (
    <tr
      data-slot="ecosystra-table-row"
      data-highlighted={highlighted ? "true" : undefined}
      className={cn(
        styles.bodyRow,
        highlighted && styles.bodyRowHighlighted,
        className
      )}
      {...props}
    />
  )
}

export type EcosystraTableCellProps = ComponentProps<"td"> & {
  sticky?: boolean
  /** Right-align numeric columns (Vibe email counts) */
  numeric?: boolean
  /** Truncate overflowing text with ellipsis */
  truncate?: boolean
}

export function EcosystraTableCell({
  sticky,
  numeric,
  truncate: doTruncate,
  className,
  children,
  ...props
}: EcosystraTableCellProps) {
  return (
    <td
      data-slot="ecosystra-table-cell"
      className={cn(
        styles.td,
        styles.cell,
        sticky && styles.stickyBodyCell,
        numeric && styles.tdNumeric,
        doTruncate && "min-w-0",
        className
      )}
      {...props}
    >
      {doTruncate ? (
        <span
          className={styles.truncate}
          title={typeof children === "string" ? children : undefined}
        >
          {children}
        </span>
      ) : (
        children
      )}
    </td>
  )
}

/** Full-width empty body — pair with `emptyState` from `EcosystraTable` props */
export function EcosystraTableEmptyRow({
  colSpan,
  children,
  className,
  ...props
}: ComponentProps<"td"> & { colSpan: number }) {
  return (
    <tr data-slot="ecosystra-table-empty-row" className={styles.bodyRow}>
      <td
        colSpan={colSpan}
        className={cn(styles.td, styles.emptyCell, className)}
        {...props}
      >
        {children}
      </td>
    </tr>
  )
}

function SkeletonCell({ type }: { type: EcosystraTableLoadingStateType }) {
  switch (type) {
    case "circle":
      return <Skeleton className="size-7 shrink-0 rounded-full" />
    case "long-text":
      return (
        <Skeleton className="h-4 w-full max-w-[min(100%,20rem)]" />
      )
    case "short-text":
      return <Skeleton className="h-4 w-16" />
    case "medium-text":
    default:
      return <Skeleton className="h-4 w-28" />
  }
}

export function EcosystraTableSkeletonRows({
  columns,
  rowCount = 5,
}: {
  columns: EcosystraTableColumn[]
  rowCount?: number
}) {
  const rows = useMemo(
    () => Array.from({ length: rowCount }, (_, i) => i),
    [rowCount]
  )
  return (
    <>
      {rows.map((i) => (
        <EcosystraTableRow key={i}>
          {columns.map((col) => (
            <EcosystraTableCell key={col.id}>
              <SkeletonCell type={col.loadingStateType} />
            </EcosystraTableCell>
          ))}
        </EcosystraTableRow>
      ))}
    </>
  )
}

/** Vibe `TableAvatar` — initials on a solid circular surface */
export function EcosystraTableAvatar({
  text,
  className,
  ...props
}: { text: string } & ComponentProps<typeof Avatar>) {
  const initials = getInitials(text) || "?"
  return (
    <Avatar
      className={cn(
        "size-7 shrink-0 rounded-full border-0 bg-violet-600 text-[0.65rem] font-semibold uppercase text-white",
        className
      )}
      {...props}
    >
      <AvatarFallback className="rounded-full border-0 bg-violet-600 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

/** Vibe `Label` — semantic status chip; map product colors to badges */
export function EcosystraTableLabel({
  text,
  color = "positive",
  className,
  ...props
}: {
  text: string
  color?: "positive" | "negative" | "primary" | "neutral" | "warning"
} & ComponentProps<typeof Badge>) {
  const cls =
    color === "positive"
      ? "border-0 bg-emerald-600 text-white hover:bg-emerald-600"
      : color === "negative"
        ? "border-0 bg-red-600 text-white hover:bg-red-600"
        : color === "warning"
          ? "border-0 bg-amber-500 text-amber-950 hover:bg-amber-500"
          : color === "primary"
            ? "border-0 bg-slate-800 text-white hover:bg-slate-800"
            : "border-border bg-muted text-foreground"

  return (
    <Badge
      data-ecosystra-table-label=""
      className={cn(
        "rounded-md px-2 py-0.5 text-xs font-semibold",
        cls,
        className
      )}
      {...props}
    >
      {text}
    </Badge>
  )
}
