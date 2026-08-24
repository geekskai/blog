export type PayPalWebhookEvent = {
  id: string
  event_type: string
  create_time?: string
  resource: Record<string, unknown>
}

export type NormalizedPayPalEvent = {
  id: string
  eventType: string
  occurredAt: Date
  resource: Record<string, unknown>
  subscriptionId: string | null
  planId: string | null
  correlationId: string | null
  payerId: string | null
  status: string | null
  currentPeriodEnd: Date | null
  saleId: string | null
  orderId: string | null
  captureId: string | null
  amount: string | null
  currency: string | null
}

const readObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

const readString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null

const readDate = (value: unknown) => {
  const raw = readString(value)
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

const readMoney = (value: unknown) => {
  const amount = readObject(value)
  const raw = readString(amount?.total) ?? readString(amount?.value)
  const currency = readString(amount?.currency) ?? readString(amount?.currency_code)
  const numeric = raw ? Number(raw) : Number.NaN
  return Number.isFinite(numeric) && numeric >= 0 && currency
    ? { value: numeric, currency: currency.toUpperCase() }
    : null
}

export function classifyPayPalRefund(
  refundResource: Record<string, unknown>,
  saleResource: Record<string, unknown>
): "full" | "partial" {
  if (readString(saleResource.state)?.toLowerCase() === "refunded") return "full"
  const refund = readMoney(refundResource.amount)
  const sale = readMoney(saleResource.amount)
  return refund &&
    sale &&
    refund.currency === sale.currency &&
    sale.value > 0 &&
    refund.value >= sale.value
    ? "full"
    : "partial"
}

export function normalizePayPalEvent(value: unknown): NormalizedPayPalEvent {
  const body = readObject(value)
  const id = readString(body?.id)
  const eventType = readString(body?.event_type)
  const resource = readObject(body?.resource)
  if (!id || !eventType || !resource) throw new Error("Invalid PayPal webhook event.")

  const subscriber = readObject(resource.subscriber)
  const billingInfo = readObject(resource.billing_info)
  const disputedTransactions = Array.isArray(resource.disputed_transactions)
    ? resource.disputed_transactions
    : []
  const disputedTransaction = readObject(disputedTransactions[0])
  const subscriptionEvent = eventType.startsWith("BILLING.SUBSCRIPTION.")
  const supplementaryData = readObject(resource.supplementary_data)
  const relatedIds = readObject(supplementaryData?.related_ids)
  const amount = readObject(resource.amount)
  const captureEvent = eventType.startsWith("PAYMENT.CAPTURE.")
  const saleId =
    eventType === "PAYMENT.SALE.REFUNDED" || eventType === "PAYMENT.SALE.REVERSED"
      ? readString(resource.sale_id)
      : eventType.startsWith("PAYMENT.SALE.")
        ? readString(resource.id)
        : readString(disputedTransaction?.seller_transaction_id)

  return {
    id,
    eventType,
    occurredAt: readDate(body?.create_time) ?? new Date(),
    resource,
    subscriptionId: subscriptionEvent
      ? readString(resource.id)
      : readString(resource.billing_agreement_id),
    planId: readString(resource.plan_id),
    correlationId: readString(resource.custom_id),
    payerId: readString(subscriber?.payer_id),
    status: readString(resource.status),
    currentPeriodEnd: readDate(billingInfo?.next_billing_time),
    saleId,
    orderId: readString(relatedIds?.order_id),
    captureId: captureEvent
      ? eventType === "PAYMENT.CAPTURE.COMPLETED"
        ? readString(resource.id)
        : readString(relatedIds?.capture_id)
      : null,
    amount: readString(amount?.value),
    currency: readString(amount?.currency_code)?.toUpperCase() ?? null,
  }
}
