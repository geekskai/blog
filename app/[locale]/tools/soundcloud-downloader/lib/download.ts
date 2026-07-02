import { saveAs } from "file-saver"

export const SOUNDCLOUD_DOWNLOAD_API = "/api/download-soundcloud/"

export interface SoundCloudDirectDownloadInfo {
  title?: string
  duration?: number
  id?: number
}

export type SoundCloudPreferredDownloadFormat = "mp3" | "wav"

export interface SoundCloudDownloadFormat {
  kind: "progressive" | "hls"
  extension: "mp3" | "m4a"
  mimeType: "audio/mpeg" | "audio/mp4"
  sourceMimeType: string
  preset?: string
  isLegacy: boolean
  url: string
}

export interface SoundCloudDirectDownloadResult {
  success: true
  directUrl?: string
  directUrlType?: "progressive" | "hls"
  recommended?: "progressive" | "hls"
  formats: SoundCloudDownloadFormat[]
  selectedFormat?: SoundCloudDownloadFormat
  savedFileName?: string
  info: SoundCloudDirectDownloadInfo
}

interface DownloadOptions {
  preferredFormat?: SoundCloudPreferredDownloadFormat
  mimeType?: string
  onProgress?: (loadedBytes: number, totalBytes: number | null) => void
}

export async function resolveSoundCloudDirectUrl(
  trackUrl: string
): Promise<SoundCloudDirectDownloadResult> {
  const response = await fetch(SOUNDCLOUD_DOWNLOAD_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: trackUrl.trim(), directUrl: true }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.success || !Array.isArray(data.formats) || data.formats.length === 0) {
    throw new Error(data.error || `Failed to resolve download URL (${response.status})`)
  }

  return data as SoundCloudDirectDownloadResult
}

const fetchMedia = async (url: string): Promise<Response> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
    })

    if (!response.ok) {
      throw new Error(`Failed to download file (${response.status})`)
    }

    return response
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "The browser could not fetch this SoundCloud media URL. The signed URL may have expired or CORS may be blocked."
      )
    }
    throw error
  }
}

const looksLikeHlsPlaylist = async (blob: Blob, contentType: string | null): Promise<boolean> => {
  if (contentType?.includes("mpegurl") || contentType?.includes("vnd.apple.mpegurl")) {
    return true
  }

  if (blob.size > 256 * 1024) {
    return false
  }

  const prefix = await blob
    .slice(0, 32)
    .text()
    .catch(() => "")
  return prefix.startsWith("#EXTM3U")
}

export async function downloadFileFromUrl(
  fileUrl: string,
  fileName: string,
  options?: {
    mimeType?: string
    onProgress?: (loadedBytes: number, totalBytes: number | null) => void
  }
): Promise<void> {
  const response = await fetchMedia(fileUrl)
  const contentLength = response.headers.get("Content-Length")
  const totalBytes = contentLength ? parseInt(contentLength, 10) : null

  if (!response.body) {
    const blob = await response.blob()
    if (await looksLikeHlsPlaylist(blob, response.headers.get("Content-Type"))) {
      throw new Error("SoundCloud returned an HLS playlist instead of a direct audio file.")
    }
    saveAs(blob, fileName)
    options?.onProgress?.(blob.size, totalBytes)
    return
  }

  const reader = response.body.getReader()
  const chunks: BlobPart[] = []
  let loadedBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    chunks.push(value)
    loadedBytes += value.length
    options?.onProgress?.(loadedBytes, totalBytes)
  }

  const blob = new Blob(chunks, {
    type: options?.mimeType || response.headers.get("Content-Type") || "audio/mpeg",
  })

  if (await looksLikeHlsPlaylist(blob, response.headers.get("Content-Type"))) {
    throw new Error("SoundCloud returned an HLS playlist instead of a direct audio file.")
  }

  saveAs(blob, fileName)
}

const resolveHlsUri = (uri: string, baseUrl: string): string => {
  return new URL(uri.trim(), baseUrl).toString()
}

