import "server-only"
import { createHash } from "node:crypto"
import { getSqlClient } from "@/lib/db/client"
import {
  classifyRefund,
  getAccessAction,
  getBillingProductSelection,
  getEntitlementSet,
  isPackageTier,
  type BillingInterval,
  type PackageTier,
} from "./domain"
import { billingSchemaV2Enabled, paidDownloadQuotasEnabled } from "./policy"
import type { AccountPlanStatus, CreemWebhookPayload } from "./types"

const PROVIDER = "creem"
const ACCOUNT_TIER_KEY = "account.package_tier"
const BATCH_LIMIT_KEY = "workspace.batch_file_limit"
const ZIP_EXPORT_KEY = "workspace.zip_export"
const DAILY_LIMIT_KEY = "downloads.daily_limit"
const CONCURRENCY_KEY = "downloads.concurrent_limit"

type Row = Record<string, unknown>

const readString = (value: unknown) => (typeof value === "string" && value ? value : null)
const readNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null
const readObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

const productEnvironment = () => ({
  CREEM_BASIC_MONTHLY_PRODUCT_ID: process.env.CREEM_BASIC_MONTHLY_PRODUCT_ID,
  CREEM_BASIC_ANNUAL_PRODUCT_ID: process.env.CREEM_BASIC_ANNUAL_PRODUCT_ID,
  CREEM_PRO_MONTHLY_PRODUCT_ID: process.env.CREEM_PRO_MONTHLY_PRODUCT_ID,
  CREEM_PRO_ANNUAL_PRODUCT_ID: process.env.CREEM_PRO_ANNUAL_PRODUCT_ID,
})

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

