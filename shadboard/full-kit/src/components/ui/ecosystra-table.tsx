"use client"

import { forwardRef, useMemo } from "react"
import { GripVertical, Info, MoreHorizontal } from "lucide-react"

import type { LucideIcon } from "lucide-react"
import type {
  CSSProperties,
  ComponentProps,
  ReactElement,
  ReactNode,
} from "react"

import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TableColumnResizeHandle } from "./ecosystra-table-column-resize"

// --- Types (Bluprint/table.md) ------------------------------------------------

export type TableColumnLoadingType =
  | "medium-text"
  | "long-text"
  | "circle"
  | "short-text"

export type TableColumn = {
  id: string
  title?: ReactNode
  loadingStateType?: TableColumnLoadingType
  width?: number | { min: number; max: number }
  infoContent?: string
  icon?: LucideIcon
  /**
   * Pin this column on horizontal scroll (e.g. Task). Aligns skeleton loading with real rows.
   * @see Bluprint/table.md — sticky column
   */
  sticky?: boolean
  /**
   * Pin to the **right** edge (e.g. “Add column”) so it stays visible when the table scrolls horizontally.
   */
  stickyEnd?: boolean
  /**
   * When the sticky column is not the first column, set the left offset (Tailwind class), e.g. `left-12` after an avatar column.
   */
  stickyLeft?: string
}

export type TableDataState = {
  isLoading?: boolean
  isError?: boolean
}

export type RowSize = "small" | "medium" | "large"

const ROW_MIN_HEIGHT: Record<RowSize, string> = {
  small: "min-h-8",
  medium: "min-h-10",
  large: "min-h-12",
}

const CELL_PAD: Record<RowSize, string> = {
  small: "px-3 py-1.5",
  medium: "px-3 py-2",
  large: "px-4 py-2.5",
}

/** Keeps sticky cells above scrolling cells and separates them from the scroll area (Bluprint/table.md). */
const STICKY_HEADER_CELL =
  "sticky z-40 border-e border-border bg-background bg-clip-padding shadow-[4px_0_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_16px_-4px_rgba(0,0,0,0.45)]"

/** Match `TableRow` blue selection highlight on cells (see `STICKY_BODY_CELL` comment). */
const BODY_ROW_HIGHLIGHT_SYNC =
  "group-data-[highlighted=true]:bg-blue-50 group-data-[highlighted=true]:group-hover:!bg-blue-100 " +
  "group-data-[highlighted=true]/row:bg-blue-50 group-data-[highlighted=true]/row:group-hover:!bg-blue-100 " +
  "dark:group-data-[highlighted=true]:bg-blue-950/40 dark:group-data-[highlighted=true]:group-hover:!bg-blue-950/55 " +
  "dark:group-data-[highlighted=true]/row:bg-blue-950/40 dark:group-data-[highlighted=true]/row:group-hover:!bg-blue-950/55"

/**
 * Sticky body cells use opaque `bg-background`, which sits above `<tr>` paint, so row
 * highlight must be reapplied on cells when the parent row has `data-highlighted="true"`.
 * Supports unnamed `group` and `group/row` (sortable rows).
 */
const STICKY_BODY_CELL =
  "sticky z-30 border-e border-border bg-background bg-clip-padding shadow-[4px_0_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_16px_-4px_rgba(0,0,0,0.45)] group-hover:bg-muted/40 " +
  BODY_ROW_HIGHLIGHT_SYNC

/** Sticky on the trailing edge (horizontal scroll). */
const STICKY_HEADER_CELL_END =
  "sticky z-40 border-s border-border bg-background bg-clip-padding shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[-6px_0_16px_-4px_rgba(0,0,0,0.45)]"

const STICKY_BODY_CELL_END =
  "sticky z-30 border-s border-border bg-background bg-clip-padding shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[-6px_0_16px_-4px_rgba(0,0,0,0.45)] group-hover:bg-muted/40 " +
  BODY_ROW_HIGHLIGHT_SYNC

