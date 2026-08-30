const SITE_ORIGIN = "https://geekskai.com"

export function safeLocalRedirectUrl(
  value: string | string[] | undefined,
  fallback = "/audio-toolkit/"
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

export function authUrlWithRedirect(path: "/sign-in/" | "/sign-up/", redirectUrl: string) {
  return `${path}?redirect_url=${encodeURIComponent(redirectUrl)}`
}

export function quotaRegistrationReturnUrl({ pathname }: Pick<Location, "pathname">) {
  const target = new URL(pathname, SITE_ORIGIN)
  target.searchParams.set("quota_return", "1")
  return `${target.pathname}${target.search}`
}
