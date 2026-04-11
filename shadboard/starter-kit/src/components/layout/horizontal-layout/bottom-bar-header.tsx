"use client"

import Image from "next/image"
import Link from "next/link"

import { FullscreenToggle } from "@/components/layout/full-screen-toggle"
import { ModeDropdown } from "@/components/layout/mode-dropdown"
import { UserDropdown } from "@/components/layout/user-dropdown"
import { ToggleMobileSidebar } from "../toggle-mobile-sidebar"

export function BottomBarHeader() {
  return (
    <div className="container flex h-14 justify-between items-center gap-4">
      <ToggleMobileSidebar />
      <Link href="/" className="hidden items-center gap-2 text-foreground font-black lg:flex">
        <Image
          src="/images/branding/ecosystra-logo.jpg"
          alt="Ecosystra"
          height={28}
          width={28}
          className="size-7 shrink-0 rounded-md object-contain"
        />
        <span>Ecosystra</span>
      </Link>
      <div className="flex gap-2">
        <FullscreenToggle />
        <ModeDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}
