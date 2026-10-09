const LOCALES = new Set(["en", "ar", "de", "fr", "es", "ja", "ko", "no", "zh-cn", "da"])

export function normalizeUrl(value) {
  try {
    const url = new URL(value)
    url.hash = ""
    url.hostname = url.hostname.toLowerCase()
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_.+|fbclid|gclid|msclkid)$/i.test(key)) url.searchParams.delete(key)
    }
    url.searchParams.sort()
    url.pathname = url.pathname === "/" ? "/" : `${url.pathname.replace(/\/+$/, "")}/`
    return url.toString()
  } catch {
    return value
  }
}

export function classifyUrl(value) {
  const parts = new URL(value).pathname.split("/").filter(Boolean)
  if (LOCALES.has((parts[0] || "").toLowerCase())) parts.shift()
  if (parts[0] === "blog") return "blog"
  if (parts[0] === "tools") return "tool"
  return "site-page"
}

export function parseHttpLinkAlternates(header, baseUrl) {
  if (!header) return []
  const alternates = []
  for (const match of header.matchAll(/<([^>]+)>\s*((?:;[^,]*)*)/g)) {
    const params = match[2]
    const rel = params.match(/(?:^|;)\s*rel\s*=\s*"?([^;,"]+)/i)?.[1]?.trim()
    const language = params.match(/(?:^|;)\s*hreflang\s*=\s*"?([^;,"]+)/i)?.[1]?.trim()
    if (rel?.split(/\s+/).includes("alternate") && language) {
      alternates.push({ language, url: new URL(match[1], baseUrl).toString() })
    }
  }
  return alternates
}

export function parseSitemapEntries(xml, baseUrl) {
  const entries = []
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const block = match[1]
    const location = block.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]
    if (!location) continue
    const alternates = [...block.matchAll(/<xhtml:link\b([^>]*)\/?\s*>/gi)]
      .map((link) => {
        const attrs = link[1]
        const language = attrs.match(/\bhreflang=["']([^"']+)["']/i)?.[1] || ""
        const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1] || ""
        return language && href
          ? { language, url: new URL(decodeXml(href), baseUrl).toString() }
          : null
      })
      .filter(Boolean)
    entries.push({ url: new URL(decodeXml(location.trim()), baseUrl).toString(), alternates })
  }
  return entries
}

export function parseRobotsTxt(content, pathname, userAgent = "*") {
  const groups = []
  let group = null
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim()
    if (!line) continue
    const separator = line.indexOf(":")
    if (separator < 0) continue
    const name = line.slice(0, separator).trim().toLowerCase()
    const value = line.slice(separator + 1).trim()
    if (name === "user-agent") {
      if (!group || group.hasRules) {
        group = { agents: [], rules: [], hasRules: false }
        groups.push(group)
      }
      group.agents.push(value.toLowerCase())
    } else if ((name === "allow" || name === "disallow") && group) {
      group.rules.push({ name, value })
      group.hasRules = true
    }
  }
  const matching = groups.filter((candidate) => candidate.agents.includes(userAgent.toLowerCase()))
  const applicableGroups = matching.length
    ? matching
    : groups.filter((candidate) => candidate.agents.includes("*"))
  const rules = applicableGroups
    .flatMap((candidate) => candidate.rules)
    .filter((rule) => rule.value)
  const matched = rules
    .filter((rule) => robotsPatternMatches(rule.value, pathname))
    .sort(
      (left, right) =>
        right.value.replace(/[*$]/g, "").length - left.value.replace(/[*$]/g, "").length
    )
  return matched.length === 0 || matched[0].name === "allow"
}

export function isBlockedResponse(status) {
  return status === 403 || status === 429 || status >= 500
}

export function assessRoute({
  firstStatus,
  finalStatus,
  finalUrl,
  expected = {},
  isHtml,
  noindex,
  selfCanonical,
}) {
  if (isBlockedResponse(firstStatus) || isBlockedResponse(finalStatus)) return "BLOCKED"
  const expectedRedirect = expected.redirectTo
  if (expectedRedirect) {
    if (firstStatus < 300 || firstStatus >= 400) return "FAIL"
    if (finalStatus < 200 || finalStatus >= 300) return "FAIL"
    return normalizeUrl(finalUrl) === normalizeUrl(expectedRedirect) ? "PASS" : "FAIL"
  }
  if (finalStatus < 200 || finalStatus >= 300) return "FAIL"
  if (expected.indexable === false) return noindex ? "PASS" : "FAIL"
  if (expected.indexable === true && noindex) return "FAIL"
  if (isHtml && expected.selfCanonical !== false && !selfCanonical) return "FAIL"
  return "PASS"
}

export function noindexHreflangStatus(alternates, responseByUrl) {
  if (!alternates.length) return "none"
  let blocked = false
  for (const alternate of alternates) {
    const target = responseByUrl.get(normalizeUrl(alternate.url))
    if (!target) {
      blocked = true
      continue
    }
    if (target.verdict === "BLOCKED") blocked = true
    else if (target.status < 200 || target.status >= 300 || target.noindex || target._noindex)
      return "yes"
  }
  return blocked ? "BLOCKED" : "no"
}

export function compareAlternateChannels(channels) {
  const populated = Object.values(channels)
    .filter((items) => items.length)
    .map(
      (items) =>
        new Set(items.map((item) => `${item.language.toLowerCase()}:${normalizeUrl(item.url)}`))
    )
  if (populated.length < 2) return "single-channel"
  return populated.every(
    (set) => set.size === populated[0].size && [...set].every((item) => populated[0].has(item))
  )
    ? "consistent"
    : "inconsistent"
}

function robotsPatternMatches(pattern, pathname) {
  const anchored = pattern.endsWith("$")
  const value = anchored ? pattern.slice(0, -1) : pattern
  const escaped = value.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*")
  return new RegExp(`^${escaped}${anchored ? "$" : ""}`).test(pathname)
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
}
