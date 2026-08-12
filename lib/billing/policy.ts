import "server-only"

export function billingCheckoutEnabled() {
  return process.env.BILLING_CHECKOUT_ENABLED === "true"
}

export function billingSchemaV2Enabled() {
  return process.env.BILLING_SCHEMA_V2_ENABLED === "true"
}
