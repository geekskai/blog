import { describe, expect, it } from "vitest"
import { createPayPalClient, getPayPalConfig, isPayPalCheckoutConfigured } from "./paypal"

const config = {
  clientId: "sandbox-client",
  clientSecret: "sandbox-secret",
  webhookId: "sandbox-webhook",
  baseUrl: "https://api-m.sandbox.paypal.com",
} as const

const transmission = {
  authAlgo: "SHA256withRSA",
  certUrl: "https://api-m.sandbox.paypal.com/cert",
  transmissionId: "transmission-1",
  transmissionSig: "signature-1",
  transmissionTime: "2026-08-23T08:00:00Z",
}

describe("PayPal webhook verification", () => {
  it("accepts an event only when PayPal confirms its transmission", async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = []
    const responses = [
      Response.json({ access_token: "access-token" }),
      Response.json({ verification_status: "SUCCESS" }),
    ]
    const client = createPayPalClient(config, async (url, init) => {
      requests.push({ url: String(url), init })
      return responses.shift() ?? Response.json({}, { status: 500 })
    })
    const event = { id: "WH-test", event_type: "BILLING.SUBSCRIPTION.ACTIVATED" }

    await expect(client.verifyWebhook(transmission, event)).resolves.toBe(true)
    expect(requests[1]?.url).toBe(
      "https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature"
    )
    expect(JSON.parse(String(requests[1]?.init?.body))).toMatchObject({
      transmission_id: "transmission-1",
      webhook_id: "sandbox-webhook",
      webhook_event: event,
    })
  })

  it("rejects a transmission PayPal does not verify", async () => {
    const responses = [
      Response.json({ access_token: "access-token" }),
      Response.json({ verification_status: "FAILURE" }),
    ]
    const client = createPayPalClient(
      config,
      async () => responses.shift() ?? Response.json({}, { status: 500 })
    )

    await expect(client.verifyWebhook(transmission, { id: "WH-rejected" })).resolves.toBe(false)
  })
})

