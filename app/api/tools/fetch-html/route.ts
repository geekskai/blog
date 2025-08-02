import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

interface FetchHtmlRequest {
  url: string
}

interface FetchHtmlResponse {
  success: boolean
  html?: string
  title?: string
  error?: string
  url: string
  wordCount?: number
  size?: number
}

export async function POST(request: NextRequest) {
  try {
    const { url }: FetchHtmlRequest = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required", url: "" },
        { status: 400 }
      )
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: "Invalid URL format", url },
        { status: 400 }
      )
    }

    // Fetch the HTML content
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HtmlToMarkdownBot/1.0; +https://geekskai.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("text/html")) {
      throw new Error("URL does not return HTML content")
    }

    const html = await response.text()

    if (!html || html.trim().length === 0) {
      throw new Error("No content found at the specified URL")
    }

    // Parse HTML and extract useful information
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract title
    const title = extractTitle(document)

    // Extract main content
    const mainContent = extractMainContent(document, url)

    // Calculate basic stats
    const wordCount = estimateWordCount(mainContent)
    const size = new Blob([mainContent]).size

    const result: FetchHtmlResponse = {
      success: true,
      html: mainContent,
      title,
      url,
      wordCount,
      size,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Fetch HTML error:", error)

    let errorMessage = "Failed to fetch URL"
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Request timeout - URL took too long to respond"
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "Domain not found - please check the URL"
      } else if (error.message.includes("ECONNREFUSED")) {
        errorMessage = "Connection refused - server may be down"
      } else if (error.message.includes("ECONNRESET")) {
        errorMessage = "Connection reset - please try again"
      } else if (error.message.includes("ETIMEDOUT")) {
        errorMessage = "Connection timeout - server is not responding"
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        url: (await request.json().catch(() => ({ url: "unknown" }))).url || "unknown",
      },
      { status: 500 }
    )
  }
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return ["http:", "https:"].includes(url.protocol)
  } catch {
    return false
  }
}

function extractTitle(document: Document): string {
  // Try multiple methods to extract title
  const titleSources = [
    () => document.querySelector("title")?.textContent,
    () => document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    () => document.querySelector('meta[name="twitter:title"]')?.getAttribute("content"),
    () => document.querySelector("h1")?.textContent,
    () => document.querySelector('meta[name="title"]')?.getAttribute("content"),
  ]

  for (const getTitle of titleSources) {
    const title = getTitle()?.trim()
    if (title && title.length > 0) {
      return title.length > 100 ? title.substring(0, 100) + "..." : title
    }
  }

  return "Untitled Document"
}

function extractMainContent(document: Document, baseUrl: string): string {
  // Remove unwanted elements
  const unwantedSelectors = [
    "script",
    "style",
    "noscript",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "select",
    "textarea",
    "nav",
    "header",
    "footer",
    "aside",
    ".nav",
    ".navigation",
    ".navbar",
    ".header",
    ".footer",
    ".sidebar",
    ".menu",
    ".breadcrumb",
    ".advertisement",
    ".ad",
    ".popup",
    ".modal",
    ".cookie",
    ".social-share",
    ".comments",
    ".related-posts",
    ".recommended",
    "#comments",
    "#sidebar",
    "#footer",
    "#header",
    "#navigation",
  ]

  // Create a copy to avoid modifying the original
  const clonedDocument = document.cloneNode(true) as Document

  unwantedSelectors.forEach((selector) => {
    const elements = clonedDocument.querySelectorAll(selector)
    elements.forEach((el) => el.remove())
  })

  // Try to find main content using various selectors
  const contentSelectors = [
    "main",
    "article",
    '[role="main"]',
    ".main-content",
    ".content",
    ".post-content",
    ".entry-content",
    ".article-content",
    ".page-content",
    "#main-content",
    "#content",
    "#main",
    ".container .content",
    ".wrapper .content",
  ]

  let mainElement: Element | null = null

  for (const selector of contentSelectors) {
    mainElement = clonedDocument.querySelector(selector)
    if (mainElement && mainElement.textContent && mainElement.textContent.trim().length > 200) {
      break
    }
  }

  // Fallback to body if no main content found
  if (!mainElement || !mainElement.textContent || mainElement.textContent.trim().length < 200) {
    mainElement = clonedDocument.body
  }

  if (!mainElement) {
    return clonedDocument.documentElement.innerHTML || ""
  }

  // Fix relative URLs
  fixRelativeUrls(mainElement, baseUrl)

  return mainElement.innerHTML
}

function fixRelativeUrls(element: Element, baseUrl: string): void {
  const base = new URL(baseUrl)

  // Fix image sources
  const images = element.querySelectorAll("img[src]")
  images.forEach((img) => {
    const src = img.getAttribute("src")
    if (src && !src.startsWith("http") && !src.startsWith("data:")) {
      try {
        const absoluteUrl = new URL(src, base).toString()
        img.setAttribute("src", absoluteUrl)
      } catch (e) {
        // Invalid URL, remove the image
        img.remove()
      }
    }
  })

  // Fix links
  const links = element.querySelectorAll("a[href]")
  links.forEach((link) => {
    const href = link.getAttribute("href")
    if (
      href &&
      !href.startsWith("http") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      !href.startsWith("#")
    ) {
      try {
        const absoluteUrl = new URL(href, base).toString()
        link.setAttribute("href", absoluteUrl)
      } catch (e) {
        // Invalid URL, keep as is
      }
    }
  })
}

function estimateWordCount(html: string): number {
  // Remove HTML tags and count words
  const text = html
    .replace(/<[^>]*>/g, " ") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  if (!text) return 0

  return text.split(" ").filter((word) => word.length > 0).length
}

// Handle CORS for development
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
