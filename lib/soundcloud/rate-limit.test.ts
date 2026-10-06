import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { parseRetryAfter } from "./retry-after"

beforeEach(() => {
  vi.resetModules()
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-10-06T00:00:00Z"))
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it.each([null, "", "garbage", "-5", "Infinity"])("rejects invalid Retry-After %s", (header) => {
  expect(parseRetryAfter(header)).toBeUndefined()
})
it("normalizes both delta seconds and HTTP dates", () => {
  expect(parseRetryAfter("90")).toBe(90)
  expect(parseRetryAfter("Tue, 06 Oct 2026 00:02:00 GMT")).toBe(120)
})
it("preserves error details, ticks down, and blocks premature requests without extending cooldown", async () => {
  const failures = await import("./client-errors")
  const response = new Response("{}", { status: 429, headers: { "Retry-After": "90" } })
  const failure = failures.readSoundCloudFailure(response, {
    code: "service_rate_limited",
    error: "Busy",
  })
  expect(failure).toMatchObject({
    code: "service_rate_limited",
    status: 429,
    retryAfterSeconds: 90,
  })
  const listener = vi.fn()
  const unsubscribe = failures.subscribeSoundCloudCooldown(listener)
  await vi.advanceTimersByTimeAsync(10_000)
  expect(failures.getSoundCloudCooldown()).toBe(80)
  expect(failures.assertSoundCloudAvailable).toThrow(failures.SoundCloudDownloadError)
  expect(failures.getSoundCloudCooldown()).toBe(80)
  await vi.advanceTimersByTimeAsync(80_000)
  expect(failures.assertSoundCloudAvailable).not.toThrow()
  unsubscribe()
  const calls = listener.mock.calls.length
  await vi.advanceTimersByTimeAsync(2000)
  expect(listener).toHaveBeenCalledTimes(calls)
})
it("keeps asynchronous job error codes and uses a conservative cooldown without a header", async () => {
  const { downloadSoundCloudTrack } = await import(
    "@/app/[locale]/tools/soundcloud-downloader/lib/download"
  )
  const { getSoundCloudCooldown } = await import("./client-errors")
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(new Response('{"token":"signed"}'))
    .mockResolvedValueOnce(
      new Response('{"status":"failed","error":{"code":"upstream_rate_limited","message":"Busy"}}')
    )
    .mockResolvedValueOnce(new Response('{"status":"cancelled"}'))
  vi.stubGlobal("fetch", fetchMock)
  await expect(
    downloadSoundCloudTrack("https://soundcloud.com/a/b", "song.mp3")
  ).rejects.toMatchObject({
    code: "upstream_rate_limited",
    retryAfterSeconds: 60,
  })
  expect(JSON.parse(fetchMock.mock.calls[2][1].body).action).toBe("cancel")
  expect(getSoundCloudCooldown()).toBe(60)
  await expect(
    downloadSoundCloudTrack("https://soundcloud.com/a/b", "song.mp3")
  ).rejects.toMatchObject({ code: "upstream_rate_limited" })
  expect(fetchMock).toHaveBeenCalledTimes(3)
})
it("ordinary failures never start a cooldown", async () => {
  const failures = await import("./client-errors")
  failures.soundCloudFailure({ code: "upstream_not_found", message: "Unavailable" })
  expect(failures.getSoundCloudCooldown()).toBe(0)
})