const parseHlsManifest = (manifest: string, manifestUrl: string) => {
  const segmentUrls: string[] = []
  let initUrl: string | null = null

  for (const rawLine of manifest.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    const mapMatch = line.match(/^#EXT-X-MAP:.*URI="([^"]+)"/)
    if (mapMatch?.[1]) {
      initUrl = resolveHlsUri(mapMatch[1], manifestUrl)
      continue
    }

    if (!line.startsWith("#")) {
      segmentUrls.push(resolveHlsUri(line, manifestUrl))
    }
  }

  return {
    initUrl,
    segmentUrls,
  }
}

const fetchArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
  const response = await fetchMedia(url)
  return response.arrayBuffer()
}

async function downloadHlsAsM4a(
  manifestUrl: string,
  fileName: string,
  options?: Pick<DownloadOptions, "onProgress">
): Promise<void> {
  const manifestResponse = await fetchMedia(manifestUrl)
  const manifest = await manifestResponse.text()

  if (!manifest.startsWith("#EXTM3U")) {
    throw new Error("SoundCloud returned an invalid HLS playlist.")
  }

  const { initUrl, segmentUrls } = parseHlsManifest(manifest, manifestUrl)

  if (segmentUrls.length === 0) {
    throw new Error("No downloadable HLS audio segments were found.")
  }

  const parts: BlobPart[] = []
  let loadedBytes = 0
  const pushPart = (buffer: ArrayBuffer) => {
    parts.push(buffer)
    loadedBytes += buffer.byteLength
    options?.onProgress?.(loadedBytes, null)
  }

  if (initUrl) {
    pushPart(await fetchArrayBuffer(initUrl))
  }

  for (const segmentUrl of segmentUrls) {
    pushPart(await fetchArrayBuffer(segmentUrl))
  }

  saveAs(new Blob(parts, { type: "audio/mp4" }), fileName)
}

const inferPreferredFormat = (
  fileName: string,
  options?: Pick<DownloadOptions, "preferredFormat" | "mimeType">
): SoundCloudPreferredDownloadFormat => {
  if (options?.preferredFormat) return options.preferredFormat
  if (options?.mimeType === "audio/wav") return "wav"
  if (fileName.toLowerCase().endsWith(".wav")) return "wav"
  return "mp3"
}

const withFileExtension = (fileName: string, extension: SoundCloudDownloadFormat["extension"]) => {
  return /\.[^.]+$/.test(fileName)
    ? fileName.replace(/\.[^.]+$/, `.${extension}`)
    : `${fileName}.${extension}`
}

const pickDownloadFormat = (
  formats: SoundCloudDownloadFormat[],
  preferredFormat: SoundCloudPreferredDownloadFormat
): SoundCloudDownloadFormat => {
  if (preferredFormat === "mp3") {
    return (
      formats.find((format) => format.kind === "progressive" && format.extension === "mp3") ??
      formats.find((format) => format.kind === "hls" && format.extension === "m4a") ??
      formats[0]
    )
  }

  // There is no real WAV output in the low-server-cost path. Prefer browser-readable AAC/HLS
  // for WAV requests, then fall back to MP3, and save with the true extension.
  return (
    formats.find((format) => format.kind === "hls" && format.extension === "m4a") ??
    formats.find((format) => format.kind === "progressive" && format.extension === "mp3") ??
    formats[0]
  )
}

export async function downloadSoundCloudTrack(
  trackUrl: string,
  fileName: string,
  options?: DownloadOptions
): Promise<SoundCloudDirectDownloadResult> {
  const result = await resolveSoundCloudDirectUrl(trackUrl)
  const preferredFormat = inferPreferredFormat(fileName, options)
  const selectedFormat = pickDownloadFormat(result.formats, preferredFormat)
  const savedFileName = withFileExtension(fileName, selectedFormat.extension)

  if (selectedFormat.kind === "hls") {
    await downloadHlsAsM4a(selectedFormat.url, savedFileName, options)
  } else {
    await downloadFileFromUrl(selectedFormat.url, savedFileName, {
      mimeType: selectedFormat.mimeType,
      onProgress: options?.onProgress,
    })
  }

  return {
    ...result,
    selectedFormat,
    savedFileName,
  }
}
