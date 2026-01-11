import { defineRouting } from "next-intl/routing"

export const supportedLocales: string[] = [
  "en",
  "ar",
  "de",
  "fr",
  "ro",
  "ja",
  "ko",
  "no",
  "zh-cn",
  "da",
]
export const locales: string[] = ["en", "ar", "de", "fr", "ro", "ja", "ko", "no", "zh-cn", "da"]

export const defaultLocale = "en"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
  localePrefix: "as-needed",
  // Used when no locale matches
  defaultLocale: defaultLocale,
})
