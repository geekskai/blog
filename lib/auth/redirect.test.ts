import { describe, expect, it } from "vitest"
import { safeLocalRedirectUrl } from "./redirect"

describe("registration return redirect", () => {
  it("keeps a local tool route and its non-sensitive marker", () => {
    expect(safeLocalRedirectUrl("/en/tools/example/?quota_return=1")).toBe(
      "/en/tools/example/?quota_return=1"
    )
  })

  it("rejects absolute, protocol-relative, and backslash redirects", () => {
    expect(safeLocalRedirectUrl("https://evil.example/path")).toBe("/audio-toolkit/")
    expect(safeLocalRedirectUrl("//evil.example/path")).toBe("/audio-toolkit/")
    expect(safeLocalRedirectUrl("/\\evil.example/path")).toBe("/audio-toolkit/")
  })
})
