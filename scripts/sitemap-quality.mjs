import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import * as cheerio from "cheerio"
import {
  assessRoute,
  classifyUrl,
  compareAlternateChannels,
  isBlockedResponse,
  noindexHreflangStatus,
  normalizeUrl,
  parseHttpLinkAlternates,
  parseRobotsTxt,
  parseSitemapEntries,
} from "./sitemap-quality-utils.mjs"

const DEFAULT_SITEMAP = "https://geekskai.com/sitemap.xml"
const DEFAULT_OUTPUT = "reports/seo/sitemap-quality.csv"
const LOCALES = new Set(["en", "ar", "de", "fr", "es", "ja", "ko", "no", "zh-cn", "da"])
const LANGUAGE_WORDS = {
  en: new Set(["the", "and", "for", "with", "this", "that", "from", "your", "you", "are"]),
  fr: new Set(["le", "la", "les", "des", "pour", "avec", "vous", "une", "est", "dans"]),
  es: new Set(["el", "la", "los", "las", "para", "con", "una", "que", "del", "esta"]),
  de: new Set(["der", "die", "das", "und", "fur", "mit", "eine", "ist", "von", "den"]),
  it: new Set(["il", "la", "gli", "per", "con", "una", "che", "del", "dei", "questo"]),
  pt: new Set(["o", "a", "os", "para", "com", "uma", "que", "dos", "das", "este"]),
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const sitemapUrl = args.sitemap || DEFAULT_SITEMAP
  const outputPath = path.resolve(args.output || DEFAULT_OUTPUT)
  const gscRows = args["gsc-csv"] ? await loadGscCsv(path.resolve(args["gsc-csv"])) : new Map()
  const routeListPath = args.routes ? path.resolve(args.routes) : null

  console.log(`Fetching sitemap: ${sitemapUrl}`)
  const sitemapData = await loadSitemapData(sitemapUrl, { allowFailure: Boolean(routeListPath) })
  const routeEntries = routeListPath
    ? await loadRouteList(routeListPath)
    : [...sitemapData.entries.values()].map((entry) => ({ url: entry.url, expected: {} }))
  const uniqueRoutes = [
    ...new Map(routeEntries.map((route) => [normalizeUrl(route.url), route])).values(),
  ]
  console.log(
    `Auditing ${uniqueRoutes.length} unique URLs with concurrency ${args.concurrency || 8}`
  )

  const robotsCache = new Map()
  const rows = await mapConcurrent(
    uniqueRoutes,
    Number(args.concurrency || 8),
    async (route, index) => {
      const row = await auditUrl(route, sitemapData, robotsCache)
      if ((index + 1) % 25 === 0 || index + 1 === uniqueRoutes.length) {
        console.log(`Audited ${index + 1}/${uniqueRoutes.length}`)
      }
      return row
    }
  )

  const extraHreflangRows = await auditMissingHreflangTargets(
    rows,
    sitemapData,
    robotsCache,
    Number(args.concurrency || 8)
  )
  enrichCrossPageChecks(rows, extraHreflangRows)
  for (const row of rows) {
    const gsc = gscRows.get(normalizeUrl(row.url)) || {}
    row.gsc_clicks = gsc.clicks || ""
    row.gsc_impressions = gsc.impressions || ""
    row.gsc_last_crawled = gsc.lastCrawled || ""
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, toCsv(rows), "utf8")

  const summary = rows.reduce(
    (result, row) => {
      result.total += 1
      if (row.indexable === "yes") result.indexable += 1
      if (row.status !== 200) result.non200 += 1
      if (row.self_canonical !== "yes") result.nonSelfCanonical += 1
      if (row.hreflang_targets_200 === "no" || row.hreflang_reciprocal === "no")
        result.hreflangIssues += 1
      return result
    },
    { total: 0, indexable: 0, non200: 0, nonSelfCanonical: 0, hreflangIssues: 0 }
  )

  console.log(`Wrote ${outputPath}`)
  console.log(JSON.stringify(summary, null, 2))
}

function parseArgs(values) {
  const parsed = {}
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (!value.startsWith("--")) continue
    const key = value.slice(2)
    parsed[key] = values[index + 1] && !values[index + 1].startsWith("--") ? values[++index] : true
  }
  return parsed
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "GeekskaiSitemapQualityAudit/1.0" },
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.text()
}

