"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  deleteBoardDriveAttachmentAction,
  importGoogleDrivePickerFileAction,
} from "@/app/actions/board-drive-attachment"
import Uppy from "@uppy/core"
import DashboardModal from "@uppy/react/dashboard-modal"
import XHRUpload from "@uppy/xhr-upload"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Loader2, Plus, Trash2 } from "lucide-react"

import type { BoardDriveAttachment } from "@/lib/ecosystra/board-drive-attachment"

import {
  FILES_ATTACHMENTS_KEY,
  parseFilesAttachments,
  persistFilesAttachmentsPatch,
} from "@/lib/ecosystra/board-drive-attachment"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EcosystraBoardFilePreviewDrawer } from "./ecosystra-board-file-preview-drawer"
import {
  ensureGooglePickerApiLoaded,
  openGoogleDrivePicker,
} from "./ecosystra-google-drive-picker"

import "@uppy/core/css/style.min.css"
import "@uppy/dashboard/css/style.min.css"
import "@uppy/react/css/style.css"

const MAX_UPLOAD_BYTES = 45 * 1024 * 1024

function optionalHaptic(ms = 10) {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return
  }
  try {
    navigator.vibrate(ms)
  } catch {
    /* no-op */
  }
}

function safeFolderSegment(name: string): string {
  return name.replace(/[/\\]+/g, " ").trim() || "Untitled"
}

export type BoardFileAttachmentCellLabels = {
  fileCellUpload: string
  fileCellAddFile: string
  fileCellMenuUploadDevice: string
  fileCellUploading: string
  fileCellUploadFailed: string
  fileCellRemove: string
  fileCellPreviewTitle: string
  /** Shown when inline preview fails; optional (drawer has a default). */
  fileCellPreviewUnavailable?: string
  fileCellOpenDrive: string
  fileCellDownload: string
  fileCellPickFromDrive: string
  fileCellGoogleSignInRequired: string
  fileCellPickerLoadFailed: string
  fileCellPickerImportFailed: string
  fileCellOpenCamera: string
}

