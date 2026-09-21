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
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true, userId: "user_a" })
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
    vi.useRealTimers()
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

  it("confirms the original order even when the PayPal SDK never reports a restored session", async () => {
    window.sessionStorage.setItem("geekskai.paypal.pending-order.v1", "ORDER-RETURNED")
    window.history.replaceState({}, "", "/pricing/?checkout=payg&paypal_return=1")
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes("/capture/")) {
        return Response.json(
          {
            ok: false,
            code: "result_unknown",
            error: "Payment status is not yet confirmed.",
          },
          { status: 502 }
        )
      }
      return Response.json({ total: 0 })
    })
    vi.stubGlobal("fetch", fetchMock)

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
    await act(async () => undefined)

    expect(
      fetchMock.mock.calls.filter(([input]) => String(input).includes("/capture/"))
    ).toHaveLength(1)
    expect(container.textContent).toContain("Retry payment confirmation")
  })

  it("times out confirmation without discarding the original order", async () => {
    vi.useFakeTimers()
    window.sessionStorage.setItem("geekskai.paypal.pending-order.v1", "ORDER-TIMEOUT")
    window.history.replaceState({}, "", "/pricing/?checkout=payg&paypal_return=1")
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      if (!String(input).includes("/capture/")) return Promise.resolve(Response.json({ total: 0 }))
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"))
        })
      })
    })
    vi.stubGlobal("fetch", fetchMock)

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
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })

    expect(container.textContent).toContain("Payment confirmation timed out")
    expect(container.textContent).toContain("Retry payment confirmation")
    expect(window.sessionStorage.getItem("geekskai.paypal.pending-order.v1")).toBe(
      "ORDER-TIMEOUT"
    )
  })

  it("does not create a replacement order when the return has no pending order", async () => {
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

    expect(container.textContent).toContain("could not restore the PayPal order")
    expect(container.textContent).toContain("Start a new purchase for this account")
    expect(mocks.oneTimePaymentButton).not.toHaveBeenCalled()
  })

  it("deduplicates the SDK approval callback against automatic return confirmation", async () => {
    window.sessionStorage.setItem("geekskai.paypal.pending-order.v1", "ORDER-CONCURRENT")
    window.history.replaceState({}, "", "/pricing/?checkout=payg&paypal_return=1")
    let finishCapture: ((response: Response) => void) | null = null
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      if (!String(input).includes("/capture/")) return Promise.resolve(Response.json({ total: 0 }))
      return new Promise<Response>((resolve) => {
        finishCapture = resolve
      })
    })
    vi.stubGlobal("fetch", fetchMock)

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
    const onApprove = mocks.oneTimePaymentButton.mock.lastCall?.[0]?.onApprove as
      | ((input: { orderId: string }) => Promise<void>)
      | undefined
    await act(async () => {
      void onApprove?.({ orderId: "ORDER-CONCURRENT" }).catch(() => undefined)
    })

    expect(
      fetchMock.mock.calls.filter(([input]) => String(input).includes("/capture/"))
    ).toHaveLength(1)

    await act(async () => {
      finishCapture?.(
        Response.json(
          { ok: false, code: "result_unknown", error: "Payment status is not yet confirmed." },
          { status: 502 }
        )
      )
    })
  })

  it("keeps pending orders isolated when the signed-in account changes", async () => {
    window.history.replaceState({}, "", "/pricing/?checkout=payg")
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).endsWith("/api/billing/orders/")) {
        return Response.json({ orderId: "ORDER-A" })
      }
      return Response.json({ total: 0 })
    })
    vi.stubGlobal("fetch", fetchMock)

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
    const createOrderForA = mocks.oneTimePaymentButton.mock.lastCall?.[0]?.createOrder as
      | (() => Promise<{ orderId: string }>)
      | undefined
    await act(async () => {
      await createOrderForA?.()
    })

    await act(async () => root.unmount())
    root = createRoot(container)
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true, userId: "user_b" })
    mocks.oneTimePaymentButton.mockClear()
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

    expect(mocks.oneTimePaymentButton.mock.lastCall?.[0]).toHaveProperty("createOrder")
    expect(mocks.oneTimePaymentButton.mock.lastCall?.[0]).not.toHaveProperty("orderId")

    await act(async () => root.unmount())
    root = createRoot(container)
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true, userId: "user_a" })
    mocks.oneTimePaymentButton.mockClear()
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

    expect(mocks.oneTimePaymentButton.mock.lastCall?.[0]).toMatchObject({ orderId: "ORDER-A" })
  })

  it("dismisses an unowned legacy order only for the current account", async () => {
    window.sessionStorage.setItem("geekskai.paypal.pending-order.v1", "ORDER-LEGACY-A")
    window.history.replaceState({}, "", "/pricing/?checkout=payg")
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true, userId: "user_b" })
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).includes("/capture/")) {
        return Response.json(
          {
            ok: false,
            code: "order_not_found",
            error: "Sign in with the account that started this PayPal purchase.",
          },
          { status: 404 }
        )
      }
      return Response.json({ total: 0 })
    })
    vi.stubGlobal("fetch", fetchMock)

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
    await act(async () => undefined)
    expect(container.textContent).toContain("Use the account that started this purchase")

    await act(async () => root.unmount())
    root = createRoot(container)
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true, userId: "user_a" })
    mocks.oneTimePaymentButton.mockClear()
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

    expect(mocks.oneTimePaymentButton.mock.lastCall?.[0]).toMatchObject({
      orderId: "ORDER-LEGACY-A",
    })
  })

  it("ignores a late response from the previous account", async () => {
    window.history.replaceState({}, "", "/pricing/?checkout=payg")
    let resolveCapture: ((response: Response) => void) | null = null
    let createdOrders = 0
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith("/api/billing/orders/")) {
        createdOrders += 1
        return Promise.resolve(Response.json({ orderId: createdOrders === 1 ? "ORDER-A" : "ORDER-B" }))
      }
      if (url.includes("/capture/")) {
        return new Promise<Response>((resolve) => {
          resolveCapture = resolve
        })
      }
      return Promise.resolve(Response.json({ total: 0 }))
    })
    vi.stubGlobal("fetch", fetchMock)
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true, userId: "user_a" })

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
    const createOrder = mocks.oneTimePaymentButton.mock.lastCall?.[0]?.createOrder as
      | (() => Promise<{ orderId: string }>)
      | undefined
    await act(async () => {
      await createOrder?.()
      root.unmount()
    })
    root = createRoot(container)
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

    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: true, userId: "user_b" })
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
    const startFresh = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Start a new purchase")
    )
    await act(async () => {
      startFresh?.click()
    })
    const createOrderForB = mocks.oneTimePaymentButton.mock.lastCall?.[0]?.createOrder as
      | (() => Promise<{ orderId: string }>)
      | undefined
    await act(async () => {
      await createOrderForB?.()
      resolveCapture?.(Response.json({ ok: true }))
    })

    const stored = JSON.parse(window.sessionStorage.getItem("geekskai.paypal.pending-orders.v2") ?? "{}")
    expect(stored).toMatchObject({ user_a: "ORDER-A", user_b: "ORDER-B" })
  })
})
