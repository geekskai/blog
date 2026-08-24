import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createMigratedTestDatabase, type TestSql } from "@/lib/test/pglite"

const testState = vi.hoisted(() => ({
  userId: "user_test",
  sql: null as TestSql | null,
  captureStatus: "REFUNDED",
}))
const originalBillingEnvironment = {
  BILLING_SCHEMA_V2_ENABLED: process.env.BILLING_SCHEMA_V2_ENABLED,
  BILLING_RELEASE_STAGE: process.env.BILLING_RELEASE_STAGE,
  PAYPAL_REGULAR_MONTHLY_PLAN_ID: process.env.PAYPAL_REGULAR_MONTHLY_PLAN_ID,
}

vi.mock("server-only", () => ({}))
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: testState.userId })),
}))
vi.mock("@/lib/db/client", () => ({
  getSqlClient: () => {
    if (!testState.sql) throw new Error("Test database is not ready.")
    return testState.sql
  },
}))
vi.mock("@/lib/billing/paypal", () => ({
  getPayPalClient: () => ({
    verifyWebhook: vi.fn(async () => true),
    getCapture: vi.fn(async () => ({
      id: "CAPTURE-REFUND",
      status: testState.captureStatus,
      amount: { value: "14.00", currency_code: "USD" },
    })),
    captureOrder: vi.fn(async () => {
      throw new Error("A completed local order must not be captured twice.")
    }),
  }),
}))

import {
  completeAudioCreditOperation,
  getAudioCreditBalance,
  releaseAudioCreditOperation,
  reserveAudioCredits,
} from "@/lib/audio-credits/repository"
import { POST as captureOrder } from "@/app/api/billing/orders/[orderId]/capture/route"
import { POST as receivePayPalWebhook } from "@/app/api/webhooks/paypal/route"
import { completePaygOrder, getPaygOrderForCapture } from "./orders"
import { processPayPalWebhook } from "./repository"

const future = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

