import { describe, expect, it } from "vitest"
import {
  FREE_BATCH_FILE_LIMIT,
  MAX_BATCH_BYTES,
  MAX_FILE_BYTES,
  getAudioSelectionIssue,
  parseLoudnormMeasurements,
} from "./audio"

describe("DJ Workspace audio selection", () => {
  it("keeps free processing to one supported local file", () => {
    expect(
      getAudioSelectionIssue([{ name: "track.flac", size: 12_000_000 }], FREE_BATCH_FILE_LIMIT)
    ).toBeNull()
    expect(
      getAudioSelectionIssue(
        [
          { name: "one.mp3", size: 1_000 },
          { name: "two.wav", size: 2_000 },
        ],
        FREE_BATCH_FILE_LIMIT
      )
    ).toBe("Your current plan supports 1 file per batch.")
  })

  it("rejects unsupported formats and unsafe browser-memory selections", () => {
    expect(getAudioSelectionIssue([{ name: "track.ogg", size: 1_000 }], 20)).toBe(
      "track.ogg is not supported. Use MP3, WAV, FLAC, or M4A."
    )
    expect(getAudioSelectionIssue([{ name: "long.wav", size: MAX_FILE_BYTES + 1 }], 20)).toBe(
      "long.wav exceeds the 200 MB per-file limit."
    )
    expect(
      getAudioSelectionIssue(
        [
          { name: "one.wav", size: 170 * 1024 * 1024 },
          { name: "two.wav", size: 170 * 1024 * 1024 },
          { name: "three.wav", size: 170 * 1024 * 1024 },
        ],
        20
      )
    ).toBe("This batch exceeds the 500 MB total limit.")
  })
})

describe("two-pass loudness measurements", () => {
  it("extracts the measured values emitted by FFmpeg loudnorm", () => {
    const log = `
      [Parsed_loudnorm_0] {
        "input_i" : "-18.42",
        "input_tp" : "-0.72",
        "input_lra" : "5.10",
        "input_thresh" : "-29.12",
        "target_offset" : "0.03"
      }
    `

    expect(parseLoudnormMeasurements(log)).toEqual({
      inputI: -18.42,
      inputTp: -0.72,
      inputLra: 5.1,
      inputThresh: -29.12,
      targetOffset: 0.03,
    })
  })
})
