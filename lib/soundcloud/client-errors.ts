import { z } from "zod"
import { DEFAULT_RETRY_AFTER_SECONDS, isSoundCloudRateLimit, parseRetryAfter } from "./retry-after"

const failureSchema = z.object({ code: z.string().optional(), error: z.string().optional() })
let cooldownUntil = 0
let cooldownCode = "service_rate_limited"
const listeners = new Set<() => void>()

export class SoundCloudDownloadError extends Error {
  readonly code: string
  readonly status?: number
  readonly retryAfterSeconds?: number

  constructor({
    code,
    message,
    status,
    retryAfterSeconds,
  }: {
    code: string
    message: string
    status?: number
    retryAfterSeconds?: number
  }) {
    super(message)
    this.name = "SoundCloudDownloadError"
    this.code = code
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export function soundCloudFailure({
  code,
  message,
  status,
  retryAfterSeconds,
}: {
  code: string
  message: string
  status?: number
  retryAfterSeconds?: number
}): SoundCloudDownloadError {
  if (isSoundCloudRateLimit(code)) {
    retryAfterSeconds ??= DEFAULT_RETRY_AFTER_SECONDS
    cooldownUntil = Math.max(cooldownUntil, Date.now() + retryAfterSeconds * 1000)
    cooldownCode = code
    listeners.forEach((listener) => listener())
    message = "The download service is busy. Please wait before retrying."
  }
  return new SoundCloudDownloadError({ code, message, status, retryAfterSeconds })
}

export function readSoundCloudFailure(
  response: Response,
  payload: unknown
): SoundCloudDownloadError {
  const parsed = failureSchema.safeParse(payload)
  const failure = parsed.success ? parsed.data : undefined
  return soundCloudFailure({
    code: failure?.code ?? "download_failed",
    message: failure?.error ?? "Download request failed.",
    status: response.status,
    retryAfterSeconds: parseRetryAfter(response.headers.get("Retry-After")),
  })
}

export function getSoundCloudCooldown(): number {
  return Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
}

export function assertSoundCloudAvailable(): void {
  const seconds = getSoundCloudCooldown()
  if (seconds > 0) {
    throw new SoundCloudDownloadError({
      code: cooldownCode,
      message: "The download service is busy. Please wait before retrying.",
      retryAfterSeconds: seconds,
    })
  }
}

export function subscribeSoundCloudCooldown(listener: () => void): () => void {
  listeners.add(listener)
  const timer = setInterval(listener, 1000)
  return () => {
    listeners.delete(listener)
    clearInterval(timer)
  }
}
