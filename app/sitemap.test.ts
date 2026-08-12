import { describe, expect, it } from "vitest"
import { canonicalStaticRoutes } from "./sitemap-config"

describe("product sitemap", () => {
  it("includes canonical commercial and legal pages", () => {
    expect(canonicalStaticRoutes).toEqual(
      expect.arrayContaining(["pricing/", "audio-toolkit/", "privacy/", "terms/"])
    )
  })
})
