import { beforeEach, describe, expect, it, vi } from "vitest"

const capturedQueries: string[] = []

vi.mock("@/lib/db/client", () => ({
  getSqlClient: () => async (strings: TemplateStringsArray) => {
    capturedQueries.push(strings.join("?"))
    return []
  },
}))

import { purgeExpiredGrowthData } from "./events"

describe("growth event retention", () => {
  beforeEach(() => capturedQueries.splice(0))

  it("lets an expiring gate match signup and download events on the live side of the cutoff", async () => {
    await purgeExpiredGrowthData(new Date("2026-08-05T12:00:00.000Z"))

    const aggregationQuery = capturedQueries[0]
    expect(aggregationQuery).toContain("FROM eligible gate")
    expect(aggregationQuery).toContain("JOIN growth_events signup")
    expect(aggregationQuery).toContain("JOIN growth_events download")
    expect(aggregationQuery).not.toContain("JOIN eligible signup")
    expect(aggregationQuery).not.toContain("JOIN eligible download")
  })
})
