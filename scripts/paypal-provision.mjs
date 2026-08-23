const environment = process.env.PAYPAL_ENVIRONMENT?.trim()
if (environment !== "sandbox" && environment !== "live") {
  throw new Error("PAYPAL_ENVIRONMENT must be sandbox or live.")
}
if (process.env.PAYPAL_PROVISION_CONFIRM !== `CREATE_${environment.toUpperCase()}`) {
  throw new Error(
    `Set PAYPAL_PROVISION_CONFIRM=CREATE_${environment.toUpperCase()} to confirm one-time provisioning.`
  )
}

const clientId = process.env.PAYPAL_CLIENT_ID?.trim()
const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim()
if (!clientId || !clientSecret) throw new Error(`PayPal ${environment} credentials are incomplete.`)

const baseUrl =
  environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"
const environmentCode = environment === "live" ? "live" : "sb"
const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    accept: "application/json",
    authorization: `Basic ${authorization}`,
    "content-type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
})
const tokenResult = await tokenResponse.json()
if (!tokenResponse.ok || !tokenResult.access_token) {
  throw new Error("PayPal authentication failed during provisioning.")
}

const paypalRequest = async (path, requestId, body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokenResult.access_token}`,
      "content-type": "application/json",
      "paypal-request-id": requestId,
      prefer: "return=representation",
    },
    body: JSON.stringify(body),
  })
  const result = await response.json()
  if (!response.ok) {
    const issue = result?.details?.[0]?.issue ?? result?.name ?? "unknown_error"
    throw new Error(`PayPal provisioning failed at ${path}: ${issue}`)
  }
  return result
}

const product = await paypalRequest(
  "/v1/catalogs/products",
  `gks-${environmentCode}-audio-product-v1`,
  {
    name: "Geekskai Audio Toolkit",
    description:
      "Browser-local audio preparation with paid batch size and ZIP export capabilities.",
    type: "DIGITAL",
    category: "SOFTWARE",
  }
)

const planDefinitions = [
  { key: "BASIC_MONTHLY", name: "Basic Monthly", intervalUnit: "MONTH", price: "10.00" },
  { key: "BASIC_ANNUAL", name: "Basic Annual", intervalUnit: "YEAR", price: "96.00" },
  { key: "PRO_MONTHLY", name: "Pro Monthly", intervalUnit: "MONTH", price: "25.00" },
  { key: "PRO_ANNUAL", name: "Pro Annual", intervalUnit: "YEAR", price: "240.00" },
]

const plans = {}
for (const definition of planDefinitions) {
  const plan = await paypalRequest(
    "/v1/billing/plans",
    `gks-${environmentCode}-${definition.key.toLowerCase().replace("_", "-")}-v1`,
    {
      product_id: product.id,
      name: `Geekskai Audio Toolkit ${definition.name}`,
      description: `${definition.name} recurring access. No trial or usage overages.`,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: { interval_unit: definition.intervalUnit, interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: definition.price, currency_code: "USD" },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: { value: "0", currency_code: "USD" },
        setup_fee_failure_action: "CANCEL",
        payment_failure_threshold: 2,
      },
    }
  )
  plans[`PAYPAL_${definition.key}_PLAN_ID`] = plan.id
}

process.stdout.write(
  `${JSON.stringify({ PAYPAL_ENVIRONMENT: environment, PAYPAL_PRODUCT_ID: product.id, ...plans }, null, 2)}\n`
)
