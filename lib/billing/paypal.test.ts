import { describe, expect, it } from "vitest"
import { createPayPalClient, getPayPalConfig } from "./paypal"

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
})
