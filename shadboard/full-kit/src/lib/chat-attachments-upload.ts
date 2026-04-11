"use client"

import type { FileType } from "@/types"

/** Upload blob-backed files to Supabase Storage; leaves already-public URLs unchanged. */
export async function uploadBlobAttachments(
  threadId: string,
  files: FileType[]
): Promise<FileType[]> {
  return Promise.all(
    files.map(async (f) => {
      const prevUrl = f.url
      if (typeof prevUrl === "string" && /^https?:\/\//i.test(prevUrl)) {
        return f
      }
      if (typeof prevUrl !== "string" || !prevUrl.startsWith("blob:")) {
        throw new Error(
          "Attachment is missing a local preview. Try selecting the file again."
        )
      }

      const blob = await fetch(prevUrl).then((r) => r.blob())
      const form = new FormData()
      form.append("file", blob, f.name)

      const res = await fetch(`/api/chat/${threadId}/attachments`, {
        method: "POST",
        body: form,
      })

      if (!res.ok) {
        let msg = "Upload failed"
        try {
          const err = (await res.json()) as { error?: string }
          if (err?.error) msg = err.error
        } catch {
          /* ignore */
        }
        throw new Error(msg)
      }

      const data = (await res.json()) as {
        url: string
        name?: string
        size?: number
        type?: string
      }

      if (prevUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prevUrl)
      }

      return {
        ...f,
        url: data.url,
        name: data.name ?? f.name,
        size: data.size ?? f.size,
        type: data.type ?? f.type,
      }
    })
  )
}
