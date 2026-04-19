import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import type { NextRequest } from "next/server"

import { authOptions } from "@/configs/next-auth"
import {
  createServiceDriveClient,
  uploadBufferToTaskFolder,
} from "@/lib/ecosystra/board-drive-upload-core"

const MAX_UPLOAD_BYTES = 45 * 1024 * 1024

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = form.get("file")
  const groupName = String(form.get("groupName") ?? "").trim() || "Untitled"
  const taskName = String(form.get("taskName") ?? "").trim() || "Untitled"

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 45 MB)" },
      { status: 413 }
    )
  }

  try {
    const { drive, rootFolderId } = createServiceDriveClient()
    const buffer = Buffer.from(await file.arrayBuffer())
    const attachment = await uploadBufferToTaskFolder({
      drive,
      rootFolderId,
      groupName,
      taskName,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      buffer,
    })
    return NextResponse.json({ attachment })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