async function loadSitemapData(url, { seen = new Set(), allowFailure = false } = {}) {
  if (seen.has(url)) return { entries: new Map(), status: "PASS" }
  seen.add(url)
  try {
    const xml = await fetchText(url)
    if (/<sitemapindex[\s>]/i.test(xml)) {
      const children = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
        decodeXml(match[1].trim())
      )
      const nested = await Promise.all(
        children.map((location) => loadSitemapData(location, { seen, allowFailure }))
      )
      return {
        entries: new Map(nested.flatMap((result) => [...result.entries])),
        status: nested.some((result) => result.status === "BLOCKED") ? "BLOCKED" : "PASS",
      }
    }
    const entries = new Map(
      parseSitemapEntries(xml, url).map((entry) => [normalizeUrl(entry.url), entry])
    )
    return { entries, status: "PASS" }
  } catch (error) {
    if (!allowFailure) throw error
    return {
      entries: new Map(),
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
}

async function loadRouteList(filePath) {
  const raw = await fs.readFile(filePath, "utf8")
  let values
  if (filePath.endsWith(".json")) {
    const value = JSON.parse(raw)
    values = Array.isArray(value) ? value : value.urls || value.routes || []
  } else {
    values = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
  }
  return values
    .map((value) =>
      typeof value === "string"
        ? { url: value, expected: {} }
        : {
            url: value.url,
            expected: value.expected || value.expect || {},
          }
    )
    .filter((route) => route.url)
}

async function auditUrl(route, sitemapData, robotsCache = new Map()) {
  const url = typeof route === "string" ? route : route.url
  const expected = typeof route === "string" ? {} : route.expected || {}
  const sitemapEntry = sitemapData.entries.get(normalizeUrl(url))
  const base = {
    content_type: classifyUrl(url),
    url,
    first_status: "",
    status: "",
    redirect_chain: "",
    final_url: "",
    indexable: "no",
    robots: "",
    canonical: "",
    html_alternates: "",
    http_alternates: "",
    first_hop_http_alternates: "",
    sitemap_alternates: "",
    in_sitemap: sitemapEntry ? "yes" : "no",
    sitemap_alternates_expected:
      sitemapData.status === "BLOCKED"
        ? "BLOCKED"
        : expected.sitemap === undefined
          ? "unspecified"
          : expected.sitemap
            ? "yes"
            : "no",
    hreflang_channels_consistent: "unknown",
    hreflang_noindex_target: "unknown",
    robots_txt: "BLOCKED",
    verdict: "BLOCKED",
    self_canonical: "no",
    declared_language: "",
    body_language_heuristic: "unknown",
    hreflang_count: 0,
    hreflang_targets: "",
    hreflang_targets_200: "unknown",
    hreflang_reciprocal: "unknown",
    word_count: 0,
    similarity_to_english: "",
    gsc_clicks: "",
    gsc_impressions: "",
    gsc_last_crawled: "",
    error: "",
    _text: "",
    _hreflangs: [],
  }

  try {
    const chain = []
    const requestPage = (requestUrl) =>
      fetch(requestUrl, {
        redirect: "manual",
        headers: { "user-agent": "GeekskaiSitemapQualityAudit/1.0" },
        signal: AbortSignal.timeout(20_000),
      })
    let response = await requestPage(url)
    const firstResponse = response
    chain.push(`${response.status} ${url}`)
    let finalUrl = url
    while (
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.get("location") &&
      chain.length < 10
    ) {
      finalUrl = new URL(response.headers.get("location"), finalUrl).toString()
      response = await requestPage(finalUrl)
      chain.push(`${response.status} ${finalUrl}`)
    }
    const finalResponse = response
    const html = await finalResponse.text()
    const contentType = finalResponse.headers.get("content-type") || ""
    const isHtml =
      contentType.toLowerCase().includes("text/html") || /<html[\s>]/i.test(html.slice(0, 500))
    const $ = cheerio.load(isHtml ? html : "")
    $("script, style, noscript, svg, nav, footer").remove()
    const robots = [
      firstResponse.headers.get("x-robots-tag") || "",
      finalResponse.headers.get("x-robots-tag") || "",
      $('meta[name="robots"]').attr("content") || "",
      $('meta[name="googlebot"]').attr("content") || "",
    ]
      .filter(Boolean)
      .join("; ")
      .toLowerCase()
    const noindex = /\bnoindex\b/.test(robots)
    const canonicalHref = $('link[rel="canonical"]').attr("href") || ""
    const canonical = canonicalHref ? new URL(canonicalHref, finalUrl).toString() : ""
    const htmlAlternates = $('link[rel="alternate"][hreflang]')
      .map((_, element) => ({
        language: $(element).attr("hreflang") || "",
        url: new URL($(element).attr("href") || "", finalUrl).toString(),
      }))
      .get()
    const firstHopHttpAlternates = parseHttpLinkAlternates(firstResponse.headers.get("link"), url)
    const httpAlternates = parseHttpLinkAlternates(finalResponse.headers.get("link"), finalUrl)
    const sitemapAlternates = sitemapEntry?.alternates || []
    const text = ($("main").text() || $("article").text() || $("body").text())
      .replace(/\s+/g, " ")
      .trim()
    const wordCount = tokenize(text).length
    const selfCanonical = Boolean(canonical) && normalizeUrl(canonical) === normalizeUrl(url)
    const robotsInfo = await getRobotsInfo(url, robotsCache)
    const firstStatus = firstResponse.status
    const status = finalResponse.status
    const routeVerdict = assessRoute({
      firstStatus,
      finalStatus: status,
      finalUrl,
      expected,
      isHtml,
      noindex,
      selfCanonical,
    })
    const redirectHttpAlternates = firstStatus !== status ? firstHopHttpAlternates : []
    const channels = {
      html: htmlAlternates,
      http: httpAlternates,
      sitemap: sitemapAlternates,
      redirectHttp: redirectHttpAlternates,
    }
    let verdict = routeVerdict
    if (expected.status !== undefined && status !== expected.status) verdict = "FAIL"
    if (
      expected.canonical &&
      normalizeUrl(canonical) !== normalizeUrl(new URL(expected.canonical, url).toString())
    )
      verdict = "FAIL"
    if (expected.sitemap !== undefined && (sitemapEntry !== undefined) !== expected.sitemap)
      verdict = "FAIL"
    if (expected.hreflang === false && Object.values(channels).some((items) => items.length))
      verdict = "FAIL"
    if (expected.hreflangTargets) {
      const actual = htmlAlternates
        .map((item) => `${item.language}:${normalizeUrl(item.url)}`)
        .sort()
      const wanted = expected.hreflangTargets
        .map((item) => `${item.language}:${normalizeUrl(new URL(item.url, url).toString())}`)
        .sort()
      if (actual.join("|") !== wanted.join("|")) verdict = "FAIL"
    }
    if (expected.robotsAllowed !== undefined) {
      if (robotsInfo.googlebotAllowed !== expected.robotsAllowed)
        verdict = robotsInfo.status === "BLOCKED" ? "BLOCKED" : "FAIL"
    } else if (!robotsInfo.googlebotAllowed) {
      verdict = "FAIL"
    }
    const channelsConsistency = compareAlternateChannels(channels)
    if (channelsConsistency === "inconsistent") verdict = "FAIL"
    if (
      robotsInfo.status === "BLOCKED" ||
      isBlockedResponse(firstStatus) ||
      isBlockedResponse(status)
    )
      verdict = "BLOCKED"

    return {
      ...base,
      first_status: firstStatus,
      status,
      redirect_chain: chain.join(" -> "),
      final_url: finalUrl,
      indexable:
        status === 200 && !noindex && selfCanonical && robotsInfo.googlebotAllowed ? "yes" : "no",
      robots: robots || "index,follow (implicit)",
      canonical,
      self_canonical: selfCanonical ? "yes" : "no",
      robots_txt:
        robotsInfo.status === "BLOCKED"
          ? "BLOCKED"
          : `Googlebot:${robotsInfo.googlebotAllowed ? "allowed" : "blocked"}; GPTBot:${robotsInfo.gptbotAllowed ? "allowed" : "blocked"}; PerplexityBot:${robotsInfo.perplexityAllowed ? "allowed" : "blocked"}`,
      declared_language: $("html").attr("lang") || "",
      body_language_heuristic: detectLanguage(text),
      hreflang_count: htmlAlternates.length,
      hreflang_targets: htmlAlternates.map((item) => `${item.language}:${item.url}`).join(" | "),
      html_alternates: htmlAlternates.map((item) => `${item.language}:${item.url}`).join(" | "),
      http_alternates: httpAlternates.map((item) => `${item.language}:${item.url}`).join(" | "),
      first_hop_http_alternates: firstHopHttpAlternates
        .map((item) => `${item.language}:${item.url}`)
        .join(" | "),
      sitemap_alternates: sitemapAlternates
        .map((item) => `${item.language}:${item.url}`)
        .join(" | "),
      hreflang_channels_consistent: channelsConsistency,
      hreflang_noindex_target: "pending-target-check",
      verdict,
      word_count: wordCount,
      _firstStatus: firstStatus,
      _noindex: noindex,
      _channels: channels,
      _text: text,
      _hreflangs: [
        ...htmlAlternates,
        ...httpAlternates,
        ...sitemapAlternates,
        ...redirectHttpAlternates,
      ],
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ...base, error: message, verdict: "BLOCKED" }
  }
}

async function auditMissingHreflangTargets(rows, sitemapData, robotsCache, concurrency) {
  const sourceUrls = new Set(rows.map((row) => normalizeUrl(row.url)))
  const missingUrls = [
    ...new Set(
      rows
        .flatMap((row) => row._hreflangs.map((item) => item.url))
        .filter((url) => !sourceUrls.has(normalizeUrl(url)))
    ),
  ]
  if (missingUrls.length === 0) return []
  console.log(`Auditing ${missingUrls.length} language targets outside the route list`)
  return mapConcurrent(missingUrls, concurrency, (url) =>
    auditUrl({ url, expected: {} }, sitemapData, robotsCache)
  )
}

function enrichCrossPageChecks(rows, extraHreflangRows = []) {
  const byUrl = new Map([...rows, ...extraHreflangRows].map((row) => [normalizeUrl(row.url), row]))
  const englishByTemplate = new Map()
  for (const row of rows) {
    const { locale, template } = getLocaleTemplate(row.url)
    if (locale === "en") englishByTemplate.set(template, row)
  }

  for (const row of rows) {
    if (row._hreflangs.length > 0) {
      const targets = row._hreflangs.map((item) => byUrl.get(normalizeUrl(item.url)))
      row.hreflang_targets_200 = targets.every(
        (target) => target?.status >= 200 && target?.status < 300
      )
        ? "yes"
        : targets.some((target) => !target || target.verdict === "BLOCKED")
          ? "BLOCKED"
          : "no"
      row.hreflang_reciprocal = targets.every((target) =>
        target?._hreflangs?.some((item) => normalizeUrl(item.url) === normalizeUrl(row.url))
      )
        ? "yes"
        : "no"
      row.hreflang_noindex_target = noindexHreflangStatus(row._hreflangs, byUrl)
      if (
        row.hreflang_noindex_target === "yes" ||
        row.hreflang_targets_200 === "no" ||
        row.hreflang_reciprocal === "no"
      ) {
        row.verdict = "FAIL"
      } else if (
        row.hreflang_noindex_target === "BLOCKED" ||
        row.hreflang_targets_200 === "BLOCKED"
      ) {
        row.verdict = "BLOCKED"
      }
    }

    const { locale, template } = getLocaleTemplate(row.url)
    const english = englishByTemplate.get(template)
    if (locale !== "en" && english?._text && row._text) {
      row.similarity_to_english = jaccard(shingles(row._text), shingles(english._text)).toFixed(3)
    }
  }

  for (const row of rows) {
    delete row._text
    delete row._hreflangs
    delete row._firstStatus
    delete row._noindex
    delete row._channels
  }
}

async function getRobotsInfo(url, cache) {
  const parsed = new URL(url)
  const robotsUrl = `${parsed.origin}/robots.txt`
  if (!cache.has(parsed.origin)) {
    cache.set(
      parsed.origin,
      (async () => {
        try {
          const response = await fetch(robotsUrl, {
            redirect: "follow",
            signal: AbortSignal.timeout(20_000),
          })
          if (isBlockedResponse(response.status)) return { status: "BLOCKED" }
          if (response.status === 404) return { status: "PASS", text: "" }
          if (!response.ok) return { status: "BLOCKED" }
          return { status: "PASS", text: await response.text() }
        } catch {
          return { status: "BLOCKED" }
        }
      })()
    )
  }
  const result = await cache.get(parsed.origin)
  if (result.status === "BLOCKED") return result
  return {
    status: "PASS",
    googlebotAllowed: parseRobotsTxt(result.text, parsed.pathname, "Googlebot"),
    gptbotAllowed: parseRobotsTxt(result.text, parsed.pathname, "GPTBot"),
    perplexityAllowed: parseRobotsTxt(result.text, parsed.pathname, "PerplexityBot"),
  }
}

function getLocaleTemplate(value) {
  const url = new URL(value)
  const parts = url.pathname.split("/").filter(Boolean)
  const locale = LOCALES.has(parts[0]) ? parts.shift() : "en"
  return { locale, template: `/${parts.join("/")}/` }
}

function tokenize(text) {
  return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []
}

function detectLanguage(text) {
  const tokens = tokenize(text)
  let best = { language: "unknown", score: 0 }
  for (const [language, words] of Object.entries(LANGUAGE_WORDS)) {
    const score = tokens.reduce((total, token) => total + (words.has(token) ? 1 : 0), 0)
    if (score > best.score) best = { language, score }
  }
  return best.score >= 5 ? best.language : "unknown"
}

function shingles(text, size = 5) {
  const tokens = tokenize(text)
  const values = new Set()
  for (let index = 0; index <= tokens.length - size; index += 1) {
    values.add(tokens.slice(index, index + size).join(" "))
  }
  return values
}

function jaccard(left, right) {
  if (left.size === 0 && right.size === 0) return 1
  let intersection = 0
  for (const item of left) if (right.has(item)) intersection += 1
  return intersection / (left.size + right.size - intersection || 1)
}

async function mapConcurrent(values, concurrency, worker) {
  const results = new Array(values.length)
  let nextIndex = 0
  const runners = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex++
      results[index] = await worker(values[index], index)
    }
  })
  await Promise.all(runners)
  return results
}

