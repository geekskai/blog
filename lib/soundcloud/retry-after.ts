export const DEFAULT_RETRY_AFTER_SECONDS = 60

export function isSoundCloudRateLimit(code: string): boolean {
  return code === "service_rate_limited" || code === "upstream_rate_limited"
}

export function parseRetryAfter(header: string | null): number | undefined {
  if (!header?.trim()) {
    return undefined
  }
  const seconds = Number(header)
  const delay = Number.isFinite(seconds) ? seconds : (Date.parse(header) - Date.now()) / 1000
  if (!Number.isFinite(delay) || delay < 0 || delay > Number.MAX_SAFE_INTEGER / 1000) {
    return undefined
  }
  return Math.max(1, Math.ceil(delay))
}
