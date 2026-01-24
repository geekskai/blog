"use client"

import { useTranslations as useNextIntlTranslations } from "next-intl"

export function useTranslations() {
  const t = useNextIntlTranslations("PERMProcessingTimeTracker")
  return t
}

export default useTranslations
