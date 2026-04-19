import { Cairo, Lato } from "next/font/google"
import { getServerSession } from "next-auth"

import { i18n } from "@/configs/i18n"
import { authOptions } from "@/configs/next-auth"
import { safeMetadataBase } from "@/lib/metadata-base"
import { cn } from "@/lib/utils"

import "../globals.css"

import { Providers } from "@/providers"

import type { LocaleType } from "@/types"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"

// Define metadata for the application
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: {
    template: "%s | Ecosystra",
    default: "Ecosystra",
  },
  description: "",
  metadataBase: safeMetadataBase(),
}

/** Mobile browsers + notched devices: correct scaling, safe areas, no UI zoom surprises. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

// Define fonts for the application
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
const latoFont = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
})
const cairoFont = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-cairo",
})

export default async function RootLayout(props: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const lang = params.lang as LocaleType

  const { children } = props

  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (e) {
    console.error("[next-auth] getServerSession failed:", e)
  }

  const direction = i18n.localeDirection[lang]

  return (
    <html lang={lang} dir={direction} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "[&:lang(en)]:font-lato [&:lang(ar)]:font-cairo", // Set font styles based on the language
          "bg-background text-foreground antialiased overscroll-x-none overscroll-y-auto", // avoid horizontal rubber-band; allow vertical scroll
          latoFont.variable, // Include Lato font variable
          cairoFont.variable // Include Cairo font variable
        )}
      >
        <Providers locale={lang} direction={direction} session={session}>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
