import { locales } from "@/app/i18n/routing"

export type ChromeSurface = "acquisition" | "workspace" | "auth"

export function normalizeChromePath(pathname: string): string {
  const pathOnly = pathname.split(/[?#]/, 1)[0] ?? "/"
  const withLeadingSlash = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`
  const segments = withLeadingSlash.split("/").filter(Boolean)
  if (segments[0] && locales.includes(segments[0])) {
    segments.shift()
  }
  if (segments.length === 0) return "/"
  return `/${segments.join("/")}/`
}

export function getChromeSurface(pathname: string): ChromeSurface {
  const path = normalizeChromePath(pathname)
  if (path.startsWith("/sign-in/") || path.startsWith("/sign-up/")) return "auth"
  if (path.startsWith("/audio-toolkit/") || path.startsWith("/account/")) return "workspace"
  return "acquisition"
}
