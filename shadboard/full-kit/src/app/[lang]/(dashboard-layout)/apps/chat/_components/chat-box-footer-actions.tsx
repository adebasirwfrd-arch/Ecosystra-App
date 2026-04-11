"use client"

import { useState } from "react"
import { useMedia } from "react-use"
import { ChevronRight, CirclePlus, Image, Mic, Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilesUploader } from "./files-uploader"
import { ImagesUploader } from "./images-uploader"

export function ChatBoxFooterActions() {
  const isMobile = useMedia("(max-width: 480px)")
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false)
  const [filesDialogOpen, setFilesDialogOpen] = useState(false)

  return isMobile ? (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="More actions"
          >
            <CirclePlus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="min-w-[10rem]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setImagesDialogOpen(true)
            }}
          >
            <Image className="me-2 size-4" aria-hidden />
            Images
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setFilesDialogOpen(true)
            }}
          >
            <Paperclip className="me-2 size-4" aria-hidden />
            Files
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start font-normal"
              aria-label="Send a voice message"
            >
              <Mic className="me-2 size-4" />
              Voice
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ImagesUploader
        dialogOpen={imagesDialogOpen}
        onDialogOpenChange={setImagesDialogOpen}
      />
      <FilesUploader
        dialogOpen={filesDialogOpen}
        onDialogOpenChange={setFilesDialogOpen}
      />
    </>
  ) : (
    <Collapsible className="flex whitespace-nowrap overflow-x-clip">
      <CollapsibleTrigger
        className="[&[data-state=open]>svg]:rotate-180"
        asChild
      >
        <Button variant="ghost" size="icon" aria-label="More actions">
          <ChevronRight className="size-4 transition-transform duration-200 rtl:-scale-100" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-left data-[state=open]:animate-collapsible-right duration-1000">
        <ImagesUploader />
        <FilesUploader />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Send a voice message"
        >
          <Mic className="size-4" />
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}
