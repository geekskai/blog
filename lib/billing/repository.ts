import "server-only"
import { createHash, randomUUID } from "node:crypto"
import {
  getAudioCreditBalance,
  grantSubscriptionCredits,
  revokePaidCreditGrant,
  revokeSubscriptionCreditGrants,
} from "@/lib/audio-credits/repository"
import { getSqlClient } from "@/lib/db/client"
import { recordGrowthEventForUserSafely } from "@/lib/growth/events"
import { completePaygOrderFromWebhook, markPaygCaptureRefunded } from "./orders"
import {
  getAccessAction,
  getBillingPlanSelection,
  type BillingInterval,
  type BillingPlanEnvironment,
  type CheckoutSelection,
  type CheckoutTier,
  type PackageTier,
} from "./domain"
import {
  normalizePayPalEvent,
  normalizePayPalPaymentResource,
  type PayPalWebhookEvent,
} from "./paypal-event"
import { billingSchemaV2Enabled } from "./policy"
import type { AccountPlanStatus, ManagedPayPalSubscription } from "./types"

const PROVIDER = "paypal"
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
  PAYPAL_REGULAR_MONTHLY_PLAN_ID: process.env.PAYPAL_REGULAR_MONTHLY_PLAN_ID,
})

const isCheckoutTier = (value: unknown): value is CheckoutTier => value === "regular"

const isBillingInterval = (value: unknown): value is BillingInterval => value === "monthly"

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
  const [rows, credits] = await Promise.all([
    sql`
      SELECT status, current_period_end, billing_interval
      FROM billing_subscriptions
      WHERE clerk_user_id = ${clerkUserId} AND provider = ${PROVIDER}
      ORDER BY updated_at DESC
      LIMIT 1
    ` as Promise<Row[]>,
    getAudioCreditBalance(clerkUserId),
  ])
  const row = rows[0] ?? {}
  const packageTier: PackageTier = credits.paidAccess ? "regular" : "free"
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
    batchFileLimit: credits.batchFileLimit,
    zipExport: credits.zipExport,
    credits,
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

export async function hasManagedPayPalSubscription(clerkUserId: string) {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT 1
    FROM billing_subscriptions
    WHERE clerk_user_id = ${clerkUserId}
      AND provider = ${PROVIDER}
      AND status IN ('APPROVAL_PENDING', 'APPROVED', 'ACTIVE', 'SUSPENDED')
    LIMIT 1
  `) as Row[]
  return Boolean(rows[0])
}

export async function recordPayPalCancellation(
  clerkUserId: string,
  subscriptionId: string,
  currentPeriodEnd: Date | null
) {
  const sql = getSqlClient()
  await sql`
    UPDATE billing_subscriptions
    SET status = 'CANCELLED',
      current_period_end = COALESCE(${currentPeriodEnd}, current_period_end),
      canceled_at = now(),
      updated_at = now()
    WHERE clerk_user_id = ${clerkUserId}
      AND provider = ${PROVIDER}
      AND provider_subscription_id = ${subscriptionId}
  `
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

export async function listPayPalPaymentIdsForReconciliation() {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT provider_payment_id
    FROM billing_payments
    WHERE provider = ${PROVIDER}
      AND reconciliation_status = 'PENDING'
    ORDER BY provider_event_at ASC NULLS FIRST
    LIMIT 500
  `) as Row[]
  return rows.flatMap((row) => {
    const id = readString(row.provider_payment_id)
    return id ? [id] : []
  })
}

