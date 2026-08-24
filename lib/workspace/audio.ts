export const FREE_BATCH_FILE_LIMIT = 1
export const MAX_FILE_BYTES = 200 * 1024 * 1024
export const MAX_BATCH_BYTES = 500 * 1024 * 1024

const SUPPORTED_EXTENSIONS = new Set(["mp3", "wav", "flac", "m4a"])

export interface AudioFileDescriptor {
  name: string
  size: number
}

export interface LoudnormMeasurements {
  inputI: number
  inputTp: number
  inputLra: number
  inputThresh: number
  targetOffset: number
}

export function getAudioSelectionIssue(
  files: AudioFileDescriptor[],
  batchFileLimit: number
): string | null {
  if (files.length === 0) return "Choose at least one audio file."
  if (files.length > batchFileLimit) {
    return `Your current plan supports ${batchFileLimit} file${batchFileLimit === 1 ? "" : "s"} per batch.`
  }

  for (const file of files) {
    const extension = file.name.split(".").pop()?.toLowerCase()
    if (!extension || !SUPPORTED_EXTENSIONS.has(extension)) {
      return `${file.name} is not supported. Use MP3, WAV, FLAC, or M4A.`
    }
    if (file.size > MAX_FILE_BYTES) return `${file.name} exceeds the 200 MB per-file limit.`
  }

  if (files.reduce((total, file) => total + file.size, 0) > MAX_BATCH_BYTES) {
    return "This batch exceeds the 500 MB total limit."
  }
  return null
}

export function readLocalAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio")
    const objectUrl = URL.createObjectURL(file)
    const timeout = window.setTimeout(
      () => finish(new Error("Audio duration could not be read.")),
      15_000
    )
    const cleanup = () => {
      window.clearTimeout(timeout)
      URL.revokeObjectURL(objectUrl)
      audio.removeAttribute("src")
      audio.load()
    }
    const finish = (error?: Error) => {
      const duration = audio.duration
      cleanup()
      if (error || !Number.isFinite(duration) || duration <= 0) {
        reject(error ?? new Error("Audio duration could not be read."))
      } else {
        resolve(duration)
      }
    }
    audio.preload = "metadata"
    audio.onloadedmetadata = () => finish()
    audio.onerror = () => finish(new Error(`${file.name} metadata could not be read.`))
    audio.src = objectUrl
  })
}

export function parseLoudnormMeasurements(log: string): LoudnormMeasurements {
  const match = log.match(/\{[\s\S]*?"input_i"[\s\S]*?"target_offset"\s*:\s*"[^"]+"[\s\S]*?\}/)
  if (!match) throw new Error("FFmpeg did not return loudness measurements.")

  const data = JSON.parse(match[0]) as Record<string, string>
  const values = {
    inputI: Number(data.input_i),
    inputTp: Number(data.input_tp),
    inputLra: Number(data.input_lra),
    inputThresh: Number(data.input_thresh),
    targetOffset: Number(data.target_offset),
  }
  if (Object.values(values).some((value) => !Number.isFinite(value))) {
    throw new Error("FFmpeg returned invalid loudness measurements.")
  }
  return values
}
