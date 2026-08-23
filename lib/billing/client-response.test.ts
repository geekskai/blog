import { describe, expect, it } from "vitest"
import { readBillingJson } from "./client-response"

describe("billing client responses", () => {
  it("reads JSON API responses", async () => {
    await expect(
      readBillingJson<{ error: string }>(Response.json({ error: "Checkout is unavailable." }))
    ).resolves.toEqual({ error: "Checkout is unavailable." })
  })

  it("does not expose an HTML gateway response as a JSON parsing error", async () => {
    await expect(
      readBillingJson<{ error: string }>(
        new Response("<!DOCTYPE html><title>Bad gateway</title>", {
          status: 502,
          headers: { "content-type": "text/html" },
        })
      )
    ).resolves.toBeNull()
  })
})
