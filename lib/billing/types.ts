export interface BillingStatusResponse {
  subscriptionStatus: string | null
  currentPeriodEnd: string | null
  batchFileLimit: number
  zipExport: boolean
  isPro: boolean
}

export interface CreemWebhookPayload {
  id: string
  eventType: string
  createdAt: Date
  object: Record<string, unknown>
}
