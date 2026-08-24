import "server-only"
import { randomUUID } from "node:crypto"
import { CREDIT_CATALOG } from "./catalog"
import { getSqlClient } from "@/lib/db/client"
import { getAudioCreditBalance } from "@/lib/audio-credits/repository"

const PROVIDER = "paypal"
type Row = Record<string, unknown>

const readObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
const readString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null

export async function createPendingPaygOrder(clerkUserId: string) {
  const sql = getSqlClient()
  const id = randomUUID()
  await sql`
    INSERT INTO billing_orders (
      id, clerk_user_id, provider, product_key, status, amount_minor, currency
    ) VALUES (
      ${id}::uuid, ${clerkUserId}, ${PROVIDER}, ${CREDIT_CATALOG.payg480.key},
      'CREATED', ${CREDIT_CATALOG.payg480.price * 100}, ${CREDIT_CATALOG.payg480.currency}
    )
  `
  return id
}

export async function attachPayPalOrder(localOrderId: string, providerOrderId: string) {
  const sql = getSqlClient()
  await sql`
    UPDATE billing_orders
    SET provider_order_id = ${providerOrderId}, updated_at = now()
    WHERE id = ${localOrderId}::uuid AND provider = ${PROVIDER}
  `
}

export async function getPaygOrderForCapture(clerkUserId: string, providerOrderId: string) {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT id, status, provider_capture_id, amount_minor, currency, product_key
    FROM billing_orders
    WHERE clerk_user_id = ${clerkUserId}
      AND provider = ${PROVIDER}
      AND provider_order_id = ${providerOrderId}
    LIMIT 1
  `) as Row[]
  return rows[0] ?? null
}

export function parseCompletedPayPalCapture(
  resource: Record<string, unknown>,
  expected: { localOrderId: string; providerOrderId: string }
) {
  const purchaseUnits = Array.isArray(resource.purchase_units) ? resource.purchase_units : []
  const unit = readObject(purchaseUnits[0])
  const payments = readObject(unit?.payments)
  const captures = Array.isArray(payments?.captures) ? payments.captures : []
  const capture = readObject(captures[0])
  const amount = readObject(capture?.amount)
  const captureId = readString(capture?.id)
  const status = readString(capture?.status)?.toUpperCase()
  const customId = readString(unit?.custom_id)
  const orderId = readString(resource.id)
  const value = readString(amount?.value)
  const currency = readString(amount?.currency_code)?.toUpperCase()
  const capturedAtRaw = readString(capture?.update_time) ?? readString(capture?.create_time)
  const capturedAt = capturedAtRaw ? new Date(capturedAtRaw) : new Date()
  if (
    !captureId ||
    status !== "COMPLETED" ||
    orderId !== expected.providerOrderId ||
    customId !== expected.localOrderId ||
    value !== CREDIT_CATALOG.payg480.price.toFixed(2) ||
    currency !== CREDIT_CATALOG.payg480.currency
  ) {
    throw new Error("PayPal capture does not match the PAYG product.")
  }
  return {
    captureId,
    orderId,
    status,
    capturedAt: Number.isNaN(capturedAt.getTime()) ? new Date() : capturedAt,
  }
}

export async function completePaygOrder(input: {
  clerkUserId: string
  localOrderId: string
  providerOrderId: string
  captureId: string
  capturedAt: Date
}) {
  const sql = getSqlClient()
  const rows = (await sql`
    WITH completed AS (
      UPDATE billing_orders
      SET provider_capture_id = ${input.captureId}, status = 'COMPLETED',
        captured_at = COALESCE(captured_at, ${input.capturedAt}), updated_at = now()
      WHERE id = ${input.localOrderId}::uuid
        AND clerk_user_id = ${input.clerkUserId}
        AND provider = ${PROVIDER}
        AND provider_order_id = ${input.providerOrderId}
        AND (provider_capture_id IS NULL OR provider_capture_id = ${input.captureId})
        AND product_key = ${CREDIT_CATALOG.payg480.key}
        AND amount_minor = ${CREDIT_CATALOG.payg480.price * 100}
        AND currency = ${CREDIT_CATALOG.payg480.currency}
        AND status IN ('CREATED', 'COMPLETED')
      RETURNING clerk_user_id, captured_at
    )
    INSERT INTO audio_credit_grants (
      clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
    )
    SELECT clerk_user_id, 'paypal_order', ${input.captureId},
      ${CREDIT_CATALOG.payg480.credits}, captured_at,
      captured_at + ${CREDIT_CATALOG.payg480.validityDays} * interval '1 day'
    FROM completed
    ON CONFLICT (clerk_user_id, source, source_ref) DO UPDATE
      SET updated_at = audio_credit_grants.updated_at
    RETURNING clerk_user_id
  `) as Row[]
  if (!rows[0]) throw new Error("PayPal order could not be completed.")
  return getAudioCreditBalance(input.clerkUserId, input.capturedAt)
}

export async function completePaygOrderFromWebhook(input: {
  providerOrderId: string
  captureId: string
  amount: string | null
  currency: string | null
  occurredAt: Date
}) {
  if (
    input.amount !== CREDIT_CATALOG.payg480.price.toFixed(2) ||
    input.currency !== CREDIT_CATALOG.payg480.currency
  ) {
    return { linked: false, processingError: "amount_mismatch" as const }
  }
  const sql = getSqlClient()
  const rows = (await sql`
    WITH completed AS (
      UPDATE billing_orders
      SET provider_capture_id = ${input.captureId}, status = 'COMPLETED',
        captured_at = COALESCE(captured_at, ${input.occurredAt}), updated_at = now()
      WHERE provider = ${PROVIDER}
        AND provider_order_id = ${input.providerOrderId}
        AND (provider_capture_id IS NULL OR provider_capture_id = ${input.captureId})
        AND product_key = ${CREDIT_CATALOG.payg480.key}
        AND amount_minor = ${CREDIT_CATALOG.payg480.price * 100}
        AND currency = ${CREDIT_CATALOG.payg480.currency}
        AND status IN ('CREATED', 'COMPLETED')
      RETURNING clerk_user_id, captured_at
    )
    INSERT INTO audio_credit_grants (
      clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
    )
    SELECT clerk_user_id, 'paypal_order', ${input.captureId},
      ${CREDIT_CATALOG.payg480.credits}, captured_at,
      captured_at + ${CREDIT_CATALOG.payg480.validityDays} * interval '1 day'
    FROM completed
    ON CONFLICT (clerk_user_id, source, source_ref) DO UPDATE
      SET updated_at = audio_credit_grants.updated_at
    RETURNING clerk_user_id
  `) as Row[]
  const row = rows[0]
  if (!row) return { linked: false, processingError: "unlinked_order" as const }
  return { linked: true, processingError: null }
}

export async function markPaygCaptureRefunded(
  captureId: string,
  now = new Date(),
  status: "REFUNDED" | "PARTIALLY_REFUNDED" = "REFUNDED"
) {
  const sql = getSqlClient()
  const rows = (await sql`
    UPDATE billing_orders
    SET status = ${status}, refunded_at = ${now}, updated_at = ${now}
    WHERE provider = ${PROVIDER} AND provider_capture_id = ${captureId}
    RETURNING clerk_user_id
  `) as Row[]
  return rows[0] ? String(rows[0].clerk_user_id) : null
}
