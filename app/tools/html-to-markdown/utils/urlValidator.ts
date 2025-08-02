import { UrlValidationResult } from "../types"

export function validateUrl(url: string): UrlValidationResult {
  if (!url || typeof url !== "string") {
    return {
      isValid: false,
      error: "URL is required",
    }
  }

  const trimmedUrl = url.trim()

  if (!trimmedUrl) {
    return {
      isValid: false,
      error: "URL cannot be empty",
    }
  }

  // Add protocol if missing
  let normalizedUrl = trimmedUrl
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  try {
    const urlObj = new URL(normalizedUrl)

    // Check for valid protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return {
        isValid: false,
        error: "Only HTTP and HTTPS protocols are supported",
      }
    }

    // Check for valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return {
        isValid: false,
        error: "Invalid hostname",
      }
    }

    // Basic hostname validation
    const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-._]*[a-zA-Z0-9]$/
    if (urlObj.hostname.length > 1 && !hostnameRegex.test(urlObj.hostname)) {
      return {
        isValid: false,
        error: "Invalid hostname format",
      }
    }

    return {
      isValid: true,
      normalizedUrl: urlObj.toString(),
    }
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid URL format",
    }
  }
}

export function validateMultipleUrls(urls: string[]): {
  valid: string[]
  invalid: { url: string; error: string }[]
} {
  const valid: string[] = []
  const invalid: { url: string; error: string }[] = []

  urls.forEach((url) => {
    const result = validateUrl(url)
    if (result.isValid && result.normalizedUrl) {
      valid.push(result.normalizedUrl)
    } else {
      invalid.push({
        url: url.trim(),
        error: result.error || "Invalid URL",
      })
    }
  })

  return { valid, invalid }
}

export function parseUrlsFromText(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"]+/gi
  const matches = text.match(urlRegex) || []

  // Also try to find URLs without protocol
  const lines = text.split(/[\r\n]+/)
  const additionalUrls: string[] = []

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith("http") && trimmed.includes(".")) {
      // Basic check for domain-like strings
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-._]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/
      if (domainRegex.test(trimmed)) {
        additionalUrls.push(trimmed)
      }
    }
  })

  return [...matches, ...additionalUrls]
}

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-._]*\.[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}
