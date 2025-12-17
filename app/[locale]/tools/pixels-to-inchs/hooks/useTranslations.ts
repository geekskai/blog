"use client"

import { useTranslations as useNextIntlTranslations } from "next-intl"

export function useTranslations() {
  const t = useNextIntlTranslations("PixelsToInchesConverter")
  return t
}

export default useTranslations
