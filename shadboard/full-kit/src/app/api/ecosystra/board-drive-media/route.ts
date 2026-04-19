import { Readable } from "node:stream"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import type { drive_v3 } from "googleapis"
import type { NextRequest } from "next/server"

import { authOptions } from "@/configs/next-auth"
import {
  createServiceDriveClient,
  createUserDriveClient,
} from "@/lib/ecosystra/board-drive-upload-core"

export const maxDuration = 120

function sanitizeFileName(raw: string): string {
  const s = raw
    .replace(/[/\\]+/g, "")
    .trim()
    .slice(0, 200)
  return s || "file"
}

async function tryStreamMedia(
  drive: drive_v3.Drive,
  fileId: string
): Promise<{ stream: Readable; contentType: string } | null> {
  try {
    const res = await drive.files.get(
      { fileId, alt: "media", supportsAllDrives: true },
      { responseType: "stream" }
    )
    const data = res.data
    if (!data || typeof (data as Readable).pipe !== "function") return null
    const stream = data as Readable
    const rawCt = res.headers["content-type"]
    const contentType =
      typeof rawCt === "string" && rawCt.length > 0
        ? rawCt.split(";")[0]?.trim() || rawCt
        : "application/octet-stream"
    return { stream, contentType }
  } catch {
    return null
  }
}

/**
 * Streams a Drive file for inline preview (img / iframe). Authenticated app
 * users only; tries service account first, then the signed-in user's Google
 * token (for picker-imported files owned by the user).
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const fileId = req.nextUrl.searchParams.get("id")?.trim()
  if (!fileId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const safeName = sanitizeFileName(
    req.nextUrl.searchParams.get("fn") ?? "file"
  )

  let streamed: { stream: Readable; contentType: string } | null = null

  try {
    const { drive } = createServiceDriveClient()
    streamed = await tryStreamMedia(drive, fileId)
  } catch {
    /* service env missing or no access */
  }

  if (!streamed && session.googleAccessToken) {
    try {
      const drive = createUserDriveClient(session.googleAccessToken)
      streamed = await tryStreamMedia(drive, fileId)
    } catch {
      /* no access */
    }
  }

  if (!streamed) {
    return NextResponse.json(
      { error: "File not found or not accessible" },
      { status: 404 }
    )
  }

  const { stream, contentType } = streamed
  const webBody = Readable.toWeb(stream)

  const asciiName = safeName.replace(/[^\x20-\x7E]/g, "_") || "file"
  const disp = `inline; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`

  return new NextResponse(webBody as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disp,
      "Cache-Control": "private, max-age=300",
    },
  })
}
