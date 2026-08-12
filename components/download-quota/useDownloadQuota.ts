"use client"

import { useAuth } from "@clerk/nextjs"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { GrowthEventName } from "@/lib/growth/events"
import type { QuotaToolId } from "@/lib/download-quota/config"
import {
  REGISTERED_DAILY_LIMIT,
  SHARE_UNLOCK_AMOUNT,
  VISITOR_DAILY_LIMIT,
} from "@/lib/download-quota/domain"

export type DownloadQuotaState = {
  date: string
  remainingClicks: number
  sharesCountToday: number
}

export type DownloadQuotaCheck =
  | { allowed: true; operationId?: string }
  | { allowed: false; reason: "share_required" | "daily_limit_reached"; message?: string }

type RegistrationReturnState = Record<string, unknown>

type UseDownloadQuotaOptions = {
  toolId: QuotaToolId
  storageKey?: string
  interruptedState?: RegistrationReturnState
  onRegistrationReturn?: (state: RegistrationReturnState) => void
}

type ServerQuota = {
  limit: number
  remaining: number
  successfulDownloads: number
  activeReservations: number
  concurrencyLimit: number
  shareUnlockAvailable: boolean
}

type QuotaApiResponse = {
  mode: "local" | "server"
  quota?: ServerQuota
  outcome?:
    | "reserved"
    | "processing"
    | "consumed"
    | "released"
    | "limit_reached"
    | "concurrency_reached"
  status?: "reserved" | "processing" | "consumed" | "released" | null
  granted?: boolean
  shareId?: string
  error?: string
}

type SavedRegistrationReturn = {
  toolId: QuotaToolId
  returnUrl: string
  state: RegistrationReturnState
  createdAt: number
}

const DEFAULT_STORAGE_KEY = "geekskai_daily_download_quota_v1"
const REGISTRATION_RETURN_KEY = "geekskai_registration_return_v1"
const exhaustedMessage = "Today's download allowance is used up. Please come back tomorrow."
const unavailableMessage = "Your account allowance is temporarily unavailable. Please try again."

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10)
}

function createQuota(date: string): DownloadQuotaState {
  return { date, remainingClicks: VISITOR_DAILY_LIMIT, sharesCountToday: 0 }
}

function normalizeQuota(raw: unknown, today: string): DownloadQuotaState {
  if (!raw || typeof raw !== "object") return createQuota(today)
  const candidate = raw as Partial<DownloadQuotaState>
  if (candidate.date !== today) return createQuota(today)

  const remainingClicks = Number(candidate.remainingClicks)
  const sharesCountToday = Number(candidate.sharesCountToday)
  const shareCount = Number.isFinite(sharesCountToday)
    ? Math.min(1, Math.max(0, Math.floor(sharesCountToday)))
    : 0

  return {
    date: today,
    remainingClicks: Number.isFinite(remainingClicks)
      ? Math.min(
          VISITOR_DAILY_LIMIT + shareCount * SHARE_UNLOCK_AMOUNT,
          Math.max(0, Math.floor(remainingClicks))
        )
      : VISITOR_DAILY_LIMIT,
    sharesCountToday: shareCount,
  }
}

function getVisitorCarryover(state: DownloadQuotaState | null) {
  if (!state) return { visitorUsage: 0, visitorShareUnlocked: false, visitorShareUsage: 0 }
  const granted = VISITOR_DAILY_LIMIT + state.sharesCountToday * SHARE_UNLOCK_AMOUNT
  const totalUsed = Math.max(0, granted - state.remainingClicks)
  return {
    visitorUsage: Math.min(VISITOR_DAILY_LIMIT, totalUsed),
    visitorShareUnlocked: state.sharesCountToday > 0,
    visitorShareUsage: Math.min(SHARE_UNLOCK_AMOUNT, Math.max(0, totalUsed - VISITOR_DAILY_LIMIT)),
  }
}

