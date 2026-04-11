"use client"

import Image from "next/image"

import type { ComponentProps, MouseEvent } from "react"

import { cn } from "@/lib/utils"

export interface MediaType {
  src: string
  alt: string
  type?: "IMAGE" | "VIDEO"
}

export interface MediaGridProps extends ComponentProps<"ul"> {
  data: Array<MediaType>
  limit?: number
  onMoreButtonClick?: (event: MouseEvent<HTMLButtonElement>) => void
  onMediaClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

function hasRenderableSrc(src: string | undefined): boolean {
  return typeof src === "string" && src.trim().length > 0
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg px-2 text-center text-xs text-muted-foreground break-words">
      {label}
    </div>
  )
}

function MediaTile({ item }: { item: MediaType }) {
  const src = item.src?.trim() ?? ""
  const hasSrc = hasRenderableSrc(src)

  if (item.type === "VIDEO") {
    if (!hasSrc) {
      return <MediaPlaceholder label={item.alt || "Video"} />
    }
    return (
      <video
        src={src}
        className="size-full rounded-lg object-cover"
        controls
        muted
      />
    )
  }

  if (!hasSrc) {
    return <MediaPlaceholder label={item.alt || "Image"} />
  }

  return (
    <Image
      src={src}
      alt={item.alt}
      className="rounded-lg object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      fill
    />
  )
}

export function MediaGrid({
  data,
  limit = 4,
  onMoreButtonClick,
  onMediaClick,
  className,
  ...props
}: MediaGridProps) {
  if (data.length === 0) return null

  const displayedMedia = data.slice(0, limit - 1)
  const remainingCount = data.length - displayedMedia.length - 1
  const hasMoreMedia = data.length >= limit
  const lastMedia = hasMoreMedia ? data[limit - 1] : null

  return (
    <ul
      className={cn(
        "grid gap-2 rounded-lg",
        data.length > 1 && "grid-cols-2",
        className
      )}
      {...props}
    >
      {displayedMedia.map((item, index) => (
        <li key={`${index}-${item.alt}-${item.src || "placeholder"}`}>
          <button
            type="button"
            onClick={onMediaClick}
            className="relative aspect-square size-full cursor-pointer before:absolute before:inset-0 before:z-10 before:rounded-lg hover:before:bg-black/5"
            aria-label="Media"
          >
            <MediaTile item={item} />
          </button>
        </li>
      ))}

      {lastMedia && (
        <li>
          <button
            type="button"
            onClick={(e) =>
              remainingCount > 0 ? onMoreButtonClick?.(e) : onMediaClick?.(e)
            }
            className="cursor-pointer relative size-full aspect-square before:absolute before:inset-0 before:rounded-lg before:z-10 hover:before:bg-black/5"
            aria-label={remainingCount > 0 ? "More media" : "Media"}
          >
            <MediaTile item={lastMedia} />
            {remainingCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 text-3xl text-white font-semibold rounded-lg">
                <span>+{remainingCount}</span>
              </div>
            )}
          </button>
        </li>
      )}
    </ul>
  )
}
