import { describe, expect, it } from "vitest"

import { getSoundCloudPageCopy } from "./soundCloudSeo"

describe("SoundCloud evidence copy", () => {
  it.each(["en", "fr", "es", "de"])("provides distinct copy for %s", (locale) => {
    const wav = getSoundCloudPageCopy("wav", locale)
    const mp3 = getSoundCloudPageCopy("mp3", locale)
    const playlist = getSoundCloudPageCopy("playlist", locale)

    expect(wav.directAnswer).not.toBe(mp3.directAnswer)
    expect(mp3.directAnswer).not.toBe(playlist.directAnswer)
    expect(wav.facts).toHaveLength(3)
    expect(mp3.steps).toHaveLength(3)
    expect(playlist.limits).toHaveLength(3)
  })

  it("states the verified English format boundaries without absolute quality claims", () => {
    const wav = getSoundCloudPageCopy("wav", "en")
    const mp3 = getSoundCloudPageCopy("mp3", "en")

    expect(wav.directAnswer).toContain("does not synthesize a WAV")
    expect(mp3.directAnswer).toContain("does not re-encode audio to 320 kbps")
    expect(`${wav.metadataDescription} ${mp3.metadataDescription}`).not.toMatch(
      /lossless|highest quality|guaranteed/i
    )
  })

  it("falls back to English for an unsupported locale", () => {
    expect(getSoundCloudPageCopy("mp3", "it")).toBe(getSoundCloudPageCopy("mp3", "en"))
  })
})
