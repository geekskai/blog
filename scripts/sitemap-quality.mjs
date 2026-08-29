import fs from "node:fs/promises"
import path from "node:path"

import * as cheerio from "cheerio"

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

const args = parseArgs(process.argv.slice(2))
const sitemapUrl = args.sitemap || DEFAULT_SITEMAP
const outputPath = path.resolve(args.output || DEFAULT_OUTPUT)
const gscRows = args["gsc-csv"] ? await loadGscCsv(path.resolve(args["gsc-csv"])) : new Map()

console.log(`Fetching sitemap: ${sitemapUrl}`)
const sitemapUrls = [...new Set(await loadSitemapUrls(sitemapUrl))]
console.log(`Auditing ${sitemapUrls.length} unique URLs with concurrency ${args.concurrency || 8}`)

const rows = await mapConcurrent(sitemapUrls, Number(args.concurrency || 8), async (url, index) => {
  const row = await auditUrl(url)
  if ((index + 1) % 25 === 0 || index + 1 === sitemapUrls.length) {
    console.log(`Audited ${index + 1}/${sitemapUrls.length}`)
  }
  return row
})

const extraHreflangRows = await auditMissingHreflangTargets(rows, Number(args.concurrency || 8))
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
    if (row.hreflang_targets_200 === "no" || row.hreflang_reciprocal === "no") {
      result.hreflangIssues += 1
    }
    return result
  },
  { total: 0, indexable: 0, non200: 0, nonSelfCanonical: 0, hreflangIssues: 0 }
)

console.log(`Wrote ${outputPath}`)
console.log(JSON.stringify(summary, null, 2))

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

async function loadSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return []
  seen.add(url)
  const xml = await fetchText(url)
  const locations = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
    decodeXml(match[1].trim())
  )
  if (!/<sitemapindex[\s>]/i.test(xml)) return locations
  const nested = await Promise.all(locations.map((location) => loadSitemapUrls(location, seen)))
  return nested.flat()
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
}

async function auditUrl(url) {
  const base = {
    content_type: classifyUrl(url),
    url,
    status: "",
    final_url: "",
    indexable: "no",
    robots: "",
    canonical: "",
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
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "GeekskaiSitemapQualityAudit/1.0" },
      signal: AbortSignal.timeout(20_000),
    })
    const html = await response.text()
    const $ = cheerio.load(html)
    $("script, style, noscript, svg, nav, footer").remove()
    const robots = [
      response.headers.get("x-robots-tag") || "",
      $('meta[name="robots"]').attr("content") || "",
      $('meta[name="googlebot"]').attr("content") || "",
    ]
      .filter(Boolean)
      .join("; ")
      .toLowerCase()
    const canonicalHref = $('link[rel="canonical"]').attr("href") || ""
    const canonical = canonicalHref ? new URL(canonicalHref, response.url).toString() : ""
    const hreflangs = $('link[rel="alternate"][hreflang]')
      .map((_, element) => ({
        language: $(element).attr("hreflang") || "",
        url: new URL($(element).attr("href") || "", response.url).toString(),
      }))
      .get()
    const text = ($("main").text() || $("article").text() || $("body").text())
      .replace(/\s+/g, " ")
      .trim()
    const wordCount = tokenize(text).length
    const selfCanonical = Boolean(canonical) && normalizeUrl(canonical) === normalizeUrl(url)

    return {
      ...base,
      status: response.status,
      final_url: response.url,
      indexable:
        response.status === 200 && !/\bnoindex\b/.test(robots) && selfCanonical ? "yes" : "no",
      robots: robots || "index,follow (implicit)",
      canonical,
      self_canonical: selfCanonical ? "yes" : "no",
      declared_language: $("html").attr("lang") || "",
      body_language_heuristic: detectLanguage(text),
      hreflang_count: hreflangs.length,
      hreflang_targets: hreflangs.map((item) => `${item.language}:${item.url}`).join(" | "),
      word_count: wordCount,
      _text: text,
      _hreflangs: hreflangs,
    }
  } catch (error) {
    return { ...base, error: error instanceof Error ? error.message : String(error) }
  }
}

async function auditMissingHreflangTargets(rows, concurrency) {
  const sitemapUrls = new Set(rows.map((row) => normalizeUrl(row.url)))
  const missingUrls = [
    ...new Set(
      rows
        .flatMap((row) => row._hreflangs.map((item) => item.url))
        .filter((url) => !sitemapUrls.has(normalizeUrl(url)))
    ),
  ]
  if (missingUrls.length === 0) return []
  console.log(`Auditing ${missingUrls.length} hreflang targets outside the sitemap`)
  return mapConcurrent(missingUrls, concurrency, auditUrl)
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
      row.hreflang_targets_200 = targets.every((target) => target?.status === 200) ? "yes" : "no"
      row.hreflang_reciprocal = targets.every((target) =>
        target?._hreflangs?.some((item) => normalizeUrl(item.url) === normalizeUrl(row.url))
      )
        ? "yes"
        : "no"
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
  }
}

function getLocaleTemplate(value) {
  const url = new URL(value)
  const parts = url.pathname.split("/").filter(Boolean)
  const locale = LOCALES.has(parts[0]) ? parts.shift() : "en"
  return { locale, template: `/${parts.join("/")}/` }
}

function classifyUrl(value) {
  const pathname = new URL(value).pathname
  if (/\/(?:[a-z]{2}\/)?blog\//.test(pathname)) return "blog"
  if (/\/(?:[a-z]{2}\/)?tools\//.test(pathname)) return "tool"
  return "site-page"
}

function normalizeUrl(value) {
  try {
    const url = new URL(value)
    url.hash = ""
    url.search = ""
    url.hostname = url.hostname.toLowerCase()
    url.pathname = url.pathname === "/" ? "/" : `${url.pathname.replace(/\/+$/, "")}/`
    return url.toString()
  } catch {
    return value
  }
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
