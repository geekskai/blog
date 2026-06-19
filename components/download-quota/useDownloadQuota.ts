"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

export type DownloadQuotaState = {
  date: string
  remainingClicks: number
  sharesCountToday: number
}

export type DownloadQuotaCheck =
  | { allowed: true }
  | { allowed: false; reason: "share_required" | "daily_limit_reached"; message?: string }

type UseDownloadQuotaOptions = {
  storageKey?: string
  initialFreeClicks?: number
  shareBonusClicks?: number
  maxDailyShareUnlocks?: number
  shareRef?: string
}

const DEFAULT_STORAGE_KEY = "geekskai_daily_download_quota_v1"
const DEFAULT_INITIAL_FREE_CLICKS = 3
const DEFAULT_SHARE_BONUS_CLICKS = 5
const DEFAULT_MAX_DAILY_SHARE_UNLOCKS = 10

const exhaustedMessage = "Today's free and shared download quota is used up. Please come back tomorrow."

function getTodayDateKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, "0")
  const day = `${now.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function createQuota(date: string, initialFreeClicks: number): DownloadQuotaState {
  return {
    date,
    remainingClicks: initialFreeClicks,
    sharesCountToday: 0,
  }
}

function normalizeQuota(
  raw: unknown,
  today: string,
  initialFreeClicks: number
): DownloadQuotaState {
  if (!raw || typeof raw !== "object") {
    return createQuota(today, initialFreeClicks)
  }

  const candidate = raw as Partial<DownloadQuotaState>
  if (candidate.date !== today) {
    return createQuota(today, initialFreeClicks)
  }

  const remainingClicks = Number(candidate.remainingClicks)
  const sharesCountToday = Number(candidate.sharesCountToday)

  return {
    date: today,
    remainingClicks: Number.isFinite(remainingClicks)
      ? Math.max(0, Math.floor(remainingClicks))
      : initialFreeClicks,
    sharesCountToday: Number.isFinite(sharesCountToday)
      ? Math.max(0, Math.floor(sharesCountToday))
      : 0,
  }
}

function withShareRef(url: string, shareRef: string) {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set("ref", shareRef)
    return parsed.toString()
  } catch {
    return `https://geekskai.com/?ref=${encodeURIComponent(shareRef)}`
  }
}

export function useDownloadQuota(options: UseDownloadQuotaOptions = {}) {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    initialFreeClicks = DEFAULT_INITIAL_FREE_CLICKS,
    shareBonusClicks = DEFAULT_SHARE_BONUS_CLICKS,
    maxDailyShareUnlocks = DEFAULT_MAX_DAILY_SHARE_UNLOCKS,
    shareRef = "fission_share",
  } = options

  const [quotaState, setQuotaState] = useState<DownloadQuotaState | null>(null)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null)
  const [unlockSuccessMessage, setUnlockSuccessMessage] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState(`https://geekskai.com/?ref=${shareRef}`)

  const readQuota = useCallback((): DownloadQuotaState | null => {
    try {
      const today = getTodayDateKey()
      const raw = window.localStorage.getItem(storageKey)
      const parsed = raw ? JSON.parse(raw) : null
      return normalizeQuota(parsed, today, initialFreeClicks)
    } catch {
      setStorageAvailable(false)
      return null
    }
  }, [initialFreeClicks, storageKey])

  const persistQuota = useCallback(
    (nextQuota: DownloadQuotaState | null) => {
      if (!nextQuota) {
        return
      }

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextQuota))
        setQuotaState(nextQuota)
        setStorageAvailable(true)
      } catch {
        setStorageAvailable(false)
      }
    },
    [storageKey]
  )

  const syncDailyQuota = useCallback(() => {
    const current = readQuota()
    if (current) {
      persistQuota(current)
    }
    return current
  }, [persistQuota, readQuota])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    setShareLink(withShareRef(window.location.href, shareRef))
    syncDailyQuota()
  }, [shareRef, syncDailyQuota])

  const checkQuotaBeforeDownload = useCallback((): DownloadQuotaCheck => {
    setQuotaMessage(null)
    setUnlockSuccessMessage(null)

    const current = syncDailyQuota()
    if (!current) {
      return { allowed: true }
    }

    if (current.remainingClicks <= 0) {
      if (current.sharesCountToday >= maxDailyShareUnlocks) {
        setQuotaMessage(exhaustedMessage)
        return {
          allowed: false,
          reason: "daily_limit_reached",
          message: exhaustedMessage,
        }
      }

      setShowShareModal(true)
      return { allowed: false, reason: "share_required" }
    }

    return { allowed: true }
  }, [maxDailyShareUnlocks, syncDailyQuota])

  const consumeDownloadQuota = useCallback(() => {
    const current = syncDailyQuota()
    if (!current) {
      return
    }

    persistQuota({
      ...current,
      remainingClicks: Math.max(0, current.remainingClicks - 1),
    })
  }, [persistQuota, syncDailyQuota])

  const handleShareUnlock = useCallback(() => {
    const current = syncDailyQuota()
    if (!current) {
      setShowShareModal(false)
      setUnlockSuccessMessage(
        `Unlock successful. ${shareBonusClicks} extra downloads have been added.`
      )
      return
    }

    if (current.sharesCountToday >= maxDailyShareUnlocks) {
      setShowShareModal(false)
      setQuotaMessage(exhaustedMessage)
      return
    }

    persistQuota({
      ...current,
      remainingClicks: current.remainingClicks + shareBonusClicks,
      sharesCountToday: current.sharesCountToday + 1,
    })
    setShowShareModal(false)
    setQuotaMessage(null)
    setUnlockSuccessMessage(
      `Unlock successful. ${shareBonusClicks} extra downloads have been added.`
    )
  }, [maxDailyShareUnlocks, persistQuota, shareBonusClicks, syncDailyQuota])

  const closeShareModal = useCallback(() => {
    setShowShareModal(false)
  }, [])

  const quotaConfig = useMemo(
    () => ({
      initialFreeClicks,
      shareBonusClicks,
      maxDailyShareUnlocks,
      storageAvailable,
    }),
    [initialFreeClicks, maxDailyShareUnlocks, shareBonusClicks, storageAvailable]
  )

  return {
    quotaState,
    quotaConfig,
    showShareModal,
    shareLink,
    quotaMessage,
    unlockSuccessMessage,
    setQuotaMessage,
    setUnlockSuccessMessage,
    checkQuotaBeforeDownload,
    consumeDownloadQuota,
    handleShareUnlock,
    closeShareModal,
  }
}

export type DownloadQuotaController = ReturnType<typeof useDownloadQuota>
