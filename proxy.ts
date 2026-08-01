import { clerkMiddleware } from "@clerk/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import { routing } from "./app/i18n/routing"

const intlMiddleware = createMiddleware(routing)

// Authentication is intentionally public-first. Individual protected pages call
// auth() themselves so the existing tools and API routes remain anonymous.
export default clerkMiddleware((_auth, request) => {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith("/api/") || pathname.startsWith("/__clerk/")) {
    return NextResponse.next()
  }

  return intlMiddleware(request)
})

export const config = {
  // 优化匹配器以减少 Proxy 调用
  // 排除静态资源、API 路由、已缓存的路径等
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - love (love page)
     * - blog (blog pages)
     * - privacy (privacy page)
     * - tags (tags pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel internal)
     * - favicon.ico, robots.txt, sitemap.xml (static files)
     * - files with extensions (images, fonts, etc.)
     */
    "/((?!api|love|blog|terms|privacy|tags|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
}
