"use client"

import { useCallback, useMemo } from "react"
import { Plus, Trash2 } from "lucide-react"

import {
  BOARD_UNASSIGNED_PERSON_ID,
  advancedTreeIsActive,
  buildFacetsForColumn,
  conditionsForValueKind,
  newAdvancedNodeId,
  type AdvancedFilterGroupNode,
  type AdvancedFilterNode,
  type AdvancedFilterRuleNode,
  type BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import type { DuePriorityLabel } from "./hooks/use-ecosystra-board-apollo"
import type { GqlBoardGroup, TableCustomColumnDef } from "./hooks/use-ecosystra-board-apollo"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type WorkspaceUser = { id: string; name: string | null; email: string }

function userLabel(
  id: string,
  users: WorkspaceUser[],
  dict: Record<string, string>
): string {
  if (id === BOARD_UNASSIGNED_PERSON_ID)
    return dict.filterUnassignedFacet ?? "Unassigned"
  const u = users.find((x) => x.id === id)
  return (u?.name || u?.email || id).trim()
}

function updateNodeById(
  node: AdvancedFilterNode | null,
  id: string,
  fn: (n: AdvancedFilterNode) => AdvancedFilterNode | null
): AdvancedFilterNode | null {
  if (!node) return null
  if (node.id === id) return fn(node)
  if (node.type === "group") {
    const children = node.children
      .map((c) => updateNodeById(c, id, fn))
      .filter((x): x is AdvancedFilterNode => x !== null)
    return { ...node, children }
  }
  return node
}

function appendChildToGroup(
  root: AdvancedFilterNode | null,
  groupId: string,
  child: AdvancedFilterNode
): AdvancedFilterNode | null {
  if (!root) {
    return {
      type: "group",
      id: newAdvancedNodeId("grp"),
      combinator: "AND",
      children: [child],
    }
  }
  return updateNodeById(root, groupId, (g) => {
    if (g.type !== "group") return g
    return { ...g, children: [...g.children, child] }
  })
}

function defaultRule(
  columns: BoardFilterColumnMeta[]
): AdvancedFilterRuleNode | null {
  const first = columns[0]
  if (!first) return null
  const conds = conditionsForValueKind(first.valueKind)
  return {
    type: "rule",
    id: newAdvancedNodeId("rule"),
    columnId: first.id,
    condition: conds[0]?.value ?? "is",
    value: "",
  }
}

function defaultSubgroup(): AdvancedFilterGroupNode {
  return {
    type: "group",
    id: newAdvancedNodeId("grp"),
    combinator: "OR",
    children: [],
  }
}

export function AdvancedFilterTreeEditor({
  root,
  onChange,
  columns,
  dict,
  groups,
  tableCustomColumns,
  labels,
  workspaceUsers,
  depth = 0,
}: {
  root: AdvancedFilterNode | null
  onChange: (next: AdvancedFilterNode | null) => void
  columns: BoardFilterColumnMeta[]
  dict: Record<string, string>
  groups: GqlBoardGroup[]
  tableCustomColumns: Record<string, TableCustomColumnDef>
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  }
  workspaceUsers: WorkspaceUser[]
  depth?: number
}) {
  const colById = useMemo(() => new Map(columns.map((c) => [c.id, c])), [columns])

  const facetOptions = useCallback(
    (columnId: string) => {
      const col = colById.get(columnId)
      if (!col) return []
      const raw = buildFacetsForColumn(
        col,
        groups,
        tableCustomColumns,
        labels,
        40
      )
      return raw.map((f) => {
        if (col.kind === "assignee" || col.kind === "owner") {
          return {
            ...f,
            label:
              f.key === BOARD_UNASSIGNED_PERSON_ID
                ? dict.filterUnassignedFacet ?? "Unassigned"
                : userLabel(f.key, workspaceUsers, dict),
          }
        }
        return f
      })
    },
    [colById, dict, groups, labels, tableCustomColumns, workspaceUsers]
  )

  const ensureRootGroup = useCallback((): AdvancedFilterGroupNode => {
    if (root && root.type === "group") return root
    return {
      type: "group",
      id: newAdvancedNodeId("grp"),
      combinator: "AND",
      children: [],
    }
  }, [root])

  const patchRoot = useCallback(
    (next: AdvancedFilterNode | null) => {
      onChange(next)
    },
    [onChange]
  )

  const updateRule = (id: string, patch: Partial<AdvancedFilterRuleNode>) => {
    const base = root ?? ensureRootGroup()
    const next = updateNodeById(base, id, (n) => {
      if (n.type !== "rule") return n
      return { ...n, ...patch }
    })
    patchRoot(next)
  }

  const removeNode = (id: string) => {
    if (!root) return
    const next = updateNodeById(root, id, () => null)
    patchRoot(next && advancedTreeIsActive(next) ? next : null)
  }

  const setCombinator = (id: string, comb: "AND" | "OR") => {
    if (!root) return
    const next = updateNodeById(root, id, (n) => {
      if (n.type !== "group") return n
      return { ...n, combinator: comb }
    })
    patchRoot(next)
  }

  const addRuleHere = () => {
    const dr = defaultRule(columns)
    if (!dr) return
    if (!root) {
      patchRoot({
        type: "group",
        id: newAdvancedNodeId("grp"),
        combinator: "AND",
        children: [dr],
      })
      return
    }
    if (root.type !== "group") return
    patchRoot(appendChildToGroup(root, root.id, dr))
  }

  const addSubgroupHere = () => {
    if (!root) {
      patchRoot({
        type: "group",
        id: newAdvancedNodeId("grp"),
        combinator: "AND",
        children: [defaultSubgroup()],
      })
      return
    }
    if (root.type !== "group") return
    patchRoot(appendChildToGroup(root, root.id, defaultSubgroup()))
  }

  if (!root) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{dict.advancedFiltersEmpty}</p>
        <Button type="button" variant="outline" size="sm" onClick={addRuleHere}>
          <Plus className="me-1 size-4" />
          {dict.advancedNewFilter}
        </Button>
      </div>
    )
  }

  if (root.type === "rule") {
    return (
      <RuleRow
        rule={root}
        columns={columns}
        colById={colById}
        dict={dict}
        facetOptions={facetOptions}
        onPatch={(p) => updateRule(root.id, p)}
        onRemove={() => removeNode(root.id)}
        showWhere={depth === 0}
      />
    )
  }

  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border border-border/60 bg-muted/10 p-2",
        depth > 0 && "ms-2 border-dashed"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">
            {dict.advancedGroupMatch}
          </Label>
          <Select
            value={root.combinator}
            onValueChange={(v) =>
              setCombinator(root.id, v as "AND" | "OR")
            }
          >
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {depth > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-destructive"
            onClick={() => removeNode(root.id)}
          >
            <Trash2 className="me-1 size-3.5" />
            {dict.advancedRemoveGroup}
          </Button>
        ) : null}
      </div>
      {root.children.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          {dict.advancedGroupEmpty}
        </p>
      ) : null}
      {root.children.map((ch, idx) => (
        <div key={ch.id} className="flex flex-wrap items-start gap-2">
          <span className="mt-2 w-14 shrink-0 text-xs font-medium text-muted-foreground">
            {idx === 0 ? dict.advancedWhere : root.combinator}
          </span>
          <div className="min-w-0 flex-1">
            {ch.type === "rule" ? (
              <RuleRow
                rule={ch}
                columns={columns}
                colById={colById}
                dict={dict}
                facetOptions={facetOptions}
                onPatch={(p) => updateRule(ch.id, p)}
                onRemove={() => removeNode(ch.id)}
                showWhere={false}
              />
            ) : (
              <AdvancedFilterTreeEditor
                root={ch}
                onChange={(nextChild) => {
                  const next = updateNodeById(root, ch.id, () => nextChild)
                  patchRoot(next)
                }}
                columns={columns}
                dict={dict}
                groups={groups}
                tableCustomColumns={tableCustomColumns}
                labels={labels}
                workspaceUsers={workspaceUsers}
                depth={depth + 1}
              />
            )}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            const dr = defaultRule(columns)
            if (!dr) return
            const next = appendChildToGroup(root, root.id, dr)
            patchRoot(next)
          }}
        >
          <Plus className="me-1 size-3.5" />
          {dict.advancedNewFilter}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            const sub = defaultSubgroup()
            const next = appendChildToGroup(root, root.id, sub)
            patchRoot(next)
          }}
        >
          <Plus className="me-1 size-3.5" />
          {dict.advancedNewGroup}
        </Button>
      </div>
    </div>
  )
}

