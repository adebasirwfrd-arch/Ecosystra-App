/** Stored on `Item.dynamicData` alongside `filesCount`. */
export type BoardDriveAttachment = {
  driveId: string
  fileName: string
  mimeType: string
  thumbnail?: string | null
  webViewLink?: string | null
  /** How the file was written to Drive (delete must use the same principal). */
  uploadAuth?: "service" | "google_oauth"
}

export const FILES_ATTACHMENTS_KEY = "filesAttachments" as const

const MAX_ATTACHMENTS = 20

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function normalizeOne(raw: unknown): BoardDriveAttachment | null {
  if (!isRecord(raw)) return null
  const driveId = String(raw.driveId ?? "").trim()
  const fileName = String(raw.fileName ?? "").trim()
  const mimeType = String(raw.mimeType ?? "application/octet-stream").trim()
  if (!driveId || !fileName) return null
  const authRaw = raw.uploadAuth
  const uploadAuth =
    authRaw === "google_oauth" || authRaw === "service" ? authRaw : undefined
  return {
    driveId,
    fileName,
    mimeType,
    uploadAuth,
    thumbnail:
      typeof raw.thumbnail === "string" && raw.thumbnail.trim()
        ? raw.thumbnail.trim()
        : typeof raw.thumbnailLink === "string"
          ? raw.thumbnailLink.trim()
          : null,
    webViewLink:
      typeof raw.webViewLink === "string" && raw.webViewLink.trim()
        ? raw.webViewLink.trim()
        : typeof raw.url === "string" && raw.url.trim()
          ? raw.url.trim()
          : null,
  }
}

export function parseFilesAttachments(
  dynamicData: Record<string, unknown> | null | undefined,
  storageKey: string = FILES_ATTACHMENTS_KEY
): BoardDriveAttachment[] {
  if (!dynamicData) return []
  const raw = dynamicData[storageKey]
  if (!Array.isArray(raw)) return []
  const out: BoardDriveAttachment[] = []
  for (const item of raw) {
    const n = normalizeOne(item)
    if (n) out.push(n)
  }
  return out
}

export function filesCountFromDynamic(
  dynamicData: Record<string, unknown> | null | undefined
): number {
  const list = parseFilesAttachments(dynamicData, FILES_ATTACHMENTS_KEY)
  if (list.length > 0) return list.length
  const n = dynamicData?.filesCount
  return typeof n === "number" && Number.isFinite(n) ? Math.max(0, n) : 0
}

/** Persist file list: core `files` column also syncs `filesCount` for filters. */
export function persistFilesAttachmentsPatch(
  next: BoardDriveAttachment[],
  options?: { fieldKey?: string }
): Record<string, unknown> {
  const capped = next.slice(0, MAX_ATTACHMENTS)
  if (options?.fieldKey) {
    return { [options.fieldKey]: capped }
  }
  return {
    [FILES_ATTACHMENTS_KEY]: capped,
    filesCount: capped.length,
  }
}

export function drivePreviewEmbedUrl(driveId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`
}

export function driveDownloadUrl(driveId: string): string {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}`
}

/** Same-origin stream for inline preview (images, PDFs); requires app session. */
export function driveMediaProxyUrl(
  driveId: string,
  fileName?: string | null
): string {
  const params = new URLSearchParams({ id: driveId })
  if (fileName?.trim()) params.set("fn", fileName.trim())
  return `/api/ecosystra/board-drive-media?${params.toString()}`
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/")
}

export function isPdfMime(mime: string): boolean {
  return mime === "application/pdf"
}
