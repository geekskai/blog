import createMiddleware from "next-intl/middleware"
import { routing } from "./app/i18n/routing"

export default createMiddleware(routing)

export const config = {
  // 优化匹配器以减少 Edge Middleware 调用
  // 排除静态资源、API 路由、已缓存的路径等
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - blog (blog pages)
     * - privacy (privacy page)
     * - tags (tags pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel internal)
     * - favicon.ico, robots.txt, sitemap.xml (static files)
     * - files with extensions (images, fonts, etc.)
     */
    "/((?!api|blog|privacy|tags|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
}
