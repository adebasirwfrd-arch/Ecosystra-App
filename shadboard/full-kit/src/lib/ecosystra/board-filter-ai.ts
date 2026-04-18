/**
 * Server-side helpers for `/api/ecosystra/board-filter-ai`.
 * Heuristic path works without API keys; OpenAI path returns richer nested trees.
 */

import {
  BOARD_UNASSIGNED_PERSON_ID,
  type AdvancedFilterNode,
  newAdvancedNodeId,
  safeParseAdvancedRoot,
} from "@/components/ecosystra/ecosystra-board-filter-engine"

export type BoardFilterAiColumnHint = {
  id: string
  title: string
  valueKind: string
  kind: string
}

function findColumn(
  cols: BoardFilterAiColumnHint[],
  needle: string
): BoardFilterAiColumnHint | undefined {
  const n = needle.trim().toLowerCase()
  if (!n) return undefined
  return cols.find((c) => {
    const t = c.title.toLowerCase()
    const k = c.kind.toLowerCase()
    return n.includes(t) || t.includes(n) || n.includes(k) || k.includes(n)
  })
}

function rule(
  columnId: string,
  condition: string,
  value: string
): AdvancedFilterNode {
  return {
    type: "rule",
    id: newAdvancedNodeId("rule"),
    columnId,
    condition,
    value,
  }
}

function andGroup(children: AdvancedFilterNode[]): AdvancedFilterNode {
  return {
    type: "group",
    id: newAdvancedNodeId("grp"),
    combinator: "AND",
    children,
  }
}

/** Lightweight NL → filter tree (no network). */
export function heuristicBoardFilterAi(
  prompt: string,
  columns: BoardFilterAiColumnHint[]
): AdvancedFilterNode | null {
  const p = prompt.trim().toLowerCase()
  if (!p) return null
  const chunks = p
    .split(/\s+and\s+|\s*&\s*/i)
    .map((s) => s.trim())
    .filter(Boolean)
  const rules: AdvancedFilterNode[] = []

  for (const chunk of chunks) {
    const statusCol = columns.find(
      (c) => c.kind === "status" || /status/.test(c.title.toLowerCase())
    )
    const taskCol = columns.find((c) => c.kind === "task" || c.id === "task")
    const ownerCol = columns.find((c) => c.kind === "owner")
    const assigneeCol = columns.find((c) => c.kind === "assignee")
    const priorityCol = columns.find((c) => c.kind === "priority")

    if (/(unassigned|no owner|empty owner)/.test(chunk) && ownerCol) {
      rules.push(rule(ownerCol.id, "is", BOARD_UNASSIGNED_PERSON_ID))
      continue
    }
    if (
      /(unassigned assignee|no assignee|empty assignee)/.test(chunk) &&
      assigneeCol
    ) {
      rules.push(rule(assigneeCol.id, "is", BOARD_UNASSIGNED_PERSON_ID))
      continue
    }

    const mIs = chunk.match(/^(.+?)\s+(is|equals|=)\s+(.+)$/)
    if (mIs && statusCol) {
      const [, left, , rawVal] = mIs
      const col = findColumn(columns, left) ?? statusCol
      const val = rawVal.trim()
      rules.push(rule(col.id, "is", val))
      continue
    }

    const mContains = chunk.match(/^(.+?)\s+contains\s+(.+)$/)
    if (mContains && taskCol) {
      const [, left, rawVal] = mContains
      const col = findColumn(columns, left) ?? taskCol
      rules.push(rule(col.id, "contains", rawVal.trim()))
      continue
    }

    if (priorityCol && /priority/.test(chunk)) {
      const m = chunk.match(/(low|medium|high)/i)
      if (m) rules.push(rule(priorityCol.id, "is", m[1]))
      continue
    }

    const colGuess = findColumn(columns, chunk)
    if (colGuess && colGuess.valueKind === "text") {
      rules.push(rule(colGuess.id, "contains", chunk))
    }
  }

  if (rules.length === 0) return null
  return rules.length === 1 ? rules[0]! : andGroup(rules)
}

export async function openAiBoardFilterTree(params: {
  apiKey: string
  model: string
  prompt: string
  columns: BoardFilterAiColumnHint[]
}): Promise<AdvancedFilterNode | null> {
  const schemaHint = `Return JSON only: either null, or an object with shape
{"type":"group","combinator":"AND"|"OR","children":[...]} where children are rules {"type":"rule","columnId":"<id from list>","condition":"is"|"is_not"|"contains"|"not_contains"|"is_empty"|"is_not_empty"|"gt"|"lt","value":"..."} or nested groups.
Use only columnId values from the provided list. For unassigned owner/assignee use value "${BOARD_UNASSIGNED_PERSON_ID}" with condition "is".`

  const colJson = JSON.stringify(params.columns, null, 2)
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: params.model,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You convert natural language board filters into JSON trees. ${schemaHint}`,
        },
        {
          role: "user",
          content: `Columns:\n${colJson}\n\nUser request:\n${params.prompt}`,
        },
      ],
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || `OpenAI HTTP ${res.status}`)
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const text = data.choices?.[0]?.message?.content?.trim() ?? ""
  let parsed: unknown
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text)
  } catch {
    return null
  }
  return safeParseAdvancedRoot(parsed)
}