function AddAttachmentMenu({
  disabled,
  pickerBusy,
  pickerDisabled,
  labels,
  onOpenUppy,
  onPickFromDrive,
  onOpenCamera,
}: {
  disabled: boolean
  pickerBusy: boolean
  pickerDisabled: boolean
  labels: BoardFileAttachmentCellLabels
  onOpenUppy: () => void
  onPickFromDrive: () => void
  onOpenCamera: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0"
          disabled={disabled || pickerBusy}
          aria-label={labels.fileCellAddFile}
        >
          {pickerBusy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        <DropdownMenuItem
          disabled={disabled}
          onSelect={() => {
            onOpenUppy()
          }}
        >
          {labels.fileCellMenuUploadDevice}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={disabled || pickerDisabled}
          onSelect={() => {
            void onPickFromDrive()
          }}
        >
          {labels.fileCellPickFromDrive}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={disabled}
          onSelect={() => {
            onOpenCamera()
          }}
        >
          {labels.fileCellOpenCamera}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function EcosystraBoardFileAttachmentCell({
  itemId,
  groupName,
  taskName,
  dynamicData,
  onPatchItem,
  labels,
  className,
  /** Custom column: store under `ecoCc__…` instead of global `filesAttachments`. */
  attachmentsField,
}: {
  itemId: string
  groupName: string
  taskName: string
  dynamicData: Record<string, unknown>
  onPatchItem: (itemId: string, patch: Record<string, unknown>) => void
  labels: BoardFileAttachmentCellLabels
  className?: string
  attachmentsField?: string
}) {
  const { data: session, status: sessionStatus } = useSession()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [pickerBusy, setPickerBusy] = useState(false)
  const [preview, setPreview] = useState<BoardDriveAttachment | null>(null)
  const [uppyModalOpen, setUppyModalOpen] = useState(false)
  const [uppy, setUppy] = useState<Uppy | null>(null)
  /** Mount Uppy modal after hydration so `target={document.body}` is valid (escapes table stacking contexts). */
  const [uppyPortalReady, setUppyPortalReady] = useState(false)

  const storageKey = attachmentsField ?? FILES_ATTACHMENTS_KEY
  const attachments = parseFilesAttachments(dynamicData, storageKey)
  const attachmentsRef = useRef(attachments)
  attachmentsRef.current = attachments

  const developerKey =
    process.env.NEXT_PUBLIC_GOOGLE_PICKER_API_KEY?.trim() ?? ""

  useEffect(() => {
    setUppyPortalReady(true)
  }, [])

  useEffect(() => {
    const uploadEndpoint = `${window.location.origin}/api/ecosystra/board-drive-upload`
    const u = new Uppy({
      id: `ecosystra-board-${itemId}-${storageKey}`,
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 12,
        maxFileSize: MAX_UPLOAD_BYTES,
      },
      meta: {
        groupName: safeFolderSegment(groupName),
        taskName: safeFolderSegment(taskName),
      },
    }).use(XHRUpload, {
      endpoint: uploadEndpoint,
      method: "POST",
      fieldName: "file",
      formData: true,
      bundle: false,
      /** Same-origin: cookies still sent; false avoids rare XHR + credentialed quirks on some networks. */
      withCredentials: false,
      allowedMetaFields: ["groupName", "taskName"],
      getResponseData(xhr) {
        try {
          return JSON.parse(xhr.responseText) as {
            attachment?: BoardDriveAttachment
            error?: string
          }
        } catch {
          return {}
        }
      },
    })

    u.on("upload-success", (_file, response) => {
      const body = response?.body as
        | { attachment?: BoardDriveAttachment }
        | undefined
      const attachment = body?.attachment
      if (!attachment) return
      const prev = attachmentsRef.current
      const next = [...prev, attachment]
      onPatchItem(
        itemId,
        persistFilesAttachmentsPatch(next, { fieldKey: attachmentsField })
      )
    })

    u.on("complete", (result) => {
      if (result.successful.length > 0) {
        optionalHaptic(10)
        toast.success(labels.fileCellUpload)
      }
    })

    u.on("upload-error", (_file, err) => {
      toast.error(err?.message || labels.fileCellUploadFailed)
    })

    setUppy(u)
    return () => {
      void u.cancelAll()
      u.destroy()
      setUppy(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see setMeta effect
  }, [
    attachmentsField,
    itemId,
    labels.fileCellUpload,
    labels.fileCellUploadFailed,
    onPatchItem,
    storageKey,
  ])

  useEffect(() => {
    if (!uppy) return
    uppy.setMeta({
      groupName: safeFolderSegment(groupName),
      taskName: safeFolderSegment(taskName),
    })
  }, [groupName, taskName, uppy])

  const runPicker = useCallback(async () => {
    if (!developerKey) {
      toast.error(labels.fileCellPickerLoadFailed)
      return
    }
    const oauth = session?.googleAccessToken
    if (!oauth) {
      toast.error(labels.fileCellGoogleSignInRequired)
      return
    }
    setPickerBusy(true)
    try {
      await ensureGooglePickerApiLoaded()
      const pickedId = await openGoogleDrivePicker({
        oauthToken: oauth,
        developerKey,
        title: labels.fileCellPickFromDrive,
      })
      if (!pickedId) return
      const res = await importGoogleDrivePickerFileAction(
        pickedId,
        safeFolderSegment(groupName),
        safeFolderSegment(taskName)
      )
      if (!res.success) {
        toast.error(res.error || labels.fileCellPickerImportFailed)
        return
      }
      const prev = attachmentsRef.current
      const next = [...prev, res.attachment]
      onPatchItem(
        itemId,
        persistFilesAttachmentsPatch(next, { fieldKey: attachmentsField })
      )
      optionalHaptic(10)
      toast.success(labels.fileCellUpload)
    } catch {
      toast.error(labels.fileCellPickerLoadFailed)
    } finally {
      setPickerBusy(false)
    }
  }, [
    attachmentsField,
    developerKey,
    groupName,
    itemId,
    labels.fileCellGoogleSignInRequired,
    labels.fileCellPickFromDrive,
    labels.fileCellPickerImportFailed,
    labels.fileCellPickerLoadFailed,
    labels.fileCellUpload,
    onPatchItem,
    session?.googleAccessToken,
    taskName,
  ])

  const removeAt = async (index: number) => {
    const target = attachments[index]
    if (!target) return
    optionalHaptic(8)
    const del = await deleteBoardDriveAttachmentAction(target.driveId, {
      uploadAuth: target.uploadAuth ?? "service",
    })
    if (!del.success) {
      toast.error(del.error)
    }
    const next = attachments.filter((_, i) => i !== index)
    onPatchItem(
      itemId,
      persistFilesAttachmentsPatch(next, { fieldKey: attachmentsField })
    )
  }

  const onCameraInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const list = e.target.files
    const file = list?.[0]
    e.target.value = ""
    if (!file || !uppy) return
    try {
      await uppy.addFile({
        name: file.name,
        type: file.type || "application/octet-stream",
        data: file,
        source: "Camera",
      })
      setUppyModalOpen(true)
      void uppy.upload()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : labels.fileCellUploadFailed
      )
    }
  }

  const pickerDisabled =
    sessionStatus === "loading" || !developerKey || !session?.googleAccessToken

  const addMenu = (
    <AddAttachmentMenu
      disabled={!uppy}
      pickerBusy={pickerBusy}
      pickerDisabled={pickerDisabled}
      labels={labels}
      onOpenUppy={() => setUppyModalOpen(true)}
      onPickFromDrive={runPicker}
      onOpenCamera={() => inputRef.current?.click()}
    />
  )

  return (
    <>
      <div
        className={cn(
          "flex min-h-11 w-full min-w-0 flex-col gap-1 rounded-md border border-transparent p-0.5",
          attachments.length === 0
            ? "items-center justify-center"
            : "items-stretch",
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,text/plain"
          capture="environment"
          multiple={false}
          onChange={(e) => void onCameraInputChange(e)}
        />

        {attachments.length > 0 ? (
          <ul className="max-h-36 min-w-0 list-none space-y-0.5 overflow-y-auto ps-0">
            {attachments.map((a, index) => (
              <li key={a.driveId} className="flex min-w-0 items-center gap-0.5">
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-start text-xs font-medium text-primary underline-offset-2 hover:underline"
                  title={a.fileName}
                  onClick={() => setPreview(a)}
                >
                  {a.fileName}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={labels.fileCellRemove}
                  onClick={(e) => {
                    e.stopPropagation()
                    void removeAt(index)
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}

        {attachments.length > 0 ? (
          <div className="flex w-full justify-center pt-0.5">{addMenu}</div>
        ) : (
          addMenu
        )}
      </div>

      {uppy && uppyPortalReady ? (
        <DashboardModal
          uppy={uppy}
          open={uppyModalOpen}
          target={document.body}
          onRequestClose={() => {
            setUppyModalOpen(false)
            void uppy.cancelAll()
          }}
          proudlyDisplayPoweredByUppy={false}
        />
      ) : null}

      <EcosystraBoardFilePreviewDrawer
        open={!!preview}
        onOpenChange={(o) => {
          if (!o) setPreview(null)
        }}
        file={preview}
        labels={{
          previewTitle: labels.fileCellPreviewTitle,
          previewUnavailable: labels.fileCellPreviewUnavailable,
          openInDrive: labels.fileCellOpenDrive,
          download: labels.fileCellDownload,
        }}
      />
    </>
  )
}
