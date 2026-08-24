import "server-only"

export type BillingReleaseStage = "off" | "credits" | "internal" | "public"

const RELEASE_STAGES = new Set<BillingReleaseStage>(["off", "credits", "internal", "public"])

export function getBillingReleaseStage(
  env: Record<string, string | undefined> = process.env
): BillingReleaseStage {
  const stage = env.BILLING_RELEASE_STAGE?.trim().toLowerCase()
  return RELEASE_STAGES.has(stage as BillingReleaseStage) ? (stage as BillingReleaseStage) : "off"
}

export function billingPublicCheckoutEnabled(
  env: Record<string, string | undefined> = process.env
) {
  return getBillingReleaseStage(env) === "public"
}

export function billingCheckoutEnabled(
  clerkUserId: string | null,
  env: Record<string, string | undefined> = process.env
) {
  const stage = getBillingReleaseStage(env)
  if (stage === "public") return true
  if (stage !== "internal" || !clerkUserId) return false
  const allowedUsers = new Set(
    env.BILLING_INTERNAL_TEST_USER_IDS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? []
  )
  return allowedUsers.has(clerkUserId)
}

export function billingSchemaV2Enabled(env: Record<string, string | undefined> = process.env) {
  return env.BILLING_SCHEMA_V2_ENABLED === "true"
}

export function audioCreditsEnabled(env: Record<string, string | undefined> = process.env) {
  return getBillingReleaseStage(env) !== "off"
}
