import { defineRouting } from "next-intl/routing"

export const supportedLocales = ["ja", "ko", "no", "zh-cn", "da"]
export const locales = ["en", "ja", "ko", "no", "zh-cn", "da"]

export const defaultLocale = "en"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
  localePrefix: "as-needed",
  // Used when no locale matches
  defaultLocale: defaultLocale,
})
