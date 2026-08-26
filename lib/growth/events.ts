import { randomUUID } from "node:crypto"
import { getSqlClient } from "@/lib/db/client"
import type { QuotaToolId } from "@/lib/download-quota/config"

export const GROWTH_EVENT_NAMES = [
  "quota_gate_viewed",
  "signup_started",
  "signup_completed",
  "successful_download",
  "share_intent_opened",
  "share_landing",
  "billing_checkout_started_payg",
  "billing_checkout_started_subscription",
  "billing_payment_completed_payg",
  "billing_payment_completed_subscription",
  "billing_subscription_cancelled",
  "paid_workspace_opened",
  "first_paid_processing_completed",
] as const

export type GrowthEventName = (typeof GROWTH_EVENT_NAMES)[number]

export function isGrowthEventName(value: unknown): value is GrowthEventName {
  return typeof value === "string" && GROWTH_EVENT_NAMES.includes(value as GrowthEventName)
}

export async function ensureGrowthJourney({
  journeyId,
  clerkUserId,
  firstShareId,
  now = new Date(),
}: {
  journeyId: string
  clerkUserId?: string | null
  firstShareId?: string | null
  now?: Date
}) {
  const sql = getSqlClient()
  const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60_000)

  await sql`
    INSERT INTO growth_journeys (id, clerk_user_id, first_share_id, expires_at)
    VALUES (
      ${journeyId}::uuid,
      ${clerkUserId ?? null},
      (
        SELECT share_id
        FROM share_attributions
        WHERE share_id = ${firstShareId ?? null}::uuid AND expires_at > ${now}
      ),
      ${expiresAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      clerk_user_id = COALESCE(growth_journeys.clerk_user_id, EXCLUDED.clerk_user_id),
      first_share_id = COALESCE(growth_journeys.first_share_id, EXCLUDED.first_share_id),
      expires_at = GREATEST(growth_journeys.expires_at, EXCLUDED.expires_at),
      updated_at = ${now}
  `
}

export async function purgeExpiredGrowthData(now = new Date()) {
  const sql = getSqlClient()
  const rawEventCutoff = new Date(now.getTime() - 90 * 24 * 60 * 60_000)
  rawEventCutoff.setUTCHours(0, 0, 0, 0)
  const shareRecordCutoff = new Date(now.getTime() - 90 * 24 * 60 * 60_000)

  await sql`
    WITH eligible AS (
      SELECT journey_id, event_name, occurred_at
      FROM growth_events
      WHERE occurred_at < ${rawEventCutoff}
    ),
    daily AS (
      SELECT
        occurred_at::date AS metric_day,
        COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'quota_gate_viewed')::integer
          AS quota_gate_viewers,
        COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'signup_completed')::integer
          AS registration_completions,
        COUNT(*) FILTER (WHERE event_name = 'successful_download')::integer
          AS successful_downloads,
        COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'share_intent_opened')::integer
          AS share_intents,
        COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'share_landing')::integer
          AS share_landings
      FROM eligible
      GROUP BY occurred_at::date
    ),
    activated AS (
      SELECT
        gate.occurred_at::date AS metric_day,
        COUNT(DISTINCT gate.journey_id)::integer AS quota_gate_activations
      FROM eligible gate
      JOIN growth_events signup
        ON signup.journey_id = gate.journey_id
        AND signup.event_name = 'signup_completed'
        AND signup.occurred_at >= gate.occurred_at
        AND signup.occurred_at <= gate.occurred_at + INTERVAL '24 hours'
      JOIN growth_events download
        ON download.journey_id = gate.journey_id
        AND download.event_name = 'successful_download'
        AND download.occurred_at >= signup.occurred_at
        AND download.occurred_at <= gate.occurred_at + INTERVAL '24 hours'
      WHERE gate.event_name = 'quota_gate_viewed'
      GROUP BY gate.occurred_at::date
    )
    INSERT INTO daily_growth_metrics (
      metric_day,
      quota_gate_viewers,
      registration_completions,
      quota_gate_activations,
      successful_downloads,
      share_intents,
      share_landings,
      updated_at
    )
    SELECT
      daily.metric_day,
      daily.quota_gate_viewers,
      daily.registration_completions,
      COALESCE(activated.quota_gate_activations, 0),
      daily.successful_downloads,
      daily.share_intents,
      daily.share_landings,
      ${now}
    FROM daily
    LEFT JOIN activated USING (metric_day)
    ON CONFLICT (metric_day) DO UPDATE SET
      quota_gate_viewers = EXCLUDED.quota_gate_viewers,
      registration_completions = EXCLUDED.registration_completions,
      quota_gate_activations = EXCLUDED.quota_gate_activations,
      successful_downloads = EXCLUDED.successful_downloads,
      share_intents = EXCLUDED.share_intents,
      share_landings = EXCLUDED.share_landings,
      updated_at = EXCLUDED.updated_at
  `
  await sql`DELETE FROM growth_events WHERE occurred_at < ${rawEventCutoff}`
  await sql`
    DELETE FROM growth_journeys journey
    WHERE journey.expires_at <= ${now}
      AND NOT EXISTS (
        SELECT 1 FROM growth_events event WHERE event.journey_id = journey.id
      )
  `
  await sql`
    DELETE FROM share_attributions attribution
    WHERE attribution.created_at < ${shareRecordCutoff}
      AND NOT EXISTS (
        SELECT 1 FROM growth_journeys journey WHERE journey.first_share_id = attribution.share_id
      )
  `
}

export async function recordGrowthEvent({
  journeyId,
  clerkUserId,
  eventName,
  toolId,
  firstShareId,
  now = new Date(),
}: {
  journeyId: string
  clerkUserId?: string | null
  eventName: GrowthEventName
  toolId?: QuotaToolId | null
  firstShareId?: string | null
  now?: Date
}) {
  await ensureGrowthJourney({ journeyId, clerkUserId, firstShareId, now })
  const sql = getSqlClient()
  await sql`
    INSERT INTO growth_events (journey_id, clerk_user_id, event_name, tool_id, occurred_at)
    VALUES (${journeyId}::uuid, ${clerkUserId ?? null}, ${eventName}, ${toolId ?? null}, ${now})
  `
}

export async function recordGrowthEventForUser({
  clerkUserId,
  eventName,
  now = new Date(),
}: {
  clerkUserId: string
  eventName: GrowthEventName
  now?: Date
}) {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT id
    FROM growth_journeys
    WHERE clerk_user_id = ${clerkUserId}
    ORDER BY updated_at DESC
    LIMIT 1
  `) as { id: string }[]
  await recordGrowthEvent({
    journeyId: rows[0]?.id ?? randomUUID(),
    clerkUserId,
    eventName,
    now,
  })
}

export async function recordGrowthEventForUserSafely(
  clerkUserId: string,
  eventName: GrowthEventName,
  now = new Date()
) {
  try {
    await recordGrowthEventForUser({ clerkUserId, eventName, now })
  } catch (error) {
    console.warn("Growth event could not be recorded", { eventName, error })
  }
}

export async function createShareAttribution({
  shareId,
  creatorClerkUserId,
  toolId,
  now = new Date(),
}: {
  shareId: string
  creatorClerkUserId?: string | null
  toolId: QuotaToolId
  now?: Date
}) {
  const sql = getSqlClient()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60_000)
  await sql`
    INSERT INTO share_attributions (
      share_id,
      creator_clerk_user_id,
      source_tool_id,
      expires_at
    ) VALUES (${shareId}::uuid, ${creatorClerkUserId ?? null}, ${toolId}, ${expiresAt})
    ON CONFLICT (share_id) DO NOTHING
  `
}
