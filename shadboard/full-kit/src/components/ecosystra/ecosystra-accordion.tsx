"use client"

/**
 * Ecosystra accordion — aligned with Vibe **Components/Accordion** (GRANDBOOK → `components-accordion--docs`).
 *
 * **Usage (Vibe)**
 * - Use accordion to reduce clutter and chunk information.
 * - Labels: short, clear, understandable.
 * - Default state: **closed**, except when the accordion is used for navigation (then set initial open via `defaultValue`).
 * - Content may include icons, radios, and checkboxes.
 *
 * **Accessibility (Vibe)**
 * - **Root `id` is required** so every accordion has a stable hook for labels and page-level references.
 * - Give each **item** a stable `value` (Radix; unique among siblings) and a unique DOM **`id`** when needed for tests or custom `aria-*` wiring.
 * - Use descriptive trigger text so screen reader users know what expands.
 * - Prefer **few** initially expanded sections (`defaultValue`); avoid opening many at once.
 *
 * **Variants**
 * - **Multi active:** `type="multiple"` — several panels open (Vibe `allowMultiple`).
 * - **Single active:** `type="single"` (default) — one panel at a time.
 *
 * **API mapping:** Vibe `defaultIndex` → Radix `defaultValue` (string, or `string[]` when `type="multiple"`).
 */

import type { ComponentProps } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export type EcosystraAccordionProps = {
  /** Required — Vibe: unique id on the Accordion root for a11y and identification. */
  id: string
} & ComponentProps<typeof Accordion>

/**
 * Root accordion for Ecosystra pages. Sets `data-ecosystra-accordion` for scoped styling or tests.
 */
export function EcosystraAccordion({ id, className, ...props }: EcosystraAccordionProps) {
  return (
    <Accordion
      id={id}
      data-ecosystra-accordion=""
      className={cn(className)}
      {...props}
    />
  )
}

export type EcosystraAccordionItemProps = ComponentProps<typeof AccordionItem>

/**
 * One section. Radix **`value`** must be unique among siblings (Vibe: unique item id).
 * Pass **`id`** for a stable DOM id (e.g. `preferences-notifications`).
 */
export function EcosystraAccordionItem({
  className,
  value,
  ...props
}: EcosystraAccordionItemProps) {
  return (
    <AccordionItem
      value={value}
      data-ecosystra-accordion-item={value}
      className={cn(className)}
      {...props}
    />
  )
}

export { AccordionContent, AccordionTrigger }

/** Optional Tailwind stack for in-page (preferences-style) accordions — Vibe “patterns” spacing `space-8`. */
export const ecosystraAccordionInPageStackClassName =
  "flex flex-col gap-[var(--vibe-space-8)]"
