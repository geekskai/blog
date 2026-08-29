import { describe, expect, it } from "vitest"
import { getChromeSurface, normalizeChromePath } from "./surface"

describe("normalizeChromePath", () => {
  it("strips locale prefixes and query strings", () => {
    expect(normalizeChromePath("/zh-cn/audio-toolkit/?x=1")).toBe("/audio-toolkit/")
    expect(normalizeChromePath("en/sign-in")).toBe("/sign-in/")
  })

  it("keeps the site root as a slash", () => {
    expect(normalizeChromePath("/")).toBe("/")
    expect(normalizeChromePath("/en/")).toBe("/")
  })
})

describe("getChromeSurface", () => {
  it("treats toolkit and account routes as workspace", () => {
    expect(getChromeSurface("/audio-toolkit/")).toBe("workspace")
    expect(getChromeSurface("/ja/account/billing/")).toBe("workspace")
    expect(getChromeSurface("/account/")).toBe("workspace")
  })

  it("treats authentication routes as auth chrome", () => {
    expect(getChromeSurface("/sign-in/")).toBe("auth")
    expect(getChromeSurface("/sign-up/?redirect_url=%2Ftools%2F")).toBe("auth")
  })

  it("keeps pricing, legal, blog, and tools on acquisition chrome", () => {
    expect(getChromeSurface("/pricing/")).toBe("acquisition")
    expect(getChromeSurface("/terms/")).toBe("acquisition")
    expect(getChromeSurface("/privacy/")).toBe("acquisition")
    expect(getChromeSurface("/blog/css/how-to-change-css-of-primevue/")).toBe("acquisition")
    expect(getChromeSurface("/tools/discord-time-converter/")).toBe("acquisition")
    expect(getChromeSurface("/")).toBe("acquisition")
  })
})
