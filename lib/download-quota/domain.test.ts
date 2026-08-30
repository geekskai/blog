import { describe, expect, it } from "vitest"
import {
  getQuotaDay,
  getRegisteredQuotaSummary,
  growthExperimentsEnabled,
  mergeVisitorUsageCarryover,
  normalizeVisitorShareCarryover,
  normalizeVisitorUsageCarryover,
} from "./domain"

describe("Daily Download Allowance", () => {
  it("keeps growth experiments disabled outside trusted server mode", () => {
    expect(growthExperimentsEnabled("pending")).toBe(false)
    expect(growthExperimentsEnabled("local")).toBe(false)
    expect(growthExperimentsEnabled("server")).toBe(true)
  })

  it("uses the UTC calendar day", () => {
    expect(getQuotaDay(new Date("2026-08-05T23:59:59.999Z"))).toBe("2026-08-05")
    expect(getQuotaDay(new Date("2026-08-06T00:00:00.000Z"))).toBe("2026-08-06")
  })

  it("carries visitor usage into registration without trusting values outside 0 through 3", () => {
    expect(normalizeVisitorUsageCarryover(-1)).toBe(0)
    expect(normalizeVisitorUsageCarryover(2)).toBe(2)
    expect(normalizeVisitorUsageCarryover(99)).toBe(3)
  })

  it("preserves a used Visitor Share Unlock while clamping its consumed downloads", () => {
    expect(normalizeVisitorShareCarryover(false, 4)).toEqual({ shareUnlocked: false, used: 0 })
    expect(normalizeVisitorShareCarryover(true, -1)).toEqual({ shareUnlocked: true, used: 0 })
    expect(normalizeVisitorShareCarryover(true, 99)).toEqual({ shareUnlocked: true, used: 5 })
  })

  it("prefers trusted server visitor usage while preserving a newer local fallback", () => {
    expect(
      mergeVisitorUsageCarryover({
        clientUsage: 0,
        clientShareUnlocked: false,
        clientShareUsage: 0,
        serverSuccessfulDownloads: 8,
        serverShareUnlocked: true,
      })
    ).toEqual({
      visitorUsage: 3,
      visitorShareUnlocked: true,
      visitorShareUsage: 5,
    })

    expect(
      mergeVisitorUsageCarryover({
        clientUsage: 3,
        clientShareUnlocked: true,
        clientShareUsage: 2,
        serverSuccessfulDownloads: 1,
        serverShareUnlocked: false,
      })
    ).toEqual({
      visitorUsage: 3,
      visitorShareUnlocked: true,
      visitorShareUsage: 2,
    })
  })

  it("gives a Registered User 10 base downloads and one five-download Share Unlock", () => {
    expect(
      getRegisteredQuotaSummary({
        successfulDownloads: 3,
        activeReservations: 0,
        shareUnlocked: false,
      })
    ).toEqual({
      limit: 10,
      remaining: 7,
      successfulDownloads: 3,
      activeReservations: 0,
      concurrencyLimit: 1,
      shareUnlockAvailable: true,
    })

    expect(
      getRegisteredQuotaSummary({
        successfulDownloads: 10,
        activeReservations: 0,
        shareUnlocked: true,
      })
    ).toEqual({
      limit: 15,
      remaining: 5,
      successfulDownloads: 10,
      activeReservations: 0,
      concurrencyLimit: 1,
      shareUnlockAvailable: false,
    })
  })

  it("counts active reservations against availability", () => {
    expect(
      getRegisteredQuotaSummary({
        successfulDownloads: 8,
        activeReservations: 2,
        shareUnlocked: false,
      })
    ).toEqual({
      limit: 10,
      remaining: 0,
      successfulDownloads: 8,
      activeReservations: 2,
      concurrencyLimit: 1,
      shareUnlockAvailable: true,
    })
  })

  it("uses paid limits without offering a share reward", () => {
    expect(
      getRegisteredQuotaSummary({
        successfulDownloads: 40,
        activeReservations: 2,
        shareUnlocked: false,
        dailyLimit: 50,
        concurrencyLimit: 2,
        shareEligible: false,
      })
    ).toEqual({
      limit: 50,
      remaining: 8,
      successfulDownloads: 40,
      activeReservations: 2,
      concurrencyLimit: 2,
      shareUnlockAvailable: false,
    })
  })
})
