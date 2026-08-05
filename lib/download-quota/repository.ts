import { getSqlClient } from "@/lib/db/client"
import type { QuotaToolId } from "./config"
import {
  getQuotaDay,
  getRegisteredQuotaSummary,
  normalizeVisitorShareCarryover,
  normalizeVisitorUsageCarryover,
  REGISTERED_DAILY_LIMIT,
  SHARE_UNLOCK_AMOUNT,
  type RegisteredQuotaSummary,
} from "./domain"

export type DownloadOperationStatus = "reserved" | "processing" | "consumed" | "released"

export type ReservationResult = {
  outcome: DownloadOperationStatus | "limit_reached"
  quota: RegisteredQuotaSummary
}

export type DownloadOperation = {
  status: DownloadOperationStatus
  toolId: QuotaToolId
  expiresAt: Date
}

type UsageRow = {
  successful_downloads: number | string
  reserved_downloads: number | string
  share_unlocked: boolean
  daily_limit: number | string
}

const RESERVATION_TTL_MINUTES = 5
const PROCESSING_TTL_MINUTES = 15

async function releaseExpiredReservations(clerkUserId: string, quotaDay: string, now: Date) {
  const sql = getSqlClient()
  await sql`
    WITH released AS (
      UPDATE download_operations
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE clerk_user_id = ${clerkUserId}
        AND quota_day = ${quotaDay}
        AND status IN ('reserved', 'processing')
        AND expires_at <= ${now}
      RETURNING quota_day
    ),
    released_count AS (
      SELECT quota_day, COUNT(*)::integer AS count
      FROM released
      GROUP BY quota_day
    )
    UPDATE daily_download_usage usage
    SET
      reserved_downloads = GREATEST(0, reserved_downloads - released_count.count),
      updated_at = ${now}
    FROM released_count
    WHERE usage.clerk_user_id = ${clerkUserId}
      AND usage.quota_day = released_count.quota_day
  `
}

function toSummary(row: UsageRow): RegisteredQuotaSummary {
  const dailyLimit = Number(row.daily_limit) || REGISTERED_DAILY_LIMIT
  const shareUnlocked = Boolean(row.share_unlocked)
  const summary = getRegisteredQuotaSummary({
    successfulDownloads: Number(row.successful_downloads),
    activeReservations: Number(row.reserved_downloads),
    shareUnlocked,
  })

  if (dailyLimit === REGISTERED_DAILY_LIMIT) return summary

  const limit = dailyLimit + (shareUnlocked ? SHARE_UNLOCK_AMOUNT : 0)
  return {
    ...summary,
    limit,
    remaining: Math.max(
      0,
      limit - Number(row.successful_downloads) - Number(row.reserved_downloads)
    ),
  }
}

export async function initializeRegisteredUsage(
  clerkUserId: string,
  visitorUsage: unknown,
  visitorShareUnlocked: unknown,
  visitorShareUsage: unknown,
  now = new Date()
): Promise<RegisteredQuotaSummary> {
  const sql = getSqlClient()
  const quotaDay = getQuotaDay(now)
  const carryover = normalizeVisitorUsageCarryover(visitorUsage)
  const shareCarryover = normalizeVisitorShareCarryover(visitorShareUnlocked, visitorShareUsage)
  const successfulDownloads = carryover + shareCarryover.used

  await sql`
    INSERT INTO daily_download_usage (
      clerk_user_id,
      quota_day,
      successful_downloads,
      visitor_usage_carryover,
      share_unlocked
    ) VALUES (
      ${clerkUserId},
      ${quotaDay},
      ${successfulDownloads},
      ${carryover},
      ${shareCarryover.shareUnlocked}
    )
    ON CONFLICT (clerk_user_id, quota_day) DO NOTHING
  `

  return getRegisteredUsage(clerkUserId, now)
}

