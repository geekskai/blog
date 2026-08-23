import type { BillingInterval, CheckoutTier, PackageTier } from "./domain"
import type { PayPalWebhookEvent } from "./paypal-event"

export interface AccountPlanStatus {
  packageTier: PackageTier
  billingInterval: BillingInterval | null
  subscriptionStatus: string | null
  currentPeriodEnd: string | null
  cancellationScheduled: boolean
  batchFileLimit: number
  zipExport: boolean
}

export interface ManagedPayPalSubscription {
  subscriptionId: string
  status: string
  currentPeriodEnd: string | null
  packageTier: CheckoutTier
  billingInterval: BillingInterval
}

export type { PayPalWebhookEvent }
