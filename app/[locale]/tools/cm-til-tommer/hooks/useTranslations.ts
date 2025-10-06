"use client"

import { useTranslations as useNextIntlTranslations } from "next-intl"

export function useTranslations() {
  const t = useNextIntlTranslations("CmTilTommerConverter")
  return t
}

export default useTranslations
