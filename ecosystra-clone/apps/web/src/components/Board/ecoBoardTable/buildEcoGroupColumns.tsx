import React from "react";
import { ChevronDown, Copy, Star } from "lucide-react";
import {
  createColumnHelper,
  type ColumnDef as TanStackColumnDef,
} from "@tanstack/react-table";
import type { BoardItem, ColumnDef } from "../boardTypes";
import { findConditionalRule } from "./conditionalFormatting";

const helper = createColumnHelper<BoardItem>();

export type EcoGroupViewSettings = {
  pinnedColumnsCount?: number;
  conditionalColoring?: Array<{
    columnId?: string;
    value?: string;
    scope?: "row" | "cell";
    color?: string;
  }>;
};

export type EcoGroupColumnBuilderInput = {
  groupColor: string;
  currentColumns: ColumnDef[];
  hiddenColumns: string[];
  viewSettings?: EcoGroupViewSettings;
  getPinnedLeft: (id: string, cols: ColumnDef[], level?: number) => number;
  expandedSubitems: Set<string>;
  toggleSubitems: (id: string) => void;
  selectedItem: BoardItem | null | undefined;
  editingItem: string | null;
  editValue: string;
  setEditValue: (v: string) => void;
  startEditItem: (id: string, name: string) => void;
  finishEditItem: (id: string) => void;
  onItemClick?: (item: BoardItem) => void;
  clickTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  editRef: React.RefObject<HTMLInputElement | null>;
  renderCell: (column: ColumnDef, item: BoardItem, itemId: string) => React.ReactNode;
  handleContextMenu: (e: React.MouseEvent, item: BoardItem) => void;
};

function itemRowStyle(
  item: BoardItem,
  rowHeight: number,
  viewSettings: EcoGroupViewSettings | undefined,
): React.CSSProperties {
  const rowStyle: React.CSSProperties = { height: rowHeight };
  const matchingRule = findConditionalRule(item, viewSettings);
  if (matchingRule && matchingRule.scope === "row" && matchingRule.color) {
    rowStyle.backgroundColor = `${matchingRule.color}15`;
    rowStyle.borderLeft = `4px solid ${matchingRule.color}`;
  }
  return rowStyle;
}

export function buildEcoGroupColumns(
  opts: EcoGroupColumnBuilderInput,
): TanStackColumnDef<BoardItem>[] {
  const visibleCols = opts.currentColumns.filter(
    (c) => !opts.hiddenColumns.includes(c.id),
  );

  const nameCol = helper.display({
    id: "name",
    size: 300,
    cell: (ctx) => {
      const item = ctx.row.original;
      const pinned = (opts.viewSettings?.pinnedColumnsCount ?? 0) > 0;
      return (
        <div
          className={`item-name ${pinned ? "sticky-column" : ""}`}
          style={
            pinned
              ? {
                  left: opts.getPinnedLeft("name", opts.currentColumns, 0),
                  width: 300,
                }
              : { width: 300 }
          }
          onClick={(e) => {
            e.stopPropagation();
            if (opts.editingItem === item.id) return;

            if (opts.clickTimeoutRef.current) {
              clearTimeout(opts.clickTimeoutRef.current);
              opts.clickTimeoutRef.current = null;
              opts.startEditItem(item.id, item.name);
            } else {
              opts.clickTimeoutRef.current = setTimeout(() => {
                opts.onItemClick?.(item);
                opts.clickTimeoutRef.current = null;
              }, 250);
            }
          }}
        >
          {opts.editingItem === item.id ? (
            <input
              ref={opts.editRef}
              className="item-name-input"
              value={opts.editValue}
              onChange={(e) => opts.setEditValue(e.target.value)}
              onBlur={() => opts.finishEditItem(item.id)}
              onKeyDown={(e) =>
                e.key === "Enter" && opts.finishEditItem(item.id)
              }
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={!item.name ? "item-name-placeholder" : ""}>
              {item.name || "Type a name..."}
            </span>
          )}
          <div className="item-hover-actions">
            <Star size={13} />
            <Copy size={13} />
            {item.subitems && item.subitems.length > 0 && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                {item.subitems.length}
              </span>
            )}
          </div>
        </div>
      );
    },
  });

  const indicator = helper.display({
    id: "indicator",
    size: 6,
    minSize: 6,
    maxSize: 6,
    cell: () => (
      <div className="group-indicator" style={{ background: opts.groupColor }} />
    ),
  });

  const selectCol = helper.display({
    id: "select",
    size: 38,
    cell: () => (
      <div className="item-checkbox">
        <input type="checkbox" />
      </div>
    ),
  });

  const expandCol = helper.display({
    id: "expand",
    size: 38,
    cell: (ctx) => {
      const item = ctx.row.original;
      const isExpanded = opts.expandedSubitems.has(item.id);
      const hasSubitems = !!(item.subitems && item.subitems.length > 0);
      return (
        <div
          className="subitem-toggle"
          onClick={(e) => {
            e.stopPropagation();
            opts.toggleSubitems(item.id);
          }}
          style={{ cursor: "pointer" }}
        >
          <ChevronDown
            size={14}
            style={{
              transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 150ms ease",
              color: "var(--text-secondary)",
              opacity: hasSubitems ? 1 : 0.3,
            }}
          />
        </div>
      );
    },
  });

  const dynamicCols = visibleCols.map((col, idx) =>
    helper.display({
      id: `dyn_${col.id}`,
      size: col.width || 140,
      cell: (ctx) => {
        const item = ctx.row.original;
        const matchingRule = findConditionalRule(item, opts.viewSettings);
        const isPinned =
          opts.viewSettings?.pinnedColumnsCount &&
          opts.viewSettings.pinnedColumnsCount > idx + 1;
        const cellStyle: React.CSSProperties = {
          width: col.width || 140,
        };

        if (isPinned) {
          cellStyle.position = "sticky";
          cellStyle.left = opts.getPinnedLeft(col.id, opts.currentColumns, 0);
          cellStyle.zIndex = 10;
          cellStyle.backgroundColor = "white";
          cellStyle.boxShadow = "inset -1px 0 0 var(--border-default)";
        }

        if (
          matchingRule &&
          matchingRule.scope === "cell" &&
          matchingRule.columnId === col.id &&
          matchingRule.color
        ) {
          cellStyle.backgroundColor = `${matchingRule.color}30`;
          cellStyle.borderBottom = `2px solid ${matchingRule.color}`;
        }

        return (
          <div
            className={`item-cell ${isPinned ? "sticky-column" : ""}`}
            style={cellStyle}
          >
            {opts.renderCell(col, item, item.id)}
          </div>
        );
      },
    }),
  );

  const trail = helper.display({
    id: "trail",
    size: 40,
    minSize: 40,
    maxSize: 40,
    cell: () => <div style={{ width: 40 }} />,
  });

  return [indicator, selectCol, expandCol, nameCol, ...dynamicCols, trail];
}

export function getEcoItemRowStyle(
  item: BoardItem,
  rowHeight: number,
  viewSettings?: EcoGroupViewSettings,
): React.CSSProperties {
  return itemRowStyle(item, rowHeight, viewSettings);
}