async function loadGscCsv(filePath) {
  const records = parseCsv(await fs.readFile(filePath, "utf8"))
  if (records.length < 2) return new Map()
  const headers = records[0].map((header) => header.trim().toLowerCase())
  const pageIndex = findHeader(headers, ["page", "top pages", "url"])
  const clicksIndex = findHeader(headers, ["clicks"])
  const impressionsIndex = findHeader(headers, ["impressions"])
  const crawledIndex = findHeader(headers, ["last crawled", "last crawl"])
  if (pageIndex < 0) throw new Error("GSC CSV needs a Page, Top pages, or URL column")
  return new Map(
    records.slice(1).map((record) => [
      normalizeUrl(record[pageIndex]),
      {
        clicks: clicksIndex >= 0 ? record[clicksIndex] : "",
        impressions: impressionsIndex >= 0 ? record[impressionsIndex] : "",
        lastCrawled: crawledIndex >= 0 ? record[crawledIndex] : "",
      },
    ])
  )
}

function findHeader(headers, candidates) {
  return headers.findIndex((header) => candidates.includes(header))
}

function parseCsv(input) {
  const rows = []
  let row = []
  let cell = ""
  let quoted = false
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    if (quoted && character === '"' && input[index + 1] === '"') {
      cell += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === "," && !quoted) {
      row.push(cell)
      cell = ""
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1
      row.push(cell)
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ""
    } else {
      cell += character
    }
  }
  row.push(cell)
  if (row.some(Boolean)) rows.push(row)
  return rows
}

function toCsv(rows) {
  const headers = Object.keys(rows[0] || {})
  const escape = (value) => {
    const text = String(value ?? "")
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
  }
  return `${headers.join(",")}\n${rows
    .map((row) => headers.map((header) => escape(row[header])).join(","))
    .join("\n")}\n`
}

export { auditUrl, enrichCrossPageChecks }
