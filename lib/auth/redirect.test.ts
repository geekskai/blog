import { describe, expect, it } from "vitest"
import { authUrlWithRedirect, quotaRegistrationReturnUrl, safeLocalRedirectUrl } from "./redirect"

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

  it("preserves the tool URL while adding the quota return marker", () => {
    expect(
      quotaRegistrationReturnUrl({
        pathname: "/tools/example/",
        search: "?format=mp3",
        hash: "#download",
      })
    ).toBe("/tools/example/?format=mp3&quota_return=1#download")
  })

  it("carries the return target between authentication pages", () => {
    expect(authUrlWithRedirect("/sign-in/", "/tools/example/?quota_return=1")).toBe(
      "/sign-in/?redirect_url=%2Ftools%2Fexample%2F%3Fquota_return%3D1"
    )
  })
})
