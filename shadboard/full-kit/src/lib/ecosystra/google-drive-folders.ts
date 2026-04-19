import type { drive_v3 } from "googleapis"

/** Escape single quotes for Drive `q` string literals. */
export function escapeDriveQueryLiteral(name: string): string {
  return name.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
}

export async function getOrCreateFolder(
  drive: drive_v3.Drive,
  name: string,
  parentId: string
): Promise<string> {
  const safe = escapeDriveQueryLiteral(name.trim() || "Untitled")
  const q = `name = '${safe}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents and trashed = false`
  const res = await drive.files.list({
    q,
    fields: "files(id, name)",
    spaces: "drive",
    pageSize: 2,
  })
  const found = res.data.files?.[0]?.id
  if (found) return found

  const created = await drive.files.create({
    requestBody: {
      name: name.trim() || "Untitled",
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  })
  const id = created.data.id
  if (!id) throw new Error("Drive folder create returned no id")
  return id
}
