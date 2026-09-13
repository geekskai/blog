/** @vitest-environment jsdom */

import { act, createElement } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ useAuth: vi.fn(), trackToolEvent: vi.fn() }))

vi.mock("@clerk/nextjs", () => ({ useAuth: mocks.useAuth }))
vi.mock("@/lib/analytics/tool-events", () => ({ trackToolEvent: mocks.trackToolEvent }))

import { useDownloadQuota, type DownloadQuotaController } from "./useDownloadQuota"

const serverQuota = {
  limit: 3,
  remaining: 3,
  successfulDownloads: 0,
  activeReservations: 0,
  concurrencyLimit: 1,
  shareUnlockAvailable: true,
}

function response(data: object) {
  return { ok: true, json: async () => data } as Response
}

describe("useDownloadQuota initialization", () => {
  let container: HTMLDivElement
  let root: Root
  let controller: DownloadQuotaController | undefined

  function render() {
    act(() => {
      root.render(
        createElement(QuotaHarness, {
          onChange: (next) => {
            controller = next
          },
        })
      )
    })
  }

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
    controller = undefined
    window.localStorage.clear()
    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: false })
    mocks.trackToolEvent.mockReset()
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("uses local quota only after an explicit local response and consumes it once", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ mode: "local" }))
    render()
    await act(async () => undefined)

    expect(controller?.quotaInitializationState).toBe("ready")
    expect(controller?.quotaConfig.mode).toBe("local")

    let check: Awaited<ReturnType<DownloadQuotaController["checkQuotaBeforeDownload"]>>
    let duplicate: Awaited<ReturnType<DownloadQuotaController["checkQuotaBeforeDownload"]>>
    await act(async () => {
      check = await controller!.checkQuotaBeforeDownload()
      duplicate = await controller!.checkQuotaBeforeDownload()
      if (check.allowed) {
        await controller!.consumeDownloadQuota(check.operationId)
      }
    })

    expect(check!).toEqual({ allowed: true })
    expect(duplicate!).toMatchObject({ allowed: false, reason: "temporarily_unavailable" })
    expect(controller?.quotaConfig.remaining).toBe(2)
  })

  it("keeps a failed initialization blocked, then retries without a page reload", async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(response({ mode: "server", quota: serverQuota }))
    render()
    await act(async () => undefined)

    expect(controller?.quotaInitializationState).toBe("failed")
    expect(controller?.quotaConfig.mode).toBe("pending")
    expect(mocks.trackToolEvent).toHaveBeenCalledWith("quota_initialization_failed", {
      tool_id: "soundcloud-track",
      action: "initial",
    })

    await act(async () => {
      await controller!.retryQuotaInitialization()
    })

    expect(controller?.quotaInitializationState).toBe("ready")
    expect(controller?.quotaConfig.mode).toBe("server")
    expect(controller?.quotaConfig.remaining).toBe(3)
    expect(mocks.trackToolEvent).toHaveBeenCalledWith("quota_initialization_succeeded", {
      tool_id: "soundcloud-track",
      action: "retry",
    })
  })

  it("times out initialization and lets the next retry establish the server quota", async () => {
    vi.useFakeTimers()
    vi.mocked(fetch)
      .mockImplementationOnce(
        (_, init) =>
          new Promise((_, reject) => {
            ;(init as RequestInit).signal?.addEventListener("abort", () => {
              reject(new DOMException("Timed out", "AbortError"))
            })
          })
      )
      .mockResolvedValueOnce(response({ mode: "server", quota: serverQuota }))
    render()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8_000)
    })

    expect(controller?.quotaInitializationState).toBe("failed")
    expect(controller?.quotaConfig.mode).toBe("pending")

    await act(async () => {
      await controller!.retryQuotaInitialization()
    })

    expect(controller?.quotaInitializationState).toBe("ready")
    expect(controller?.quotaConfig.mode).toBe("server")
  })

  it("does not classify an unresolved Clerk session as an anonymous visitor", async () => {
    vi.useFakeTimers()
    mocks.useAuth.mockReturnValue({ isLoaded: false, isSignedIn: false })
    render()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8_000)
    })

    expect(fetch).not.toHaveBeenCalled()
    expect(controller?.quotaInitializationState).toBe("failed")
    expect(controller?.quotaConfig.mode).toBe("pending")

    mocks.useAuth.mockReturnValue({ isLoaded: true, isSignedIn: false })
    vi.mocked(fetch).mockResolvedValueOnce(response({ mode: "server", quota: serverQuota }))
    render()
    await act(async () => undefined)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(controller?.quotaInitializationState).toBe("ready")
    expect(controller?.quotaConfig.mode).toBe("server")
  })
})

function QuotaHarness({ onChange }: { onChange: (controller: DownloadQuotaController) => void }) {
  onChange(useDownloadQuota({ toolId: "soundcloud-track" }))
  return null
}
