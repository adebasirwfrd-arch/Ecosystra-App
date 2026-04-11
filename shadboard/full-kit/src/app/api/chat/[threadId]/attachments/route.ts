import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import {
  CHAT_DB_SETUP_MESSAGE,
  ensureEcoUserFromSession,
  isChatSchemaMissingError,
} from "@/lib/chat-server"
import { db, withPrismaRetry } from "@/lib/prisma"
import type { SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-client"

const BUCKET = "chat-attachments"
const MAX_BYTES = 15 * 1024 * 1024

/** Create the public bucket once if missing (service role). */
let bucketEnsured = false

async function ensureChatAttachmentsBucket(
  supabase: SupabaseClient
): Promise<{ error: string | null }> {
  if (bucketEnsured) return { error: null }

  const { data: buckets, error: listErr } = await supabase.storage.listBuckets()
  if (listErr) {
    console.error("[chat attachments] listBuckets", listErr)
    return { error: listErr.message }
  }

  if (buckets?.some((b) => b.name === BUCKET)) {
    bucketEnsured = true
    return { error: null }
  }

  const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  })

  if (createErr) {
    const msg = String(createErr.message ?? "")
    if (/already exists|duplicate|409/i.test(msg)) {
      bucketEnsured = true
      return { error: null }
    }
    console.error("[chat attachments] createBucket", createErr)
    return { error: createErr.message }
  }

  bucketEnsured = true
  return { error: null }
}

function safeSegment(name: string): string {
  const base = name.replace(/[/\\]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "_")
  return base.slice(0, 180) || "file"
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ threadId: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { threadId } = await ctx.params
  if (!threadId) {
    return NextResponse.json({ error: "Missing thread" }, { status: 400 })
  }

  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "File uploads are not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local and create a public Storage bucket named chat-attachments.",
      },
      { status: 503 }
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 15 MB)" }, { status: 400 })
  }

  try {
    const member = await withPrismaRetry(() =>
      db.ecoChatMember.findUnique({
        where: {
          threadId_userId: { threadId, userId: eco.id },
        },
      })
    )

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const originalName =
      typeof (file as File).name === "string" ? (file as File).name : "upload"
    const contentType =
      typeof (file as File).type === "string" && (file as File).type
        ? (file as File).type
        : "application/octet-stream"

    const path = `threads/${threadId}/${crypto.randomUUID()}-${safeSegment(originalName)}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const ensured = await ensureChatAttachmentsBucket(supabase)
    if (ensured.error) {
      return NextResponse.json(
        {
          error: `Could not prepare Storage bucket "${BUCKET}": ${ensured.error}. Create it in Supabase → Storage (public) or check the service role key.`,
        },
        { status: 503 }
      )
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType, upsert: false })

    if (uploadError) {
      console.error("[chat attachments upload]", uploadError)
      const hint =
        uploadError.message ||
        "Storage upload failed. In Supabase → Storage, add a public bucket named chat-attachments."
      return NextResponse.json({ error: hint }, { status: 502 })
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({
      url: pub.publicUrl,
      name: originalName,
      size: file.size,
      type: contentType,
    })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    const message = e instanceof Error ? e.message : "Server error"
    console.error("[api/chat/attachments]", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
