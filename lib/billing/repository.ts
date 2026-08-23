import "server-only"
import { createHash, randomUUID } from "node:crypto"
import { getSqlClient } from "@/lib/db/client"
import {
  getAccessAction,
  getBillingPlanSelection,
  getEntitlementSet,
  isPackageTier,
  type BillingInterval,
  type BillingPlanEnvironment,
  type CheckoutSelection,
  type CheckoutTier,
  type PackageTier,
} from "./domain"
import { normalizePayPalEvent, type PayPalWebhookEvent } from "./paypal-event"
import { billingSchemaV2Enabled } from "./policy"
import type { AccountPlanStatus, ManagedPayPalSubscription } from "./types"

const PROVIDER = "paypal"
const ACCOUNT_TIER_KEY = "account.package_tier"
const BATCH_LIMIT_KEY = "workspace.batch_file_limit"
const ZIP_EXPORT_KEY = "workspace.zip_export"

type Row = Record<string, unknown>

const readString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null

const readDate = (value: unknown) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const raw = readString(value)
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

const readObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

const planEnvironment = (): BillingPlanEnvironment => ({
  PAYPAL_BASIC_MONTHLY_PLAN_ID: process.env.PAYPAL_BASIC_MONTHLY_PLAN_ID,
  PAYPAL_BASIC_ANNUAL_PLAN_ID: process.env.PAYPAL_BASIC_ANNUAL_PLAN_ID,
  PAYPAL_PRO_MONTHLY_PLAN_ID: process.env.PAYPAL_PRO_MONTHLY_PLAN_ID,
  PAYPAL_PRO_ANNUAL_PLAN_ID: process.env.PAYPAL_PRO_ANNUAL_PLAN_ID,
})

const isCheckoutTier = (value: unknown): value is CheckoutTier =>
  value === "basic" || value === "pro"

const isBillingInterval = (value: unknown): value is BillingInterval =>
  value === "monthly" || value === "annual"

const statusForEvent = (eventType: string, resourceStatus: string | null) => {
  if (resourceStatus) return resourceStatus.toUpperCase()
  const statuses: Record<string, string> = {
    "BILLING.SUBSCRIPTION.ACTIVATED": "ACTIVE",
    "BILLING.SUBSCRIPTION.PAYMENT.FAILED": "ACTIVE",
    "BILLING.SUBSCRIPTION.SUSPENDED": "SUSPENDED",
    "BILLING.SUBSCRIPTION.CANCELLED": "CANCELLED",
    "BILLING.SUBSCRIPTION.EXPIRED": "EXPIRED",
  }
  return statuses[eventType] ?? "UNKNOWN"
}