function withShareId(url: string, shareId?: string) {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set("ref", "quota_share")
    if (shareId) parsed.searchParams.set("share_id", shareId)
    return parsed.toString()
  } catch {
    return "https://geekskai.com/?ref=quota_share"
  }
}

async function quotaRequest(body: Record<string, unknown>): Promise<QuotaApiResponse> {
  const response = await fetch("/api/download-quota", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = (await response.json().catch(() => ({}))) as QuotaApiResponse
  if (!response.ok) throw new Error(data.error || unavailableMessage)
  return data
}

export function useDownloadQuota({
  toolId,
  storageKey = DEFAULT_STORAGE_KEY,
  interruptedState = {},
  onRegistrationReturn,
}: UseDownloadQuotaOptions) {
  const { isLoaded, isSignedIn } = useAuth()
  const [quotaState, setQuotaState] = useState<DownloadQuotaState | null>(null)
  const [serverQuota, setServerQuota] = useState<ServerQuota | null>(null)
  const [quotaMode, setQuotaMode] = useState<"pending" | "local" | "server">("pending")
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null)
  const [unlockSuccessMessage, setUnlockSuccessMessage] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("https://geekskai.com/?ref=quota_share")
  const [shareLinkReady, setShareLinkReady] = useState(false)
  const interruptedStateRef = useRef(interruptedState)
  const registrationRestoredRef = useRef(false)

  interruptedStateRef.current = interruptedState

  const readQuota = useCallback((): DownloadQuotaState | null => {
    try {
      const today = getTodayDateKey()
      const raw = window.localStorage.getItem(storageKey)
      return normalizeQuota(raw ? JSON.parse(raw) : null, today)
    } catch {
      setStorageAvailable(false)
      return null
    }
  }, [storageKey])

  const persistQuota = useCallback(
    (nextQuota: DownloadQuotaState | null) => {
      if (!nextQuota) return
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
    if (current) persistQuota(current)
    return current
  }, [persistQuota, readQuota])

  const trackGrowthEvent = useCallback(
    async (eventName: GrowthEventName) => {
      try {
        await quotaRequest({ action: "event", eventName, toolId })
      } catch {
        // Analytics must never block the user's task.
      }
    },
    [toolId]
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    setShareLink(withShareId(window.location.href))
    const localQuota = syncDailyQuota()
    if (!isLoaded) return
    setQuotaMode("pending")

    const carryover = getVisitorCarryover(localQuota)
    void quotaRequest({
      action: "initialize",
      toolId,
      ...carryover,
    })
      .then((data) => {
        if (data.mode === "server" && data.quota) {
          setQuotaMode("server")
          setServerQuota(data.quota)
        } else {
          setQuotaMode("local")
        }
      })
      .catch(() => setQuotaMessage(unavailableMessage))
  }, [isLoaded, isSignedIn, syncDailyQuota, toolId])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || registrationRestoredRef.current) return
    try {
      const raw = window.sessionStorage.getItem(REGISTRATION_RETURN_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as SavedRegistrationReturn
      if (saved.toolId !== toolId || Date.now() - saved.createdAt > 60 * 60_000) return

      registrationRestoredRef.current = true
      window.sessionStorage.removeItem(REGISTRATION_RETURN_KEY)
      onRegistrationReturn?.(saved.state)
      void trackGrowthEvent("signup_completed")
      const cleanUrl = new URL(window.location.href)
      cleanUrl.searchParams.delete("quota_return")
      window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`)
    } catch {
      window.sessionStorage.removeItem(REGISTRATION_RETURN_KEY)
    }
  }, [isLoaded, isSignedIn, onRegistrationReturn, toolId, trackGrowthEvent])

  useEffect(() => {
    if (typeof window === "undefined") return
    const shareId = new URL(window.location.href).searchParams.get("share_id")
    if (!shareId) return
    void quotaRequest({ action: "share_landing", shareId, toolId }).catch(() => undefined)
  }, [toolId])

  const prepareShareLink = useCallback(async () => {
    const currentUrl = window.location.href
    const shareId = crypto.randomUUID()
    const attributedLink = withShareId(currentUrl, shareId)
    setShareLinkReady(false)
    setShareLink(attributedLink)
    try {
      await quotaRequest({ action: "create_share", shareId, toolId })
    } catch {
      // Keep the opaque ID in the prepared URL even if attribution persistence is unavailable.
    } finally {
      setShareLinkReady(true)
    }
    return attributedLink
  }, [toolId])

  const openQuotaGate = useCallback(() => {
    setShowShareModal(true)
    void trackGrowthEvent("quota_gate_viewed")
    void prepareShareLink()
  }, [prepareShareLink, trackGrowthEvent])

  const checkQuotaBeforeDownload = useCallback(async (): Promise<DownloadQuotaCheck> => {
    setQuotaMessage(null)
    setUnlockSuccessMessage(null)

    if (quotaMode === "pending") {
      setQuotaMessage(unavailableMessage)
      return { allowed: false, reason: "daily_limit_reached", message: unavailableMessage }
    }

    if (quotaMode === "server") {
      if (!serverQuota || serverQuota.remaining <= 0) {
        openQuotaGate()
        return { allowed: false, reason: "share_required" }
      }

      const operationId = crypto.randomUUID()
      try {
        const data = await quotaRequest({ action: "reserve", operationId, toolId })
        if (data.quota) setServerQuota(data.quota)
        if (data.outcome === "reserved" || data.outcome === "consumed") {
          return { allowed: true, operationId }
        }
        if (data.outcome === "concurrency_reached") {
          const message = `You already have ${data.quota?.concurrencyLimit ?? 1} active download task${(data.quota?.concurrencyLimit ?? 1) === 1 ? "" : "s"}. Finish one before starting another.`
          setQuotaMessage(message)
          return { allowed: false, reason: "daily_limit_reached", message }
        }
        openQuotaGate()
        return { allowed: false, reason: "share_required" }
      } catch {
        setQuotaMessage(unavailableMessage)
        return { allowed: false, reason: "daily_limit_reached", message: unavailableMessage }
      }
    }

    const current = syncDailyQuota()
    if (!current) return { allowed: true }
    if (current.remainingClicks <= 0) {
      if (current.sharesCountToday >= 1) {
        setQuotaMessage(exhaustedMessage)
      }
      openQuotaGate()
      return {
        allowed: false,
        reason: current.sharesCountToday >= 1 ? "daily_limit_reached" : "share_required",
        message: current.sharesCountToday >= 1 ? exhaustedMessage : undefined,
      }
    }
    return { allowed: true }
  }, [openQuotaGate, quotaMode, serverQuota, syncDailyQuota, toolId])

  const consumeDownloadQuota = useCallback(
    async (operationId?: string) => {
      if (quotaMode === "server") {
        if (!operationId) return
        const data = await quotaRequest({ action: "complete", operationId, toolId })
        if (data.quota) setServerQuota(data.quota)
        void trackGrowthEvent("successful_download")
      } else {
        const current = syncDailyQuota()
        if (current) {
          persistQuota({ ...current, remainingClicks: Math.max(0, current.remainingClicks - 1) })
        }
        void trackGrowthEvent("successful_download")
      }
    },
    [persistQuota, quotaMode, syncDailyQuota, toolId, trackGrowthEvent]
  )

  const releaseDownloadQuota = useCallback(
    async (operationId?: string) => {
      if (quotaMode !== "server" || !operationId) return
      try {
        const data = await quotaRequest({ action: "release", operationId, toolId })
        if (data.quota) setServerQuota(data.quota)
      } catch {
        // The reservation expires automatically if release cannot be delivered.
      }
    },
    [quotaMode, toolId]
  )

  const handleShareUnlock = useCallback(async () => {
    void trackGrowthEvent("share_intent_opened")
    if (quotaMode === "server") {
      try {
        const data = await quotaRequest({ action: "share_unlock", toolId })
        if (data.quota) setServerQuota(data.quota)
        setShowShareModal(false)
        setQuotaMessage(null)
        setUnlockSuccessMessage(
          data.granted
            ? `Share reward unlocked. ${SHARE_UNLOCK_AMOUNT} downloads were added.`
            : "Today's share reward was already used."
        )
      } catch {
        setQuotaMessage(unavailableMessage)
      }
      return
    }

    try {
      const data = await quotaRequest({ action: "share_unlock", toolId })
      const current = syncDailyQuota()
      const localFallback = data.mode === "local" && typeof data.granted !== "boolean"
      if ((data.granted || localFallback) && current && current.sharesCountToday < 1) {
        persistQuota({
          ...current,
          remainingClicks: current.remainingClicks + SHARE_UNLOCK_AMOUNT,
          sharesCountToday: 1,
        })
      }
      setShowShareModal(false)
      setQuotaMessage(null)
      setUnlockSuccessMessage(
        data.granted || localFallback
          ? `Share reward unlocked. ${SHARE_UNLOCK_AMOUNT} downloads were added.`
          : "Today's share reward was already used."
      )
    } catch {
      setQuotaMessage(unavailableMessage)
    }
  }, [persistQuota, quotaMode, syncDailyQuota, toolId, trackGrowthEvent])

  const startRegistration = useCallback(() => {
    const returnUrl = window.location.pathname
    const returnWithMarker = `${returnUrl}?quota_return=1`
    const saved: SavedRegistrationReturn = {
      toolId,
      returnUrl,
      state: interruptedStateRef.current,
      createdAt: Date.now(),
    }
    window.sessionStorage.setItem(REGISTRATION_RETURN_KEY, JSON.stringify(saved))
    void trackGrowthEvent("signup_started")
    window.location.assign(`/sign-up/?redirect_url=${encodeURIComponent(returnWithMarker)}`)
  }, [toolId, trackGrowthEvent])

  const closeShareModal = useCallback(() => setShowShareModal(false), [])
  const visibleRemaining =
    quotaMode === "server" ? serverQuota?.remaining : quotaState?.remainingClicks
  const visibleLimit =
    quotaMode === "server"
      ? serverQuota?.limit
      : VISITOR_DAILY_LIMIT + (quotaState?.sharesCountToday ?? 0) * SHARE_UNLOCK_AMOUNT
  const fallbackLimit = isSignedIn ? REGISTERED_DAILY_LIMIT : VISITOR_DAILY_LIMIT
  const resolvedLimit = visibleLimit ?? fallbackLimit
  const resolvedRemaining = visibleRemaining ?? fallbackLimit
  const quotaConfig = useMemo(
    () => ({
      initialFreeClicks: isSignedIn ? REGISTERED_DAILY_LIMIT : VISITOR_DAILY_LIMIT,
      shareBonusClicks: SHARE_UNLOCK_AMOUNT,
      maxDailyShareUnlocks: 1,
      storageAvailable,
      mode: quotaMode,
      isRegistered: Boolean(isSignedIn),
      shareUnlockAvailable:
        shareLinkReady &&
        (quotaMode === "server"
          ? Boolean(serverQuota?.shareUnlockAvailable)
          : (quotaState?.sharesCountToday ?? 0) < 1),
      used: Math.max(0, resolvedLimit - resolvedRemaining),
      limit: resolvedLimit,
      remaining: resolvedRemaining,
    }),
    [
      isSignedIn,
      quotaMode,
      quotaState?.sharesCountToday,
      serverQuota?.shareUnlockAvailable,
      shareLinkReady,
      storageAvailable,
      resolvedLimit,
      resolvedRemaining,
    ]
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
    releaseDownloadQuota,
    handleShareUnlock,
    startRegistration,
    closeShareModal,
  }
}

export type DownloadQuotaController = ReturnType<typeof useDownloadQuota>
