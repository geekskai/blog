import "server-only"
import { getSqlClient } from "@/lib/db/client"
import { CREDIT_CATALOG } from "@/lib/billing/catalog"
import { creditsForDuration, getDailyCreditWindow } from "@/lib/billing/domain"
import type { AudioCreditBalance, AudioCreditOperationStatus } from "@/lib/billing/types"

type Row = Record<string, unknown>

const RESERVATION_MINUTES = 30
const MAX_OPERATION_HOURS = 24

const numberValue = (value: unknown) => Number(value) || 0
const stringValue = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null

async function ensureDailyGrant(clerkUserId: string, now: Date) {
  const sql = getSqlClient()
  const daily = getDailyCreditWindow(now)
  await sql`
    INSERT INTO audio_credit_grants (
      clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
    ) VALUES (
      ${clerkUserId}, 'daily_free', ${daily.sourceRef}, ${daily.credits},
      ${daily.startsAt}, ${daily.expiresAt}
    )
    ON CONFLICT (clerk_user_id, source, source_ref) DO NOTHING
  `
}

async function releaseExpiredOperations(clerkUserId: string, now: Date) {
  const sql = getSqlClient()
  await sql`
    WITH expired AS (
      UPDATE audio_credit_operations
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE clerk_user_id = ${clerkUserId}
        AND status IN ('reserved', 'processing')
        AND expires_at <= ${now}
      RETURNING id
    ), released AS (
      SELECT allocation.grant_id, SUM(allocation.reserved_credits)::integer AS credits
      FROM audio_credit_allocations allocation
      JOIN expired ON expired.id = allocation.operation_id
      GROUP BY allocation.grant_id
    )
    UPDATE audio_credit_grants grant_row
    SET reserved_credits = GREATEST(0, grant_row.reserved_credits - released.credits),
      updated_at = ${now}
    FROM released
    WHERE grant_row.id = released.grant_id
  `
}

