import { randomUUID } from "node:crypto"
import { getSqlClient } from "@/lib/db/client"
import type { QuotaToolId } from "@/lib/download-quota/config"
import type { ShareChannel, ShareCopyMode, ShareSurface } from "./sharing"

export const GROWTH_EVENT_NAMES = [
  "quota_gate_viewed",
  "signup_started",
  "new_account_completed",
  "signin_completed",
  "successful_download",
  "share_intent_opened",
  "share_card_viewed",
  "share_channel_opened",
  "share_landing",
  "ai_copy_generated",
  "ai_copy_failed",
  "billing_checkout_started_payg",
  "billing_checkout_started_subscription",
  "billing_payment_completed_payg",
  "billing_payment_completed_subscription",
  "billing_subscription_cancelled",
  "paid_workspace_opened",
  "first_paid_processing_completed",
] as const

export type GrowthEventName = (typeof GROWTH_EVENT_NAMES)[number]

export type GrowthEventDimensions = {
  channel?: ShareChannel | null
  surface?: ShareSurface | null
  copyMode?: ShareCopyMode | null
  copyVariant?: string | null
}

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

export async function isActiveGrowthJourney(journeyId: string, now = new Date()) {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT id
    FROM growth_journeys
    WHERE id = ${journeyId}::uuid
      AND expires_at > ${now}
    LIMIT 1
  `) as { id: string }[]
  return rows.length > 0
}

export async function hasRecentAiCopyAttempt({
  journeyId,
  toolId,
  channel,
  now = new Date(),
}: {
  journeyId: string
  toolId: QuotaToolId
  channel: ShareChannel
  now?: Date
}) {
  const sql = getSqlClient()
  const cutoff = new Date(now.getTime() - 24 * 60 * 60_000)
  const rows = (await sql`
    SELECT id
    FROM growth_events
    WHERE journey_id = ${journeyId}::uuid
      AND tool_id = ${toolId}
      AND share_channel = ${channel}
      AND event_name IN ('ai_copy_generated', 'ai_copy_failed')
      AND occurred_at >= ${cutoff}
    LIMIT 1
  `) as { id: string }[]
  return rows.length > 0
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
        COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'new_account_completed')::integer
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
        AND signup.event_name = 'new_account_completed'
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
  await sql`
    INSERT INTO daily_growth_channel_metrics (
      metric_day,
      tool_id,
      channel,
      surface,
      copy_mode,
      copy_variant,
      share_card_views,
      channel_opens,
      share_landings,
      referred_new_accounts,
      updated_at
    )
    SELECT
      occurred_at::date,
      COALESCE(tool_id, 'unknown'),
      COALESCE(share_channel, 'unknown'),
      COALESCE(share_surface, 'unknown'),
      COALESCE(copy_mode, 'unknown'),
      COALESCE(copy_variant, 'unknown'),
      COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'share_card_viewed')::integer,
      COUNT(*) FILTER (WHERE event_name = 'share_channel_opened')::integer,
      COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'share_landing')::integer,
      COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'new_account_completed')::integer,
      ${now}
    FROM growth_events
    WHERE occurred_at < ${rawEventCutoff}
      AND event_name IN (
        'share_card_viewed',
        'share_channel_opened',
        'share_landing',
        'new_account_completed'
      )
    GROUP BY
      occurred_at::date,
      COALESCE(tool_id, 'unknown'),
      COALESCE(share_channel, 'unknown'),
      COALESCE(share_surface, 'unknown'),
      COALESCE(copy_mode, 'unknown'),
      COALESCE(copy_variant, 'unknown')
    ON CONFLICT (metric_day, tool_id, channel, surface, copy_mode, copy_variant)
    DO UPDATE SET
      share_card_views = EXCLUDED.share_card_views,
      channel_opens = EXCLUDED.channel_opens,
      share_landings = EXCLUDED.share_landings,
      referred_new_accounts = EXCLUDED.referred_new_accounts,
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
  channel,
  surface,
  copyMode,
  copyVariant,
  now = new Date(),
}: {
  journeyId: string
  clerkUserId?: string | null
  eventName: GrowthEventName
  toolId?: QuotaToolId | null
  firstShareId?: string | null
  channel?: ShareChannel | null
  surface?: ShareSurface | null
  copyMode?: ShareCopyMode | null
  copyVariant?: string | null
  now?: Date
}) {
  await ensureGrowthJourney({ journeyId, clerkUserId, firstShareId, now })
  const sql = getSqlClient()
  await sql`
    INSERT INTO growth_events (
      journey_id,
      clerk_user_id,
      event_name,
      tool_id,
      share_channel,
      share_surface,
      copy_mode,
      copy_variant,
      occurred_at
    ) VALUES (
      ${journeyId}::uuid,
      ${clerkUserId ?? null},
      ${eventName},
      ${toolId ?? null},
      ${channel ?? null},
      ${surface ?? null},
      ${copyMode ?? null},
      ${copyVariant ?? null},
      ${now}
    )
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
  channel,
  surface,
  copyMode,
  copyVariant,
  now = new Date(),
}: {
  shareId: string
  creatorClerkUserId?: string | null
  toolId: QuotaToolId
  channel: ShareChannel
  surface: ShareSurface
  copyMode: ShareCopyMode
  copyVariant: string
  now?: Date
}) {
  const sql = getSqlClient()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60_000)
  await sql`
    INSERT INTO share_attributions (
      share_id,
      creator_clerk_user_id,
      source_tool_id,
      share_channel,
      share_surface,
      copy_mode,
      copy_variant,
      expires_at
    ) VALUES (
      ${shareId}::uuid,
      ${creatorClerkUserId ?? null},
      ${toolId},
      ${channel},
      ${surface},
      ${copyMode},
      ${copyVariant},
      ${expiresAt}
    )
    ON CONFLICT (share_id) DO NOTHING
  `
}

export type ValidShareAttribution = {
  shareId: string
  toolId: QuotaToolId
  channel: ShareChannel
  surface: ShareSurface
  copyMode: ShareCopyMode
  copyVariant: string
}

export async function getValidShareAttribution(
  shareId: string,
  now = new Date()
): Promise<ValidShareAttribution | null> {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT
      share_id,
      source_tool_id,
      share_channel,
      share_surface,
      copy_mode,
      copy_variant
    FROM share_attributions
    WHERE share_id = ${shareId}::uuid
      AND expires_at > ${now}
    LIMIT 1
  `) as {
    share_id: string
    source_tool_id: QuotaToolId
    share_channel: ShareChannel
    share_surface: ShareSurface
    copy_mode: ShareCopyMode
    copy_variant: string
  }[]
  const row = rows[0]
  return row
    ? {
        shareId: row.share_id,
        toolId: row.source_tool_id,
        channel: row.share_channel,
        surface: row.share_surface,
        copyMode: row.copy_mode,
        copyVariant: row.copy_variant,
      }
    : null
}

