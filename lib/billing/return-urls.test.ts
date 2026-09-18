import { describe, expect, it } from "vitest"
import { getBillingReturnOrigin, getPayPalOrderReturnUrls } from "./return-urls"

describe("trusted billing return URLs", () => {
  it("uses the Vercel branch URL for preview PayPal returns", () => {
    expect(
      getPayPalOrderReturnUrls("de", {
        VERCEL_ENV: "preview",
        VERCEL_BRANCH_URL: "codex-paypal-sandbox.example.vercel.app",
      })
    ).toEqual({
      returnUrl:
        "https://codex-paypal-sandbox.example.vercel.app/de/pricing/?checkout=payg&paypal_return=1",
      cancelUrl:
        "https://codex-paypal-sandbox.example.vercel.app/de/pricing/?checkout=payg&paypal_cancel=1",
    })
  })

  it("falls back to the default locale and production origin", () => {
    expect(getPayPalOrderReturnUrls("unknown", { NODE_ENV: "production" })).toEqual({
      returnUrl: "https://geekskai.com/pricing/?checkout=payg&paypal_return=1",
      cancelUrl: "https://geekskai.com/pricing/?checkout=payg&paypal_cancel=1",
    })
  })

  it("rejects configured origins containing paths or non-HTTPS deployment URLs", () => {
    expect(() =>
      getBillingReturnOrigin({
        NODE_ENV: "production",
        BILLING_RETURN_ORIGIN: "https://example.com/redirect",
      })
    ).toThrow("trusted origin")
    expect(() =>
      getBillingReturnOrigin({ VERCEL_ENV: "preview", VERCEL_URL: "http://example.com" })
    ).toThrow("HTTPS")
  })
})