export async function getAudioCreditBalance(
  clerkUserId: string,
  now = new Date()
): Promise<AudioCreditBalance> {
  await ensureDailyGrant(clerkUserId, now)
  await releaseExpiredOperations(clerkUserId, now)
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT
      COALESCE(SUM(granted_credits - reserved_credits - consumed_credits), 0)::integer AS total,
      COALESCE(SUM(granted_credits - reserved_credits - consumed_credits)
        FILTER (WHERE source = 'daily_free'), 0)::integer AS free,
      COALESCE(SUM(granted_credits - reserved_credits - consumed_credits)
        FILTER (WHERE source = 'paypal_subscription'), 0)::integer AS subscription,
      COALESCE(SUM(granted_credits - reserved_credits - consumed_credits)
        FILTER (WHERE source = 'paypal_order'), 0)::integer AS payg,
      MIN(expires_at) FILTER (
        WHERE granted_credits - reserved_credits - consumed_credits > 0
      ) AS next_expiry
    FROM audio_credit_grants
    WHERE clerk_user_id = ${clerkUserId}
      AND starts_at <= ${now}
      AND expires_at > ${now}
      AND revoked_at IS NULL
  `) as Row[]
  const row = rows[0] ?? {}
  const subscription = numberValue(row.subscription)
  const payg = numberValue(row.payg)
  const paidAccess = subscription + payg > 0
  return {
    total: numberValue(row.total),
    free: numberValue(row.free),
    subscription,
    payg,
    paidAccess,
    batchFileLimit: paidAccess ? 50 : 1,
    zipExport: paidAccess,
    nextExpiry: row.next_expiry ? new Date(String(row.next_expiry)).toISOString() : null,
  }
}

export async function reserveAudioCredits(input: {
  clerkUserId: string
  operationId: string
  totalDurationSeconds: number
  fileCount: number
  now?: Date
}) {
  const now = input.now ?? new Date()
  const requiredCredits = creditsForDuration(input.totalDurationSeconds)
  if (requiredCredits < 1) throw new Error("Audio duration must be greater than zero.")
  await ensureDailyGrant(input.clerkUserId, now)
  await releaseExpiredOperations(input.clerkUserId, now)
  const access = await getAudioCreditBalance(input.clerkUserId, now)
  if (input.fileCount > access.batchFileLimit) {
    throw new Error("A paid Audio Credit balance is required for batch processing.")
  }
  const sql = getSqlClient()
  const expiresAt = new Date(now.getTime() + RESERVATION_MINUTES * 60_000)
  const rows = (await sql`
    WITH eligible AS MATERIALIZED (
      SELECT id, source, expires_at,
        granted_credits - reserved_credits - consumed_credits AS available
      FROM audio_credit_grants
      WHERE clerk_user_id = ${input.clerkUserId}
        AND starts_at <= ${now}
        AND expires_at > ${now}
        AND revoked_at IS NULL
        AND granted_credits - reserved_credits - consumed_credits > 0
      FOR UPDATE
    ), ranked AS (
      SELECT id, source, expires_at, available,
        COALESCE(SUM(available) OVER (
          ORDER BY CASE source
            WHEN 'daily_free' THEN 0
            WHEN 'paypal_subscription' THEN 1
            ELSE 2
          END, expires_at, id
          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
        ), 0)::integer AS credits_before
      FROM eligible
    ), sufficient AS (
      SELECT COALESCE(SUM(available), 0)::integer AS available FROM eligible
    ), attempted AS (
      INSERT INTO audio_credit_operations (
        id, clerk_user_id, total_duration_seconds, file_count, reserved_credits,
        status, expires_at
      )
      SELECT ${input.operationId}::uuid, ${input.clerkUserId},
        ${Math.ceil(input.totalDurationSeconds)}, ${input.fileCount}, ${requiredCredits},
        'reserved', ${expiresAt}
      FROM sufficient
      WHERE available >= ${requiredCredits}
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    ), allocated AS (
      INSERT INTO audio_credit_allocations (operation_id, grant_id, reserved_credits)
      SELECT attempted.id, ranked.id,
        LEAST(ranked.available, GREATEST(${requiredCredits} - ranked.credits_before, 0))::integer
      FROM ranked CROSS JOIN attempted
      WHERE ranked.credits_before < ${requiredCredits}
      RETURNING grant_id, reserved_credits
    ), held AS (
      UPDATE audio_credit_grants grant_row
      SET reserved_credits = grant_row.reserved_credits + allocated.credits,
        updated_at = ${now}
      FROM (
        SELECT grant_id, SUM(reserved_credits)::integer AS credits
        FROM allocated GROUP BY grant_id
      ) allocated
      WHERE grant_row.id = allocated.grant_id
      RETURNING grant_row.id
    )
    SELECT operation.status, operation.reserved_credits
    FROM audio_credit_operations operation
    JOIN attempted ON attempted.id = operation.id
  `) as { status: AudioCreditOperationStatus; reserved_credits: number | string }[]

  if (!rows[0]) {
    const existing = (await sql`
      SELECT status, reserved_credits, total_duration_seconds, file_count, clerk_user_id
      FROM audio_credit_operations WHERE id = ${input.operationId}::uuid
    `) as Row[]
    const operation = existing[0]
    if (operation) {
      if (
        operation.clerk_user_id !== input.clerkUserId ||
        numberValue(operation.total_duration_seconds) !== Math.ceil(input.totalDurationSeconds) ||
        numberValue(operation.file_count) !== input.fileCount
      ) {
        throw new Error("Audio credit operation ID is already in use.")
      }
      return {
        outcome: stringValue(operation.status) as AudioCreditOperationStatus,
        reservedCredits: numberValue(operation.reserved_credits),
        balance: await getAudioCreditBalance(input.clerkUserId, now),
      }
    }
    return {
      outcome: "insufficient_credits" as const,
      reservedCredits: requiredCredits,
      balance: await getAudioCreditBalance(input.clerkUserId, now),
    }
  }

  return {
    outcome: rows[0].status,
    reservedCredits: numberValue(rows[0].reserved_credits),
    balance: await getAudioCreditBalance(input.clerkUserId, now),
  }
}

export async function heartbeatAudioCreditOperation(
  clerkUserId: string,
  operationId: string,
  now = new Date()
) {
  const sql = getSqlClient()
  const rows = (await sql`
    UPDATE audio_credit_operations
    SET status = 'processing',
      expires_at = LEAST(
        ${new Date(now.getTime() + RESERVATION_MINUTES * 60_000)},
        created_at + ${MAX_OPERATION_HOURS} * interval '1 hour'
      ),
      updated_at = ${now}
    WHERE id = ${operationId}::uuid
      AND clerk_user_id = ${clerkUserId}
      AND status IN ('reserved', 'processing')
      AND expires_at > ${now}
    RETURNING status, expires_at
  `) as Row[]
  return rows[0]
    ? {
        status: "processing" as const,
        expiresAt: new Date(String(rows[0].expires_at)).toISOString(),
      }
    : null
}

export async function completeAudioCreditOperation(input: {
  clerkUserId: string
  operationId: string
  completedDurationSeconds: number
  completedFileCount: number
  now?: Date
}) {
  const now = input.now ?? new Date()
  const sql = getSqlClient()
  const operationRows = (await sql`
    SELECT total_duration_seconds, file_count, status, consumed_credits
    FROM audio_credit_operations
    WHERE id = ${input.operationId}::uuid AND clerk_user_id = ${input.clerkUserId}
    LIMIT 1
  `) as Row[]
  const operation = operationRows[0]
  if (!operation) return null
  if (
    input.completedDurationSeconds < 0 ||
    input.completedDurationSeconds > numberValue(operation.total_duration_seconds) ||
    input.completedFileCount < 0 ||
    input.completedFileCount > numberValue(operation.file_count)
  ) {
    throw new Error("Completed audio work exceeds the reserved operation.")
  }
  const completedCredits = creditsForDuration(input.completedDurationSeconds)
  if (operation.status === "consumed" || operation.status === "released") {
    return {
      status: operation.status as AudioCreditOperationStatus,
      consumedCredits: numberValue(operation.consumed_credits),
      balance: await getAudioCreditBalance(input.clerkUserId, now),
    }
  }

  const rows = (await sql`
    WITH finished AS (
      UPDATE audio_credit_operations
      SET status = ${completedCredits > 0 ? "consumed" : "released"},
        consumed_credits = ${completedCredits},
        consumed_at = ${completedCredits > 0 ? now : null},
        released_at = ${completedCredits > 0 ? null : now},
        updated_at = ${now}
      WHERE id = ${input.operationId}::uuid
        AND clerk_user_id = ${input.clerkUserId}
        AND status IN ('reserved', 'processing')
      RETURNING id, status, consumed_credits
    ), ranked AS (
      SELECT allocation.operation_id, allocation.grant_id, allocation.reserved_credits,
        COALESCE(SUM(allocation.reserved_credits) OVER (
          ORDER BY CASE grant_row.source
            WHEN 'daily_free' THEN 0
            WHEN 'paypal_subscription' THEN 1
            ELSE 2
          END, grant_row.expires_at, grant_row.id
          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
        ), 0)::integer AS credits_before
      FROM audio_credit_allocations allocation
      JOIN audio_credit_grants grant_row ON grant_row.id = allocation.grant_id
      JOIN finished ON finished.id = allocation.operation_id
    ), settled AS (
      UPDATE audio_credit_allocations allocation
      SET consumed_credits = LEAST(
          ranked.reserved_credits,
          GREATEST(${completedCredits} - ranked.credits_before, 0)
        )::integer,
        updated_at = ${now}
      FROM ranked
      WHERE allocation.operation_id = ranked.operation_id
        AND allocation.grant_id = ranked.grant_id
      RETURNING allocation.grant_id, allocation.reserved_credits, allocation.consumed_credits
    ), totals AS (
      SELECT grant_id, SUM(reserved_credits)::integer AS reserved,
        SUM(consumed_credits)::integer AS consumed
      FROM settled GROUP BY grant_id
    ), grants_updated AS (
      UPDATE audio_credit_grants grant_row
      SET reserved_credits = GREATEST(0, grant_row.reserved_credits - totals.reserved),
        consumed_credits = grant_row.consumed_credits + totals.consumed,
        updated_at = ${now}
      FROM totals WHERE grant_row.id = totals.grant_id
      RETURNING grant_row.id
    ), settlement_barrier AS (
      SELECT COUNT(*) FROM grants_updated
    )
    SELECT finished.status, finished.consumed_credits
    FROM finished CROSS JOIN settlement_barrier
  `) as Row[]
  return rows[0]
    ? {
        status: stringValue(rows[0].status) as AudioCreditOperationStatus,
        consumedCredits: numberValue(rows[0].consumed_credits),
        balance: await getAudioCreditBalance(input.clerkUserId, now),
      }
    : null
}

export async function releaseAudioCreditOperation(
  clerkUserId: string,
  operationId: string,
  now = new Date()
) {
  const sql = getSqlClient()
  const rows = (await sql`
    WITH released_operation AS (
      UPDATE audio_credit_operations
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE id = ${operationId}::uuid
        AND clerk_user_id = ${clerkUserId}
        AND status IN ('reserved', 'processing')
      RETURNING id, status
    ), released AS (
      SELECT allocation.grant_id, SUM(allocation.reserved_credits)::integer AS credits
      FROM audio_credit_allocations allocation
      JOIN released_operation ON released_operation.id = allocation.operation_id
      GROUP BY allocation.grant_id
    ), grants_updated AS (
      UPDATE audio_credit_grants grant_row
      SET reserved_credits = GREATEST(0, grant_row.reserved_credits - released.credits),
        updated_at = ${now}
      FROM released WHERE grant_row.id = released.grant_id
      RETURNING grant_row.id
    ), release_barrier AS (
      SELECT COUNT(*) FROM grants_updated
    )
    SELECT released_operation.status
    FROM released_operation CROSS JOIN release_barrier
  `) as Row[]
  if (rows[0]) {
    return {
      status: stringValue(rows[0].status) as AudioCreditOperationStatus,
      balance: await getAudioCreditBalance(clerkUserId, now),
    }
  }
  const existing = (await sql`
    SELECT status FROM audio_credit_operations
    WHERE id = ${operationId}::uuid AND clerk_user_id = ${clerkUserId}
  `) as Row[]
  return existing[0]
    ? {
        status: stringValue(existing[0].status) as AudioCreditOperationStatus,
        balance: await getAudioCreditBalance(clerkUserId, now),
      }
    : null
}

export async function grantSubscriptionCredits(input: {
  clerkUserId: string
  paymentId: string
  startsAt: Date
  expiresAt: Date
}) {
  const sql = getSqlClient()
  await sql`
    INSERT INTO audio_credit_grants (
      clerk_user_id, source, source_ref, granted_credits, starts_at, expires_at
    ) VALUES (
      ${input.clerkUserId}, 'paypal_subscription', ${input.paymentId},
      ${CREDIT_CATALOG.regularMonthly.credits}, ${input.startsAt}, ${input.expiresAt}
    )
    ON CONFLICT (clerk_user_id, source, source_ref) DO NOTHING
  `
}

export async function revokePaidCreditGrant(sourceRef: string, now = new Date()) {
  const sql = getSqlClient()
  const rows = (await sql`
    WITH target_grants AS MATERIALIZED (
      SELECT id
      FROM audio_credit_grants
      WHERE source_ref = ${sourceRef}
        AND source IN ('paypal_order', 'paypal_subscription')
      FOR UPDATE
    ), released_operations AS (
      UPDATE audio_credit_operations operation
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE operation.status IN ('reserved', 'processing')
        AND EXISTS (
          SELECT 1
          FROM audio_credit_allocations allocation
          JOIN target_grants target ON target.id = allocation.grant_id
          WHERE allocation.operation_id = operation.id
        )
      RETURNING operation.id
    ), released AS (
      SELECT allocation.grant_id, SUM(allocation.reserved_credits)::integer AS credits
      FROM audio_credit_allocations allocation
      JOIN released_operations operation ON operation.id = allocation.operation_id
      GROUP BY allocation.grant_id
    ), revoked AS (
      UPDATE audio_credit_grants grant_row
      SET reserved_credits = GREATEST(
          0,
          grant_row.reserved_credits - COALESCE(released.credits, 0)
        ),
        revoked_at = ${now}, expires_at = LEAST(grant_row.expires_at, ${now}),
        updated_at = ${now}
      FROM target_grants target
      LEFT JOIN released ON released.grant_id = target.id
      WHERE grant_row.id = target.id
      RETURNING grant_row.clerk_user_id
    )
    SELECT clerk_user_id FROM revoked
  `) as Row[]
  return rows.map((row) => String(row.clerk_user_id))
}

export async function revokeSubscriptionCreditGrants(
  subscriptionId: string,
  now = new Date()
) {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT provider_payment_id
    FROM billing_payments
    WHERE provider = 'paypal'
      AND provider_subscription_id = ${subscriptionId}
  `) as Row[]
  const revokedUsers = new Set<string>()
  for (const row of rows) {
    const paymentId = stringValue(row.provider_payment_id)
    if (!paymentId) continue
    for (const clerkUserId of await revokePaidCreditGrant(paymentId, now)) {
      revokedUsers.add(clerkUserId)
    }
  }
  return [...revokedUsers]
}
