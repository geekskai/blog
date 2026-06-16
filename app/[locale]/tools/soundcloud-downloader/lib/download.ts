import { saveAs } from "file-saver"

export const SOUNDCLOUD_DOWNLOAD_API = "/api/download-soundcloud/"

export interface SoundCloudDirectDownloadInfo {
  title?: string
  duration?: number
  id?: number
}

export interface SoundCloudDirectDownloadResult {
  success: true
  directUrl: string
  info: SoundCloudDirectDownloadInfo
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

  if (!response.ok || !data.success || !data.directUrl) {
    throw new Error(data.error || `Failed to resolve download URL (${response.status})`)
  }

  return data as SoundCloudDirectDownloadResult
}

export async function downloadFileFromUrl(
  fileUrl: string,
  fileName: string,
  options?: {
    mimeType?: string
    onProgress?: (loadedBytes: number, totalBytes: number | null) => void
  }
): Promise<void> {
  const response = await fetch(fileUrl)

  if (!response.ok) {
    throw new Error(`Failed to download file (${response.status})`)
  }

  const contentLength = response.headers.get("Content-Length")
  const totalBytes = contentLength ? parseInt(contentLength, 10) : null

  if (!response.body) {
    const blob = await response.blob()
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

  saveAs(blob, fileName)
}

export async function downloadSoundCloudTrack(
  trackUrl: string,
  fileName: string,
  options?: {
    mimeType?: string
    onProgress?: (loadedBytes: number, totalBytes: number | null) => void
  }
): Promise<SoundCloudDirectDownloadResult> {
  const result = await resolveSoundCloudDirectUrl(trackUrl)
  await downloadFileFromUrl(result.directUrl, fileName, options)
  return result
}