export async function getAccountPlanStatus(clerkUserId: string): Promise<AccountPlanStatus> {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT
      subscription.status,
      subscription.current_period_end,
      subscription.product_id,
      COALESCE((
        SELECT entitlement.value #>> '{}'
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = ${ACCOUNT_TIER_KEY}
          AND entitlement.effective_at <= now()
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        ORDER BY
          CASE WHEN entitlement.source LIKE 'manual:%' THEN 0 ELSE 1 END,
          entitlement.updated_at DESC
        LIMIT 1
      ), 'free') AS package_tier,
      COALESCE((
        SELECT (entitlement.value #>> '{}')::integer
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = ${BATCH_LIMIT_KEY}
          AND entitlement.effective_at <= now()
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        ORDER BY CASE WHEN entitlement.source LIKE 'manual:%' THEN 0 ELSE 1 END,
          entitlement.updated_at DESC
        LIMIT 1
      ), 1) AS batch_file_limit,
      COALESCE((
        SELECT (entitlement.value #>> '{}')::boolean
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = ${ZIP_EXPORT_KEY}
          AND entitlement.effective_at <= now()
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        ORDER BY CASE WHEN entitlement.source LIKE 'manual:%' THEN 0 ELSE 1 END,
          entitlement.updated_at DESC
        LIMIT 1
      ), false) AS zip_export,
      COALESCE((
        SELECT (entitlement.value #>> '{}')::integer
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = ${DAILY_LIMIT_KEY}
          AND entitlement.effective_at <= now()
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        ORDER BY CASE WHEN entitlement.source LIKE 'manual:%' THEN 0 ELSE 1 END,
          entitlement.updated_at DESC
        LIMIT 1
      ), 10) AS download_daily_limit,
      COALESCE((
        SELECT (entitlement.value #>> '{}')::integer
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = ${CONCURRENCY_KEY}
          AND entitlement.effective_at <= now()
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        ORDER BY CASE WHEN entitlement.source LIKE 'manual:%' THEN 0 ELSE 1 END,
          entitlement.updated_at DESC
        LIMIT 1
      ), 1) AS download_concurrency
    FROM (SELECT 1) seed
    LEFT JOIN LATERAL (
      SELECT status, current_period_end, product_id
      FROM billing_subscriptions
      WHERE clerk_user_id = ${clerkUserId} AND provider = ${PROVIDER}
      ORDER BY updated_at DESC
      LIMIT 1
    ) subscription ON true
  `) as Row[]
  const row = rows[0] ?? {}
  const packageTier: PackageTier = isPackageTier(row.package_tier) ? row.package_tier : "free"
  const catalogEntitlements = getEntitlementSet(packageTier)
  const storedBatchFileLimit = Number(row.batch_file_limit ?? 1)
  const batchFileLimit =
    packageTier === "enterprise"
      ? Math.max(catalogEntitlements.audioBatchFileLimit, storedBatchFileLimit)
      : catalogEntitlements.audioBatchFileLimit
  const zipExport =
    packageTier === "enterprise"
      ? catalogEntitlements.zipExport || row.zip_export === true
      : catalogEntitlements.zipExport
  const downloadDailyLimit =
    packageTier === "enterprise"
      ? Math.max(catalogEntitlements.downloadDailyLimit, Number(row.download_daily_limit ?? 10))
      : catalogEntitlements.downloadDailyLimit
  const downloadConcurrency =
    packageTier === "enterprise"
      ? Math.max(catalogEntitlements.downloadConcurrency, Number(row.download_concurrency ?? 1))
      : catalogEntitlements.downloadConcurrency
  const currentPeriodEnd = row.current_period_end
  const billingInterval = getBillingProductSelection(
    readString(row.product_id),
    productEnvironment()
  )?.interval
  const paidDownloadsEnabled = paidDownloadQuotasEnabled()
  const manuallyGrantedEnterprise = packageTier === "enterprise"
  return {
    packageTier,
    billingInterval:
      !manuallyGrantedEnterprise && (billingInterval === "monthly" || billingInterval === "annual")
        ? (billingInterval as BillingInterval)
        : null,
    subscriptionStatus: manuallyGrantedEnterprise ? "manual_grant" : readString(row.status),
    currentPeriodEnd:
      !manuallyGrantedEnterprise && currentPeriodEnd instanceof Date
        ? currentPeriodEnd.toISOString()
        : null,
    cancellationScheduled:
      !manuallyGrantedEnterprise && readString(row.status) === "scheduled_cancel",
    batchFileLimit,
    zipExport,
    downloadDailyLimit: paidDownloadsEnabled ? downloadDailyLimit : 10,
    downloadConcurrency: paidDownloadsEnabled ? downloadConcurrency : 1,
    shareUnlockAvailable: packageTier === "free",
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
      AND status <> 'canceled'
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
  if (!billingSchemaV2Enabled()) {
    throw new Error("Billing schema v2 is not enabled.")
  }

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
  const selection = getBillingProductSelection(identity.productId, productEnvironment())
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
        package_tier, billing_interval, provider_event_at, current_period_end, canceled_at, updated_at
      ) VALUES (
        ${clerkUserId}, ${PROVIDER}, ${identity.subscriptionId}, ${identity.status},
        ${identity.productId}, ${selection?.tier ?? null}, ${selection?.interval ?? null},
        ${payload.createdAt}, ${identity.currentPeriodEnd},
        ${payload.eventType === "subscription.canceled" ? payload.createdAt : null}, now()
      )
      ON CONFLICT (provider, provider_subscription_id) DO UPDATE SET
        clerk_user_id = EXCLUDED.clerk_user_id,
        status = EXCLUDED.status,
        product_id = COALESCE(EXCLUDED.product_id, billing_subscriptions.product_id),
        package_tier = COALESCE(EXCLUDED.package_tier, billing_subscriptions.package_tier),
        billing_interval = COALESCE(EXCLUDED.billing_interval, billing_subscriptions.billing_interval),
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
  const processingError = !clerkUserId
    ? "unlinked_account"
    : !selection && (action === "grant" || identity.productId)
      ? "unknown_product"
      : null
  if (processingError) {
    console.error("Creem billing event rejected", {
      providerEventId: payload.id,
      eventType: payload.eventType,
      processingError,
    })
  }
  if (clerkUserId && identity.subscriptionId && subscriptionUpdated) {
    const source = `creem:${identity.subscriptionId}`
    if (action === "grant" && selection) {
      const entitlements = getEntitlementSet(selection.tier)
      await sql`
        INSERT INTO account_entitlements (
          clerk_user_id, entitlement_key, value, source, effective_at, expires_at, updated_at
        ) VALUES
          (${clerkUserId}, ${ACCOUNT_TIER_KEY}, ${JSON.stringify(selection.tier)}::jsonb, ${source}, now(), null, now()),
          (${clerkUserId}, ${BATCH_LIMIT_KEY}, ${JSON.stringify(entitlements.audioBatchFileLimit)}::jsonb, ${source}, now(), null, now()),
          (${clerkUserId}, ${ZIP_EXPORT_KEY}, ${JSON.stringify(entitlements.zipExport)}::jsonb, ${source}, now(), null, now()),
          (${clerkUserId}, ${DAILY_LIMIT_KEY}, ${JSON.stringify(entitlements.downloadDailyLimit)}::jsonb, ${source}, now(), null, now()),
          (${clerkUserId}, ${CONCURRENCY_KEY}, ${JSON.stringify(entitlements.downloadConcurrency)}::jsonb, ${source}, now(), null, now())
        ON CONFLICT (clerk_user_id, entitlement_key, source) DO UPDATE SET
          value = EXCLUDED.value,
          effective_at = EXCLUDED.effective_at,
          expires_at = null,
          updated_at = now()
      `
    } else if (action === "revoke" || processingError === "unknown_product") {
      await sql`
        UPDATE account_entitlements
        SET expires_at = LEAST(COALESCE(expires_at, now()), now()), updated_at = now()
        WHERE clerk_user_id = ${clerkUserId} AND source = ${source}
      `
    }
  }

  await sql`
    UPDATE billing_webhook_events
    SET processed_at = now(), processing_error = ${processingError}
    WHERE provider = ${PROVIDER} AND provider_event_id = ${payload.id}
  `
  return { duplicate: false, action, linked: Boolean(clerkUserId), processingError }
}
