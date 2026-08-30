export const VISITOR_DAILY_LIMIT = 3
export const REGISTERED_DAILY_LIMIT = 10
export const SHARE_UNLOCK_AMOUNT = 5

export type QuotaRuntimeMode = "pending" | "local" | "server"

export function growthExperimentsEnabled(mode: QuotaRuntimeMode): boolean {
  return mode === "server"
}

type RegisteredQuotaUsage = {
  successfulDownloads: number
  activeReservations: number
  shareUnlocked: boolean
  dailyLimit?: number
  concurrencyLimit?: number
  shareEligible?: boolean
}

export type RegisteredQuotaSummary = {
  limit: number
  remaining: number
  successfulDownloads: number
  activeReservations: number
  concurrencyLimit: number
  shareUnlockAvailable: boolean
}

export function getQuotaDay(now = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function normalizeVisitorUsageCarryover(value: unknown): number {
  const usage = Number(value)
  if (!Number.isFinite(usage)) return 0
  return Math.min(VISITOR_DAILY_LIMIT, Math.max(0, Math.floor(usage)))
}

export function normalizeVisitorShareCarryover(shareUnlocked: unknown, used: unknown) {
  const unlocked = shareUnlocked === true
  const numericUsed = Number(used)
  return {
    shareUnlocked: unlocked,
    used:
      unlocked && Number.isFinite(numericUsed)
        ? Math.min(SHARE_UNLOCK_AMOUNT, Math.max(0, Math.floor(numericUsed)))
        : 0,
  }
}

export function mergeVisitorUsageCarryover(input: {
  clientUsage: unknown
  clientShareUnlocked: unknown
  clientShareUsage: unknown
  serverSuccessfulDownloads?: number
  serverShareUnlocked?: boolean
}) {
  const clientUsage = normalizeVisitorUsageCarryover(input.clientUsage)
  const clientShare = normalizeVisitorShareCarryover(
    input.clientShareUnlocked,
    input.clientShareUsage
  )
  const serverTotal = Math.min(
    VISITOR_DAILY_LIMIT + SHARE_UNLOCK_AMOUNT,
    Math.max(0, Math.floor(input.serverSuccessfulDownloads ?? 0))
  )
  const serverUsage = Math.min(VISITOR_DAILY_LIMIT, serverTotal)
  const serverShareUsage = input.serverShareUnlocked
    ? Math.min(SHARE_UNLOCK_AMOUNT, Math.max(0, serverTotal - VISITOR_DAILY_LIMIT))
    : 0

  return {
    visitorUsage: Math.max(clientUsage, serverUsage),
    visitorShareUnlocked: clientShare.shareUnlocked || Boolean(input.serverShareUnlocked),
    visitorShareUsage: Math.max(clientShare.used, serverShareUsage),
  }
}

export function getRegisteredQuotaSummary({
  successfulDownloads,
  activeReservations,
  shareUnlocked,
  dailyLimit = REGISTERED_DAILY_LIMIT,
  concurrencyLimit = 1,
  shareEligible = true,
}: RegisteredQuotaUsage): RegisteredQuotaSummary {
  const limit = dailyLimit + (shareEligible && shareUnlocked ? SHARE_UNLOCK_AMOUNT : 0)
  const used = Math.max(0, successfulDownloads) + Math.max(0, activeReservations)

  return {
    limit,
    remaining: Math.max(0, limit - used),
    successfulDownloads: Math.max(0, successfulDownloads),
    activeReservations: Math.max(0, activeReservations),
    concurrencyLimit,
    shareUnlockAvailable: shareEligible && !shareUnlocked,
  }
}
