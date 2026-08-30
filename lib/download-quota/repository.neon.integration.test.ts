import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { getSqlClient } from "@/lib/db/client"
import {
  getRegisteredUsage,
  getVisitorUsage,
  releaseRegisteredDownload,
  releaseVisitorDownload,
  reserveRegisteredDownload,
  reserveVisitorDownload,
} from "./repository"

const runIntegration = process.env.RUN_DOWNLOAD_QUOTA_NEON_INTEGRATION === "true"
const describeNeon = runIntegration ? describe : describe.skip
const productionBranchId = "br-solitary-wind-ay1sjees"

describeNeon("download quota reservations on Neon", () => {
  let verifiedTestBranch = false
  const anonymousId = crypto.randomUUID()
  const visitorOperationA = crypto.randomUUID()
  const visitorOperationB = crypto.randomUUID()
  const clerkUserId = `quota_integration_${crypto.randomUUID()}`
  const registeredOperationA = crypto.randomUUID()
  const registeredOperationB = crypto.randomUUID()

  beforeAll(async () => {
    const databaseUrl = process.env.DOWNLOAD_QUOTA_TEST_DATABASE_URL?.trim()
    const expectedBranchId = process.env.DOWNLOAD_QUOTA_TEST_BRANCH_ID?.trim()
    if (!databaseUrl || !expectedBranchId) {
      throw new Error(
        "DOWNLOAD_QUOTA_TEST_DATABASE_URL and DOWNLOAD_QUOTA_TEST_BRANCH_ID are required"
      )
    }
    if (expectedBranchId === productionBranchId) {
      throw new Error("Download quota integration tests must not run against Production")
    }

    process.env.DATABASE_URL = databaseUrl
    const sql = getSqlClient()
    const rows = (await sql`
      SELECT current_setting('neon.branch_id', true) AS branch_id
    `) as { branch_id: string | null }[]
    if (rows[0]?.branch_id !== expectedBranchId) {
      throw new Error("Connected Neon branch does not match DOWNLOAD_QUOTA_TEST_BRANCH_ID")
    }
    verifiedTestBranch = true
  })

  afterAll(async () => {
    if (!verifiedTestBranch) return
    const sql = getSqlClient()
    await sql.transaction([
      sql`DELETE FROM visitor_download_operations WHERE anonymous_id = ${anonymousId}::uuid`,
      sql`DELETE FROM visitor_share_unlocks WHERE anonymous_id = ${anonymousId}::uuid`,
      sql`DELETE FROM visitor_download_usage WHERE anonymous_id = ${anonymousId}::uuid`,
      sql`DELETE FROM download_operations WHERE clerk_user_id = ${clerkUserId}`,
      sql`DELETE FROM daily_download_usage WHERE clerk_user_id = ${clerkUserId}`,
    ])
  })

  it("keeps a Visitor reservation idempotent and releases its held allowance", async () => {
    const first = await reserveVisitorDownload(anonymousId, visitorOperationA, "soundcloud-artwork")
    expect(first).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 2, activeReservations: 1 },
    })

    const duplicate = await reserveVisitorDownload(
      anonymousId,
      visitorOperationA,
      "soundcloud-artwork"
    )
    expect(duplicate).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 2, activeReservations: 1 },
    })

    const concurrent = await reserveVisitorDownload(
      anonymousId,
      visitorOperationB,
      "soundcloud-track"
    )
    expect(concurrent).toMatchObject({
      outcome: "concurrency_reached",
      quota: { remaining: 2, activeReservations: 1 },
    })

    expect(await releaseVisitorDownload(anonymousId, visitorOperationA)).toBe("released")
    expect(await getVisitorUsage(anonymousId)).toMatchObject({
      remaining: 3,
      activeReservations: 0,
    })

    const retry = await reserveVisitorDownload(anonymousId, visitorOperationB, "soundcloud-track")
    expect(retry).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 2, activeReservations: 1 },
    })
    expect(await releaseVisitorDownload(anonymousId, visitorOperationB)).toBe("released")
  })

  it("keeps a Registered User reservation idempotent and releases its held allowance", async () => {
    const first = await reserveRegisteredDownload(
      clerkUserId,
      registeredOperationA,
      "youtube-shorts"
    )
    expect(first).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 9, activeReservations: 1 },
    })

    const duplicate = await reserveRegisteredDownload(
      clerkUserId,
      registeredOperationA,
      "youtube-shorts"
    )
    expect(duplicate).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 9, activeReservations: 1 },
    })

    const concurrent = await reserveRegisteredDownload(
      clerkUserId,
      registeredOperationB,
      "youtube-video"
    )
    expect(concurrent).toMatchObject({
      outcome: "concurrency_reached",
      quota: { remaining: 9, activeReservations: 1 },
    })

    expect(await releaseRegisteredDownload(clerkUserId, registeredOperationA)).toBe("released")
    expect(await getRegisteredUsage(clerkUserId)).toMatchObject({
      remaining: 10,
      activeReservations: 0,
    })

    const retry = await reserveRegisteredDownload(
      clerkUserId,
      registeredOperationB,
      "youtube-video"
    )
    expect(retry).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 9, activeReservations: 1 },
    })
    expect(await releaseRegisteredDownload(clerkUserId, registeredOperationB)).toBe("released")
  })
})