export function resolveTableColumnWidthPx(
  col: TableColumn,
  override?: Record<string, number>
): number {
  const o = override?.[col.id]
  if (typeof o === "number" && Number.isFinite(o) && o > 0) return o
  if (typeof col.width === "number") return col.width
  if (col.width && typeof col.width === "object") {
    const { min, max } = col.width
    return Math.min(max, Math.max(min, (min + max) / 2))
  }
  return 120
}

/** Sum of widths of sticky columns before `index` — use with `stickyLeftPx` on header/body cells. */
export function stickyLeftPxForColumnIndex(
  columns: TableColumn[],
  columnWidthsPx: Record<string, number> | undefined,
  index: number
): number | undefined {
  const col = columns[index]
  if (!col?.sticky) return undefined
  let left = 0
  for (let i = 0; i < index; i++) {
    const c = columns[i]
    if (c?.sticky) {
      left += resolveTableColumnWidthPx(c, columnWidthsPx)
    }
  }
  return left
}

// --- Table root ---------------------------------------------------------------

export type EcosystraTableProps = {
  id?: string
  /** Column metadata (widths, loading skeletons, info). Required by blueprint. */
  columns: TableColumn[]
  emptyState: ReactElement
  errorState: ReactElement
  dataState?: TableDataState
  /** When true, show `emptyState` instead of table body content. */
  isEmpty?: boolean
  size?: RowSize
  withoutBorder?: boolean
  className?: string
  style?: CSSProperties
  "data-testid"?: string
  children: ReactNode
  /** Merged pixel widths per column id (resize + defaults); drives `<colgroup>` */
  columnWidthsPx?: Record<string, number>
}

