import { Metadata } from "next"

// Content freshness - Update this monthly
const lastModified = new Date("2026-01-14") // Update current date

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
  ],
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
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

// FAQ Schema for better AI retrieval
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best free PDF to Markdown converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our PDF to Markdown converter is the best free online tool for converting PDF to MD format. This PDF markdown converter offers unlimited conversions with no registration requirements, subscription fees, or usage limits. Convert PDF documents to markdown format as many times as you need.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is PDF to MD conversion with this converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our PDF to markdown converter uses advanced parsing algorithms to maintain document structure when converting PDF to MD format. The PDF markdown conversion preserves headers, lists, and formatting. Most PDF to markdown conversions achieve 95%+ accuracy in preserving the original content structure.",
      },
    },
    {
      "@type": "Question",
      name: "Is this PDF to markdown converter secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our PDF to MD converter is completely secure. All PDF to markdown conversion happens locally in your browser using client-side JavaScript. When you convert PDF to markdown with our tool, your files never leave your device, ensuring complete privacy and security during the PDF markdown conversion process.",
      },
    },
    {
      "@type": "Question",
      name: "What are the file size limits for PDF to markdown conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our PDF to markdown converter supports files up to 50MB for converting PDF to MD format. For larger PDF files, consider splitting them into smaller sections before using the PDF markdown converter for optimal conversion results.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert scanned PDFs to markdown format?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This PDF to markdown converter works best with text-based PDF documents. For scanned PDFs or image-based documents, the PDF to MD conversion may not extract text accurately as our PDF markdown converter doesn't include OCR (Optical Character Recognition) functionality. Use text-based PDFs for best results when converting PDF to markdown.",
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
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
