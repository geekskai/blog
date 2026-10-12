import { describe, expect, it } from "vitest"
import { getPaginationHref } from "./pagination"

describe("blog pagination links", () => {
  it("uses the canonical blog root for the first page", () => {
    expect(getPaginationHref("blog", 1)).toBe("/blog/")
  })

  it("uses page paths for subsequent pages", () => {
    expect(getPaginationHref("blog", 2)).toBe("/blog/page/2")
    expect(getPaginationHref("blog", 18)).toBe("/blog/page/18")
  })
})
