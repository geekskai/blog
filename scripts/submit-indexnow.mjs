import { readFileSync, readdirSync, existsSync } from "fs"
import { resolve, basename } from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const siteMetadata = require("../data/siteMetadata.js")

const DEFAULT_SITEMAP_PATH = "public/sitemap.xml"
const DEFAULT_ENDPOINT = "https://api.indexnow.org/indexnow"
const DEFAULT_BATCH_SIZE = 10000

function parseArgs(argv) {
  const options = {}

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]

    if (arg === "--sitemap" && next) {
      options.sitemapPath = next
      i += 1
      continue
    }

    if (arg === "--key" && next) {
      options.key = next
      i += 1
      continue
    }

    if (arg === "--key-location" && next) {
      options.keyLocation = next
      i += 1
      continue
    }

    if (arg === "--endpoint" && next) {
      options.endpoint = next
      i += 1
      continue
    }

    if (arg === "--batch-size" && next) {
      const size = Number.parseInt(next, 10)
      if (!Number.isNaN(size) && size > 0) {
        options.batchSize = size
      }
      i += 1
      continue
    }

    if (arg === "--dry-run") {
      options.dryRun = true
    }
  }

  return options
}

function extractLocValues(xml) {
  const urls = []
  const locRegex = /<loc>(.*?)<\/loc>/g
  let match = locRegex.exec(xml)

  while (match !== null) {
    urls.push(match[1].trim())
    match = locRegex.exec(xml)
  }

  return urls
}

function extractUrlsFromSitemap(xml) {
  const isSitemapIndex = xml.includes("<sitemapindex")
  if (isSitemapIndex) {
    throw new Error(
      "当前 sitemap.xml 是 sitemap index。请传入具体 urlset 文件，或扩展脚本处理多级 sitemap。"
    )
  }

  return extractLocValues(xml).filter((url) => /^https?:\/\//.test(url))
}

function uniqueUrls(urls) {
  return Array.from(new Set(urls))
}

function detectKeyFromPublic(publicDir) {
  if (!existsSync(publicDir)) {
    return null
  }

  const files = readdirSync(publicDir).filter((file) => file.endsWith(".txt"))

  for (const file of files) {
    const filepath = resolve(publicDir, file)
    const content = readFileSync(filepath, "utf-8").trim()
    const filenameWithoutExt = basename(file, ".txt")

    if (content && content === filenameWithoutExt) {
      return content
    }
  }

  return null
}

function chunkArray(items, chunkSize) {
  const chunks = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

async function submitBatch({ endpoint, host, key, keyLocation, urls, batchIndex, totalBatches }) {
  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls,
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  })

  const bodyText = await res.text()
  const label = `[${batchIndex}/${totalBatches}]`

  if (!res.ok) {
    throw new Error(`IndexNow 提交失败 ${label}，状态码 ${res.status}，响应：${bodyText}`)
  }

  console.log(`IndexNow 提交成功 ${label}，本批 ${urls.length} 条`)
  if (bodyText) {
    console.log(`响应：${bodyText}`)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const sitemapPath = options.sitemapPath || process.env.SITEMAP_PATH || DEFAULT_SITEMAP_PATH
  const endpoint = options.endpoint || process.env.INDEXNOW_ENDPOINT || DEFAULT_ENDPOINT
  const batchSize =
    options.batchSize ||
    Number.parseInt(process.env.INDEXNOW_BATCH_SIZE || "", 10) ||
    DEFAULT_BATCH_SIZE

  const projectRoot = process.cwd()
  const sitemapAbsPath = resolve(projectRoot, sitemapPath)
  const sitemapXml = readFileSync(sitemapAbsPath, "utf-8")

  const urls = uniqueUrls(extractUrlsFromSitemap(sitemapXml))
  if (urls.length === 0) {
    throw new Error("未在 sitemap 中解析到 URL。")
  }

  const siteUrl = siteMetadata.siteUrl
  const host = new URL(siteUrl).host

  const key =
    options.key || process.env.INDEXNOW_KEY || detectKeyFromPublic(resolve(projectRoot, "public"))

  if (!key) {
    throw new Error(
      "未找到 IndexNow key。请通过 --key / INDEXNOW_KEY 提供，或在 public 下放置 key.txt（文件名与内容相同）。"
    )
  }

  const keyLocation =
    options.keyLocation ||
    process.env.INDEXNOW_KEY_LOCATION ||
    `${siteUrl.replace(/\/$/, "")}/${key}.txt`

  if (options.dryRun) {
    console.log("Dry run 模式，不会发起网络请求。")
    console.log(`endpoint: ${endpoint}`)
    console.log(`host: ${host}`)
    console.log(`keyLocation: ${keyLocation}`)
    console.log(`url 总数: ${urls.length}`)
    console.log("前 10 条 URL:")
    urls.slice(0, 10).forEach((url) => console.log(`- ${url}`))
    return
  }

  const batches = chunkArray(urls, Math.min(batchSize, DEFAULT_BATCH_SIZE))
  console.log(`准备提交 ${urls.length} 条 URL，分 ${batches.length} 批。`)

  for (let i = 0; i < batches.length; i += 1) {
    await submitBatch({
      endpoint,
      host,
      key,
      keyLocation,
      urls: batches[i],
      batchIndex: i + 1,
      totalBatches: batches.length,
    })
  }

  console.log("全部 URL 已提交到 IndexNow。")
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