export async function getAccountPlanStatus(clerkUserId: string): Promise<AccountPlanStatus> {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT
      subscription.status,
      subscription.current_period_end,
      subscription.billing_interval,
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
      ), 'free') AS package_tier
    FROM (SELECT 1) seed
    LEFT JOIN LATERAL (
      SELECT status, current_period_end, billing_interval
      FROM billing_subscriptions
      WHERE clerk_user_id = ${clerkUserId} AND provider = ${PROVIDER}
      ORDER BY updated_at DESC
      LIMIT 1
    ) subscription ON true
  `) as Row[]
  const row = rows[0] ?? {}
  const packageTier: PackageTier = isPackageTier(row.package_tier) ? row.package_tier : "free"
  const entitlements = getEntitlementSet(packageTier)
  const billingInterval = readString(row.billing_interval)
  const subscriptionStatus = readString(row.status)
  const currentPeriodEnd = readDate(row.current_period_end)
  return {
    packageTier,
    billingInterval: isBillingInterval(billingInterval) ? billingInterval : null,
    subscriptionStatus,
    currentPeriodEnd: currentPeriodEnd?.toISOString() ?? null,
    cancellationScheduled:
      subscriptionStatus === "CANCELLED" &&
      Boolean(currentPeriodEnd && currentPeriodEnd > new Date()),
    batchFileLimit: entitlements.audioBatchFileLimit,
    zipExport: entitlements.zipExport,
  }
}

export async function createPayPalCheckoutCorrelation(
  clerkUserId: string,
  selection: CheckoutSelection
) {
  const sql = getSqlClient()
  const id = randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
  await sql`
    INSERT INTO billing_checkout_correlations (
      id, clerk_user_id, provider, package_tier, billing_interval, expires_at
    ) VALUES (
      ${id}, ${clerkUserId}, ${PROVIDER}, ${selection.tier}, ${selection.interval}, ${expiresAt}
    )
  `
  await sql`
    DELETE FROM billing_checkout_correlations
    WHERE provider = ${PROVIDER} AND created_at < now() - interval '30 days'
  `
  return { id, expiresAt }
}

export async function confirmPayPalSubscription(
  clerkUserId: string,
  resource: Record<string, unknown>
) {
  if (!billingSchemaV2Enabled()) throw new Error("Billing schema v2 is not enabled.")
  const sql = getSqlClient()
  const subscriptionId = readString(resource.id)
  const planId = readString(resource.plan_id)
  const correlationId = readString(resource.custom_id)
  const status = readString(resource.status)?.toUpperCase()
  const subscriber = readObject(resource.subscriber)
  const billingInfo = readObject(resource.billing_info)
  const payerId = readString(subscriber?.payer_id)
  const currentPeriodEnd = readDate(billingInfo?.next_billing_time)
  if (!subscriptionId || !planId || !correlationId || !status) {
    throw new Error("PayPal subscription confirmation is incomplete.")
  }
  if (!["APPROVAL_PENDING", "APPROVED", "ACTIVE"].includes(status)) {
    throw new Error("PayPal subscription is not approvable.")
  }

  const correlationRows = (await sql`
    SELECT package_tier, billing_interval
    FROM billing_checkout_correlations
    WHERE id::text = ${correlationId}
      AND clerk_user_id = ${clerkUserId}
      AND provider = ${PROVIDER}
      AND consumed_at IS NULL
      AND expires_at > now()
    LIMIT 1
  `) as Row[]
  const correlation = correlationRows[0]
  const planSelection = getBillingPlanSelection(planId, planEnvironment())
  if (
    !correlation ||
    !planSelection ||
    correlation.package_tier !== planSelection.tier ||
    correlation.billing_interval !== planSelection.interval
  ) {
    throw new Error("PayPal subscription does not match this checkout.")
  }

  if (payerId) {
    await sql`
      INSERT INTO billing_customers (clerk_user_id, provider, provider_customer_id, updated_at)
      VALUES (${clerkUserId}, ${PROVIDER}, ${payerId}, now())
      ON CONFLICT (clerk_user_id, provider) DO UPDATE SET
        provider_customer_id = EXCLUDED.provider_customer_id,
        updated_at = now()
    `
  }
  await sql`
    INSERT INTO billing_subscriptions (
      clerk_user_id, provider, provider_subscription_id, status, product_id,
      package_tier, billing_interval, current_period_end, updated_at
    ) VALUES (
      ${clerkUserId}, ${PROVIDER}, ${subscriptionId}, ${status}, ${planId},
      ${planSelection.tier}, ${planSelection.interval}, ${currentPeriodEnd}, now()
    )
    ON CONFLICT (provider, provider_subscription_id) DO UPDATE SET
      clerk_user_id = EXCLUDED.clerk_user_id,
      status = EXCLUDED.status,
      product_id = EXCLUDED.product_id,
      package_tier = EXCLUDED.package_tier,
      billing_interval = EXCLUDED.billing_interval,
      current_period_end = COALESCE(EXCLUDED.current_period_end, billing_subscriptions.current_period_end),
      updated_at = now()
  `
  await sql`
    UPDATE billing_checkout_correlations
    SET consumed_at = now(), updated_at = now()
    WHERE id::text = ${correlationId} AND clerk_user_id = ${clerkUserId}
  `
  return { subscriptionId, status }
}

export async function getManagedPayPalSubscription(
  clerkUserId: string
): Promise<ManagedPayPalSubscription | null> {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT provider_subscription_id, status, current_period_end, package_tier, billing_interval
    FROM billing_subscriptions
    WHERE clerk_user_id = ${clerkUserId}
      AND provider = ${PROVIDER}
      AND status IN ('APPROVAL_PENDING', 'APPROVED', 'ACTIVE', 'SUSPENDED')
    ORDER BY updated_at DESC
    LIMIT 1
  `) as Row[]
  const row = rows[0]
  const subscriptionId = readString(row?.provider_subscription_id)
  const status = readString(row?.status)
  const packageTier = row?.package_tier
  const billingInterval = row?.billing_interval
  if (
    !subscriptionId ||
    !status ||
    !isCheckoutTier(packageTier) ||
    !isBillingInterval(billingInterval)
  ) {
    return null
  }
  return {
    subscriptionId,
    status,
    currentPeriodEnd: readDate(row.current_period_end)?.toISOString() ?? null,
    packageTier,
    billingInterval,
  }
}

