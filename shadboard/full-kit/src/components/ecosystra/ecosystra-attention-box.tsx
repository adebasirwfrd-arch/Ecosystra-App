"use client"

/**
 * Ecosystra **Attention Box** — Vibe **Components/AttentionBox** (GRANDBOOK → `components-attentionbox--docs`).
 *
 * **Usage**
 * - Information the user needs to **finish or acknowledge** a task; keep it **next to the related content** (not whole-app system messages → use **Alert Banner**).
 * - **Does not auto-dismiss**; stays until the user dismisses or the issue is resolved.
 * - **Width** follows layout: use inside a column or grid — the box is `w-full min-w-0` of its parent.
 *
 * **Variants (`type`)** — `primary`, `neutral`, `positive`, `warning`, `negative`.
 *
 * **Accessibility** — Set `closeButtonAriaLabel` when `onClose` is present; you can use
 * `dictionary.ecosystraApp.chrome.attentionBox.defaultCloseLabel` or a specific string.
 *
 * **Do (Vibe)** — Brief **title** plus **body**; optional **link** / **action** with actions aligned for scanning.
 * **Don’t** — Title-only explanations; attention box **not** tied to specific content; random colors outside the five types (handled by base styles).
 */

import {
  AttentionBox,
  type AttentionBoxProps,
  type AttentionBoxType,
} from "@/components/ui/attention-box"
import { cn } from "@/lib/utils"

export type EcosystraAttentionBoxProps = AttentionBoxProps

export function EcosystraAttentionBox({
  className,
  ...props
}: EcosystraAttentionBoxProps) {
  return (
    <AttentionBox
      {...props}
      data-ecosystra-attention-box=""
      className={cn("w-full min-w-0", className)}
    />
  )
}

export type { AttentionBoxType }
