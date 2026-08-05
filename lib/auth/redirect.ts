const SITE_ORIGIN = "https://geekskai.com"

export function safeLocalRedirectUrl(
  value: string | string[] | undefined,
  fallback = "/workspace/"
) {
  const candidate = Array.isArray(value) ? value[0] : value
  if (!candidate) return fallback

  try {
    const parsed = new URL(candidate, SITE_ORIGIN)
    return parsed.origin === SITE_ORIGIN
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : fallback
  } catch {
    return fallback
  }
}
