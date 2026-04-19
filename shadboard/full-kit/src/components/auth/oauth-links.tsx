"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { signIn } from "next-auth/react"

import type { LocaleType } from "@/types"

import { oauthLinksData } from "@/data/oauth-links"

import { sanitizeAppHomePathname } from "@/lib/app-default-home"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { buttonVariants } from "@/components/ui/button"

export function OAuthLinks() {
  const params = useParams()
  const locale = (params.lang as LocaleType) || "en"
  const [loading, setLoading] = useState(false)

  const homePath = ensureLocalizedPathname(
    sanitizeAppHomePathname(
      process.env.NEXT_PUBLIC_HOME_PATHNAME || "/apps/ecosystra"
    ),
    locale
  )

  const handleGoogleSignIn = () => {
    setLoading(true)
    signIn("google", { callbackUrl: homePath })
  }

  return (
    <div className="flex justify-center gap-2">
      {oauthLinksData.map((link) =>
        link.label === "Google" ? (
          <button
            type="button"
            key={link.label}
            disabled={loading}
            className={buttonVariants({ variant: "outline", size: "icon" })}
            aria-label={link.label}
            onClick={handleGoogleSignIn}
          >
            <link.icon className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            key={link.label}
            className={buttonVariants({ variant: "outline", size: "icon" })}
            aria-label={link.label}
            onClick={() => {
              /* other providers not wired */
            }}
          >
            <link.icon className="size-4" />
          </button>
        )
      )}
    </div>
  )
}
