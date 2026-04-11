import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import type { NextRequest } from "next/server"

import { isGuestRoute, isPublicRoute } from "@/lib/auth-routes"

/** Must match NextAuth JWT signing — Edge middleware often fails to decode without an explicit `secret`. */
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET
import {
  ensureLocalizedPathname,
  getLocaleFromPathname,
  getPreferredLocale,
  isPathnameMissingLocale,
} from "@/lib/i18n"
import { ensureRedirectPathname, ensureWithoutPrefix } from "@/lib/utils"

function redirect(pathname: string, request: NextRequest) {
  const { search, hash } = request.nextUrl
  let resolvedPathname = pathname

  if (isPathnameMissingLocale(pathname)) {
    const preferredLocale = getPreferredLocale(request)
    resolvedPathname = ensureLocalizedPathname(pathname, preferredLocale)
  }
  if (search) {
    resolvedPathname += search
  }
  if (hash) {
    resolvedPathname += hash
  }

  const redirectUrl = new URL(resolvedPathname, request.url).toString()
  return NextResponse.redirect(redirectUrl)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * Browsers sometimes resolve a relative href like `dashboards/analytics` against
   * the wrong base (e.g. document path treated as `/favicon.ico`), producing
   * `/favicon.ico/dashboards/analytics`. That breaks Next (500 + _document /_app
   * noise). Strip the bogus prefix and redirect to the real path.
   */
  if (pathname.startsWith("/favicon.ico/")) {
    const fixedPath = pathname.slice("/favicon.ico".length) || "/"
    const url = request.nextUrl.clone()
    url.pathname = fixedPath.startsWith("/") ? fixedPath : `/${fixedPath}`
    return NextResponse.redirect(url)
  }

  /** Let the real favicon through — do not run locale redirect on `/favicon.ico`. */
  if (pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  const locale = getLocaleFromPathname(pathname)
  const pathnameWithoutLocale = ensureWithoutPrefix(pathname, `/${locale}`)
  const isNotPublic = !isPublicRoute(pathnameWithoutLocale)

  // Handle authentication for protected and guest routes
  if (isNotPublic) {
    const secureCookie = request.nextUrl.protocol === "https:"
    const token = await getToken({
      req: request,
      secret: NEXTAUTH_SECRET,
      secureCookie,
    })
    const isAuthenticated = !!token
    const isGuest = isGuestRoute(pathnameWithoutLocale)
    const isProtected = !isGuest

    // Redirect authenticated users away from guest routes
    if (isAuthenticated && isGuest) {
      return redirect(process.env.HOME_PATHNAME || "/", request)
    }

    // Redirect unauthenticated users from protected routes to sign-in
    if (!isAuthenticated && isProtected) {
      let redirectPathname = "/sign-in"

      // Maintain the original path for redirection
      if (pathnameWithoutLocale !== "") {
        redirectPathname = ensureRedirectPathname(redirectPathname, pathname)
      }

      return redirect(redirectPathname, request)
    }
  }

  // Redirect to localized URL if the pathname is missing a locale
  if (!locale) {
    return redirect(pathname, request)
  }

  /**
   * NOTE
   * If your homepage is not '/', you need to configure a redirect
   * in next.config.mjs using the redirects() function,
   * and set the HOME_PATHNAME environment variable accordingly.
   *
   * See https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
   */

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - sitemap.xml, robots.txt (metadata files)
     * - images folder
     * - docs
     *
     * Note: Do not exclude `favicon.ico` here — that also skipped `/favicon.ico/...`
     * bogus URLs so our `/favicon.ico/*` fix in middleware never ran. Real
     * `/favicon.ico` is cheap to pass through; `next.config` redirect also strips
     * bad `/favicon.ico/:path*` requests.
     */
    "/((?!api|_next/static|_next/image|sitemap.xml|robots.txt|images|docs).*)",
  ],
}
