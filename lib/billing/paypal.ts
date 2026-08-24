export type PayPalConfig = {
  clientId: string
  clientSecret: string
  webhookId: string
  baseUrl: "https://api-m.sandbox.paypal.com" | "https://api-m.paypal.com"
}

export type PayPalTransmission = {
  authAlgo: string
  certUrl: string
  transmissionId: string
  transmissionSig: string
  transmissionTime: string
}

type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

function isPayPalEnvironmentAllowedForDeployment(
  environment: string | undefined,
  vercelEnvironment: string | undefined
) {
  if (vercelEnvironment === "production") return environment === "live"
  if (vercelEnvironment === "preview" || vercelEnvironment === "development") {
    return environment === "sandbox"
  }
  return environment === "sandbox" || environment === "live"
}

const PAYPAL_CHECKOUT_ENV_KEYS = [
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_WEBHOOK_ID",
  "PAYPAL_REGULAR_MONTHLY_PLAN_ID",
] as const

export function isPayPalCheckoutConfigured(env: Record<string, string | undefined> = process.env) {
  const environment = env.PAYPAL_ENVIRONMENT?.trim()
  return (
    isPayPalEnvironmentAllowedForDeployment(environment, env.VERCEL_ENV?.trim()) &&
    PAYPAL_CHECKOUT_ENV_KEYS.every((key) => Boolean(env[key]?.trim()))
  )
}

export function getPayPalConfig(
  env: Record<string, string | undefined> = process.env
): PayPalConfig {
  const environment = env.PAYPAL_ENVIRONMENT?.trim()
  if (environment !== "sandbox" && environment !== "live") {
    throw new Error("PAYPAL_ENVIRONMENT must be sandbox or live.")
  }
  if (!isPayPalEnvironmentAllowedForDeployment(environment, env.VERCEL_ENV?.trim())) {
    throw new Error(`PayPal ${environment} configuration is not allowed in this deployment.`)
  }
  const clientId = env.PAYPAL_CLIENT_ID?.trim()
  const clientSecret = env.PAYPAL_CLIENT_SECRET?.trim()
  const webhookId = env.PAYPAL_WEBHOOK_ID?.trim()
  if (!clientId || !clientSecret || !webhookId) {
    throw new Error(`PayPal ${environment} configuration is incomplete.`)
  }
  return {
    clientId,
    clientSecret,
    webhookId,
    baseUrl:
      environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com",
  }
}

export function createPayPalClient(config: PayPalConfig, fetchImpl: Fetch = fetch) {
  const getAccessToken = async () => {
    const authorization = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString(
      "base64"
    )
    const response = await fetchImpl(`${config.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Basic ${authorization}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })
    const result = (await response.json().catch(() => null)) as { access_token?: string } | null
    if (!response.ok || !result?.access_token) {
      throw new Error("PayPal authentication failed.")
    }
    return result.access_token
  }

  const authorizedRequest = async (path: string, init: RequestInit = {}) => {
    const accessToken = await getAccessToken()
    return fetchImpl(`${config.baseUrl}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    })
  }

  return {
    async verifyWebhook(transmission: PayPalTransmission, event: Record<string, unknown>) {
      const accessToken = await getAccessToken()
      const response = await fetchImpl(
        `${config.baseUrl}/v1/notifications/verify-webhook-signature`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${accessToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            auth_algo: transmission.authAlgo,
            cert_url: transmission.certUrl,
            transmission_id: transmission.transmissionId,
            transmission_sig: transmission.transmissionSig,
            transmission_time: transmission.transmissionTime,
            webhook_id: config.webhookId,
            webhook_event: event,
          }),
          cache: "no-store",
        }
      )
      const result = (await response.json().catch(() => null)) as {
        verification_status?: string
      } | null
      if (!response.ok) throw new Error("PayPal webhook verification failed.")
      return result?.verification_status === "SUCCESS"
    },

    async getSubscription(subscriptionId: string) {
      const response = await authorizedRequest(
        `/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`
      )
      const result = (await response.json().catch(() => null)) as Record<string, unknown> | null
      if (!response.ok || !result) throw new Error("PayPal subscription lookup failed.")
      return result
    },

    async createOrder(input: {
      requestId: string
      customId: string
      amount: string
      currency: string
      productKey: string
      description: string
    }) {
      const response = await authorizedRequest("/v2/checkout/orders", {
        method: "POST",
        headers: { "paypal-request-id": input.requestId },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: input.customId,
              invoice_id: input.requestId,
              description: input.description,
              amount: {
                currency_code: input.currency,
                value: input.amount,
                breakdown: {
                  item_total: { currency_code: input.currency, value: input.amount },
                },
              },
              items: [
                {
                  name: input.description,
                  sku: input.productKey,
                  quantity: "1",
                  unit_amount: { currency_code: input.currency, value: input.amount },
                  category: "DIGITAL_GOODS",
                },
              ],
            },
          ],
          payment_source: {
            paypal: { experience_context: { shipping_preference: "NO_SHIPPING" } },
          },
        }),
      })
      const result = (await response.json().catch(() => null)) as Record<string, unknown> | null
      if (!response.ok || !result) throw new Error("PayPal order creation failed.")
      return result
    },

    async captureOrder(orderId: string, requestId: string) {
      const response = await authorizedRequest(
        `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
        { method: "POST", headers: { "paypal-request-id": requestId }, body: "{}" }
      )
      const result = (await response.json().catch(() => null)) as Record<string, unknown> | null
      if (!response.ok || !result) throw new Error("PayPal order capture failed.")
      return result
    },

    async createSubscription(input: {
      requestId: string
      planId: string
      customId: string
      returnUrl: string
      cancelUrl: string
    }) {
      const response = await authorizedRequest("/v1/billing/subscriptions", {
        method: "POST",
        headers: { "paypal-request-id": input.requestId },
        body: JSON.stringify({
          plan_id: input.planId,
          custom_id: input.customId,
          application_context: {
            user_action: "SUBSCRIBE_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: input.returnUrl,
            cancel_url: input.cancelUrl,
          },
        }),
      })
      const result = (await response.json().catch(() => null)) as Record<string, unknown> | null
      if (!response.ok || !result) throw new Error("PayPal subscription creation failed.")
      return result
    },

    async getSale(saleId: string) {
      const response = await authorizedRequest(`/v1/payments/sale/${encodeURIComponent(saleId)}`)
      const result = (await response.json().catch(() => null)) as Record<string, unknown> | null
      if (!response.ok || !result) throw new Error("PayPal sale lookup failed.")
      return result
    },

    async getCapture(captureId: string) {
      const response = await authorizedRequest(
        `/v2/payments/captures/${encodeURIComponent(captureId)}`
      )
      const result = (await response.json().catch(() => null)) as Record<string, unknown> | null
      if (!response.ok || !result) throw new Error("PayPal capture lookup failed.")
      return result
    },

    async cancelSubscription(subscriptionId: string, reason: string) {
      const response = await authorizedRequest(
        `/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
        { method: "POST", body: JSON.stringify({ reason }) }
      )
      if (!response.ok) throw new Error("PayPal subscription cancellation failed.")
    },
  }
}

export function getPayPalClient(env: Record<string, string | undefined> = process.env) {
  return createPayPalClient(getPayPalConfig(env))
}
