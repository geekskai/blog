import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))
vi.mock("@/lib/db/client", () => ({ getSqlClient: vi.fn() }))
vi.mock("@/lib/audio-credits/repository", () => ({ getAudioCreditBalance: vi.fn() }))

import {
  isExpectedPaygOrder,
  isExpectedPayPalOrder,
  isPaygOrderCapturable,
  parseCompletedPayPalCapture,
  readPayPalOrderStatus,
} from "./orders"

describe("PayPal PAYG capture validation", () => {
  const resource = {
    id: "ORDER-1",
    purchase_units: [
      {
        custom_id: "f5703a0e-60e2-4eed-92ad-1c165a312b39",
        payments: {
          captures: [
            {
              id: "CAPTURE-1",
              status: "COMPLETED",
              update_time: "2026-08-24T03:04:05Z",
              amount: { value: "14.00", currency_code: "USD" },
            },
          ],
        },
      },
    ],
  }

  it("accepts only the exact completed 480-Credit product capture", () => {
    expect(
      parseCompletedPayPalCapture(resource, {
        localOrderId: "f5703a0e-60e2-4eed-92ad-1c165a312b39",
        providerOrderId: "ORDER-1",
      })
    ).toEqual({
      captureId: "CAPTURE-1",
      orderId: "ORDER-1",
      status: "COMPLETED",
      capturedAt: new Date("2026-08-24T03:04:05Z"),
    })
  })

  it("rejects amount, currency, order, or opaque correlation mismatches", () => {
    const changedAmount = structuredClone(resource)
    changedAmount.purchase_units[0].payments.captures[0].amount.value = "13.99"
    expect(() =>
      parseCompletedPayPalCapture(changedAmount, {
        localOrderId: "f5703a0e-60e2-4eed-92ad-1c165a312b39",
        providerOrderId: "ORDER-1",
      })
    ).toThrow("does not match")
    expect(() =>
      parseCompletedPayPalCapture(resource, {
        localOrderId: "different-order",
        providerOrderId: "ORDER-1",
      })
    ).toThrow("does not match")
  })

  it("allows only unexpired CREATED orders to reach PayPal capture", () => {
    const now = new Date("2026-08-26T12:00:00Z")
    const expectedOrder = {
      product_key: "audio_credits_payg_480",
      amount_minor: 1400,
      currency: "USD",
    }
    expect(
      isPaygOrderCapturable(
        {
          ...expectedOrder,
          status: "CREATED",
          expires_at: new Date("2026-08-26T12:01:00Z"),
        },
        now
      )
    ).toBe(true)
    expect(
      isPaygOrderCapturable(
        {
          ...expectedOrder,
          status: "CREATED",
          expires_at: new Date("2026-08-26T11:59:00Z"),
        },
        now
      )
    ).toBe(false)
    expect(
      isPaygOrderCapturable(
        {
          ...expectedOrder,
          status: "COMPLETED",
          expires_at: new Date("2026-08-26T12:01:00Z"),
        },
        now
      )
    ).toBe(false)
  })

  it("rejects a locally mismatched product before contacting PayPal capture", () => {
    expect(
      isExpectedPaygOrder({
        product_key: "audio_credits_payg_480",
        amount_minor: 1400,
        currency: "USD",
      })
    ).toBe(true)
    expect(
      isExpectedPaygOrder({
        product_key: "audio_credits_payg_480",
        amount_minor: 140000,
        currency: "USD",
      })
    ).toBe(false)
  })

  it("rejects a provider order mismatch before capture", () => {
    expect(
      isExpectedPayPalOrder(
        {
          id: "ORDER-1",
          purchase_units: [
            {
              custom_id: "f5703a0e-60e2-4eed-92ad-1c165a312b39",
              amount: { value: "14.00", currency_code: "USD" },
            },
          ],
        },
        {
          localOrderId: "f5703a0e-60e2-4eed-92ad-1c165a312b39",
          providerOrderId: "ORDER-1",
        }
      )
    ).toBe(true)
    expect(
      isExpectedPayPalOrder(
        {
          id: "ORDER-1",
          purchase_units: [
            {
              custom_id: "f5703a0e-60e2-4eed-92ad-1c165a312b39",
              amount: { value: "1400.00", currency_code: "USD" },
            },
          ],
        },
        {
          localOrderId: "f5703a0e-60e2-4eed-92ad-1c165a312b39",
          providerOrderId: "ORDER-1",
        }
      )
    ).toBe(false)
  })

  it("normalizes PayPal order statuses used by the capture state machine", () => {
    expect(readPayPalOrderStatus({ status: "approved" })).toBe("APPROVED")
    expect(readPayPalOrderStatus({})).toBeNull()
  })
})
