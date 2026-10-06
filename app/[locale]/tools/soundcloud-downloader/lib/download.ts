import { z } from "zod"
import {
  assertSoundCloudAvailable,
  readSoundCloudFailure,
  soundCloudFailure,
} from "@/lib/soundcloud/client-errors"
import type { QuotaToolId } from "@/lib/download-quota/config"
import {
  fileSchema,
  progressSchema,
  type DownloadProgress,
  type OutputFormat,
} from "@/lib/soundcloud/contracts"

const JOB_API = "/api/soundcloud-download-job"
const PREPARATION_TIMEOUT_MS = 13 * 60_000
const REQUEST_TIMEOUT_MS = 30_000
export type SoundCloudPreferredDownloadFormat = "mp3" | "m4a" | "wav"
interface DownloadOptions {
  preferredFormat?: SoundCloudPreferredDownloadFormat
  operationId?: string
  quotaToolId?: QuotaToolId
  onProgress?: (progress: DownloadProgress) => void
}
const statusSchema = z.object({
  status: z.enum(["queued", "preparing", "ready", "failed", "cancelled", "expired"]),
  progress: progressSchema.optional(),
  error: z.object({ code: z.string().optional(), message: z.string() }).optional(),
})
async function requestJson({
  path,
  body,
  headers = {},
}: {
  path: string
  body: unknown
  headers?: Record<string, string>
}) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  const payload: unknown = await response.json()
  if (!response.ok) {
    throw readSoundCloudFailure(response, payload)
  }
  return payload
}
async function waitForFile(token: string, onProgress?: DownloadOptions["onProgress"]) {
  const deadline = Date.now() + PREPARATION_TIMEOUT_MS
  while (Date.now() < deadline) {
    const payload = await requestJson({ path: JOB_API, body: { token, action: "status" } })
    const job = statusSchema.parse(payload)
    if (job.progress) {
      onProgress?.(job.progress)
    }
    if (job.status === "ready") {
      return
    }
    if (job.status !== "queued" && job.status !== "preparing") {
      throw soundCloudFailure({
        code: job.error?.code ?? "download_failed",
        message: job.error?.message || "Download preparation ended. Please try again.",
      })
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error("Download preparation timed out. Please try again.")
}
export async function downloadSoundCloudFile({
  url,
  format,
  operationId,
  quotaToolId,
  onProgress,
}: {
  url: string
  format: OutputFormat
  operationId?: string
  quotaToolId: QuotaToolId
  onProgress?: DownloadOptions["onProgress"]
}) {
  assertSoundCloudAvailable()
  const path =
    format === "artwork" ? "/api/download-soundcloud-artwork" : "/api/download-soundcloud/"
  const created = await requestJson({
    path,
    body: { url: url.trim(), format },
    headers: {
      ...(operationId ? { "X-Download-Operation-Id": operationId } : {}),
      "X-Quota-Tool-Id": quotaToolId,
    },
  })
  const { token } = z.object({ token: z.string() }).parse(created)
  try {
    await waitForFile(token, onProgress)
    const payload = await requestJson({ path: JOB_API, body: { token, action: "ticket" } })
    const ticket = z.object({ url: z.url(), file: fileSchema }).parse(payload)
    if (ticket.file.format !== format || new URL(ticket.url).protocol !== "https:") {
      throw new Error("Invalid download file response.")
    }
    const link = document.createElement("a")
    link.href = ticket.url
    link.rel = "noreferrer"
    // Content-Disposition on the VPS starts a native download; audio never crosses Next.js.
    document.body.appendChild(link)
    link.click()
    link.remove()
    return ticket.file
  } catch (error: unknown) {
    try {
      await requestJson({ path: JOB_API, body: { token, action: "cancel" } })
    } catch (cancelError: unknown) {
      console.warn("SoundCloud task cancellation failed", { failed: cancelError instanceof Error })
    }
    throw error
  }
}
export async function downloadSoundCloudTrack(
  trackUrl: string,
  fileName: string,
  options?: DownloadOptions
) {
  let format: SoundCloudPreferredDownloadFormat = "mp3"
  if (fileName.endsWith(".wav")) {
    format = "wav"
  }
  if (fileName.endsWith(".m4a")) {
    format = "m4a"
  }
  const file = await downloadSoundCloudFile({
    url: trackUrl,
    format: options?.preferredFormat || format,
    operationId: options?.operationId,
    quotaToolId: options?.quotaToolId || "soundcloud-track",
    onProgress: options?.onProgress,
  })
  return {
    selectedFormat: { extension: file.format as SoundCloudPreferredDownloadFormat },
    savedFileName: file.fileName,
  }
}
