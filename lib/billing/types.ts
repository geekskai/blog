import type { BillingInterval, PackageTier } from "./domain"

export interface AccountPlanStatus {
  packageTier: PackageTier
  billingInterval: BillingInterval | null
  subscriptionStatus: string | null
  currentPeriodEnd: string | null
  cancellationScheduled: boolean
  batchFileLimit: number
  zipExport: boolean
  downloadDailyLimit: number
  downloadConcurrency: number
  shareUnlockAvailable: boolean
}

export interface CreemWebhookPayload {
  id: string
  eventType: string
  createdAt: Date
  object: Record<string, unknown>
}
