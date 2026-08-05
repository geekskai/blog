export const VISITOR_DAILY_LIMIT = 3
export const REGISTERED_DAILY_LIMIT = 10
export const SHARE_UNLOCK_AMOUNT = 5

type RegisteredQuotaUsage = {
  successfulDownloads: number
  activeReservations: number
  shareUnlocked: boolean
}

export type RegisteredQuotaSummary = {
  limit: number
  remaining: number
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

export function getRegisteredQuotaSummary({
  successfulDownloads,
  activeReservations,
  shareUnlocked,
}: RegisteredQuotaUsage): RegisteredQuotaSummary {
  const limit = REGISTERED_DAILY_LIMIT + (shareUnlocked ? SHARE_UNLOCK_AMOUNT : 0)
  const used = Math.max(0, successfulDownloads) + Math.max(0, activeReservations)

  return {
    limit,
    remaining: Math.max(0, limit - used),
    shareUnlockAvailable: !shareUnlocked,
  }
}