export async function getRegisteredUsage(
  clerkUserId: string,
  now = new Date()
): Promise<RegisteredQuotaSummary> {
  const sql = getSqlClient()
  const quotaDay = getQuotaDay(now)

  await sql`
    INSERT INTO daily_download_usage (clerk_user_id, quota_day)
    VALUES (${clerkUserId}, ${quotaDay})
    ON CONFLICT (clerk_user_id, quota_day) DO NOTHING
  `

  await releaseExpiredReservations(clerkUserId, quotaDay, now)

  const rows = (await sql`
    SELECT
      usage.successful_downloads,
      usage.reserved_downloads,
      usage.share_unlocked,
      COALESCE((
        SELECT (entitlement.value #>> '{}')::integer
        FROM account_entitlements entitlement
        WHERE entitlement.clerk_user_id = ${clerkUserId}
          AND entitlement.entitlement_key = 'downloads.daily_limit'
          AND entitlement.effective_at <= ${now}
          AND (entitlement.expires_at IS NULL OR entitlement.expires_at > ${now})
        ORDER BY entitlement.effective_at DESC
        LIMIT 1
      ), ${REGISTERED_DAILY_LIMIT}) AS daily_limit
    FROM daily_download_usage usage
    WHERE usage.clerk_user_id = ${clerkUserId}
      AND usage.quota_day = ${quotaDay}
  `) as UsageRow[]

  return toSummary(rows[0])
}

export async function reserveRegisteredDownload(
  clerkUserId: string,
  operationId: string,
  toolId: QuotaToolId,
  now = new Date()
): Promise<ReservationResult> {
  const sql = getSqlClient()
  const quotaDay = getQuotaDay(now)
  const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MINUTES * 60_000)

  await sql`
    INSERT INTO daily_download_usage (clerk_user_id, quota_day)
    VALUES (${clerkUserId}, ${quotaDay})
    ON CONFLICT (clerk_user_id, quota_day) DO NOTHING
  `

  await releaseExpiredReservations(clerkUserId, quotaDay, now)

  const rows = (await sql`
    WITH attempted AS (
      INSERT INTO download_operations (
        id, clerk_user_id, quota_day, tool_id, status, expires_at
      ) VALUES (
        ${operationId}::uuid,
        ${clerkUserId},
        ${quotaDay},
        ${toolId},
        'released',
        ${expiresAt}
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    ),
    entitlement AS (
      SELECT COALESCE((
        SELECT (value #>> '{}')::integer
        FROM account_entitlements
        WHERE clerk_user_id = ${clerkUserId}
          AND entitlement_key = 'downloads.daily_limit'
          AND effective_at <= ${now}
          AND (expires_at IS NULL OR expires_at > ${now})
        ORDER BY effective_at DESC
        LIMIT 1
      ), ${REGISTERED_DAILY_LIMIT}) AS daily_limit
    ),
    held AS (
      UPDATE daily_download_usage usage
      SET reserved_downloads = reserved_downloads + 1, updated_at = ${now}
      FROM entitlement
      WHERE usage.clerk_user_id = ${clerkUserId}
        AND usage.quota_day = ${quotaDay}
        AND EXISTS (SELECT 1 FROM attempted)
        AND usage.successful_downloads + usage.reserved_downloads <
          entitlement.daily_limit + CASE WHEN usage.share_unlocked THEN ${SHARE_UNLOCK_AMOUNT} ELSE 0 END
      RETURNING usage.clerk_user_id
    ),
    activated AS (
      UPDATE download_operations operation
      SET status = 'reserved', updated_at = ${now}
      WHERE operation.id = ${operationId}::uuid
        AND operation.clerk_user_id = ${clerkUserId}
        AND operation.status = 'released'
        AND EXISTS (SELECT 1 FROM held)
      RETURNING operation.status
    )
    SELECT status FROM activated
  `) as { status: DownloadOperationStatus }[]

  if (!rows[0]) {
    const existing = await getRegisteredDownloadOperation(clerkUserId, operationId)
    const outcome = existing?.status === "released" ? "limit_reached" : existing?.status
    return {
      outcome: outcome ?? "limit_reached",
      quota: await getRegisteredUsage(clerkUserId, now),
    }
  }

  return {
    outcome: rows[0]?.status ?? "limit_reached",
    quota: await getRegisteredUsage(clerkUserId, now),
  }
}

