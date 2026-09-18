/** @vitest-environment jsdom */

import { act, createElement, type ReactNode } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  oneTimePaymentButton: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({ useAuth: mocks.useAuth }))
vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode }) => createElement("a", props, children),
}))
vi.mock("@/lib/analytics/clarity", () => ({ trackClarityEvent: vi.fn() }))
vi.mock("@paypal/react-paypal-js/sdk-v6", () => ({
  INSTANCE_LOADING_STATE: {
    PENDING: "pending",
    REJECTED: "rejected",
    RESOLVED: "resolved",
  },
  PayPalProvider: ({ children }: { children: ReactNode }) => children,
  PayPalOneTimePaymentButton: (props: Record<string, unknown>) => {
    mocks.oneTimePaymentButton(props)
    return createElement("button", { type: "button" }, "PayPal")
  },
  PayPalSubscriptionButton: () => createElement("button", { type: "button" }, "Subscribe"),
  usePayPal: () => ({ loadingStatus: "resolved", error: null }),
}))

import PricingActions from "./PricingActions"

describe("PricingActions PayPal redirect recovery", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
    window.sessionStorage.clear()
    window.history.replaceState({}, "", "/pricing/")
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true })
    mocks.oneTimePaymentButton.mockReset()
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ total: 0 }))
    )
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    })
    Element.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    window.sessionStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("remounts the PAYG session with the original order after PayPal redirects back", async () => {
    window.sessionStorage.setItem("geekskai.paypal.pending-order.v1", "ORDER-RETURNED")
    window.history.replaceState({}, "", "/pricing/?checkout=payg&paypal_return=1")

    await act(async () => {
      root.render(
        createElement(PricingActions, {
          locale: "en",
          checkoutEnabled: true,
          clientId: "sandbox-client-id",
          environment: "sandbox",
        })
      )
    })

    expect(mocks.oneTimePaymentButton).toHaveBeenCalled()
    expect(mocks.oneTimePaymentButton.mock.lastCall?.[0]).toMatchObject({
      orderId: "ORDER-RETURNED",
      presentationMode: "redirect",
    })
  })
})
