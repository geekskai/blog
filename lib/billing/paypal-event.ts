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
  amountMinor: number | null
  currency: string | null
  feeMinor: number | null
  netMinor: number | null
  statusReason: string | null
}

export type NormalizedPayPalPayment = {
  amount: string | null
  amountMinor: number | null
  currency: string | null
  feeMinor: number | null
  netMinor: number | null
  statusReason: string | null
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
  if (!raw || !currency || !/^\d+(?:\.\d{1,2})?$/.test(raw)) return null
  const [whole, fraction = ""] = raw.split(".")
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"))
  return Number.isSafeInteger(minor)
    ? { raw, value: Number(raw), minor, currency: currency.toUpperCase() }
    : null
}

export function normalizePayPalPaymentResource(
  resource: Record<string, unknown>
): NormalizedPayPalPayment {
  const receivable = readObject(resource.seller_receivable_breakdown)
  const gross = readMoney(receivable?.gross_amount) ?? readMoney(resource.amount)
  const fee = readMoney(receivable?.paypal_fee) ?? readMoney(resource.transaction_fee)
  const net = readMoney(receivable?.net_amount) ?? readMoney(resource.receivable_amount)
  const currency = gross?.currency ?? fee?.currency ?? net?.currency ?? null

  return {
    amount: gross?.raw ?? null,
    amountMinor: gross?.minor ?? null,
    currency,
    feeMinor: fee?.currency === currency ? fee.minor : null,
    netMinor: net?.currency === currency ? net.minor : null,
    statusReason:
      readString(resource.reason_code) ??
      readString(resource.pending_reason) ??
      readString(resource.status_details),
  }
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
  const payment = normalizePayPalPaymentResource(resource)
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
    amount: readString(amount?.value) ?? payment.amount,
    amountMinor: payment.amountMinor,
    currency: readString(amount?.currency_code)?.toUpperCase() ?? payment.currency,
    feeMinor: payment.feeMinor,
    netMinor: payment.netMinor,
    statusReason: payment.statusReason,
  }
}
