import { defaultLocale, supportedLocales } from "./i18n/routing"
import {
  isSoundCloudToolPath,
  soundCloudGrowthLocales,
  soundCloudHubPath,
} from "@/data/soundCloudGrowth"

export const canonicalStaticRoutes = [
  "",
  "blog/",
  "projects/",
  "tags/",
  "about/",
  "pricing/",
  "audio-toolkit/",
  "privacy/",
  "terms/",
  "llms.txt",
  "pricing.txt",
] as const

export type ToolLocalePolicy = {
  indexedLocales: readonly string[]
  unsupportedLocale: "redirect-to-default"
}

const defaultToolLocalePolicy: ToolLocalePolicy = {
  indexedLocales: supportedLocales,
  unsupportedLocale: "redirect-to-default",
}

const englishOnlyToolLocalePolicy: ToolLocalePolicy = {
  indexedLocales: [defaultLocale],
  unsupportedLocale: "redirect-to-default",
}

const soundCloudToolLocalePolicy: ToolLocalePolicy = {
  indexedLocales: soundCloudGrowthLocales,
  unsupportedLocale: "redirect-to-default",
}

const toolLocalePolicies: Record<string, ToolLocalePolicy> = {
  "/tools/pdf-to-markdown/": englishOnlyToolLocalePolicy,
  "/tools/morse-code-translator/": englishOnlyToolLocalePolicy,
}

function normalizeToolPath(path: string) {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`
}

export function getToolLocalePolicy(path: string): ToolLocalePolicy {
  const normalizedPath = normalizeToolPath(path)

  if (normalizedPath === soundCloudHubPath || isSoundCloudToolPath(normalizedPath)) {
    return soundCloudToolLocalePolicy
  }

  return toolLocalePolicies[normalizedPath] ?? defaultToolLocalePolicy
}

export function getIndexedToolLocales(path: string) {
  return getToolLocalePolicy(path).indexedLocales
}

export function isToolLocaleIndexed(path: string, locale: string) {
  return getIndexedToolLocales(path).includes(locale)
}

export function getToolLinkLocale(path: string, currentLocale: string) {
  return isToolLocaleIndexed(path, currentLocale) ? undefined : defaultLocale
}

export function getCanonicalToolRedirectPath(pathname: string) {
  const localizedToolPath = pathname.match(/^\/([^/]+)(\/tools\/[^/]+\/?$)/)
  if (!localizedToolPath) return null

  const [, locale, toolPath] = localizedToolPath
  if (locale === defaultLocale || !supportedLocales.includes(locale)) return null
  if (isToolLocaleIndexed(toolPath, locale)) return null

  return normalizeToolPath(toolPath)
}
