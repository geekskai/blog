import { defaultLocale, supportedLocales } from "./routing"

export function normalizePath(path = "/") {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`
}

export function getLocalizedPath(locale: string, path = "/") {
  const normalizedPath = normalizePath(path)
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`

  if (normalizedPath === "/") {
    return localePrefix || "/"
  }

  return `${localePrefix}${normalizedPath}`
}

export function getLocalizedUrl(siteUrl: string, locale: string, path = "/") {
  return `${siteUrl}${getLocalizedPath(locale, path)}`
}

export function buildLanguageAlternates(siteUrl: string, path = "/", locales = supportedLocales) {
  const languages: Record<string, string> = {
    "x-default": getLocalizedUrl(siteUrl, defaultLocale, path),
  }

  locales.forEach((locale) => {
    languages[locale] = getLocalizedUrl(siteUrl, locale, path)
  })

  return languages
}