function RuleRow({
  rule,
  columns,
  colById,
  dict,
  facetOptions,
  onPatch,
  onRemove,
  showWhere,
}: {
  rule: AdvancedFilterRuleNode
  columns: BoardFilterColumnMeta[]
  colById: Map<string, BoardFilterColumnMeta>
  dict: Record<string, string>
  facetOptions: (columnId: string) => ReturnType<typeof buildFacetsForColumn>
  onPatch: (p: Partial<AdvancedFilterRuleNode>) => void
  onRemove: () => void
  showWhere: boolean
}) {
  const col = colById.get(rule.columnId) ?? columns[0]
  const condOpts = conditionsForValueKind(col?.valueKind ?? "text")
  const facets = facetOptions(rule.columnId)
  return (
    <div className="flex flex-wrap items-end gap-2 rounded-md border border-border/50 bg-background/80 p-2">
      {showWhere ? (
        <span className="mb-2 w-14 shrink-0 text-xs font-medium text-muted-foreground">
          {dict.advancedWhere}
        </span>
      ) : null}
      <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-muted-foreground">
            {dict.advancedColumn}
          </Label>
          <Select
            value={rule.columnId}
            onValueChange={(columnId) => {
              const nextCol = colById.get(columnId)
              const nextCond = nextCol
                ? conditionsForValueKind(nextCol.valueKind)[0]?.value ?? "is"
                : "is"
              onPatch({ columnId, condition: nextCond, value: "" })
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {columns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-muted-foreground">
            {dict.advancedCondition}
          </Label>
          <Select
            value={rule.condition}
            onValueChange={(condition) => onPatch({ condition })}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {condOpts.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-muted-foreground">
            {dict.advancedValue}
          </Label>
          {rule.condition === "is_empty" ||
          rule.condition === "is_not_empty" ? (
            <div className="flex h-9 items-center text-xs text-muted-foreground">
              —
            </div>
          ) : facets.length > 0 &&
            col &&
            (col.valueKind === "text" ||
              col.valueKind === "group" ||
              col.valueKind === "taskName" ||
              col.valueKind === "users" ||
              col.valueKind === "number") ? (
            <Select
              value={rule.value || "__none__"}
              onValueChange={(value) =>
                onPatch({ value: value === "__none__" ? "" : value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">—</SelectItem>
                {facets.map((f) => (
                  <SelectItem key={f.key} value={f.key}>
                    {f.label} ({f.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={rule.value}
              onChange={(e) => onPatch({ value: e.target.value })}
              aria-label={dict.advancedValue}
            />
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-label={dict.advancedRemoveRule}
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
