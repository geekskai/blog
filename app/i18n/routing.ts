import { defineRouting } from "next-intl/routing"

export const locales = ["en", "zh-cn", "no"]

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,
  localePrefix: "as-needed",
  // Used when no locale matches
  defaultLocale: "en",
})
