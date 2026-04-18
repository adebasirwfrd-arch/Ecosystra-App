import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import {
  heuristicBoardFilterAi,
  openAiBoardFilterTree,
  type BoardFilterAiColumnHint,
} from "@/lib/ecosystra/board-filter-ai"

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { prompt?: string; columns?: BoardFilterAiColumnHint[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const prompt = String(body.prompt ?? "").trim()
  const columns = Array.isArray(body.columns) ? body.columns : []
  if (!prompt) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 })
  }

  const key = process.env.OPENAI_API_KEY?.trim()
  const model = process.env.OPENAI_BOARD_FILTER_MODEL?.trim() || "gpt-4o-mini"

  if (key) {
    try {
      const root = await openAiBoardFilterTree({
        apiKey: key,
        model,
        prompt,
        columns,
      })
      return NextResponse.json({ root, source: "openai" })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "OpenAI failed"
      const root = heuristicBoardFilterAi(prompt, columns)
      return NextResponse.json({
        root,
        source: "heuristic_fallback",
        warning: msg,
      })
    }
  }

  const root = heuristicBoardFilterAi(prompt, columns)
  return NextResponse.json({
    root,
    source: "heuristic",
    hint:
      "Set OPENAI_API_KEY for richer nested filters from natural language.",
  })
}
