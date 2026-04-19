"use client"

/**
 * Ecosystra **Alert Banner** — Vibe **Components/AlertBanner** (GRANDBOOK → `components-alertbanner--docs`).
 *
 * **Usage**
 * - High-signal, system-level messages; prefer **Toast** for action feedback.
 * - Include **one** primary CTA (`action`) and optionally **dismiss** (`onDismiss` + `closeButtonAriaLabel`).
 * - Place at **top** of the shell (via `EcosystraAlertBannerHost` in `EcosystraPageChrome`) so content sits below.
 *
 * **Accessibility**
 * - `ariaLabel` → `aria-label` on the region (Vibe `ariaLabel`).
 * - When dismissible, set `closeButtonAriaLabel` (Vibe `closeButtonAriaLabel`).
 * - Use `ariaLive` on the message when dynamic updates should be announced (`polite` | `assertive` | `off`).
 *
 * **Variants** — primary, positive, negative, warning, inverted (Vibe `backgroundColor` / types).
 */

import Link from "next/link"
import { X } from "lucide-react"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type EcosystraAlertBannerVariant =
  | "primary"
  | "positive"
  | "negative"
  | "warning"
  | "inverted"

type Base = {
  id: string
  /** Vibe: accessible name for the banner (type + purpose). */
  ariaLabel: string
  variant?: EcosystraAlertBannerVariant
  message: ReactNode
  /** At most one CTA (Vibe). Link or button — not both as separate primary actions. */
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** When set, message is wrapped in a live region (Vibe `AlertBannerText`). */
  ariaLive?: "off" | "polite" | "assertive"
  className?: string
}

type Dismissible = Base & {
  onDismiss: () => void
  closeButtonAriaLabel: string
}

type NotDismissible = Base & {
  onDismiss?: undefined
  closeButtonAriaLabel?: undefined
}

export type EcosystraAlertBannerProps = Dismissible | NotDismissible

const variantClass: Record<EcosystraAlertBannerVariant, string> = {
  primary:
    "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-50",
  positive:
    "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-50",
  negative:
    "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-50",
  warning:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-50",
  inverted:
    "border-zinc-700 bg-zinc-900 text-zinc-50 dark:border-zinc-600",
}

const actionLinkClass: Record<EcosystraAlertBannerVariant, string> = {
  primary: "text-blue-800 underline-offset-4 hover:text-blue-900 dark:text-blue-200",
  positive: "text-emerald-800 underline-offset-4 hover:text-emerald-900 dark:text-emerald-200",
  negative: "text-red-800 underline-offset-4 hover:text-red-900 dark:text-red-200",
  warning: "text-amber-900 underline-offset-4 hover:text-amber-950 dark:text-amber-100",
  inverted: "text-white underline-offset-4 hover:text-zinc-200",
}

function ActionControl({
  action,
  variant,
}: {
  action: NonNullable<EcosystraAlertBannerProps["action"]>
  variant: EcosystraAlertBannerVariant
}) {
  const linkClass = cn(
    "shrink-0 text-sm font-medium underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    actionLinkClass[variant]
  )

  if (action.href) {
    const external = /^https?:\/\//i.test(action.href)
    if (external) {
      return (
        <a
          href={action.href}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          {action.label}
        </a>
      )
    }
    return (
      <Link href={action.href} className={linkClass}>
        {action.label}
      </Link>
    )
  }

  if (action.onClick) {
    return (
      <Button
        type="button"
        variant="link"
        className={cn(
          "h-auto shrink-0 px-0 text-sm font-medium",
          actionLinkClass[variant]
        )}
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    )
  }

  return null
}

export function EcosystraAlertBanner(props: EcosystraAlertBannerProps) {
  const {
    id,
    ariaLabel,
    variant = "primary",
    message,
    action,
    ariaLive = "off",
    className,
  } = props

  const dismissible = "onDismiss" in props && props.onDismiss != null
  const onDismiss = dismissible ? props.onDismiss : undefined
  const closeButtonAriaLabel = dismissible
    ? props.closeButtonAriaLabel
    : undefined

  return (
    <div
      id={id}
      role="region"
      aria-label={ariaLabel}
      data-ecosystra-alert-banner=""
      data-variant={variant}
      className={cn(
        "sticky top-0 z-50 w-full border-b shadow-sm",
        variantClass[variant],
        className
      )}
    >
      <div className="mx-auto flex max-w-[100dvw] items-start gap-3 px-[var(--vibe-space-16)] py-[var(--vibe-space-12)] md:px-[var(--vibe-space-24)]">
        <div className="min-w-0 flex-1 text-sm leading-snug">
          {ariaLive === "off" ? (
            message
          ) : (
            <div aria-live={ariaLive} className="min-w-0">
              {message}
            </div>
          )}
        </div>

        {action ? <ActionControl action={action} variant={variant} /> : null}

        {onDismiss && closeButtonAriaLabel ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 shrink-0",
              variant === "inverted" &&
                "text-zinc-50 hover:bg-zinc-800 hover:text-white"
            )}
            aria-label={closeButtonAriaLabel}
            onClick={onDismiss}
          >
            <X className="size-4" aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
