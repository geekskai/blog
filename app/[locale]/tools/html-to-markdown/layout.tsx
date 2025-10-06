import { Metadata } from "next"

export const metadata: Metadata = {
  title: "HTML to Markdown Converter - Free Online Tool | Convert HTML to MD",
  description:
    "Free HTML to Markdown converter with batch processing, URL support, and advanced customization. Convert websites and HTML code to clean Markdown format instantly. No registration required.",
  keywords: [
    "html to markdown",
    "html to md converter",
    "markdown converter",
    "html converter",
    "web scraping to markdown",
    "batch html conversion",
    "markdown generator",
    "html parser",
    "content converter",
    "developer tools",
    "markdown tools",
    "html to markdown online",
    "free html converter",
    "web content converter",
    "html to markdown batch",
    "url to markdown",
    "website to markdown",
    "html markdown tool",
    "content extraction",
    "markdown formatting",
  ],
  openGraph: {
    title: "HTML to Markdown Converter - Free Online Tool",
    description:
      "Convert HTML content to clean Markdown format with advanced customization options. Support for URLs, batch processing, and instant downloads.",
    type: "website",
    images: [
      {
        url: "/static/images/html-to-markdown-converter.png",
        width: 1200,
        height: 630,
        alt: "HTML to Markdown Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML to Markdown Converter - Free Tool",
    description:
      "Convert HTML to Markdown with batch processing, URL support, and advanced customization options.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/html-to-markdown/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HTML to Markdown Converter",
  description:
    "Free online HTML to Markdown converter tool with batch processing, URL support, and advanced customization options. Convert HTML content from websites or raw code to clean Markdown format instantly.",
  url: "https://geekskai.com/tools/html-to-markdown",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "HTML to Markdown conversion",
    "Batch URL processing",
    "Raw HTML code conversion",
    "Advanced customization options",
    "Table conversion support",
    "Code block preservation",
    "Image link preservation",
    "Custom heading styles",
    "List marker options",
    "Real-time preview",
    "Download converted files",
    "Copy to clipboard",
    "Conversion history",
    "Mobile responsive design",
    "No registration required",
    "Privacy focused processing",
    "Lightning fast conversion",
    "SEO-friendly output",
    "Developer-friendly features",
    "Content extraction from websites",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "html to markdown, html converter, markdown generator, batch conversion, url to markdown, html parser, content converter, developer tools, web scraping, markdown tools",
  educationalUse:
    "Content Creation, Documentation, Web Development, Technical Writing, Blog Writing, Developer Tools, Content Management",
  targetAudience: {
    "@type": "Audience",
    audienceType:
      "Web Developers, Content Writers, Technical Writers, Bloggers, Documentation Teams, Content Creators, Digital Marketers, SEO Specialists",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "HTML to Markdown Converter Tool",
    applicationCategory: "Productivity Software",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2340",
    },
  },
  potentialAction: [
    {
      "@type": "ConvertAction",
      name: "Convert HTML to Markdown",
      description: "Convert HTML content or website URLs to clean Markdown format",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://geekskai.com/tools/html-to-markdown/",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  ],
  sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  )
}
