"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * Accordion trigger with an {@link HTMLHeadingElement | h2} wrapper so board task groups
 * sit directly under the board {@link HTMLHeadingElement | h1} without skipping levels.
 */
export function EcosystraBoardGroupAccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header asChild>
      <h2
        className={cn(
          "m-0 flex min-w-0 flex-1 items-stretch border-0 bg-transparent p-0 text-base font-semibold leading-none"
        )}
      >
        <AccordionPrimitive.Trigger
          data-slot="eco-board-accordion-trigger"
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-between py-[var(--vibe-space-8)] ps-[var(--vibe-space-12)] pe-2 text-start text-sm font-semibold transition-all hover:no-underline [&[data-state=open]>svg]:rotate-180",
            className
          )}
          {...props}
        >
          {children}
          <ChevronDown
            className="h-4 w-4 shrink-0 text-[color:var(--eco-brand)] transition-transform duration-200"
            aria-hidden
          />
        </AccordionPrimitive.Trigger>
      </h2>
    </AccordionPrimitive.Header>
  )
}
