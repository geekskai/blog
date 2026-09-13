import { describe, expect, it } from "vitest"
import {
  isSoundCloudSetPrepEntry,
  SOUNDCLOUD_SET_PREP_ENTRY,
  SOUNDCLOUD_SET_PREP_PATH,
} from "./set-prep"

describe("SoundCloud Set Prep entry", () => {
  it("accepts only the lifecycle marker and carries no source content", () => {
    expect(SOUNDCLOUD_SET_PREP_ENTRY).toBe("soundcloud-set")
    expect(SOUNDCLOUD_SET_PREP_PATH).toBe("/audio-toolkit/?entry=soundcloud-set")
    expect(SOUNDCLOUD_SET_PREP_PATH).not.toMatch(/url|track|file|playlist/i)
  })

  it("does not activate Set Prep for any other query value", () => {
    expect(isSoundCloudSetPrepEntry("soundcloud-set")).toBe(true)
    expect(isSoundCloudSetPrepEntry("download-result")).toBe(false)
    expect(isSoundCloudSetPrepEntry(undefined)).toBe(false)
  })
})
