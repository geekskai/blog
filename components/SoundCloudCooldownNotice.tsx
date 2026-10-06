"use client"

import { useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"
import { getSoundCloudCooldown, subscribeSoundCloudCooldown } from "@/lib/soundcloud/client-errors"

export function useSoundCloudCooldown(): number {
  return useSyncExternalStore(subscribeSoundCloudCooldown, getSoundCloudCooldown, () => 0)
}

export default function SoundCloudCooldownNotice() {
  const seconds = useSoundCloudCooldown()
  const t = useTranslations("SoundCloudService")
  if (seconds === 0) {
    return null
  }
  return (
    <p
      role="status"
      className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200"
    >
      {t("retry_after", { seconds })}
    </p>
  )
}