export async function recordPayPalCancellation(
  clerkUserId: string,
  subscriptionId: string,
  currentPeriodEnd: Date | null
) {
  const sql = getSqlClient()
  const subscriptionRows = (await sql`
    UPDATE billing_subscriptions
    SET status = 'CANCELLED',
      current_period_end = COALESCE(${currentPeriodEnd}, current_period_end),
      canceled_at = now(),
      updated_at = now()
    WHERE clerk_user_id = ${clerkUserId}
      AND provider = ${PROVIDER}
      AND provider_subscription_id = ${subscriptionId}
    RETURNING current_period_end
  `) as Row[]
  const paidThrough = readDate(subscriptionRows[0]?.current_period_end)
  if (paidThrough) {
    await sql`
      UPDATE account_entitlements
      SET expires_at = ${paidThrough}, updated_at = now()
      WHERE clerk_user_id = ${clerkUserId} AND source = ${`${PROVIDER}:${subscriptionId}`}
    `
  }
}

export async function listTrackedPayPalSubscriptionIds() {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT provider_subscription_id
    FROM billing_subscriptions
    WHERE provider = ${PROVIDER}
      AND status IN ('APPROVAL_PENDING', 'APPROVED', 'ACTIVE', 'SUSPENDED')
    ORDER BY updated_at ASC
    LIMIT 500
  `) as Row[]
  return rows.flatMap((row) => {
    const id = readString(row.provider_subscription_id)
    return id ? [id] : []
  })
}

export async function deleteExpiredPayPalCheckoutCorrelations() {
  const sql = getSqlClient()
  const rows = (await sql`
    DELETE FROM billing_checkout_correlations
    WHERE provider = ${PROVIDER} AND created_at < now() - interval '30 days'
    RETURNING id
  `) as Row[]
  return rows.length
}

export async function processPayPalWebhook(
  payload: PayPalWebhookEvent,
  rawPayload: string,
  options: { refundType?: "full" | "partial" } = {}
) {
  if (!billingSchemaV2Enabled()) throw new Error("Billing schema v2 is not enabled.")
  const sql = getSqlClient()
  const event = normalizePayPalEvent(payload)
  const payloadHash = createHash("sha256").update(rawPayload).digest("hex")
  const eventRows = (await sql`
    INSERT INTO billing_webhook_events (
      provider, provider_event_id, event_type, payload_hash
    ) VALUES (${PROVIDER}, ${event.id}, ${event.eventType}, ${payloadHash})
    ON CONFLICT (provider, provider_event_id) DO UPDATE SET
      payload_hash = billing_webhook_events.payload_hash
    RETURNING processed_at
  `) as Row[]
  if (eventRows[0]?.processed_at) return { duplicate: true }

  let clerkUserId: string | null = null
  let linkedSelection: CheckoutSelection | null = null
  if (event.correlationId) {
    const rows = (await sql`
      SELECT clerk_user_id, package_tier, billing_interval
      FROM billing_checkout_correlations
      WHERE id::text = ${event.correlationId} AND provider = ${PROVIDER}
      LIMIT 1
    `) as Row[]
    clerkUserId = readString(rows[0]?.clerk_user_id)
    if (isCheckoutTier(rows[0]?.package_tier) && isBillingInterval(rows[0]?.billing_interval)) {
      linkedSelection = {
        tier: rows[0].package_tier as CheckoutTier,
        interval: rows[0].billing_interval as BillingInterval,
      }
    }
  }
  if (!clerkUserId && event.subscriptionId) {
    const rows = (await sql`
      SELECT clerk_user_id, package_tier, billing_interval
      FROM billing_subscriptions
      WHERE provider = ${PROVIDER} AND provider_subscription_id = ${event.subscriptionId}
      LIMIT 1
    `) as Row[]
    clerkUserId = readString(rows[0]?.clerk_user_id)
    if (isCheckoutTier(rows[0]?.package_tier) && isBillingInterval(rows[0]?.billing_interval)) {
      linkedSelection = {
        tier: rows[0].package_tier as CheckoutTier,
        interval: rows[0].billing_interval as BillingInterval,
      }
    }
  }
  if (!clerkUserId && event.payerId) {
    const rows = (await sql`
      SELECT clerk_user_id FROM billing_customers
      WHERE provider = ${PROVIDER} AND provider_customer_id = ${event.payerId}
      LIMIT 1
    `) as Row[]
    clerkUserId = readString(rows[0]?.clerk_user_id)
  }
  if (!clerkUserId && event.saleId) {
    const rows = (await sql`
      SELECT clerk_user_id, provider_subscription_id
      FROM billing_payments
      WHERE provider = ${PROVIDER} AND provider_payment_id = ${event.saleId}
      LIMIT 1
    `) as Row[]
    clerkUserId = readString(rows[0]?.clerk_user_id)
    event.subscriptionId ??= readString(rows[0]?.provider_subscription_id)
  }

  const planSelection = event.planId
    ? getBillingPlanSelection(event.planId, planEnvironment())
    : linkedSelection
  const action = getAccessAction(event.eventType, {
    ...options,
    subscriptionStatus: event.status,
  })
  const processingError = !clerkUserId
    ? "unlinked_account"
    : event.planId && !planSelection
      ? "unknown_plan"
      : action === "grant" && !planSelection
        ? "unknown_plan"
        : null

  if (clerkUserId && event.payerId) {
    await sql`
      INSERT INTO billing_customers (clerk_user_id, provider, provider_customer_id, updated_at)
      VALUES (${clerkUserId}, ${PROVIDER}, ${event.payerId}, now())
      ON CONFLICT (clerk_user_id, provider) DO UPDATE SET
        provider_customer_id = EXCLUDED.provider_customer_id,
        updated_at = now()
    `
  }

  let subscriptionUpdated = true
  if (clerkUserId && event.subscriptionId && event.eventType.startsWith("BILLING.SUBSCRIPTION.")) {
    const subscriptionRows = (await sql`
      INSERT INTO billing_subscriptions (
        clerk_user_id, provider, provider_subscription_id, status, product_id,
        package_tier, billing_interval, provider_event_at, current_period_end, canceled_at, updated_at
      ) VALUES (
        ${clerkUserId}, ${PROVIDER}, ${event.subscriptionId},
        ${statusForEvent(event.eventType, event.status)}, ${event.planId},
        ${planSelection?.tier ?? null}, ${planSelection?.interval ?? null},
        ${event.occurredAt}, ${event.currentPeriodEnd},
        ${event.eventType === "BILLING.SUBSCRIPTION.CANCELLED" ? event.occurredAt : null}, now()
      )
      ON CONFLICT (provider, provider_subscription_id) DO UPDATE SET
        clerk_user_id = EXCLUDED.clerk_user_id,
        status = EXCLUDED.status,
        product_id = COALESCE(EXCLUDED.product_id, billing_subscriptions.product_id),
        package_tier = COALESCE(EXCLUDED.package_tier, billing_subscriptions.package_tier),
        billing_interval = COALESCE(EXCLUDED.billing_interval, billing_subscriptions.billing_interval),
        provider_event_at = EXCLUDED.provider_event_at,
        current_period_end = COALESCE(EXCLUDED.current_period_end, billing_subscriptions.current_period_end),
        canceled_at = COALESCE(EXCLUDED.canceled_at, billing_subscriptions.canceled_at),
        updated_at = now()
      WHERE billing_subscriptions.provider_event_at IS NULL
         OR billing_subscriptions.provider_event_at <= EXCLUDED.provider_event_at
      RETURNING id
    `) as Row[]
    subscriptionUpdated = subscriptionRows.length > 0
  }

  if (clerkUserId && event.saleId) {
    await sql`
      INSERT INTO billing_payments (
        clerk_user_id, provider, provider_payment_id, provider_subscription_id,
        status, provider_event_at, updated_at
      ) VALUES (
        ${clerkUserId}, ${PROVIDER}, ${event.saleId}, ${event.subscriptionId},
        ${event.eventType}, ${event.occurredAt}, now()
      )
      ON CONFLICT (provider, provider_payment_id) DO UPDATE SET
        provider_subscription_id = COALESCE(EXCLUDED.provider_subscription_id, billing_payments.provider_subscription_id),
        status = EXCLUDED.status,
        provider_event_at = EXCLUDED.provider_event_at,
        updated_at = now()
    `
  }

  if (clerkUserId && event.subscriptionId && subscriptionUpdated) {
    const source = `${PROVIDER}:${event.subscriptionId}`
    if (action === "grant" && planSelection && !processingError) {
      const entitlements = getEntitlementSet(planSelection.tier)
      await sql`
        INSERT INTO account_entitlements (
          clerk_user_id, entitlement_key, value, source, effective_at, expires_at, updated_at
        ) VALUES
          (${clerkUserId}, ${ACCOUNT_TIER_KEY}, ${JSON.stringify(planSelection.tier)}::jsonb, ${source}, now(), null, now()),
          (${clerkUserId}, ${BATCH_LIMIT_KEY}, ${JSON.stringify(entitlements.audioBatchFileLimit)}::jsonb, ${source}, now(), null, now()),
          (${clerkUserId}, ${ZIP_EXPORT_KEY}, ${JSON.stringify(entitlements.zipExport)}::jsonb, ${source}, now(), null, now())
        ON CONFLICT (clerk_user_id, entitlement_key, source) DO UPDATE SET
          value = EXCLUDED.value,
          effective_at = EXCLUDED.effective_at,
          expires_at = null,
          updated_at = now()
      `
    } else if (event.eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      const periodRows = (await sql`
        SELECT current_period_end FROM billing_subscriptions
        WHERE provider = ${PROVIDER} AND provider_subscription_id = ${event.subscriptionId}
        LIMIT 1
      `) as Row[]
      const paidThrough = readDate(periodRows[0]?.current_period_end)
      if (paidThrough) {
        await sql`
          UPDATE account_entitlements
          SET expires_at = ${paidThrough}, updated_at = now()
          WHERE clerk_user_id = ${clerkUserId} AND source = ${source}
        `
      }
    } else if (action === "revoke" || processingError === "unknown_plan") {
      await sql`
        UPDATE account_entitlements
        SET expires_at = LEAST(COALESCE(expires_at, now()), now()), updated_at = now()
        WHERE clerk_user_id = ${clerkUserId} AND source = ${source}
      `
    }
  }

  if (processingError) {
    console.error("PayPal billing event rejected", {
      providerEventId: event.id,
      eventType: event.eventType,
      processingError,
    })
  }
  await sql`
    UPDATE billing_webhook_events
    SET processed_at = now(), processing_error = ${processingError}
    WHERE provider = ${PROVIDER} AND provider_event_id = ${event.id}
  `
  return { duplicate: false, action, linked: Boolean(clerkUserId), processingError }
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
