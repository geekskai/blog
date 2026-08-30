import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { getSqlClient } from "@/lib/db/client"
import {
  completeRegisteredDownload,
  completeVisitorDownload,
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
  const reservationAnonymousId = crypto.randomUUID()
  const completionAnonymousId = crypto.randomUUID()
  const visitorOperationA = crypto.randomUUID()
  const visitorOperationB = crypto.randomUUID()
  const visitorOperationC = crypto.randomUUID()
  const reservationClerkUserId = `quota_integration_${crypto.randomUUID()}`
  const completionClerkUserId = `quota_integration_${crypto.randomUUID()}`
  const registeredOperationA = crypto.randomUUID()
  const registeredOperationB = crypto.randomUUID()
  const registeredOperationC = crypto.randomUUID()

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
      sql`DELETE FROM visitor_download_operations WHERE anonymous_id = ${reservationAnonymousId}::uuid`,
      sql`DELETE FROM visitor_share_unlocks WHERE anonymous_id = ${reservationAnonymousId}::uuid`,
      sql`DELETE FROM visitor_download_usage WHERE anonymous_id = ${reservationAnonymousId}::uuid`,
      sql`DELETE FROM visitor_download_operations WHERE anonymous_id = ${completionAnonymousId}::uuid`,
      sql`DELETE FROM visitor_share_unlocks WHERE anonymous_id = ${completionAnonymousId}::uuid`,
      sql`DELETE FROM visitor_download_usage WHERE anonymous_id = ${completionAnonymousId}::uuid`,
      sql`DELETE FROM download_operations WHERE clerk_user_id = ${reservationClerkUserId}`,
      sql`DELETE FROM daily_download_usage WHERE clerk_user_id = ${reservationClerkUserId}`,
      sql`DELETE FROM download_operations WHERE clerk_user_id = ${completionClerkUserId}`,
      sql`DELETE FROM daily_download_usage WHERE clerk_user_id = ${completionClerkUserId}`,
    ])
  })

  it("keeps a Visitor reservation idempotent and releases its held allowance", async () => {
    const first = await reserveVisitorDownload(
      reservationAnonymousId,
      visitorOperationA,
      "soundcloud-artwork"
    )
    expect(first).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 2, activeReservations: 1 },
    })

    const duplicate = await reserveVisitorDownload(
      reservationAnonymousId,
      visitorOperationA,
      "soundcloud-artwork"
    )
    expect(duplicate).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 2, activeReservations: 1 },
    })

    const concurrent = await reserveVisitorDownload(
      reservationAnonymousId,
      visitorOperationB,
      "soundcloud-track"
    )
    expect(concurrent).toMatchObject({
      outcome: "concurrency_reached",
      quota: { remaining: 2, activeReservations: 1 },
    })

    expect(await releaseVisitorDownload(reservationAnonymousId, visitorOperationA)).toBe("released")
    expect(await getVisitorUsage(reservationAnonymousId)).toMatchObject({
      remaining: 3,
      activeReservations: 0,
    })

    const retry = await reserveVisitorDownload(
      reservationAnonymousId,
      visitorOperationB,
      "soundcloud-track"
    )
    expect(retry).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 2, activeReservations: 1 },
    })
    expect(await releaseVisitorDownload(reservationAnonymousId, visitorOperationB)).toBe("released")
  }, 30_000)

  it("keeps a Registered User reservation idempotent and releases its held allowance", async () => {
    const first = await reserveRegisteredDownload(
      reservationClerkUserId,
      registeredOperationA,
      "youtube-shorts"
    )
    expect(first).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 9, activeReservations: 1 },
    })

    const duplicate = await reserveRegisteredDownload(
      reservationClerkUserId,
      registeredOperationA,
      "youtube-shorts"
    )
    expect(duplicate).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 9, activeReservations: 1 },
    })

    const concurrent = await reserveRegisteredDownload(
      reservationClerkUserId,
      registeredOperationB,
      "youtube-video"
    )
    expect(concurrent).toMatchObject({
      outcome: "concurrency_reached",
      quota: { remaining: 9, activeReservations: 1 },
    })

    expect(await releaseRegisteredDownload(reservationClerkUserId, registeredOperationA)).toBe(
      "released"
    )
    expect(await getRegisteredUsage(reservationClerkUserId)).toMatchObject({
      remaining: 10,
      activeReservations: 0,
    })

    const retry = await reserveRegisteredDownload(
      reservationClerkUserId,
      registeredOperationB,
      "youtube-video"
    )
    expect(retry).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 9, activeReservations: 1 },
    })
    expect(await releaseRegisteredDownload(reservationClerkUserId, registeredOperationB)).toBe(
      "released"
    )
  }, 30_000)

  it("returns the consumed Visitor status and settles its held allowance", async () => {
    const reserved = await reserveVisitorDownload(
      completionAnonymousId,
      visitorOperationC,
      "soundcloud-artwork"
    )
    expect(reserved).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 2, activeReservations: 1 },
    })

    expect(await completeVisitorDownload(completionAnonymousId, visitorOperationC)).toBe("consumed")
    expect(await getVisitorUsage(completionAnonymousId)).toMatchObject({
      remaining: 2,
      successfulDownloads: 1,
      activeReservations: 0,
    })
  }, 30_000)

  it("returns the consumed Registered User status and settles its held allowance", async () => {
    const reserved = await reserveRegisteredDownload(
      completionClerkUserId,
      registeredOperationC,
      "youtube-shorts"
    )
    expect(reserved).toMatchObject({
      outcome: "reserved",
      quota: { remaining: 9, activeReservations: 1 },
    })

    expect(await completeRegisteredDownload(completionClerkUserId, registeredOperationC)).toBe(
      "consumed"
    )
    expect(await getRegisteredUsage(completionClerkUserId)).toMatchObject({
      remaining: 9,
      successfulDownloads: 1,
      activeReservations: 0,
    })
  }, 30_000)
})