describe("PayPal and Audio Credit state", () => {
  let database: Awaited<ReturnType<typeof createMigratedTestDatabase>>["database"]

  beforeEach(async () => {
    const migrated = await createMigratedTestDatabase()
    database = migrated.database
    testState.sql = migrated.sql
    testState.userId = "user_test"
    testState.captureStatus = "REFUNDED"
    process.env.BILLING_SCHEMA_V2_ENABLED = "true"
    process.env.BILLING_RELEASE_STAGE = "public"
    process.env.PAYPAL_REGULAR_MONTHLY_PLAN_ID = "P-REGULAR"
  })

  afterEach(async () => {
    testState.sql = null
    await database.close()
    for (const [key, value] of Object.entries(originalBillingEnvironment)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })

  it("does not mark an order completed when its Credit grant cannot be persisted", async () => {
    await testState.sql!`
      INSERT INTO billing_orders (
        id, clerk_user_id, provider, product_key, provider_order_id,
        status, amount_minor, currency
      ) VALUES (
        '00000000-0000-4000-8000-000000000001', 'user_test', 'paypal',
        'audio_credits_payg_480', 'ORDER-ATOMIC', 'CREATED', 1400, 'USD'
      )
    `
    const baseSql = testState.sql!
    testState.sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
      if (strings.join("").includes("INSERT INTO audio_credit_grants")) {
        throw new Error("simulated grant persistence failure")
      }
      return baseSql(strings, ...values)
    }) as TestSql

    await expect(
      completePaygOrder({
        clerkUserId: "user_test",
        localOrderId: "00000000-0000-4000-8000-000000000001",
        providerOrderId: "ORDER-ATOMIC",
        captureId: "CAPTURE-ATOMIC",
        capturedAt: new Date(),
      })
    ).rejects.toThrow()

    const order = await getPaygOrderForCapture("user_test", "ORDER-ATOMIC")
    expect(order?.status).toBe("CREATED")
  })

  it("repairs a missing PAYG grant when a completed capture is retried", async () => {
    await testState.sql!`
      INSERT INTO billing_orders (
        id, clerk_user_id, provider, product_key, provider_order_id, provider_capture_id,
        status, amount_minor, currency, captured_at
      ) VALUES (
        '00000000-0000-4000-8000-000000000002', 'user_test', 'paypal',
        'audio_credits_payg_480', 'ORDER-DUPLICATE', 'CAPTURE-DUPLICATE', 'COMPLETED', 1400, 'USD', now()
      )
    `

    const response = await captureOrder(new Request("http://localhost"), {
      params: Promise.resolve({ orderId: "ORDER-DUPLICATE" }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.duplicate).toBe(true)
    expect(body.balance.payg).toBe(480)
  })

  it("blocks PAYG capture when checkout is not released to the user", async () => {
    process.env.BILLING_RELEASE_STAGE = "credits"
    await testState.sql!`
      INSERT INTO billing_orders (
        id, clerk_user_id, provider, product_key, provider_order_id,
        status, amount_minor, currency
      ) VALUES (
        '00000000-0000-4000-8000-000000000004', 'user_test', 'paypal',
        'audio_credits_payg_480', 'ORDER-BLOCKED', 'CREATED', 1400, 'USD'
      )
    `

    const response = await captureOrder(new Request("http://localhost"), {
      params: Promise.resolve({ orderId: "ORDER-BLOCKED" }),
    })

    expect(response.status).toBe(503)
  })

  it("does not capture an already captured PAYG order again after a partial refund", async () => {
    await testState.sql!`
      INSERT INTO billing_orders (
        id, clerk_user_id, provider, product_key, provider_order_id, provider_capture_id,
        status, amount_minor, currency, captured_at
      ) VALUES (
        '00000000-0000-4000-8000-000000000006', 'user_test', 'paypal',
        'audio_credits_payg_480', 'ORDER-PARTIAL', 'CAPTURE-PARTIAL',
        'PARTIALLY_REFUNDED', 1400, 'USD', now()
      )
    `
    await testState.sql!`
      INSERT INTO audio_credit_grants (
        clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
      ) VALUES ('user_test', 'paypal_order', 'CAPTURE-PARTIAL', 480, now(), ${future()})
    `

    const response = await captureOrder(new Request("http://localhost"), {
      params: Promise.resolve({ orderId: "ORDER-PARTIAL" }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.duplicate).toBe(true)
    expect(body.balance.payg).toBe(480)
  })

  it("asks PayPal to retry a refund that arrives before its capture is linked", async () => {
    const payload = {
      id: "WH-UNLINKED-REFUND",
      event_type: "PAYMENT.CAPTURE.REFUNDED",
      create_time: new Date().toISOString(),
      resource: {
        amount: { value: "14.00", currency_code: "USD" },
        supplementary_data: { related_ids: { capture_id: "CAPTURE-MISSING" } },
      },
    }
    const response = await receivePayPalWebhook(
      webhookRequest(payload)
    )

    expect(response.status).toBe(500)
  })

  it("revokes PAYG Credits after multiple partial refunds reach the full capture amount", async () => {
    await testState.sql!`
      INSERT INTO billing_orders (
        id, clerk_user_id, provider, product_key, provider_order_id, provider_capture_id,
        status, amount_minor, currency, captured_at
      ) VALUES (
        '00000000-0000-4000-8000-000000000003', 'user_test', 'paypal',
        'audio_credits_payg_480', 'ORDER-REFUND', 'CAPTURE-REFUND', 'COMPLETED', 1400, 'USD', now()
      )
    `
    await testState.sql!`
      INSERT INTO audio_credit_grants (
        clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
      ) VALUES ('user_test', 'paypal_order', 'CAPTURE-REFUND', 480, now(), ${future()})
    `

    const payload = {
      id: "WH-SECOND-PARTIAL-REFUND",
      event_type: "PAYMENT.CAPTURE.REFUNDED",
      create_time: new Date().toISOString(),
      resource: {
        amount: { value: "7.00", currency_code: "USD" },
        supplementary_data: { related_ids: { capture_id: "CAPTURE-REFUND" } },
      },
    }
    const response = await receivePayPalWebhook(webhookRequest(payload))
    const balance = await getAudioCreditBalance("user_test")

    expect(response.status).toBe(200)
    expect(balance.payg).toBe(0)
  })

  it("revokes every unexpired grant when PayPal suspends its subscription", async () => {
    await testState.sql!`
      INSERT INTO billing_subscriptions (
        clerk_user_id, provider, provider_subscription_id, status, product_id,
        package_tier, billing_interval, provider_event_at
      ) VALUES (
        'user_test', 'paypal', 'I-SUSPENDED', 'ACTIVE', 'P-REGULAR',
        'regular', 'monthly', now() - interval '1 minute'
      )
    `
    await testState.sql!`
      INSERT INTO billing_payments (
        clerk_user_id, provider, provider_payment_id, provider_subscription_id,
        status, provider_event_at
      ) VALUES (
        'user_test', 'paypal', 'SALE-SUSPENDED', 'I-SUSPENDED',
        'PAYMENT.SALE.COMPLETED', now() - interval '1 minute'
      )
    `
    await testState.sql!`
      INSERT INTO audio_credit_grants (
        clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
      ) VALUES (
        'user_test', 'paypal_subscription', 'SALE-SUSPENDED', 2800,
        now() - interval '1 day', ${future()}
      )
    `
    const payload = {
      id: "WH-SUSPENDED",
      event_type: "BILLING.SUBSCRIPTION.SUSPENDED",
      create_time: new Date().toISOString(),
      resource: { id: "I-SUSPENDED", status: "SUSPENDED", plan_id: "P-REGULAR" },
    }

    await processPayPalWebhook(payload, JSON.stringify(payload))
    const balance = await getAudioCreditBalance("user_test")

    expect(balance.subscription).toBe(0)
  })

  it("never over-reserves Credits across overlapping requests", async () => {
    const results = await Promise.all([
      reserveAudioCredits({
        clerkUserId: "user_test",
        operationId: "10000000-0000-4000-8000-000000000001",
        totalDurationSeconds: 20 * 60,
        fileCount: 1,
      }),
      reserveAudioCredits({
        clerkUserId: "user_test",
        operationId: "10000000-0000-4000-8000-000000000002",
        totalDurationSeconds: 20 * 60,
        fileCount: 1,
      }),
    ])

    expect(results.map((result) => result.outcome).sort()).toEqual([
      "insufficient_credits",
      "reserved",
    ])
  })

  it("settles a completed operation idempotently", async () => {
    const operationId = "10000000-0000-4000-8000-000000000003"
    await reserveAudioCredits({
      clerkUserId: "user_test",
      operationId,
      totalDurationSeconds: 120,
      fileCount: 1,
    })

    const first = await completeAudioCreditOperation({
      clerkUserId: "user_test",
      operationId,
      completedDurationSeconds: 120,
      completedFileCount: 1,
    })
    const second = await completeAudioCreditOperation({
      clerkUserId: "user_test",
      operationId,
      completedDurationSeconds: 120,
      completedFileCount: 1,
    })

    expect(first?.consumedCredits).toBe(2)
    expect(second?.consumedCredits).toBe(2)
    expect((await getAudioCreditBalance("user_test")).free).toBe(28)
  })

  it("releases a cancelled operation idempotently", async () => {
    const operationId = "10000000-0000-4000-8000-000000000005"
    await reserveAudioCredits({
      clerkUserId: "user_test",
      operationId,
      totalDurationSeconds: 120,
      fileCount: 1,
    })

    const first = await releaseAudioCreditOperation("user_test", operationId)
    const second = await releaseAudioCreditOperation("user_test", operationId)

    expect(first?.status).toBe("released")
    expect(second?.status).toBe("released")
    expect((await getAudioCreditBalance("user_test")).free).toBe(30)
  })

  it("releases an active operation when its PAYG grant is fully refunded", async () => {
    await testState.sql!`
      INSERT INTO billing_orders (
        id, clerk_user_id, provider, product_key, provider_order_id, provider_capture_id,
        status, amount_minor, currency, captured_at
      ) VALUES (
        '00000000-0000-4000-8000-000000000005', 'user_test', 'paypal',
        'audio_credits_payg_480', 'ORDER-ACTIVE-REFUND', 'CAPTURE-REFUND',
        'COMPLETED', 1400, 'USD', now()
      )
    `
    await testState.sql!`
      INSERT INTO audio_credit_grants (
        clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
      ) VALUES ('user_test', 'paypal_order', 'CAPTURE-REFUND', 480, now(), ${future()})
    `
    const operationId = "10000000-0000-4000-8000-000000000004"
    await reserveAudioCredits({
      clerkUserId: "user_test",
      operationId,
      totalDurationSeconds: 31 * 60,
      fileCount: 1,
    })
    const payload = {
      id: "WH-ACTIVE-REFUND",
      event_type: "PAYMENT.CAPTURE.REFUNDED",
      create_time: new Date().toISOString(),
      resource: {
        amount: { value: "14.00", currency_code: "USD" },
        supplementary_data: { related_ids: { capture_id: "CAPTURE-REFUND" } },
      },
    }

    expect((await receivePayPalWebhook(webhookRequest(payload))).status).toBe(200)
    const operations = await testState.sql!`
      SELECT status FROM audio_credit_operations WHERE id = ${operationId}::uuid
    `
    expect(operations[0]?.status).toBe("released")
    expect((await getAudioCreditBalance("user_test")).payg).toBe(0)
  })
})

function webhookRequest(payload: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/webhooks/paypal/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "paypal-auth-algo": "SHA256withRSA",
      "paypal-cert-url": "https://api.paypal.com/cert.pem",
      "paypal-transmission-id": "transmission-id",
      "paypal-transmission-sig": "signature",
      "paypal-transmission-time": new Date().toISOString(),
    },
    body: JSON.stringify(payload),
  })
}
