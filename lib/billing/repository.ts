import "server-only"
import { createHash } from "node:crypto"
import { getSqlClient } from "@/lib/db/client"
import { FREE_BATCH_FILE_LIMIT, PRO_BATCH_FILE_LIMIT } from "@/lib/workspace/audio"
import { classifyRefund, getAccessAction } from "./domain"
import type { BillingStatusResponse, CreemWebhookPayload } from "./types"

const PROVIDER = "creem"
const BATCH_LIMIT_KEY = "workspace.batch_file_limit"
const ZIP_EXPORT_KEY = "workspace.zip_export"

type Row = Record<string, unknown>

const readString = (value: unknown) => (typeof value === "string" && value ? value : null)
const readNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null)
const readObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

function entityId(value: unknown) {
  return readString(value) ?? readString(readObject(value)?.id)
}

function parseDate(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function getWebhookIdentity(payload: CreemWebhookPayload) {
  const object = payload.object
  const metadata = readObject(object.metadata) ?? {}
  const customer = readObject(object.customer)
  const subscription = readObject(object.subscription) ?? object
  const transaction = readObject(object.transaction)
  const product = readObject(subscription.product) ?? readObject(object.product)
  return {
    clerkUserId:
      readString(metadata.referenceId) ??
      readString(metadata.reference_id) ??
      readString(metadata.userId) ??
      readString(metadata.user_id),
    customerId: entityId(object.customer) ?? entityId(subscription.customer),
    subscriptionId:
      entityId(object.subscription) ??
      (payload.eventType.startsWith("subscription.") ? entityId(object) : null),
    productId: entityId(subscription.product) ?? entityId(object.product) ?? entityId(product),
    status: readString(subscription.status) ?? payload.eventType.replace("subscription.", ""),
    currentPeriodEnd:
      parseDate(subscription.currentPeriodEndDate) ??
      parseDate(subscription.current_period_end_date) ??
      parseDate(subscription.currentPeriodEnd) ??
      parseDate(subscription.current_period_end),
    refundType: classifyRefund({
      refundAmount: readNumber(object.refund_amount) ?? readNumber(object.refundAmount),
      transactionAmountPaid:
        readNumber(transaction?.amount_paid) ?? readNumber(transaction?.amountPaid),
      transactionRefundedAmount:
        readNumber(transaction?.refunded_amount) ?? readNumber(transaction?.refundedAmount),
      subscriptionStatus: readString(subscription.status),
    }),
  }
}

export async function getWorkspaceBillingStatus(clerkUserId: string): Promise<BillingStatusResponse> {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT
      subscription.status,
      subscription.current_period_end,
      COALESCE((
        SELECT (entitlement.value #>> '{}')::integer
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = ${BATCH_LIMIT_KEY}
          AND entitlement.effective_at <= now()
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        ORDER BY entitlement.updated_at DESC
        LIMIT 1
      ), ${FREE_BATCH_FILE_LIMIT}) AS batch_file_limit,
      COALESCE((
        SELECT (entitlement.value #>> '{}')::boolean
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = ${ZIP_EXPORT_KEY}
          AND entitlement.effective_at <= now()
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        ORDER BY entitlement.updated_at DESC
        LIMIT 1
      ), false) AS zip_export
    FROM (SELECT 1) seed
    LEFT JOIN LATERAL (
      SELECT status, current_period_end
      FROM billing_subscriptions
      WHERE clerk_user_id = ${clerkUserId} AND provider = ${PROVIDER}
      ORDER BY updated_at DESC
      LIMIT 1
    ) subscription ON true
  `) as Row[]
  const row = rows[0] ?? {}
  const batchFileLimit = Number(row.batch_file_limit ?? FREE_BATCH_FILE_LIMIT)
  const currentPeriodEnd = row.current_period_end
  return {
    subscriptionStatus: readString(row.status),
    currentPeriodEnd: currentPeriodEnd instanceof Date ? currentPeriodEnd.toISOString() : null,
    batchFileLimit,
    zipExport: row.zip_export === true,
    isPro: batchFileLimit >= PRO_BATCH_FILE_LIMIT && row.zip_export === true,
  }
}

export async function getCreemCustomerId(clerkUserId: string) {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT provider_customer_id
    FROM billing_customers
    WHERE clerk_user_id = ${clerkUserId} AND provider = ${PROVIDER}
    LIMIT 1
  `) as Row[]
  return readString(rows[0]?.provider_customer_id)
}

export async function listTrackedCreemSubscriptionIds() {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT provider_subscription_id
    FROM billing_subscriptions
    WHERE provider = ${PROVIDER}
      AND status NOT IN ('expired', 'canceled')
    ORDER BY updated_at ASC
    LIMIT 500
  `) as Row[]
  return rows.flatMap((row) => {
    const id = readString(row.provider_subscription_id)
    return id ? [id] : []
  })
}

export async function recordWorkspaceActivation(clerkUserId: string, kind: "single" | "batch") {
  const sql = getSqlClient()
  const singleAt = kind === "single" ? new Date() : null
  const batchAt = kind === "batch" ? new Date() : null
  await sql`
    INSERT INTO workspace_activations (
      clerk_user_id, first_single_completed_at, first_batch_completed_at, updated_at
    ) VALUES (${clerkUserId}, ${singleAt}, ${batchAt}, now())
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      first_single_completed_at = COALESCE(
        workspace_activations.first_single_completed_at,
        EXCLUDED.first_single_completed_at
      ),
      first_batch_completed_at = COALESCE(
        workspace_activations.first_batch_completed_at,
        EXCLUDED.first_batch_completed_at
      ),
      updated_at = now()
  `
}

export function parseCreemWebhookPayload(value: unknown): CreemWebhookPayload {
  const body = readObject(value)
  const id = readString(body?.id)
  const eventType = readString(body?.eventType) ?? readString(body?.event_type)
  const object = readObject(body?.object)
  if (!id || !eventType || !object) throw new Error("Invalid Creem webhook payload.")
  const createdAt = parseDate(body?.created_at) ?? parseDate(body?.createdAt) ?? new Date()
  return { id, eventType, object, createdAt }
}

export async function processCreemWebhook(payload: CreemWebhookPayload, rawPayload: string) {
  const sql = getSqlClient()
  const payloadHash = createHash("sha256").update(rawPayload).digest("hex")
  const eventRows = (await sql`
    INSERT INTO billing_webhook_events (
      provider, provider_event_id, event_type, payload_hash
    ) VALUES (${PROVIDER}, ${payload.id}, ${payload.eventType}, ${payloadHash})
    ON CONFLICT (provider, provider_event_id) DO UPDATE SET
      payload_hash = billing_webhook_events.payload_hash
    RETURNING processed_at
  `) as Row[]
  if (eventRows[0]?.processed_at) return { duplicate: true }

  const identity = getWebhookIdentity(payload)
  let clerkUserId = identity.clerkUserId
  if (!clerkUserId && identity.customerId) {
    const userRows = (await sql`
      SELECT clerk_user_id FROM billing_customers
      WHERE provider = ${PROVIDER} AND provider_customer_id = ${identity.customerId}
      LIMIT 1
    `) as Row[]
    clerkUserId = readString(userRows[0]?.clerk_user_id)
  }

  if (clerkUserId && identity.customerId) {
    await sql`
      INSERT INTO billing_customers (clerk_user_id, provider, provider_customer_id, updated_at)
      VALUES (${clerkUserId}, ${PROVIDER}, ${identity.customerId}, now())
      ON CONFLICT (clerk_user_id, provider) DO UPDATE SET
        provider_customer_id = EXCLUDED.provider_customer_id,
        updated_at = now()
    `
  }

  let subscriptionUpdated = true
  if (clerkUserId && identity.subscriptionId) {
    const subscriptionRows = (await sql`
      INSERT INTO billing_subscriptions (
        clerk_user_id, provider, provider_subscription_id, status, product_id,
        provider_event_at, current_period_end, canceled_at, updated_at
      ) VALUES (
        ${clerkUserId}, ${PROVIDER}, ${identity.subscriptionId}, ${identity.status},
        ${identity.productId}, ${payload.createdAt}, ${identity.currentPeriodEnd},
        ${payload.eventType === "subscription.canceled" ? payload.createdAt : null}, now()
      )
      ON CONFLICT (provider, provider_subscription_id) DO UPDATE SET
        clerk_user_id = EXCLUDED.clerk_user_id,
        status = EXCLUDED.status,
        product_id = COALESCE(EXCLUDED.product_id, billing_subscriptions.product_id),
        provider_event_at = EXCLUDED.provider_event_at,
        current_period_end = COALESCE(
          EXCLUDED.current_period_end,
          billing_subscriptions.current_period_end
        ),
        canceled_at = COALESCE(EXCLUDED.canceled_at, billing_subscriptions.canceled_at),
        updated_at = now()
      WHERE billing_subscriptions.provider_event_at IS NULL
         OR billing_subscriptions.provider_event_at <= EXCLUDED.provider_event_at
      RETURNING id
    `) as Row[]
    subscriptionUpdated = subscriptionRows.length > 0
  }

  const action = getAccessAction(payload.eventType, {
    refundType: identity.refundType === "partial" ? "partial" : "full",
  })
  if (clerkUserId && identity.subscriptionId && subscriptionUpdated) {
    const source = `creem:${identity.subscriptionId}`
    if (action === "grant") {
      await sql`
        INSERT INTO account_entitlements (
          clerk_user_id, entitlement_key, value, source, effective_at, expires_at, updated_at
        ) VALUES
          (${clerkUserId}, ${BATCH_LIMIT_KEY}, ${JSON.stringify(PRO_BATCH_FILE_LIMIT)}::jsonb, ${source}, now(), null, now()),
          (${clerkUserId}, ${ZIP_EXPORT_KEY}, ${JSON.stringify(true)}::jsonb, ${source}, now(), null, now())
        ON CONFLICT (clerk_user_id, entitlement_key, source) DO UPDATE SET
          value = EXCLUDED.value,
          effective_at = EXCLUDED.effective_at,
          expires_at = null,
          updated_at = now()
      `
    } else if (action === "revoke") {
      await sql`
        UPDATE account_entitlements
        SET expires_at = LEAST(COALESCE(expires_at, now()), now()), updated_at = now()
        WHERE clerk_user_id = ${clerkUserId} AND source = ${source}
      `
    }
  }

  await sql`
    UPDATE billing_webhook_events SET processed_at = now()
    WHERE provider = ${PROVIDER} AND provider_event_id = ${payload.id}
  `
  return { duplicate: false, action, linked: Boolean(clerkUserId) }
}
