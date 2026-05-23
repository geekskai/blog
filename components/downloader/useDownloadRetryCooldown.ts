"use client"

import { useCallback, useEffect, useState } from "react"

const DEFAULT_COOLDOWN_SECONDS = 30

export function useDownloadRetryCooldown(defaultSeconds = DEFAULT_COOLDOWN_SECONDS) {
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (cooldownEndsAt == null) return

    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownEndsAt])

  const cooldownSecondsLeft =
    cooldownEndsAt == null ? 0 : Math.max(0, Math.ceil((cooldownEndsAt - now) / 1000))

  useEffect(() => {
    if (cooldownSecondsLeft <= 0 && cooldownEndsAt != null) {
      setCooldownEndsAt(null)
    }
  }, [cooldownEndsAt, cooldownSecondsLeft])

  const startCooldown = useCallback(
    (seconds = defaultSeconds) => {
      setNow(Date.now())
      setCooldownEndsAt(Date.now() + Math.max(1, seconds) * 1000)
    },
    [defaultSeconds]
  )

  const clearCooldown = useCallback(() => {
    setCooldownEndsAt(null)
    setNow(Date.now())
  }, [])

  return {
    isDownloadCooldown: cooldownSecondsLeft > 0,
    cooldownSecondsLeft,
    startCooldown,
    clearCooldown,
  }
}
