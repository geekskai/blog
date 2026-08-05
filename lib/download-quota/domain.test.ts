import { describe, expect, it } from "vitest"
import {
  getQuotaDay,
  getRegisteredQuotaSummary,
  normalizeVisitorShareCarryover,
  normalizeVisitorUsageCarryover,
} from "./domain"

describe("Daily Download Allowance", () => {
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

  it("gives a Registered User 10 base downloads and one five-download Share Unlock", () => {
    expect(
      getRegisteredQuotaSummary({ successfulDownloads: 3, activeReservations: 0, shareUnlocked: false })
    ).toEqual({ limit: 10, remaining: 7, shareUnlockAvailable: true })

    expect(
      getRegisteredQuotaSummary({ successfulDownloads: 10, activeReservations: 0, shareUnlocked: true })
    ).toEqual({ limit: 15, remaining: 5, shareUnlockAvailable: false })
  })

  it("counts active reservations against availability", () => {
    expect(
      getRegisteredQuotaSummary({ successfulDownloads: 8, activeReservations: 2, shareUnlocked: false })
    ).toEqual({ limit: 10, remaining: 0, shareUnlockAvailable: true })
  })
})
