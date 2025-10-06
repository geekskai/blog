import createMiddleware from "next-intl/middleware"
import { routing } from "./app/i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/blog`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|blog|privacy|tags|_next|_vercel|.*\\..*).*)",
}