export async function countPayPalPaymentsNeedingReview() {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT COUNT(*)::integer AS count
    FROM billing_payments
    WHERE provider = ${PROVIDER} AND reconciliation_status = 'NEEDS_REVIEW'
  `) as Row[]
  return Number(rows[0]?.count ?? 0)
}

export async function reconcilePayPalSale(
  providerPaymentId: string,
  resource: Record<string, unknown>,
  now = new Date()
) {
  const sql = getSqlClient()
  const payment = normalizePayPalPaymentResource(resource)
  const state =
    readString(resource.state)?.toUpperCase() ?? readString(resource.status)?.toUpperCase()
  const eventStatus = state ? `PAYMENT.SALE.${state}` : null
  const reconciled =
    Boolean(payment.currency && payment.amountMinor !== null) &&
    Boolean(state && ["COMPLETED", "REFUNDED", "REVERSED", "DENIED"].includes(state))
  const refundedMinor = state === "REFUNDED" || state === "REVERSED" ? payment.amountMinor : null
  const rows = (await sql`
    UPDATE billing_payments
    SET status = COALESCE(${eventStatus}, status),
      amount_minor = COALESCE(${payment.amountMinor}, amount_minor),
      currency = COALESCE(${payment.currency}, currency),
      fee_minor = COALESCE(${payment.feeMinor}, fee_minor),
      net_minor = COALESCE(${payment.netMinor}, net_minor),
      refunded_minor = COALESCE(${refundedMinor}, refunded_minor),
      status_reason = COALESCE(${payment.statusReason}, status_reason),
      reconciliation_status = ${reconciled ? "RECONCILED" : "NEEDS_REVIEW"},
      reconciled_at = ${reconciled ? now : null},
      updated_at = ${now}
    WHERE provider = ${PROVIDER} AND provider_payment_id = ${providerPaymentId}
    RETURNING id
  `) as Row[]
  return { linked: rows.length > 0, reconciled }
}

export async function processPayPalWebhook(
  payload: PayPalWebhookEvent,
  rawPayload: string,
  options: { refundType?: "full" | "partial"; subscriptionPeriodEnd?: Date | null } = {}
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

  if (event.eventType === "PAYMENT.CAPTURE.COMPLETED" && event.orderId && event.captureId) {
    const result = await completePaygOrderFromWebhook({
      providerOrderId: event.orderId,
      captureId: event.captureId,
      amount: event.amount,
      currency: event.currency,
      occurredAt: event.occurredAt,
    })
    const retryable = result.processingError === "unlinked_order"
    await sql`
      UPDATE billing_webhook_events SET processed_at = ${retryable ? null : new Date()},
        processing_error = ${result.processingError}
      WHERE provider = ${PROVIDER} AND provider_event_id = ${event.id}
    `
    if (result.linked) {
      const rows = (await sql`
        SELECT clerk_user_id FROM billing_orders
        WHERE provider = ${PROVIDER} AND provider_capture_id = ${event.captureId}
        LIMIT 1
      `) as Row[]
      const paygUserId = readString(rows[0]?.clerk_user_id)
      if (paygUserId) {
        await recordGrowthEventForUserSafely(paygUserId, "billing_payment_completed_payg")
      }
    }
    return { duplicate: false, action: "grant" as const, ...result }
  }

  if (
    (event.eventType === "PAYMENT.CAPTURE.REFUNDED" ||
      event.eventType === "PAYMENT.CAPTURE.REVERSED") &&
    event.captureId
  ) {
    const fullRefund =
      event.eventType === "PAYMENT.CAPTURE.REVERSED" || options.refundType === "full"
    const clerkUserId = await markPaygCaptureRefunded(
      event.captureId,
      event.occurredAt,
      fullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED"
    )
    if (clerkUserId && fullRefund) {
      await revokePaidCreditGrant(event.captureId, event.occurredAt)
    }
    const processingError = !clerkUserId
      ? "unlinked_capture"
      : fullRefund
        ? null
        : "partial_refund_review"
    const retryable = !clerkUserId
    if (processingError === "partial_refund_review") {
      console.warn("PayPal PAYG partial refund requires review", {
        providerEventId: event.id,
        captureId: event.captureId,
      })
    }
    await sql`
      UPDATE billing_webhook_events SET processed_at = ${retryable ? null : new Date()},
        processing_error = ${processingError}
      WHERE provider = ${PROVIDER} AND provider_event_id = ${event.id}
    `
    return {
      duplicate: false,
      action: fullRefund ? ("revoke" as const) : ("review" as const),
      linked: Boolean(clerkUserId),
      processingError,
    }
  }

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
        : action === "grant" &&
            (!options.subscriptionPeriodEnd || options.subscriptionPeriodEnd <= event.occurredAt)
          ? "invalid_billing_period"
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
    const refundEvent =
      event.eventType === "PAYMENT.SALE.REFUNDED" ||
      event.eventType === "PAYMENT.SALE.REVERSED" ||
      event.eventType === "CUSTOMER.DISPUTE.CREATED"
    const refundedMinor = refundEvent
      ? options.refundType === "full"
        ? event.amountMinor
        : (event.amountMinor ?? 0)
      : 0
    await sql`
      INSERT INTO billing_payments (
        clerk_user_id, provider, provider_payment_id, provider_subscription_id,
        status, status_reason, amount_minor, currency, fee_minor, net_minor,
        refunded_minor, reconciliation_status, provider_event_at, updated_at
      ) VALUES (
        ${clerkUserId}, ${PROVIDER}, ${event.saleId}, ${event.subscriptionId},
        ${event.eventType}, ${event.statusReason}, ${refundEvent ? null : event.amountMinor},
        ${event.currency}, ${refundEvent ? null : event.feeMinor},
        ${refundEvent ? null : event.netMinor}, ${refundedMinor},
        ${refundEvent ? "NEEDS_REVIEW" : "PENDING"}, ${event.occurredAt}, now()
      )
      ON CONFLICT (provider, provider_payment_id) DO UPDATE SET
        provider_subscription_id = COALESCE(EXCLUDED.provider_subscription_id, billing_payments.provider_subscription_id),
        status = CASE
          WHEN billing_payments.provider_event_at IS NULL
            OR billing_payments.provider_event_at <= EXCLUDED.provider_event_at
          THEN EXCLUDED.status
          ELSE billing_payments.status
        END,
        status_reason = COALESCE(EXCLUDED.status_reason, billing_payments.status_reason),
        amount_minor = COALESCE(EXCLUDED.amount_minor, billing_payments.amount_minor),
        currency = COALESCE(EXCLUDED.currency, billing_payments.currency),
        fee_minor = COALESCE(EXCLUDED.fee_minor, billing_payments.fee_minor),
        net_minor = COALESCE(EXCLUDED.net_minor, billing_payments.net_minor),
        refunded_minor = GREATEST(billing_payments.refunded_minor, EXCLUDED.refunded_minor),
        reconciliation_status = CASE
          WHEN EXCLUDED.reconciliation_status = 'NEEDS_REVIEW' THEN 'NEEDS_REVIEW'
          ELSE billing_payments.reconciliation_status
        END,
        reconciled_at = CASE
          WHEN EXCLUDED.reconciliation_status = 'NEEDS_REVIEW' THEN NULL
          ELSE billing_payments.reconciled_at
        END,
        provider_event_at = GREATEST(billing_payments.provider_event_at, EXCLUDED.provider_event_at),
        updated_at = now()
    `
  }

  if (clerkUserId && event.subscriptionId && subscriptionUpdated) {
    if (
      action === "grant" &&
      planSelection &&
      !processingError &&
      event.saleId &&
      options.subscriptionPeriodEnd &&
      options.subscriptionPeriodEnd > event.occurredAt
    ) {
      await grantSubscriptionCredits({
        clerkUserId,
        paymentId: event.saleId,
        startsAt: event.occurredAt,
        expiresAt: options.subscriptionPeriodEnd,
      })
    } else if (action === "revoke" || processingError === "unknown_plan") {
      if (event.saleId) await revokePaidCreditGrant(event.saleId, event.occurredAt)
      else await revokeSubscriptionCreditGrants(event.subscriptionId, event.occurredAt)
    }
  }

  if (processingError) {
    console.error("PayPal billing event rejected", {
      providerEventId: event.id,
      eventType: event.eventType,
      processingError,
    })
  }
  const retryable =
    processingError === "unlinked_account" || processingError === "invalid_billing_period"
  await sql`
    UPDATE billing_webhook_events
    SET processed_at = ${retryable ? null : new Date()}, processing_error = ${processingError}
    WHERE provider = ${PROVIDER} AND provider_event_id = ${event.id}
  `
  if (clerkUserId && !processingError) {
    if (event.eventType === "PAYMENT.SALE.COMPLETED" && action === "grant") {
      await recordGrowthEventForUserSafely(
        clerkUserId,
        "billing_payment_completed_subscription",
        event.occurredAt
      )
    } else if (event.eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      await recordGrowthEventForUserSafely(
        clerkUserId,
        "billing_subscription_cancelled",
        event.occurredAt
      )
    }
  }
  return { duplicate: false, action, linked: Boolean(clerkUserId), processingError }
}

export async function recordWorkspaceActivation(
  clerkUserId: string,
  kind: "opened" | "single" | "batch",
  now = new Date()
) {
  const sql = getSqlClient()
  await sql`
    INSERT INTO workspace_activations (clerk_user_id, updated_at)
    VALUES (${clerkUserId}, ${now})
    ON CONFLICT (clerk_user_id) DO NOTHING
  `
  if (kind === "single") {
    await sql`
      UPDATE workspace_activations
      SET first_single_completed_at = COALESCE(first_single_completed_at, ${now}), updated_at = ${now}
      WHERE clerk_user_id = ${clerkUserId}
    `
  } else if (kind === "batch") {
    await sql`
      UPDATE workspace_activations
      SET first_batch_completed_at = COALESCE(first_batch_completed_at, ${now}), updated_at = ${now}
      WHERE clerk_user_id = ${clerkUserId}
    `
  }

  const milestoneRows =
    kind === "opened"
      ? ((await sql`
          UPDATE workspace_activations
          SET first_paid_opened_at = ${now}, updated_at = ${now}
          WHERE clerk_user_id = ${clerkUserId}
            AND first_paid_opened_at IS NULL
            AND EXISTS (
              SELECT 1 FROM audio_credit_grants
              WHERE clerk_user_id = ${clerkUserId}
                AND source IN ('paypal_order', 'paypal_subscription')
                AND starts_at <= ${now}
                AND expires_at > ${now}
                AND revoked_at IS NULL
                AND granted_credits - reserved_credits - consumed_credits > 0
            )
          RETURNING clerk_user_id
        `) as Row[])
      : ((await sql`
          UPDATE workspace_activations
          SET first_paid_completed_at = ${now}, updated_at = ${now}
          WHERE clerk_user_id = ${clerkUserId}
            AND first_paid_completed_at IS NULL
            AND EXISTS (
              SELECT 1 FROM audio_credit_grants
              WHERE clerk_user_id = ${clerkUserId}
                AND source IN ('paypal_order', 'paypal_subscription')
                AND starts_at <= ${now}
                AND expires_at > ${now}
                AND revoked_at IS NULL
                AND granted_credits - reserved_credits - consumed_credits > 0
            )
          RETURNING clerk_user_id
        `) as Row[])
  if (milestoneRows.length > 0) {
    await recordGrowthEventForUserSafely(
      clerkUserId,
      kind === "opened" ? "paid_workspace_opened" : "first_paid_processing_completed",
      now
    )
  }
}
