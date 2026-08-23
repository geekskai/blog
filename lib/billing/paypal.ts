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
  "PAYPAL_BASIC_MONTHLY_PLAN_ID",
  "PAYPAL_BASIC_ANNUAL_PLAN_ID",
  "PAYPAL_PRO_MONTHLY_PLAN_ID",
  "PAYPAL_PRO_ANNUAL_PLAN_ID",
] as const

export function isPayPalCheckoutConfigured(
  env: Record<string, string | undefined> = process.env
) {
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

    async getSale(saleId: string) {
      const response = await authorizedRequest(`/v1/payments/sale/${encodeURIComponent(saleId)}`)
      const result = (await response.json().catch(() => null)) as Record<string, unknown> | null
      if (!response.ok || !result) throw new Error("PayPal sale lookup failed.")
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
