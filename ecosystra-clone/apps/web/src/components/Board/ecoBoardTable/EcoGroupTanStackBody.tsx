import React, { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { BoardGroup, BoardItem, ColumnDef } from "../boardTypes";
import {
  buildEcoGroupColumns,
  getEcoItemRowStyle,
  type EcoGroupViewSettings,
} from "./buildEcoGroupColumns";

export type EcoGroupTanStackBodyProps = {
  group: BoardGroup;
  items: BoardItem[];
  columns: ColumnDef[];
  hiddenColumns: string[];
  viewSettings: {
    itemHeight?: "single" | "double" | "triple";
    pinnedColumns?: boolean;
    pinnedColumnsCount?: number;
    conditionalColoring?: EcoGroupViewSettings["conditionalColoring"];
    defaultValues?: Record<string, unknown>;
  };
  rowHeight: number;
  getPinnedLeft: (
    id: string,
    cols: ColumnDef[],
    level?: number,
  ) => number;
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
  renderCell: (
    column: ColumnDef,
    item: BoardItem,
    itemId: string,
  ) => React.ReactNode;
  handleContextMenu: (e: React.MouseEvent, item: BoardItem) => void;
  /** Subitem tree + headers (same block as legacy `renderItem` expansion). */
  renderSubitemsAfterRow: (item: BoardItem) => React.ReactNode;
};

export function EcoGroupTanStackBody(props: EcoGroupTanStackBodyProps) {
  const {
    group,
    items,
    columns,
    hiddenColumns,
    viewSettings,
    rowHeight,
    getPinnedLeft,
    expandedSubitems,
    toggleSubitems,
    selectedItem,
    editingItem,
    editValue,
    setEditValue,
    startEditItem,
    finishEditItem,
    onItemClick,
    clickTimeoutRef,
    editRef,
    renderCell,
    handleContextMenu,
    renderSubitemsAfterRow,
  } = props;

  const table = useReactTable({
    data: items,
    columns: useMemo(
      () =>
        buildEcoGroupColumns({
          groupColor: group.color,
          currentColumns: columns,
          hiddenColumns,
          viewSettings,
          getPinnedLeft,
          expandedSubitems,
          toggleSubitems,
          selectedItem,
          editingItem,
          editValue,
          setEditValue,
          startEditItem,
          finishEditItem,
          onItemClick,
          clickTimeoutRef,
          editRef,
          renderCell,
          handleContextMenu,
        }),
      [
        group.color,
        columns,
        hiddenColumns,
        viewSettings,
        getPinnedLeft,
        expandedSubitems,
        toggleSubitems,
        selectedItem,
        editingItem,
        editValue,
        setEditValue,
        startEditItem,
        finishEditItem,
        onItemClick,
        clickTimeoutRef,
        editRef,
        renderCell,
        handleContextMenu,
      ],
    ),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <React.Fragment key={row.id}>
          <div
            className={`item-row ${selectedItem?.id === row.original.id ? "selected" : ""}`}
            style={getEcoItemRowStyle(row.original, rowHeight, viewSettings)}
            onContextMenu={(e) => handleContextMenu(e, row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <React.Fragment key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </React.Fragment>
            ))}
          </div>
          {renderSubitemsAfterRow(row.original)}
        </React.Fragment>
      ))}
    </>
  );
}