export async function completeRegisteredDownload(
  clerkUserId: string,
  operationId: string,
  now = new Date()
): Promise<DownloadOperationStatus | null> {
  const sql = getSqlClient()

  const rows = (await sql`
    WITH completed AS (
      UPDATE download_operations
      SET status = 'consumed', consumed_at = ${now}, updated_at = ${now}
      WHERE id = ${operationId}::uuid
        AND clerk_user_id = ${clerkUserId}
        AND status IN ('reserved', 'processing')
      RETURNING quota_day
    ),
    incremented AS (
      UPDATE daily_download_usage usage
      SET
        successful_downloads = successful_downloads + 1,
        reserved_downloads = GREATEST(0, reserved_downloads - 1),
        updated_at = ${now}
      FROM completed
      WHERE usage.clerk_user_id = ${clerkUserId}
        AND usage.quota_day = completed.quota_day
      RETURNING usage.clerk_user_id
    )
    SELECT status
    FROM download_operations
    WHERE id = ${operationId}::uuid AND clerk_user_id = ${clerkUserId}
  `) as { status: DownloadOperationStatus }[]

  return rows[0]?.status ?? null
}

export async function getRegisteredDownloadOperation(
  clerkUserId: string,
  operationId: string
): Promise<DownloadOperation | null> {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT status, tool_id, expires_at
    FROM download_operations
    WHERE id = ${operationId}::uuid AND clerk_user_id = ${clerkUserId}
  `) as { status: DownloadOperationStatus; tool_id: QuotaToolId; expires_at: Date }[]

  return rows[0]
    ? { status: rows[0].status, toolId: rows[0].tool_id, expiresAt: rows[0].expires_at }
    : null
}

export async function claimRegisteredDownloadOperation(
  clerkUserId: string,
  operationId: string,
  allowedTools: readonly QuotaToolId[],
  now = new Date()
): Promise<DownloadOperation | null> {
  const sql = getSqlClient()
  const processingExpiresAt = new Date(now.getTime() + PROCESSING_TTL_MINUTES * 60_000)
  const rows = (await sql`
    UPDATE download_operations
    SET status = 'processing', expires_at = ${processingExpiresAt}, updated_at = ${now}
    WHERE id = ${operationId}::uuid
      AND clerk_user_id = ${clerkUserId}
      AND tool_id = ANY(${allowedTools}::text[])
      AND status = 'reserved'
      AND expires_at > ${now}
    RETURNING status, tool_id, expires_at
  `) as { status: DownloadOperationStatus; tool_id: QuotaToolId; expires_at: Date }[]

  return rows[0]
    ? { status: rows[0].status, toolId: rows[0].tool_id, expiresAt: rows[0].expires_at }
    : null
}

export async function releaseRegisteredDownload(
  clerkUserId: string,
  operationId: string,
  now = new Date()
): Promise<DownloadOperationStatus | null> {
  const sql = getSqlClient()
  const rows = (await sql`
    WITH released AS (
      UPDATE download_operations
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE id = ${operationId}::uuid
        AND clerk_user_id = ${clerkUserId}
        AND status IN ('reserved', 'processing')
      RETURNING quota_day, status
    ),
    decremented AS (
      UPDATE daily_download_usage usage
      SET reserved_downloads = GREATEST(0, reserved_downloads - 1), updated_at = ${now}
      FROM released
      WHERE usage.clerk_user_id = ${clerkUserId}
        AND usage.quota_day = released.quota_day
    )
    SELECT status FROM released
  `) as { status: DownloadOperationStatus }[]

  if (rows[0]) return rows[0].status

  const existing = (await sql`
    SELECT status
    FROM download_operations
    WHERE id = ${operationId}::uuid AND clerk_user_id = ${clerkUserId}
  `) as { status: DownloadOperationStatus }[]
  return existing[0]?.status ?? null
}

export async function grantRegisteredShareUnlock(
  clerkUserId: string,
  now = new Date()
): Promise<{ granted: boolean; quota: RegisteredQuotaSummary }> {
  const sql = getSqlClient()
  const quotaDay = getQuotaDay(now)

  await sql`
    INSERT INTO daily_download_usage (clerk_user_id, quota_day)
    VALUES (${clerkUserId}, ${quotaDay})
    ON CONFLICT (clerk_user_id, quota_day) DO NOTHING
  `

  const rows = (await sql`
    UPDATE daily_download_usage
    SET share_unlocked = true, updated_at = ${now}
    WHERE clerk_user_id = ${clerkUserId}
      AND quota_day = ${quotaDay}
      AND share_unlocked = false
    RETURNING clerk_user_id
  `) as { clerk_user_id: string }[]

  return {
    granted: rows.length > 0,
    quota: await getRegisteredUsage(clerkUserId, now),
  }
}
