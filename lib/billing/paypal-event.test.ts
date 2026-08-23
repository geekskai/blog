import { describe, expect, it } from "vitest"
import { classifyPayPalRefund, normalizePayPalEvent } from "./paypal-event"

describe("PayPal event normalization", () => {
  it("extracts the approved plan and opaque correlation from a subscription event", () => {
    const event = normalizePayPalEvent({
      id: "WH-activated",
      event_type: "BILLING.SUBSCRIPTION.ACTIVATED",
      create_time: "2026-08-23T08:00:00Z",
      resource: {
        id: "I-subscription",
        plan_id: "P-basic-monthly",
        custom_id: "5d032557-e219-4a39-aeb1-7699e77f4cc3",
        status: "ACTIVE",
        subscriber: { payer_id: "PAYER-1" },
        billing_info: { next_billing_time: "2026-09-23T08:00:00Z" },
      },
    })

    expect(event).toMatchObject({
      id: "WH-activated",
      eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
      subscriptionId: "I-subscription",
      planId: "P-basic-monthly",
      correlationId: "5d032557-e219-4a39-aeb1-7699e77f4cc3",
      payerId: "PAYER-1",
      status: "ACTIVE",
      currentPeriodEnd: new Date("2026-09-23T08:00:00Z"),
    })
  })

  it("links completed sales and disputes without inventing a subscription", () => {
    expect(
      normalizePayPalEvent({
        id: "WH-sale",
        event_type: "PAYMENT.SALE.COMPLETED",
        resource: { id: "SALE-1", billing_agreement_id: "I-subscription" },
      })
    ).toMatchObject({ saleId: "SALE-1", subscriptionId: "I-subscription" })

    expect(
      normalizePayPalEvent({
        id: "WH-dispute",
        event_type: "CUSTOMER.DISPUTE.CREATED",
        resource: {
          dispute_id: "PP-D-1",
          disputed_transactions: [{ seller_transaction_id: "SALE-1" }],
        },
      })
    ).toMatchObject({ saleId: "SALE-1", subscriptionId: null })
  })

  it("rejects events without a stable PayPal event identity", () => {
    expect(() => normalizePayPalEvent({ event_type: "BILLING.SUBSCRIPTION.ACTIVATED" })).toThrow(
      "Invalid PayPal webhook event."
    )
  })
})

describe("PayPal refund classification", () => {
  it("recognizes a full refund from PayPal state or independently matching totals", () => {
    expect(classifyPayPalRefund({}, { state: "refunded" })).toBe("full")
    expect(
      classifyPayPalRefund(
        { amount: { total: "10.00", currency: "USD" } },
        { state: "partially_refunded", amount: { total: "10.00", currency: "USD" } }
      )
    ).toBe("full")
  })

  it("keeps partial or ambiguous refunds for manual review", () => {
    expect(
      classifyPayPalRefund(
        { amount: { total: "4.00", currency: "USD" } },
        { state: "partially_refunded", amount: { total: "10.00", currency: "USD" } }
      )
    ).toBe("partial")
    expect(classifyPayPalRefund({}, {})).toBe("partial")
  })
})
