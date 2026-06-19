import { Metadata } from "next"

// Content freshness - Update this monthly
const lastModified = new Date("2026-05-26") // Update current date

export const metadata: Metadata = {
  title: "PDF to Markdown Converter - Free Online PDF to MD Converter Tool",
  description:
    "Best free PDF to Markdown converter online. Convert PDF to MD format instantly with our PDF markdown converter. Extract text from PDF documents and transform to clean Markdown files. No registration required.",
  keywords: [
    "pdf to markdown converter",
    "pdf to md converter",
    "convert pdf to markdown",
    "pdf to markdown",
    "pdf to md",
  ],
  openGraph: {
    title: "Free PDF to Markdown Converter - Convert PDF to MD Online",
    description:
      "Professional PDF to Markdown converter. Transform PDF documents into clean MD format instantly. Free, secure, and accurate PDF to markdown conversion.",
    type: "website",
    images: [
      {
        url: "/static/images/pdf-to-markdown-converter.png",
        width: 1200,
        height: 630,
        alt: "PDF to Markdown Converter Tool - Convert PDF to MD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to Markdown Converter Online",
    description: "Convert PDF to MD format instantly with our free PDF to markdown converter.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/pdf-to-markdown/",
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
  other: {
    "last-modified": lastModified.toISOString(),
    "update-frequency": "monthly",
    "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
}

// JSON-LD Structured Data - Enhanced for AI search optimization
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF to Markdown Converter",
  description:
    "Professional free online PDF to Markdown converter tool. Convert PDF documents to MD format with formatting preserved. Best PDF to markdown conversion solution.",
  url: "https://geekskai.com/tools/pdf-to-markdown",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Convert PDF to Markdown format instantly",
    "Preserve document formatting and structure",
    "Browser-based PDF to MD conversion",
    "No file upload to servers required",
    "Free unlimited PDF to markdown conversion",
    "Support for large PDF files up to 50MB",
    "Extract text from PDF to clean markdown",
    "Professional PDF markdown converter",
    "Smart header and list detection",
    "Real-time markdown preview",
    "Privacy-first local processing",
    "Multiple page support",
  ].join(", "),
  softwareRequirements: "Modern web browser with JavaScript enabled",
  provider: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
    sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
  },
  keywords: "pdf to markdown converter, pdf to md, convert pdf to markdown, pdf markdown converter",
  educationalUse:
    "Documentation, Content Management, GitHub Integration, Technical Writing, Blog Publishing, Documentation Platforms",
  targetAudience: {
    "@type": "Audience",
    audienceType:
      "Developers, Technical Writers, Content Creators, Documentation Teams, Students, Researchers, Bloggers, Markdown Users",
  },
  potentialAction: [
    {
      "@type": "ConvertAction",
      name: "Convert PDF to Markdown",
      description: "Convert PDF documents to Markdown format with preserved formatting",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://geekskai.com/tools/pdf-to-markdown/",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  ],
}

// Breadcrumb Schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://geekskai.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tools",
      item: "https://geekskai.com/tools/",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "PDF to Markdown Converter",
      item: "https://geekskai.com/tools/pdf-to-markdown/",
    },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </div>
  )
}