export function Table({
  id,
  columns,
  emptyState,
  errorState,
  dataState,
  isEmpty,
  size = "medium",
  withoutBorder = false,
  className,
  style,
  "data-testid": dataTestId,
  children,
  columnWidthsPx,
}: EcosystraTableProps) {
  /** Sum of column widths so `table-fixed` + `w-full` does not compress cols below colgroup on narrow viewports (mobile horizontal scroll). */
  const tableMinWidthPx = useMemo(
    () =>
      columns.reduce(
        (sum, col) => sum + resolveTableColumnWidthPx(col, columnWidthsPx),
        0
      ),
    [columns, columnWidthsPx]
  )

  if (dataState?.isError) {
    return (
      <div
        className={cn(
          "rounded-md text-sm",
          !withoutBorder && "border border-border",
          className
        )}
        style={style}
      >
        {errorState}
      </div>
    )
  }

  if (isEmpty && !dataState?.isLoading) {
    return (
      <div
        className={cn(
          "rounded-md text-sm",
          !withoutBorder && "border border-border",
          className
        )}
        style={style}
      >
        {emptyState}
      </div>
    )
  }

  return (
    <div
      data-slot="ecosystra-table-wrap"
      className={cn(
        "relative isolate w-full min-w-0 overflow-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]",
        className
      )}
      style={style}
    >
      <table
        id={id}
        data-testid={dataTestId}
        data-size={size}
        className={cn(
          "w-full table-fixed caption-bottom border-separate border-spacing-0 text-sm",
          !withoutBorder && "border border-border",
          "[&_tbody>tr>td]:border-b [&_tbody>tr>td]:border-border",
          "[&_thead>tr>th]:border-b [&_thead>tr>th]:border-border"
        )}
        style={{ minWidth: tableMinWidthPx }}
      >
        <colgroup>
          {columns.map((col) => (
            <col
              key={col.id}
              style={{
                width: resolveTableColumnWidthPx(col, columnWidthsPx),
              }}
            />
          ))}
        </colgroup>
        {dataState?.isLoading ? (
          <>
            <TableHeader>
              <TableRow size={size}>
                {columns.map((col, ci) => (
                  <TableHeaderCell
                    key={col.id}
                    title={col.title ?? col.id}
                    size={size}
                    sticky={!!col.sticky && !col.stickyEnd}
                    stickyEnd={col.stickyEnd}
                    stickyLeftClassName={col.stickyLeft}
                    stickyLeftPx={
                      col.stickyEnd
                        ? undefined
                        : stickyLeftPxForColumnIndex(
                            columns,
                            columnWidthsPx,
                            ci
                          )
                    }
                  />
                ))}
              </TableRow>
            </TableHeader>
            <tbody>
              {Array.from({ length: 5 }).map((_, ri) => (
                <TableRow key={ri} size={size}>
                  {columns.map((col, ci) => (
                    <TableCell
                      key={col.id}
                      size={size}
                      sticky={!!col.sticky && !col.stickyEnd}
                      stickyEnd={col.stickyEnd}
                      stickyLeftClassName={col.stickyLeft}
                      stickyLeftPx={
                        col.stickyEnd
                          ? undefined
                          : stickyLeftPxForColumnIndex(
                              columns,
                              columnWidthsPx,
                              ci
                            )
                      }
                    >
                      <LoadingCellPlaceholder type={col.loadingStateType} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  )
}

function LoadingCellPlaceholder({
  type = "medium-text",
}: {
  type?: TableColumnLoadingType
}) {
  if (type === "circle") {
    return (
      <div className="size-8 animate-pulse rounded-full bg-muted" aria-hidden />
    )
  }
  if (type === "long-text") {
    return (
      <div
        className="h-3 max-w-md animate-pulse rounded bg-muted"
        aria-hidden
      />
    )
  }
  if (type === "short-text") {
    return (
      <div className="h-3 w-12 animate-pulse rounded bg-muted" aria-hidden />
    )
  }
  return <div className="h-3 w-24 animate-pulse rounded bg-muted" aria-hidden />
}

// --- TableHeader / TableBody --------------------------------------------------

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  )
}

export type TableHeaderCellProps = Omit<ComponentProps<"th">, "title"> & {
  title?: ReactNode
  icon?: LucideIcon
  infoContent?: string
  sortState?: "none" | "asc" | "desc"
  onSortClicked?: (direction: "none" | "asc" | "desc") => void
  sortButtonAriaLabel?: string
  sticky?: boolean
  /** Tailwind `left-*` when sticky column is not first (e.g. `left-14`). Defaults to `left-0`. */
  stickyLeftClassName?: string
  /** Pixel `left` for sticky columns — overrides `stickyLeftClassName` when set (dynamic widths). */
  stickyLeftPx?: number
  /** Sticky right edge (e.g. add column). */
  stickyEnd?: boolean
  /** Pixel `right` when using `stickyEnd` (defaults to `right-0` class). */
  stickyRightPx?: number
  size?: RowSize
  /** Optional popup menu trigger on the right side. */
  menu?: ReactNode
  /** Drag handle on trailing edge (Monday-style column resize). */
  columnResize?: {
    minPx: number
    maxPx: number
    widthPx: number
    onResize: (nextWidthPx: number) => void
    onResizeCommit?: (finalWidthPx: number) => void
    showHandle: boolean
    ariaLabel: string
  }
  /** Center grab handle for column reorder (pass `dragHandleProps` from DnD `Draggable`). */
  columnDragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  columnDragAriaLabel?: string
  /** Horizontal alignment of header label (default start). */
  contentAlign?: "start" | "center"
  /** Long text: wrap instead of overflowing (adds break-words / min-w-0). */
  wordWrap?: boolean
}

export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(function TableHeaderCell(
  {
    className,
    title,
    children,
    icon: Icon,
    infoContent,
    sortState = "none",
    onSortClicked,
    sortButtonAriaLabel = "Sort",
    sticky,
    stickyLeftClassName,
    stickyLeftPx,
    stickyEnd,
    stickyRightPx,
    size = "medium",
    menu,
    columnResize,
    columnDragHandleProps,
    columnDragAriaLabel = "Reorder column",
    contentAlign = "start",
    wordWrap = false,
    style,
    ...props
  },
  ref
) {
  const content = children ?? (
    <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
      {Icon ? (
        <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
      ) : null}
      {title}
      {infoContent ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex rounded p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Column information"
              >
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              {infoContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </span>
  )

  const sortable = !!onSortClicked

  const cycle = () => {
    if (!onSortClicked) return
    const next: "none" | "asc" | "desc" =
      sortState === "none" ? "asc" : sortState === "asc" ? "desc" : "none"
    onSortClicked(next)
  }

  const stickyStyle: CSSProperties | undefined = stickyEnd
    ? stickyRightPx !== undefined
      ? { right: stickyRightPx }
      : undefined
    : sticky && stickyLeftPx !== undefined
      ? { left: stickyLeftPx }
      : undefined

  const mainBlock = sortable ? (
    <button
      type="button"
      className={cn(
        "inline-flex w-full min-w-0 items-center gap-1 hover:text-foreground",
        contentAlign === "center" ? "justify-center text-center" : "text-start"
      )}
      onClick={cycle}
      aria-label={sortButtonAriaLabel}
    >
      {content}
      <span className="text-[10px] opacity-70" aria-hidden>
        {sortState === "asc" ? "▲" : sortState === "desc" ? "▼" : "◇"}
      </span>
    </button>
  ) : (
    content
  )

  return (
    <th
      ref={ref}
      scope="col"
      data-slot="table-header-cell"
      data-sticky={sticky && !stickyEnd ? "true" : undefined}
      data-sticky-end={stickyEnd ? "true" : undefined}
      style={{ ...stickyStyle, ...style }}
      className={cn(
        "align-middle font-medium text-muted-foreground",
        contentAlign === "center" ? "text-center" : "text-start",
        wordWrap &&
          "min-w-0 whitespace-normal break-words [overflow-wrap:anywhere]",
        CELL_PAD[size],
        columnResize?.showHandle && "relative",
        columnDragHandleProps && "group/header-cell",
        stickyEnd
          ? cn(
              STICKY_HEADER_CELL_END,
              stickyRightPx === undefined ? "right-0" : undefined
            )
          : sticky
            ? cn(
                STICKY_HEADER_CELL,
                stickyLeftPx === undefined
                  ? (stickyLeftClassName ?? "left-0")
                  : undefined
              )
            : "relative z-0",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex min-h-9 min-w-0 items-center",
          contentAlign === "center" && "justify-center"
        )}
      >
        <div
          className={cn(
            "min-w-0",
            contentAlign === "center" ? "flex w-full justify-center" : "flex-1"
          )}
        >
          {mainBlock}
        </div>
        {menu ? (
          <div className="pointer-events-none absolute right-0 top-1/2 z-[46] -translate-y-1/2 opacity-0 transition-opacity group-hover/header-cell:pointer-events-auto group-hover/header-cell:opacity-100">
            {menu}
          </div>
        ) : null}
        {columnDragHandleProps ? (
          <button
            type="button"
            {...columnDragHandleProps}
            aria-label={columnDragAriaLabel}
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 z-[45] -translate-x-1/2 -translate-y-1/2 rounded border-0 bg-muted/90 p-1 opacity-0 shadow-sm outline-none transition-opacity hover:opacity-100 group-hover/header-cell:pointer-events-auto group-hover/header-cell:opacity-100",
              "cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <GripVertical
              className="size-4 text-muted-foreground"
              aria-hidden
            />
          </button>
        ) : null}
      </div>
      {columnResize?.showHandle ? (
        <TableColumnResizeHandle
          minPx={columnResize.minPx}
          maxPx={columnResize.maxPx}
          startWidthPx={columnResize.widthPx}
          onResize={columnResize.onResize}
          onResizeCommit={columnResize.onResizeCommit}
          ariaLabel={columnResize.ariaLabel}
        />
      ) : null}
    </th>
  )
})

TableHeaderCell.displayName = "TableHeaderCell"

/** @deprecated Prefer `TableHeaderCell` with `title` — alias for TanStack / legacy markup. */
export function TableHead(props: TableHeaderCellProps) {
  return <TableHeaderCell {...props} />
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child>td]:border-b-0", className)}
      {...props}
    />
  )
}

export type TableRowProps = ComponentProps<"tr"> & {
  highlighted?: boolean
  size?: RowSize
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    { className, highlighted, size = "medium", ...props },
    ref
  ) {
    return (
      <tr
        ref={ref}
        data-slot="table-row"
        data-highlighted={highlighted ? "true" : undefined}
        className={cn(
          "group transition-colors",
          ROW_MIN_HEIGHT[size],
          highlighted
            ? "border-l-4 border-l-blue-600 bg-blue-50 hover:bg-blue-100 dark:border-l-blue-500 dark:bg-blue-950/40 dark:hover:bg-blue-950/55"
            : "hover:bg-muted/40",
          className
        )}
        {...props}
      />
    )
  }
)

TableRow.displayName = "TableRow"

export type TableCellProps = ComponentProps<"td"> & {
  sticky?: boolean
  stickyLeftClassName?: string
  stickyLeftPx?: number
  stickyEnd?: boolean
  stickyRightPx?: number
  size?: RowSize
  contentAlign?: "start" | "center"
  wordWrap?: boolean
}

export function TableCell({
  className,
  sticky,
  stickyLeftClassName,
  stickyLeftPx,
  stickyEnd,
  stickyRightPx,
  size = "medium",
  contentAlign = "start",
  wordWrap = false,
  style,
  children,
  ...props
}: TableCellProps) {
  const stickyStyle: CSSProperties | undefined = stickyEnd
    ? stickyRightPx !== undefined
      ? { right: stickyRightPx }
      : undefined
    : sticky && stickyLeftPx !== undefined
      ? { left: stickyLeftPx }
      : undefined
  const inner =
    contentAlign === "center" ? (
      <div className="flex w-full min-w-0 justify-center">{children}</div>
    ) : (
      children
    )
  return (
    <td
      data-slot="table-cell"
      data-sticky={sticky && !stickyEnd ? "true" : undefined}
      data-sticky-end={stickyEnd ? "true" : undefined}
      style={{ ...stickyStyle, ...style }}
      className={cn(
        "align-middle text-foreground",
        contentAlign === "center" ? "text-center" : "text-start",
        wordWrap &&
          "min-w-0 whitespace-normal break-words [overflow-wrap:anywhere]",
        CELL_PAD[size],
        stickyEnd
          ? cn(
              STICKY_BODY_CELL_END,
              stickyRightPx === undefined ? "right-0" : undefined
            )
          : sticky
            ? cn(
                STICKY_BODY_CELL,
                stickyLeftPx === undefined
                  ? (stickyLeftClassName ?? "left-0")
                  : undefined
              )
            : cn("relative z-0", BODY_ROW_HIGHLIGHT_SYNC),
        "[&:has([role=checkbox])]:pe-0",
        className
      )}
      {...props}
    >
      {inner}
    </td>
  )
}

export type TableRowHeaderCellProps = ComponentProps<"th"> & {
  sticky?: boolean
  stickyLeftClassName?: string
  stickyLeftPx?: number
  size?: RowSize
  contentAlign?: "start" | "center"
  wordWrap?: boolean
}

/** Use for the primary row label column (e.g. task name) per WCAG table header semantics. */
export function TableRowHeaderCell({
  className,
  sticky,
  stickyLeftClassName,
  stickyLeftPx,
  size = "medium",
  contentAlign = "start",
  wordWrap = false,
  scope = "row",
  style,
  children,
  ...props
}: TableRowHeaderCellProps) {
  const stickyStyle: CSSProperties | undefined =
    sticky && stickyLeftPx !== undefined ? { left: stickyLeftPx } : undefined
  return (
    <th
      scope={scope}
      data-slot="table-row-header-cell"
      data-sticky={sticky ? "true" : undefined}
      style={{ ...stickyStyle, ...style }}
      className={cn(
        "align-middle font-medium text-foreground",
        contentAlign === "center" ? "text-center" : "text-start",
        wordWrap &&
          "min-w-0 whitespace-normal break-words [overflow-wrap:anywhere]",
        CELL_PAD[size],
        sticky
          ? cn(
              STICKY_BODY_CELL,
              stickyLeftPx === undefined
                ? (stickyLeftClassName ?? "left-0")
                : undefined
            )
          : cn("relative z-0", BODY_ROW_HIGHLIGHT_SYNC),
        className
      )}
      {...props}
    >
      {contentAlign === "center" ? (
        <div className="flex w-full min-w-0 justify-center">{children}</div>
      ) : (
        children
      )}
    </th>
  )
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium last:[&>tr]:border-b-0",
        className
      )}
      {...props}
    />
  )
}

export function TableCaption({
  className,
  ...props
}: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}
