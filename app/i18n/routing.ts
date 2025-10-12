import { defineRouting } from "next-intl/routing"

export const supportedLocales = ["en", "ja", "ko", "no", "zh-cn", "da"]

export const defaultLocale = "en"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLocales,
  localePrefix: "as-needed",
  // Used when no locale matches
  defaultLocale: defaultLocale,
})
