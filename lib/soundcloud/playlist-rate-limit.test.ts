// @vitest-environment jsdom
import React, { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

interface FormControls {
  onUrlChange(url: string): void
  onSubmit(event: { preventDefault(): void }): void
  onExtensionChange(format: "mp3" | "m4a" | "wav"): void
}
interface BatchControls {
  onDownloadAll(): Promise<void>
  canResume: boolean
}
const controls = vi.hoisted(() => ({
  form: null as FormControls | null,
  batch: null as BatchControls | null,
  download: vi.fn(),
  reserve: vi.fn(),
  release: vi.fn(),
  consume: vi.fn(),
}))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "en" }))
vi.mock("next/dynamic", () => ({ default: () => () => null }))
vi.mock("@/components/GoogleAdUnitPlaceholder", () => ({ GoogleAdUnitPlaceholder: () => null }))
vi.mock("@/components/SoundCloudToolSwitcher", () => ({ default: () => null }))
vi.mock("@/components/download-quota/DownloadShareModal", () => ({ default: () => null }))
vi.mock("@/components/ContentFreshnessBadge", () => ({ ContentFreshnessBadge: () => null }))
vi.mock("@/components/ShareButtons", () => ({ default: () => null }))
vi.mock("@/components/SoundCloudEvidenceContent", () => ({ default: () => null }))
vi.mock("@/lib/analytics/tool-events", () => ({ trackToolEvent: vi.fn() }))
vi.mock("@/components/download-quota/useDownloadQuota", () => ({
  useDownloadQuota: () => ({
    checkQuotaBeforeDownload: controls.reserve,
    releaseDownloadQuota: controls.release,
    consumeDownloadQuota: controls.consume,
    quotaConfig: {},
  }),
}))
vi.mock("@/app/[locale]/tools/soundcloud-downloader/components/TrackDownloadForm", () => ({
  default: (props: FormControls) => {
    controls.form = props
    return null
  },
}))
vi.mock("@/app/[locale]/tools/soundcloud-playlist-downloader/components/PlaylistTracks", () => ({
  default: (props: BatchControls) => {
    controls.batch = props
    return null
  },
}))
vi.mock("@/app/[locale]/tools/soundcloud-playlist-downloader/components/DownloadProgress", () => ({
  default: () => null,
}))
vi.mock("@/app/[locale]/tools/soundcloud-downloader/lib/download", () => ({
  downloadSoundCloudTrack: controls.download,
}))

import PlaylistPage from "@/app/[locale]/tools/soundcloud-playlist-downloader/page"
import { soundCloudFailure } from "./client-errors"

let root: Root
const tracks = ["first", "second", "third"].map((name, index) => ({
  id: index + 1,
  title: name,
  artist: "Artist",
  url: `https://soundcloud.com/artist/${name}`,
}))

let testEpoch = Date.parse("2026-10-06T00:00:00Z")

beforeEach(async () => {
  vi.useFakeTimers()
  testEpoch += 24 * 60 * 60_000
  vi.setSystemTime(testEpoch)
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, tracks })))
  )
  HTMLElement.prototype.scrollIntoView = vi.fn()
  controls.download.mockReset()
  controls.reserve.mockReset().mockResolvedValue({ allowed: true, operationId: "reserved" })
  controls.release.mockReset().mockResolvedValue(undefined)
  controls.consume.mockReset().mockResolvedValue(undefined)
  const container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => root.render(React.createElement(PlaylistPage)))
  await act(async () => controls.form!.onUrlChange("https://soundcloud.com/artist/sets/playlist"))
  await act(async () => controls.form!.onSubmit({ preventDefault() {} }))
})
afterEach(async () => {
  await act(async () => root.unmount())
  document.body.replaceChildren()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it("pauses on rate limiting, releases quota, and resumes the same track without repeating completed tracks", async () => {
  const completed = { selectedFormat: { extension: "mp3" }, savedFileName: "song.mp3" }
  controls.download
    .mockResolvedValueOnce(completed)
    .mockImplementationOnce(async () => {
      throw soundCloudFailure({
        code: "service_rate_limited",
        message: "Busy",
        retryAfterSeconds: 60,
      })
    })
    .mockResolvedValue(completed)
  await act(async () => {
    const batch = controls.batch!.onDownloadAll()
    await vi.advanceTimersByTimeAsync(500)
    await batch
  })
  expect(controls.download.mock.calls.map(([url]) => url)).toEqual([tracks[0].url, tracks[1].url])
  expect(controls.release).toHaveBeenCalledTimes(1)
  expect(controls.consume).toHaveBeenCalledTimes(1)
  expect(controls.batch!.canResume).toBe(true)
  await act(async () => controls.batch!.onDownloadAll())
  expect(controls.reserve).toHaveBeenCalledTimes(2)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(60_000)
    const resumed = controls.batch!.onDownloadAll()
    await vi.advanceTimersByTimeAsync(500)
    await resumed
  })
  expect(controls.download.mock.calls.map(([url]) => url)).toEqual([
    tracks[0].url,
    tracks[1].url,
    tracks[1].url,
    tracks[2].url,
  ])
  expect(controls.reserve).toHaveBeenCalledTimes(4)
  expect(controls.consume).toHaveBeenCalledTimes(3)
  expect(controls.batch!.canResume).toBe(false)
})

it("skips an ordinary unavailable track and continues the remaining playlist", async () => {
  controls.download.mockRejectedValueOnce(new Error("Unavailable track")).mockResolvedValue({
    selectedFormat: { extension: "mp3" },
    savedFileName: "song.mp3",
  })
  await act(async () => {
    const batch = controls.batch!.onDownloadAll()
    await vi.advanceTimersByTimeAsync(1000)
    await batch
  })
  expect(controls.download).toHaveBeenCalledTimes(3)
  expect(controls.release).toHaveBeenCalledTimes(1)
  expect(controls.consume).toHaveBeenCalledTimes(2)
  expect(controls.batch!.canResume).toBe(false)
})
