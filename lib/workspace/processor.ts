"use client"

import type { LoudnormMeasurements } from "./audio"
import { parseLoudnormMeasurements } from "./audio"

export type AudioOutputFormat = "mp3" | "wav"
export type WavBitDepth = 16 | 24

interface ProcessOptions {
  outputFormat: AudioOutputFormat
  wavBitDepth: WavBitDepth
  loudnessTarget: number
  onProgress?: (progress: number) => void
}

let ffmpegInstance: import("@ffmpeg/ffmpeg").FFmpeg | null = null
let loadingPromise: Promise<import("@ffmpeg/ffmpeg").FFmpeg> | null = null
let currentLog = ""

async function getFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance
  if (loadingPromise) return loadingPromise
  loadingPromise = (async () => {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ])
    const ffmpeg = new FFmpeg()
    ffmpegInstance = ffmpeg
    ffmpeg.on("log", ({ message }) => {
      currentLog += `${message}\n`
    })
    const coreBase = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd"
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${coreBase}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${coreBase}/ffmpeg-core.wasm`, "application/wasm"),
      })
      return ffmpeg
    } catch (error) {
      if (ffmpegInstance === ffmpeg) ffmpegInstance = null
      throw error
    }
  })()
  try {
    return await loadingPromise
  } finally {
    loadingPromise = null
  }
}

function secondPassFilter(target: number, measured: LoudnormMeasurements) {
  return [
    `loudnorm=I=${target}`,
    "TP=-1.0",
    "LRA=11",
    `measured_I=${measured.inputI}`,
    `measured_TP=${measured.inputTp}`,
    `measured_LRA=${measured.inputLra}`,
    `measured_thresh=${measured.inputThresh}`,
    `offset=${measured.targetOffset}`,
    "linear=true",
    "print_format=summary",
  ].join(":")
}

export async function processAudioFile(file: File, options: ProcessOptions) {
  const ffmpeg = await getFFmpeg()
  const { fetchFile } = await import("@ffmpeg/util")
  const inputName = `input-${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase()}`
  const outputName = `output-${crypto.randomUUID()}.${options.outputFormat}`
  currentLog = ""
  const onProgress = ({ progress }: { progress: number }) => options.onProgress?.(progress)
  ffmpeg.on("progress", onProgress)
  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec([
      "-hide_banner",
      "-i",
      inputName,
      "-af",
      `loudnorm=I=${options.loudnessTarget}:TP=-1.0:LRA=11:print_format=json`,
      "-f",
      "null",
      "-",
    ])
    const measured = parseLoudnormMeasurements(currentLog)
    const codecArgs =
      options.outputFormat === "mp3"
        ? ["-codec:a", "libmp3lame", "-b:a", "320k"]
        : ["-codec:a", options.wavBitDepth === 24 ? "pcm_s24le" : "pcm_s16le"]
    await ffmpeg.exec([
      "-i",
      inputName,
      "-map",
      "0:a:0",
      "-af",
      secondPassFilter(options.loudnessTarget, measured),
      ...codecArgs,
      "-y",
      outputName,
    ])
    const data = await ffmpeg.readFile(outputName)
    const mimeType = options.outputFormat === "mp3" ? "audio/mpeg" : "audio/wav"
    return new Blob([data instanceof Uint8Array ? data.slice().buffer : data], { type: mimeType })
  } finally {
    ffmpeg.off("progress", onProgress)
    await Promise.allSettled([ffmpeg.deleteFile(inputName), ffmpeg.deleteFile(outputName)])
  }
}

export function cancelAudioProcessing() {
  ffmpegInstance?.terminate()
  ffmpegInstance = null
  loadingPromise = null
}
