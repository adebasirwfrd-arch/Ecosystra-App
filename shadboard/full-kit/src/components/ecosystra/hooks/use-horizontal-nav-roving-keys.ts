"use client"

import { useCallback } from "react"

import type { KeyboardEvent as ReactKeyboardEvent } from "react"

/**
 * Keyboard traversal between focusable links in a horizontal `nav`
 * (Foundations/Accessibility — operable; aligns with list-style roving focus).
 */
export function useHorizontalNavRovingKeys<E extends HTMLElement>(): {
  onNavKeyDown: (event: ReactKeyboardEvent<E>) => void
} {
  const onNavKeyDown = useCallback((event: ReactKeyboardEvent<E>) => {
    const nav = event.currentTarget
    const items = [
      ...nav.querySelectorAll<HTMLAnchorElement>(
        "a[href]:not([aria-disabled='true'])"
      ),
    ].filter((el) => !el.closest("[hidden]"))
    if (items.length === 0) return

    const active = document.activeElement
    const index = items.indexOf(active as HTMLAnchorElement)
    if (index < 0 && event.key !== "Home" && event.key !== "End") return

    let next = index
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index < 0 ? 0 : (index + 1) % items.length
        event.preventDefault()
        break
      case "ArrowLeft":
      case "ArrowUp":
        next =
          index < 0
            ? items.length - 1
            : (index - 1 + items.length) % items.length
        event.preventDefault()
        break
      case "Home":
        next = 0
        event.preventDefault()
        break
      case "End":
        next = items.length - 1
        event.preventDefault()
        break
      default:
        return
    }
    items[next]?.focus()
  }, [])

  return { onNavKeyDown }
}
