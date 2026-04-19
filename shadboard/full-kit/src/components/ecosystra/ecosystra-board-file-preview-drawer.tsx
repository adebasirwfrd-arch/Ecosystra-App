"use client"

import { useEffect, useState } from "react"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { ExternalLink, X } from "lucide-react"

import type { BoardDriveAttachment } from "@/lib/ecosystra/board-drive-attachment"

import {
  driveDownloadUrl,
  driveMediaProxyUrl,
  drivePreviewEmbedUrl,
  isImageMime,
  isPdfMime,
} from "@/lib/ecosystra/board-drive-attachment"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import "react-photo-view/dist/react-photo-view.css"

type Labels = {
  previewTitle: string
  openInDrive: string
  download: string
  /** Optional: shown when inline image/PDF proxy fails to load */
  previewUnavailable?: string
}

export function EcosystraBoardFilePreviewDrawer({
  open,
  onOpenChange,
  file,
  labels,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: BoardDriveAttachment | null
  labels: Labels
}) {
  if (!file) return null

  const downloadUrl = driveDownloadUrl(file.driveId)
  const image = isImageMime(file.mimeType)
  const pdf = isPdfMime(file.mimeType)
  const mediaSrc = driveMediaProxyUrl(file.driveId, file.fileName)
  const embedFallbackUrl = drivePreviewEmbedUrl(file.driveId)

  return (
    <PreviewDrawerBody
      open={open}
      onOpenChange={onOpenChange}
      file={file}
      labels={labels}
      downloadUrl={downloadUrl}
      image={image}
      pdf={pdf}
      mediaSrc={mediaSrc}
      embedFallbackUrl={embedFallbackUrl}
    />
  )
}

function PreviewDrawerBody({
  open,
  onOpenChange,
  file,
  labels,
  downloadUrl,
  image,
  pdf,
  mediaSrc,
  embedFallbackUrl,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: BoardDriveAttachment
  labels: Labels
  downloadUrl: string
  image: boolean
  pdf: boolean
  mediaSrc: string
  embedFallbackUrl: string
}) {
  const [mediaFailed, setMediaFailed] = useState(false)

  useEffect(() => {
    setMediaFailed(false)
  }, [file.driveId, open])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn(
          "flex max-h-[92vh] flex-col sm:left-auto sm:right-0 sm:top-0 sm:mt-0 sm:h-full sm:max-h-none sm:w-[min(100vw,720px)] sm:rounded-none sm:rounded-l-lg"
        )}
      >
        <DrawerHeader className="border-b border-border text-start">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <DrawerTitle className="truncate">
                {labels.previewTitle}
              </DrawerTitle>
              <DrawerDescription className="truncate">
                {file.fileName}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0"
                aria-label="Close"
              >
                <X className="size-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-hidden bg-muted/20">
          {mediaFailed ? (
            <div className="flex h-[min(50vh,420px)] flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground sm:h-[calc(100vh-240px)]">
              <p>
                {labels.previewUnavailable ??
                  "Preview could not be loaded. Try Open in Google Drive or Download."}
              </p>
              <iframe
                title={file.fileName}
                src={embedFallbackUrl}
                className="h-full min-h-[200px] w-full max-w-full flex-1 rounded-md border border-border bg-background"
                allow="fullscreen"
              />
            </div>
          ) : image ? (
            <PhotoProvider>
              <div className="flex max-h-[55vh] items-center justify-center p-3 sm:max-h-[calc(100vh-180px)]">
                <PhotoView src={mediaSrc}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- same-origin Drive proxy */}
                  <img
                    src={mediaSrc}
                    alt=""
                    className="max-h-[50vh] max-w-full cursor-zoom-in rounded-md object-contain shadow-sm sm:max-h-[calc(100vh-220px)]"
                    onError={() => setMediaFailed(true)}
                  />
                </PhotoView>
              </div>
            </PhotoProvider>
          ) : pdf ? (
            <iframe
              title={file.fileName}
              src={mediaSrc}
              className="h-[min(70vh,560px)] w-full border-0 sm:h-[calc(100vh-200px)]"
              allow="fullscreen"
              onError={() => setMediaFailed(true)}
            />
          ) : (
            <iframe
              title={file.fileName}
              src={embedFallbackUrl}
              className="h-[min(70vh,560px)] w-full border-0 sm:h-[calc(100vh-200px)]"
              allow="fullscreen"
            />
          )}
        </div>

        <DrawerFooter className="border-t border-border sm:flex-row sm:justify-end">
          {file.webViewLink ? (
            <Button type="button" variant="outline" size="sm" asChild>
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="me-2 size-4" aria-hidden />
                {labels.openInDrive}
              </a>
            </Button>
          ) : null}
          <Button type="button" variant="default" size="sm" asChild>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              {labels.download}
            </a>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
