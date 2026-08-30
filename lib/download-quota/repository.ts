import { getSqlClient } from "@/lib/db/client"
import type { QuotaToolId } from "./config"
import {
  getQuotaDay,
  getRegisteredQuotaSummary,
  normalizeVisitorShareCarryover,
  normalizeVisitorUsageCarryover,
  REGISTERED_DAILY_LIMIT,
  SHARE_UNLOCK_AMOUNT,
  VISITOR_DAILY_LIMIT,
  type RegisteredQuotaSummary,
} from "./domain"

export type DownloadOperationStatus = "reserved" | "processing" | "consumed" | "released"

export type ReservationResult = {
  outcome: DownloadOperationStatus | "limit_reached" | "concurrency_reached"
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
  concurrent_limit: number | string
  share_eligible: boolean
}

const RESERVATION_TTL_MINUTES = 5
const PROCESSING_TTL_MINUTES = 15

export async function reconcileRegisteredReservationCounters(now = new Date()) {
  const sql = getSqlClient()
  const rows = (await sql`
    WITH released AS (
      UPDATE download_operations
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE status IN ('reserved', 'processing') AND expires_at <= ${now}
      RETURNING id
    ),
    active AS (
      SELECT clerk_user_id, quota_day, COUNT(*)::integer AS active_count
      FROM download_operations
      WHERE status IN ('reserved', 'processing') AND expires_at > ${now}
      GROUP BY clerk_user_id, quota_day
    ),
    corrected AS (
      UPDATE daily_download_usage usage
      SET reserved_downloads = COALESCE(active.active_count, 0), updated_at = ${now}
      FROM (
        SELECT
          usage_row.clerk_user_id,
          usage_row.quota_day,
          active.active_count
        FROM daily_download_usage usage_row
        LEFT JOIN active
          ON active.clerk_user_id = usage_row.clerk_user_id
          AND active.quota_day = usage_row.quota_day
      ) active
      WHERE usage.clerk_user_id = active.clerk_user_id
        AND usage.quota_day = active.quota_day
        AND usage.reserved_downloads <> COALESCE(active.active_count, 0)
      RETURNING usage.clerk_user_id
    )
    SELECT
      (SELECT COUNT(*)::integer FROM released) AS expired_released,
      (SELECT COUNT(*)::integer FROM corrected) AS counters_corrected
  `) as { expired_released: number | string; counters_corrected: number | string }[]
  return {
    expiredReleased: Number(rows[0]?.expired_released ?? 0),
    countersCorrected: Number(rows[0]?.counters_corrected ?? 0),
  }
}

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
  return getRegisteredQuotaSummary({
    successfulDownloads: Number(row.successful_downloads),
    activeReservations: Number(row.reserved_downloads),
    shareUnlocked: Boolean(row.share_unlocked),
    dailyLimit,
    concurrencyLimit: Number(row.concurrent_limit) || 1,
    shareEligible: Boolean(row.share_eligible),
  })
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
    ON CONFLICT (clerk_user_id, quota_day) DO UPDATE SET
      successful_downloads = GREATEST(
        daily_download_usage.successful_downloads,
        EXCLUDED.successful_downloads
      ),
      visitor_usage_carryover = GREATEST(
        daily_download_usage.visitor_usage_carryover,
        EXCLUDED.visitor_usage_carryover
      ),
      share_unlocked = daily_download_usage.share_unlocked OR EXCLUDED.share_unlocked,
      updated_at = now()
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
      ${REGISTERED_DAILY_LIMIT} AS daily_limit,
      1 AS concurrent_limit,
      true AS share_eligible
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

  const [, rows] = (await sql.transaction((transaction) => [
    transaction`
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
    `,
    transaction`
    WITH entitlement AS (
      SELECT
        ${REGISTERED_DAILY_LIMIT} AS daily_limit,
        1 AS concurrent_limit,
        true AS share_eligible
    ),
    held AS (
      UPDATE daily_download_usage usage
      SET reserved_downloads = reserved_downloads + 1, updated_at = ${now}
      FROM entitlement
      WHERE usage.clerk_user_id = ${clerkUserId}
        AND usage.quota_day = ${quotaDay}
        AND EXISTS (
          SELECT 1
          FROM download_operations operation
          WHERE operation.id = ${operationId}::uuid
            AND operation.clerk_user_id = ${clerkUserId}
            AND operation.status = 'released'
        )
        AND usage.successful_downloads + usage.reserved_downloads <
          entitlement.daily_limit + CASE
            WHEN entitlement.share_eligible AND usage.share_unlocked THEN ${SHARE_UNLOCK_AMOUNT}
            ELSE 0
          END
        AND usage.reserved_downloads < entitlement.concurrent_limit
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
  `,
  ])) as [unknown, { status: DownloadOperationStatus }[]]

  if (!rows[0]) {
    const existing = await getRegisteredDownloadOperation(clerkUserId, operationId)
    const quota = await getRegisteredUsage(clerkUserId, now)
    const outcome =
      existing?.status === "released"
        ? quota.remaining > 0
          ? "concurrency_reached"
          : "limit_reached"
        : existing?.status
    return {
      outcome: outcome ?? "limit_reached",
      quota,
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

export async function grantVisitorShareUnlock(
  anonymousId: string,
  now = new Date()
): Promise<{ granted: boolean; quota: RegisteredQuotaSummary }> {
  const sql = getSqlClient()
  const rows = (await sql`
    INSERT INTO visitor_share_unlocks (anonymous_id, quota_day, created_at)
    VALUES (${anonymousId}::uuid, ${getQuotaDay(now)}, ${now})
    ON CONFLICT (anonymous_id, quota_day) DO NOTHING
    RETURNING anonymous_id
  `) as { anonymous_id: string }[]
  return { granted: rows.length > 0, quota: await getVisitorUsage(anonymousId, now) }
}

type VisitorUsageRow = {
  successful_downloads: number | string
  reserved_downloads: number | string
  share_unlocked: boolean
}

function toVisitorSummary(row: VisitorUsageRow): RegisteredQuotaSummary {
  return getRegisteredQuotaSummary({
    successfulDownloads: Number(row.successful_downloads),
    activeReservations: Number(row.reserved_downloads),
    shareUnlocked: Boolean(row.share_unlocked),
    dailyLimit: VISITOR_DAILY_LIMIT,
    concurrencyLimit: 1,
    shareEligible: true,
  })
}

async function releaseExpiredVisitorReservations(anonymousId: string, quotaDay: string, now: Date) {
  const sql = getSqlClient()
  await sql`
    WITH released AS (
      UPDATE visitor_download_operations
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE anonymous_id = ${anonymousId}::uuid
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
    UPDATE visitor_download_usage usage
    SET
      reserved_downloads = GREATEST(0, reserved_downloads - released_count.count),
      updated_at = ${now}
    FROM released_count
    WHERE usage.anonymous_id = ${anonymousId}::uuid
      AND usage.quota_day = released_count.quota_day
  `
}

export async function initializeVisitorUsage(
  anonymousId: string,
  visitorUsage: unknown,
  now = new Date()
): Promise<RegisteredQuotaSummary> {
  const sql = getSqlClient()
  const quotaDay = getQuotaDay(now)
  const successfulDownloads = normalizeVisitorUsageCarryover(visitorUsage)
  await sql`
    INSERT INTO visitor_download_usage (
      anonymous_id, quota_day, successful_downloads
    ) VALUES (${anonymousId}::uuid, ${quotaDay}, ${successfulDownloads})
    ON CONFLICT (anonymous_id, quota_day) DO NOTHING
  `
  return getVisitorUsage(anonymousId, now)
}

export async function getVisitorUsage(
  anonymousId: string,
  now = new Date()
): Promise<RegisteredQuotaSummary> {
  const sql = getSqlClient()
  const quotaDay = getQuotaDay(now)
  await sql`
    INSERT INTO visitor_download_usage (anonymous_id, quota_day)
    VALUES (${anonymousId}::uuid, ${quotaDay})
    ON CONFLICT (anonymous_id, quota_day) DO NOTHING
  `
  await releaseExpiredVisitorReservations(anonymousId, quotaDay, now)
  const rows = (await sql`
    SELECT
      usage.successful_downloads,
      usage.reserved_downloads,
      EXISTS (
        SELECT 1
        FROM visitor_share_unlocks share
        WHERE share.anonymous_id = ${anonymousId}::uuid
          AND share.quota_day = ${quotaDay}
      ) AS share_unlocked
    FROM visitor_download_usage usage
    WHERE usage.anonymous_id = ${anonymousId}::uuid
      AND usage.quota_day = ${quotaDay}
  `) as VisitorUsageRow[]
  return toVisitorSummary(rows[0])
}

export async function reserveVisitorDownload(
  anonymousId: string,
  operationId: string,
  toolId: QuotaToolId,
  now = new Date()
): Promise<ReservationResult> {
  const sql = getSqlClient()
  const quotaDay = getQuotaDay(now)
  const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MINUTES * 60_000)
  await sql`
    INSERT INTO visitor_download_usage (anonymous_id, quota_day)
    VALUES (${anonymousId}::uuid, ${quotaDay})
    ON CONFLICT (anonymous_id, quota_day) DO NOTHING
  `
  await releaseExpiredVisitorReservations(anonymousId, quotaDay, now)
  const [, rows] = (await sql.transaction((transaction) => [
    transaction`
      INSERT INTO visitor_download_operations (
        id, anonymous_id, quota_day, tool_id, status, expires_at
      ) VALUES (
        ${operationId}::uuid, ${anonymousId}::uuid, ${quotaDay}, ${toolId}, 'released', ${expiresAt}
      )
      ON CONFLICT (id) DO NOTHING
    `,
    transaction`
    WITH held AS (
      UPDATE visitor_download_usage usage
      SET reserved_downloads = reserved_downloads + 1, updated_at = ${now}
      WHERE usage.anonymous_id = ${anonymousId}::uuid
        AND usage.quota_day = ${quotaDay}
        AND EXISTS (
          SELECT 1
          FROM visitor_download_operations operation
          WHERE operation.id = ${operationId}::uuid
            AND operation.anonymous_id = ${anonymousId}::uuid
            AND operation.status = 'released'
        )
        AND usage.successful_downloads + usage.reserved_downloads <
          ${VISITOR_DAILY_LIMIT} + CASE WHEN EXISTS (
            SELECT 1 FROM visitor_share_unlocks share
            WHERE share.anonymous_id = ${anonymousId}::uuid
              AND share.quota_day = ${quotaDay}
          ) THEN ${SHARE_UNLOCK_AMOUNT} ELSE 0 END
        AND usage.reserved_downloads < 1
      RETURNING usage.anonymous_id
    ),
    activated AS (
      UPDATE visitor_download_operations operation
      SET status = 'reserved', updated_at = ${now}
      WHERE operation.id = ${operationId}::uuid
        AND operation.anonymous_id = ${anonymousId}::uuid
        AND operation.status = 'released'
        AND EXISTS (SELECT 1 FROM held)
      RETURNING operation.status
    )
    SELECT status FROM activated
  `,
  ])) as [unknown, { status: DownloadOperationStatus }[]]

  if (!rows[0]) {
    const existing = await getVisitorDownloadOperation(anonymousId, operationId)
    const quota = await getVisitorUsage(anonymousId, now)
    return {
      outcome:
        existing?.status === "released"
          ? quota.remaining > 0
            ? "concurrency_reached"
            : "limit_reached"
          : (existing?.status ?? "limit_reached"),
      quota,
    }
  }
  return { outcome: rows[0].status, quota: await getVisitorUsage(anonymousId, now) }
}

export async function completeVisitorDownload(
  anonymousId: string,
  operationId: string,
  now = new Date()
): Promise<DownloadOperationStatus | null> {
  const sql = getSqlClient()
  const rows = (await sql`
    WITH completed AS (
      UPDATE visitor_download_operations
      SET status = 'consumed', consumed_at = ${now}, updated_at = ${now}
      WHERE id = ${operationId}::uuid
        AND anonymous_id = ${anonymousId}::uuid
        AND status IN ('reserved', 'processing')
      RETURNING quota_day
    ),
    incremented AS (
      UPDATE visitor_download_usage usage
      SET
        successful_downloads = successful_downloads + 1,
        reserved_downloads = GREATEST(0, reserved_downloads - 1),
        updated_at = ${now}
      FROM completed
      WHERE usage.anonymous_id = ${anonymousId}::uuid
        AND usage.quota_day = completed.quota_day
      RETURNING usage.anonymous_id
    )
    SELECT status
    FROM visitor_download_operations
    WHERE id = ${operationId}::uuid AND anonymous_id = ${anonymousId}::uuid
  `) as { status: DownloadOperationStatus }[]
  return rows[0]?.status ?? null
}

export async function getVisitorDownloadOperation(
  anonymousId: string,
  operationId: string
): Promise<DownloadOperation | null> {
  const sql = getSqlClient()
  const rows = (await sql`
    SELECT status, tool_id, expires_at
    FROM visitor_download_operations
    WHERE id = ${operationId}::uuid AND anonymous_id = ${anonymousId}::uuid
  `) as { status: DownloadOperationStatus; tool_id: QuotaToolId; expires_at: Date }[]
  return rows[0]
    ? { status: rows[0].status, toolId: rows[0].tool_id, expiresAt: rows[0].expires_at }
    : null
}

export async function claimVisitorDownloadOperation(
  anonymousId: string,
  operationId: string,
  allowedTools: readonly QuotaToolId[],
  now = new Date()
): Promise<DownloadOperation | null> {
  const sql = getSqlClient()
  const processingExpiresAt = new Date(now.getTime() + PROCESSING_TTL_MINUTES * 60_000)
  const rows = (await sql`
    UPDATE visitor_download_operations
    SET status = 'processing', expires_at = ${processingExpiresAt}, updated_at = ${now}
    WHERE id = ${operationId}::uuid
      AND anonymous_id = ${anonymousId}::uuid
      AND tool_id = ANY(${allowedTools}::text[])
      AND status = 'reserved'
      AND expires_at > ${now}
    RETURNING status, tool_id, expires_at
  `) as { status: DownloadOperationStatus; tool_id: QuotaToolId; expires_at: Date }[]
  return rows[0]
    ? { status: rows[0].status, toolId: rows[0].tool_id, expiresAt: rows[0].expires_at }
    : null
}

export async function releaseVisitorDownload(
  anonymousId: string,
  operationId: string,
  now = new Date()
): Promise<DownloadOperationStatus | null> {
  const sql = getSqlClient()
  const rows = (await sql`
    WITH released AS (
      UPDATE visitor_download_operations
      SET status = 'released', released_at = ${now}, updated_at = ${now}
      WHERE id = ${operationId}::uuid
        AND anonymous_id = ${anonymousId}::uuid
        AND status IN ('reserved', 'processing')
      RETURNING quota_day
    ),
    decremented AS (
      UPDATE visitor_download_usage usage
      SET reserved_downloads = GREATEST(0, reserved_downloads - 1), updated_at = ${now}
      FROM released
      WHERE usage.anonymous_id = ${anonymousId}::uuid
        AND usage.quota_day = released.quota_day
      RETURNING usage.anonymous_id
    )
    SELECT status
    FROM visitor_download_operations
    WHERE id = ${operationId}::uuid AND anonymous_id = ${anonymousId}::uuid
  `) as { status: DownloadOperationStatus }[]
  return rows[0]?.status ?? null
}
