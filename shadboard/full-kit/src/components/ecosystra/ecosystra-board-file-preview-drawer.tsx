"use client"

import { PhotoProvider, PhotoView } from "react-photo-view"
import { ExternalLink, X } from "lucide-react"

import type { BoardDriveAttachment } from "@/lib/ecosystra/board-drive-attachment"

import {
  driveDownloadUrl,
  drivePreviewEmbedUrl,
  isImageMime,
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

  const previewUrl = drivePreviewEmbedUrl(file.driveId)
  const downloadUrl = driveDownloadUrl(file.driveId)
  const image = isImageMime(file.mimeType)
  const imgSrc = file.thumbnail || previewUrl

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
          {image ? (
            <PhotoProvider>
              <div className="flex max-h-[55vh] items-center justify-center p-3 sm:max-h-[calc(100vh-180px)]">
                <PhotoView src={imgSrc}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Drive thumbnail */}
                  <img
                    src={imgSrc}
                    alt=""
                    className="max-h-[50vh] max-w-full cursor-zoom-in rounded-md object-contain shadow-sm sm:max-h-[calc(100vh-220px)]"
                  />
                </PhotoView>
              </div>
            </PhotoProvider>
          ) : (
            <iframe
              title={file.fileName}
              src={previewUrl}
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