describe("PayPal environment isolation", () => {
  it("requires complete server configuration before checkout can open", () => {
    expect(
      isPayPalCheckoutConfigured({
        PAYPAL_ENVIRONMENT: "sandbox",
        PAYPAL_WEBHOOK_ID: "sandbox-webhook",
      })
    ).toBe(false)

    expect(
      isPayPalCheckoutConfigured({
        PAYPAL_ENVIRONMENT: "sandbox",
        PAYPAL_CLIENT_ID: "client",
        PAYPAL_CLIENT_SECRET: "secret",
        PAYPAL_WEBHOOK_ID: "webhook",
        PAYPAL_REGULAR_MONTHLY_PLAN_ID: "P-regular-monthly",
      })
    ).toBe(true)
  })

  it("never allows Sandbox billing in Production or Live billing in Preview", () => {
    const completeEnvironment = {
      PAYPAL_CLIENT_ID: "client",
      PAYPAL_CLIENT_SECRET: "secret",
      PAYPAL_WEBHOOK_ID: "webhook",
      PAYPAL_REGULAR_MONTHLY_PLAN_ID: "P-regular-monthly",
    }

    expect(
      isPayPalCheckoutConfigured({
        ...completeEnvironment,
        VERCEL_ENV: "production",
        PAYPAL_ENVIRONMENT: "sandbox",
      })
    ).toBe(false)
    expect(
      isPayPalCheckoutConfigured({
        ...completeEnvironment,
        VERCEL_ENV: "preview",
        PAYPAL_ENVIRONMENT: "live",
      })
    ).toBe(false)
    expect(() =>
      getPayPalConfig({
        ...completeEnvironment,
        VERCEL_ENV: "production",
        PAYPAL_ENVIRONMENT: "sandbox",
      })
    ).toThrow("PayPal sandbox configuration is not allowed in this deployment.")
  })

  it("selects the Sandbox API only from an explicit complete Sandbox configuration", () => {
    expect(
      getPayPalConfig({
        PAYPAL_ENVIRONMENT: "sandbox",
        PAYPAL_CLIENT_ID: "client",
        PAYPAL_CLIENT_SECRET: "secret",
        PAYPAL_WEBHOOK_ID: "webhook",
      })
    ).toEqual({
      clientId: "client",
      clientSecret: "secret",
      webhookId: "webhook",
      baseUrl: "https://api-m.sandbox.paypal.com",
    })
    expect(() =>
      getPayPalConfig({ PAYPAL_ENVIRONMENT: "live", PAYPAL_CLIENT_ID: "client" })
    ).toThrow("PayPal live configuration is incomplete.")
  })

  it("reads and cancels a subscription through authenticated PayPal endpoints", async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = []
    const responses = [
      Response.json({ access_token: "token-1" }),
      Response.json({ id: "I-subscription", status: "ACTIVE" }),
      Response.json({ access_token: "token-2" }),
      new Response(null, { status: 204 }),
    ]
    const client = createPayPalClient(config, async (url, init) => {
      requests.push({ url: String(url), init })
      return responses.shift() ?? Response.json({}, { status: 500 })
    })

    await expect(client.getSubscription("I-subscription")).resolves.toMatchObject({
      id: "I-subscription",
      status: "ACTIVE",
    })
    await expect(
      client.cancelSubscription("I-subscription", "Customer requested cancellation")
    ).resolves.toBeUndefined()
    expect(requests[1]?.url).toBe(
      "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-subscription"
    )
    expect(requests[3]?.url).toBe(
      "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-subscription/cancel"
    )
  })

  it("reads a sale so refund and dispute events can be linked safely", async () => {
    const responses = [
      Response.json({ access_token: "token" }),
      Response.json({ id: "SALE-1", state: "refunded", billing_agreement_id: "I-subscription" }),
    ]
    const client = createPayPalClient(
      config,
      async () => responses.shift() ?? Response.json({}, { status: 500 })
    )

    await expect(client.getSale("SALE-1")).resolves.toMatchObject({
      state: "refunded",
      billing_agreement_id: "I-subscription",
    })
  })

  it("reads the original capture so cumulative refunds can be classified", async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = []
    const responses = [
      Response.json({ access_token: "token" }),
      Response.json({
        id: "CAPTURE-1",
        status: "REFUNDED",
        amount: { value: "14.00", currency_code: "USD" },
      }),
    ]
    const client = createPayPalClient(config, async (url, init) => {
      requests.push({ url: String(url), init })
      return responses.shift() ?? Response.json({}, { status: 500 })
    })

    await expect(client.getCapture("CAPTURE-1")).resolves.toMatchObject({ status: "REFUNDED" })
    expect(requests[1]?.url).toBe(
      "https://api-m.sandbox.paypal.com/v2/payments/captures/CAPTURE-1"
    )
  })

  it("creates and captures the fixed PAYG order on authenticated server endpoints", async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = []
    const responses = [
      Response.json({ access_token: "token-1" }),
      Response.json({ id: "ORDER-1", status: "CREATED" }),
      Response.json({ access_token: "token-2" }),
      Response.json({ id: "ORDER-1", status: "COMPLETED" }),
    ]
    const client = createPayPalClient(config, async (url, init) => {
      requests.push({ url: String(url), init })
      return responses.shift() ?? Response.json({}, { status: 500 })
    })

    await client.createOrder({
      requestId: "local-order-id",
      customId: "local-order-id",
      amount: "14.00",
      currency: "USD",
      productKey: "audio_credits_payg_480",
      description: "480 Geekskai Audio Credits",
    })
    await client.captureOrder("ORDER-1", "local-order-id-capture")

    expect(requests[1]?.url).toBe("https://api-m.sandbox.paypal.com/v2/checkout/orders")
    expect(requests[1]?.init?.headers).toMatchObject({
      "paypal-request-id": "local-order-id",
    })
    expect(JSON.parse(String(requests[1]?.init?.body))).toMatchObject({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: "local-order-id",
          invoice_id: "local-order-id",
          amount: { currency_code: "USD", value: "14.00" },
          items: [{ sku: "audio_credits_payg_480", quantity: "1" }],
        },
      ],
    })
    expect(requests[3]?.url).toBe(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders/ORDER-1/capture"
    )
  })

  it("creates the Regular subscription on the server with opaque correlation URLs", async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = []
    const responses = [
      Response.json({ access_token: "token" }),
      Response.json({ id: "I-REGULAR", status: "APPROVAL_PENDING" }),
    ]
    const client = createPayPalClient(config, async (url, init) => {
      requests.push({ url: String(url), init })
      return responses.shift() ?? Response.json({}, { status: 500 })
    })

    await client.createSubscription({
      requestId: "correlation-id",
      planId: "P-REGULAR",
      customId: "correlation-id",
      returnUrl: "https://geekskai.com/audio-toolkit/?checkout=success",
      cancelUrl: "https://geekskai.com/pricing/?checkout=cancelled",
    })

    expect(requests[1]?.url).toBe("https://api-m.sandbox.paypal.com/v1/billing/subscriptions")
    expect(JSON.parse(String(requests[1]?.init?.body))).toEqual({
      plan_id: "P-REGULAR",
      custom_id: "correlation-id",
      application_context: {
        user_action: "SUBSCRIBE_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: "https://geekskai.com/audio-toolkit/?checkout=success",
        cancel_url: "https://geekskai.com/pricing/?checkout=cancelled",
      },
    })
  })
})