export function classifyAccountCompletion({
  signupStartedAt,
  userCreatedAt,
  now,
}: {
  signupStartedAt: Date | null
  userCreatedAt: Date
  now: Date
}): "new_account_completed" | "signin_completed" {
  if (!signupStartedAt) return "signin_completed"
  const clockToleranceMs = 5 * 60_000
  const returnWindowMs = 60 * 60_000
  const createdDuringJourney =
    userCreatedAt.getTime() >= signupStartedAt.getTime() - clockToleranceMs
  const createdByReturn = userCreatedAt.getTime() <= now.getTime() + clockToleranceMs
  const elapsed = now.getTime() - signupStartedAt.getTime()
  const returnedInTime = elapsed >= -clockToleranceMs && elapsed <= returnWindowMs
  return createdDuringJourney && createdByReturn && returnedInTime
    ? "new_account_completed"
    : "signin_completed"
}

export async function recordAccountCompletion({
  journeyId,
  clerkUserId,
  userCreatedAt,
  toolId,
  firstShareId,
  now = new Date(),
}: {
  journeyId: string
  clerkUserId: string
  userCreatedAt: Date
  toolId: QuotaToolId
  firstShareId?: string | null
  now?: Date
}) {
  const sql = getSqlClient()
  const existing = (await sql`
    SELECT event_name
    FROM growth_events
    WHERE journey_id = ${journeyId}::uuid
      AND clerk_user_id = ${clerkUserId}
      AND event_name IN ('new_account_completed', 'signin_completed')
    LIMIT 1
  `) as { event_name: "new_account_completed" | "signin_completed" }[]
  if (existing[0]) return existing[0].event_name

  const starts = (await sql`
    SELECT occurred_at
    FROM growth_events
    WHERE journey_id = ${journeyId}::uuid
      AND event_name = 'signup_started'
    ORDER BY occurred_at DESC
    LIMIT 1
  `) as { occurred_at: Date }[]
  const eventName = classifyAccountCompletion({
    signupStartedAt: starts[0]?.occurred_at ?? null,
    userCreatedAt,
    now,
  })
  const attribution = firstShareId ? await getValidShareAttribution(firstShareId, now) : null
  await recordGrowthEvent({
    journeyId,
    clerkUserId,
    eventName,
    toolId,
    firstShareId: attribution?.shareId ?? null,
    channel: attribution?.channel,
    surface: attribution?.surface,
    copyMode: attribution?.copyMode,
    copyVariant: attribution?.copyVariant,
    now,
  })
  return eventName
}
