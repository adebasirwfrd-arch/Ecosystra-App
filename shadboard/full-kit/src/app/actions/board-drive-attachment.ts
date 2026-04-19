"use server"

import { getServerSession } from "next-auth"

import type { BoardDriveAttachment } from "@/lib/ecosystra/board-drive-attachment"

import { authOptions } from "@/configs/next-auth"
import { authenticateUser } from "@/lib/auth"
import {
  copyPickerFileToTaskFolder,
  createServiceDriveClient,
  deleteDriveFile,
  deleteDriveFileWithUserToken,
  uploadBufferToTaskFolder,
} from "@/lib/ecosystra/board-drive-upload-core"

const MAX_UPLOAD_BYTES = 45 * 1024 * 1024

export type UploadBoardDriveAttachmentResult =
  | { success: true; attachment: BoardDriveAttachment }
  | { success: false; error: string }

export async function uploadBoardDriveAttachmentAction(
  formData: FormData,
  groupName: string,
  taskName: string
): Promise<UploadBoardDriveAttachmentResult> {
  try {
    await authenticateUser()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided" }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { success: false, error: "File is too large (max 45 MB)" }
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
    return { success: true, attachment }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed"
    return { success: false, error: msg }
  }
}

export type ImportGoogleDrivePickerFileResult =
  | { success: true; attachment: BoardDriveAttachment }
  | { success: false; error: string }

/**
 * Copies a file the user selected in Google Picker into the board folder tree
 * (same `GOOGLE_DRIVE_ROOT_FOLDER_ID` as service uploads). Requires Google sign-in
 * with Drive scope and Editor access to that folder.
 */
export async function importGoogleDrivePickerFileAction(
  sourceFileId: string,
  groupName: string,
  taskName: string
): Promise<ImportGoogleDrivePickerFileResult> {
  try {
    await authenticateUser()
  } catch {
    return { success: false, error: "Unauthorized" }
  }

  const session = await getServerSession(authOptions)
  const token = session?.googleAccessToken
  if (!token) {
    return {
      success: false,
      error:
        "Google Drive session missing. Sign in with Google and allow Drive access to import from Picker.",
    }
  }

  const id = String(sourceFileId ?? "").trim()
  if (!id) return { success: false, error: "No file selected" }

  try {
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim()
    if (!rootFolderId) {
      return { success: false, error: "GOOGLE_DRIVE_ROOT_FOLDER_ID is not set" }
    }
    const attachment = await copyPickerFileToTaskFolder({
      userAccessToken: token,
      rootFolderId,
      sourceFileId: id,
      groupName,
      taskName,
    })
    return { success: true, attachment }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Import failed"
    return { success: false, error: msg }
  }
}

export type DeleteBoardDriveAttachmentResult =
  | { success: true }
  | { success: false; error: string }

export async function deleteBoardDriveAttachmentAction(
  driveId: string,
  options?: { uploadAuth?: BoardDriveAttachment["uploadAuth"] }
): Promise<DeleteBoardDriveAttachmentResult> {
  try {
    await authenticateUser()
  } catch {
    return { success: false, error: "Unauthorized" }
  }
  const id = String(driveId ?? "").trim()
  if (!id) return { success: false, error: "Missing file id" }

  const auth = options?.uploadAuth ?? "service"

  try {
    if (auth === "google_oauth") {
      const session = await getServerSession(authOptions)
      const token = session?.googleAccessToken
      if (!token) {
        return {
          success: false,
          error:
            "Cannot delete: Google Drive token missing. Sign in with Google again.",
        }
      }
      await deleteDriveFileWithUserToken(token, id)
      return { success: true }
    }

    const { drive } = createServiceDriveClient()
    await deleteDriveFile(drive, id)
    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed"
    return { success: false, error: msg }
  }
}
