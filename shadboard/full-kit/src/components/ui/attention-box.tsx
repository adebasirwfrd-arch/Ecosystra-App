"use client"

import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Info,
  X,
} from "lucide-react"

import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const attentionBoxVariants = cva(
  "relative flex gap-3 rounded-lg border p-4 text-start shadow-sm [&_.attention-box-body]:text-muted-foreground",
  {
    variants: {
      type: {
        primary:
          "border-primary/35 bg-primary/[0.07] dark:bg-primary/[0.12] [&_.attention-box-icon]:text-primary",
        neutral:
          "border-border bg-muted/45 [&_.attention-box-icon]:text-muted-foreground",
        positive:
          "border-success/40 bg-success/10 dark:bg-success/15 [&_.attention-box-icon]:text-success",
        warning:
          "border-amber-500/45 bg-amber-50 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-50 [&_.attention-box-body]:text-amber-900/85 dark:[&_.attention-box-body]:text-amber-100/90 [&_.attention-box-icon]:text-amber-600 dark:[&_.attention-box-icon]:text-amber-400",
        negative:
          "border-destructive/40 bg-destructive/10 dark:bg-destructive/15 [&_.attention-box-icon]:text-destructive",
      },
      compact: {
        true: "items-center p-3 py-2 ps-3",
        false: "",
      },
    },
    defaultVariants: {
      type: "primary",
      compact: false,
    },
  }
)

const iconMap = {
  primary: Info,
  neutral: CircleDot,
  positive: CheckCircle2,
  warning: AlertTriangle,
  negative: AlertCircle,
} as const

export type AttentionBoxType = NonNullable<
  VariantProps<typeof attentionBoxVariants>["type"]
>

export type AttentionBoxProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof attentionBoxVariants> & {
    /** Brief heading; pair with `text` — don’t use title alone without body (Vibe). */
    title?: ReactNode
    text: ReactNode
    onClose?: () => void
    /** Vibe `closeButtonAriaLabel` — defaults to “Dismiss”. */
    closeButtonAriaLabel?: string
    /** Optional link; keep visually separate from body (Vibe: align actions to the end). */
    link?: { href: string; text: string }
    /** Single secondary action (Vibe: one button alongside optional link). */
    action?: { text: string; onClick: () => void }
    /** Single-line density with ellipsis on overflow. */
    compact?: boolean
    /** Set false to hide the default type icon (Vibe `icon={false}`). */
    showIcon?: boolean
  }

function AttentionBoxLink({
  href,
  text,
  className,
}: {
  href: string
  text: string
  className?: string
}) {
  const external = /^https?:\/\//i.test(href)
  const cls = cn(
    "text-sm font-medium text-primary underline-offset-4 hover:underline",
    className
  )
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {text}
    </Link>
  )
}

export function AttentionBox({
  className,
  type = "primary",
  title,
  text,
  onClose,
  closeButtonAriaLabel = "Dismiss",
  link,
  action,
  compact: compactProp,
  showIcon = true,
  ...props
}: AttentionBoxProps) {
  const Icon = iconMap[type ?? "primary"]
  const compact = compactProp ?? false

  const actions = link || action

  const closeBtn = onClose ? (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "absolute end-2 size-8 shrink-0 text-foreground/70 hover:text-foreground",
        compact ? "top-1/2 -translate-y-1/2" : "top-2"
      )}
      aria-label={closeButtonAriaLabel}
      onClick={onClose}
    >
      <X className="size-4" />
    </Button>
  ) : null

  if (compact) {
    return (
      <div
        data-slot="attention-box"
        data-compact=""
        role="status"
        className={cn(
          attentionBoxVariants({ type, compact: true }),
          onClose && "pe-11",
          className
        )}
        {...props}
      >
        {showIcon ? (
          <Icon
            className="attention-box-icon size-5 shrink-0"
            aria-hidden
          />
        ) : null}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {title ? (
            <span className="shrink-0 font-semibold text-foreground">
              {title}
            </span>
          ) : null}
          <p className="attention-box-body m-0 min-w-0 truncate text-sm leading-snug">
            {text}
          </p>
        </div>
        {closeBtn}
      </div>
    )
  }

  return (
    <div
      data-slot="attention-box"
      role="status"
      className={cn(
        attentionBoxVariants({ type, compact: false }),
        onClose && "pe-11",
        className
      )}
      {...props}
    >
      {showIcon ? (
        <Icon
          className="attention-box-icon size-5 shrink-0 translate-y-px"
          aria-hidden
        />
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        {title ? (
          <p className="font-semibold leading-snug text-foreground">{title}</p>
        ) : null}
        <div className="attention-box-body text-sm leading-relaxed">{text}</div>
        {actions ? (
          <div className="attention-box-actions flex flex-wrap items-center justify-end gap-3 pt-2">
            {link ? (
              <AttentionBoxLink href={link.href} text={link.text} />
            ) : null}
            {action ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={action.onClick}
              >
                {action.text}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      {closeBtn}
    </div>
  )
}
