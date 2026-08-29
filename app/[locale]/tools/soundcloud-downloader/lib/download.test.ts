import { describe, expect, it } from "vitest"

import {
  selectSoundCloudDownloadFormat,
  withSoundCloudFileExtension,
  type SoundCloudDownloadFormat,
} from "./download"

const progressiveMp3: SoundCloudDownloadFormat = {
  kind: "progressive",
  extension: "mp3",
  mimeType: "audio/mpeg",
  sourceMimeType: "audio/mpeg",
  isLegacy: false,
  url: "https://media.example/track.mp3",
}

const hlsM4a: SoundCloudDownloadFormat = {
  kind: "hls",
  extension: "m4a",
  mimeType: "audio/mp4",
  sourceMimeType: "audio/mp4",
  isLegacy: false,
  url: "https://media.example/playlist.m3u8",
}

describe("SoundCloud output format selection", () => {
  it("prefers progressive MP3 for the MP3 workflow", () => {
    expect(selectSoundCloudDownloadFormat([hlsM4a, progressiveMp3], "mp3")).toBe(progressiveMp3)
  })

  it("prefers the available AAC/M4A stream for the source-oriented workflow", () => {
    expect(selectSoundCloudDownloadFormat([progressiveMp3, hlsM4a], "wav")).toBe(hlsM4a)
  })

  it("falls back transparently without inventing a requested format", () => {
    expect(selectSoundCloudDownloadFormat([hlsM4a], "mp3")).toBe(hlsM4a)
    expect(selectSoundCloudDownloadFormat([progressiveMp3], "wav")).toBe(progressiveMp3)
  })

  it("saves the file with the selected stream's real extension", () => {
    expect(withSoundCloudFileExtension("track.wav", "m4a")).toBe("track.m4a")
    expect(withSoundCloudFileExtension("track", "mp3")).toBe("track.mp3")
  })
})
