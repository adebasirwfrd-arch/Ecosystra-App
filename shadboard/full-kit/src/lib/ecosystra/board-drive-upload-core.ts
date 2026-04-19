import { Readable } from "node:stream"

import { google } from "googleapis"

import type { BoardDriveAttachment } from "@/lib/ecosystra/board-drive-attachment"
import type { drive_v3 } from "googleapis"

import { getOrCreateFolder } from "@/lib/ecosystra/google-drive-folders"

export function requireDriveServiceEnv(): {
  clientId: string
  clientSecret: string
  redirectUri: string
  refreshToken: string
  rootFolderId: string
} {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.trim()
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.trim()
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI?.trim()
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN?.trim()
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim()
  if (
    !clientId ||
    !clientSecret ||
    !redirectUri ||
    !refreshToken ||
    !rootFolderId
  ) {
    throw new Error(
      "Google Drive is not configured. Set GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI, GOOGLE_DRIVE_REFRESH_TOKEN, and GOOGLE_DRIVE_ROOT_FOLDER_ID."
    )
  }
  return {
    clientId,
    clientSecret,
    redirectUri,
    refreshToken,
    rootFolderId,
  }
}

export function createServiceDriveClient() {
  const env = requireDriveServiceEnv()
  const oauth2 = new google.auth.OAuth2(
    env.clientId,
    env.clientSecret,
    env.redirectUri
  )
  oauth2.setCredentials({ refresh_token: env.refreshToken })
  return {
    drive: google.drive({ version: "v3", auth: oauth2 }),
    rootFolderId: env.rootFolderId,
  }
}

export function createUserDriveClient(accessToken: string) {
  const oauth2 = new google.auth.OAuth2()
  oauth2.setCredentials({ access_token: accessToken })
  return google.drive({ version: "v3", auth: oauth2 })
}

export function requireRootFolderIdOnly(): string {
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim()
  if (!rootFolderId) {
    throw new Error("GOOGLE_DRIVE_ROOT_FOLDER_ID is not set.")
  }
  return rootFolderId
}

export async function tryApplyLinkShareAnyone(
  drive: drive_v3.Drive,
  fileId: string
) {
  if (process.env.GOOGLE_DRIVE_LINK_SHARE_ANYONE !== "true") return
  try {
    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    })
  } catch {
    /* optional */
  }
}

export async function uploadBufferToTaskFolder(params: {
  drive: drive_v3.Drive
  rootFolderId: string
  groupName: string
  taskName: string
  fileName: string
  mimeType: string
  buffer: Buffer
}): Promise<BoardDriveAttachment> {
  const {
    drive,
    rootFolderId,
    groupName,
    taskName,
    fileName,
    mimeType,
    buffer,
  } = params
  const groupId = await getOrCreateFolder(drive, groupName, rootFolderId)
  const taskId = await getOrCreateFolder(drive, taskName, groupId)
  const body = Readable.from(buffer)

  const uploaded = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [taskId],
    },
    media: {
      mimeType: mimeType || "application/octet-stream",
      body,
    },
    fields: "id, name, mimeType, webViewLink, thumbnailLink",
  })

  const id = uploaded.data.id
  if (!id || !uploaded.data.name) {
    throw new Error("Drive upload returned incomplete metadata")
  }

  await tryApplyLinkShareAnyone(drive, id)

  return {
    driveId: id,
    fileName: uploaded.data.name,
    mimeType: uploaded.data.mimeType || mimeType || "application/octet-stream",
    thumbnail: uploaded.data.thumbnailLink ?? null,
    webViewLink: uploaded.data.webViewLink ?? null,
    uploadAuth: "service",
  }
}

export async function copyPickerFileToTaskFolder(params: {
  userAccessToken: string
  rootFolderId: string
  sourceFileId: string
  groupName: string
  taskName: string
}): Promise<BoardDriveAttachment> {
  const { userAccessToken, rootFolderId, sourceFileId, groupName, taskName } =
    params
  const drive = createUserDriveClient(userAccessToken)

  const meta = await drive.files.get({
    fileId: sourceFileId,
    fields: "id, name, mimeType",
  })
  const baseName = meta.data.name?.trim() || "file"
  const mimeType = meta.data.mimeType || "application/octet-stream"

  const groupId = await getOrCreateFolder(drive, groupName, rootFolderId)
  const taskId = await getOrCreateFolder(drive, taskName, groupId)

  const copied = await drive.files.copy({
    fileId: sourceFileId,
    requestBody: {
      name: baseName,
      parents: [taskId],
    },
    fields: "id, name, mimeType, webViewLink, thumbnailLink",
  })

  const id = copied.data.id
  if (!id || !copied.data.name) {
    throw new Error("Drive copy returned incomplete metadata")
  }

  if (process.env.GOOGLE_DRIVE_LINK_SHARE_ANYONE === "true") {
    await tryApplyLinkShareAnyone(drive, id)
  }

  return {
    driveId: id,
    fileName: copied.data.name,
    mimeType: copied.data.mimeType || mimeType,
    thumbnail: copied.data.thumbnailLink ?? null,
    webViewLink: copied.data.webViewLink ?? null,
    uploadAuth: "google_oauth",
  }
}

export async function deleteDriveFile(drive: drive_v3.Drive, fileId: string) {
  await drive.files.delete({ fileId })
}

export async function deleteDriveFileWithUserToken(
  userAccessToken: string,
  fileId: string
) {
  const drive = createUserDriveClient(userAccessToken)
  await drive.files.delete({ fileId })
}
