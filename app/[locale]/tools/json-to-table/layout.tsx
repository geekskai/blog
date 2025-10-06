import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to Table Converter - Best Free Online JSON to HTML/Excel Table Tool",
  description:
    "Professional JSON to Table converter online. Convert JSON to HTML, ASCII, Excel tables instantly with our free JSON table generator. Transform JSON data to beautiful tables with advanced customization. No registration required.",
  keywords: [
    "json to table converter",
    "json to html table converter",
    "json to excel converter",
    "convert json to table",
    "json to table",
    "json table generator",
    "json to html table",
  ],
  openGraph: {
    title: "Best Free JSON to Table Converter - Convert JSON to HTML/Excel Online",
    description:
      "Professional JSON to Table converter. Transform JSON data into HTML, ASCII, Excel tables instantly. Free, secure, and accurate JSON table conversion with advanced customization.",
    type: "website",
    images: [
      {
        url: "/static/images/json-to-table-converter.png",
        width: 1200,
        height: 630,
        alt: "JSON to Table Converter Tool - Convert JSON to HTML Excel Tables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON to Table Converter Online - JSON to HTML/Excel",
    description:
      "Convert JSON to HTML, ASCII, Excel tables instantly with our free JSON table generator. Advanced customization and instant downloads.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/json-to-table/",
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
  name: "JSON to Table Converter",
  description:
    "Professional free online JSON to Table converter tool. Convert JSON data to HTML, ASCII, Excel table formats with formatting preserved. Best JSON to table conversion solution with advanced customization options.",
  url: "https://geekskai.com/tools/json-to-table/",
  applicationCategory: "Utility",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert JSON to HTML table format instantly",
    "Convert JSON to ASCII table format",
    "Convert JSON to Excel (XLSX) format",
    "Transform nested JSON objects to tables",
    "Convert JSON arrays to structured tables",
    "Browser-based JSON to table conversion",
    "No file upload to servers required",
    "Free unlimited JSON table conversion",
    "Support for complex JSON structures",
    "Advanced table customization options",
    "Real-time JSON table preview",
    "Download converted tables in multiple formats",
    "Copy JSON tables to clipboard",
    "Professional JSON table generator",
    "Preserve JSON data structure in tables",
    "Mobile responsive JSON converter",
    "No registration required for conversion",
    "Privacy focused JSON processing",
    "Lightning fast JSON to table conversion",
    "Developer-friendly JSON table tool",
    "Multiple JSON input methods supported",
    "Customizable table output formats",
    "JSON file upload support",
    "JSON URL fetching capability",
    "Batch JSON processing",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "json to table converter, json to html table, json to excel, convert json to table, json table generator, json parser table",
  educationalUse:
    "Data Analysis, Web Development, API Documentation, Database Design, Report Generation, Data Visualization, Technical Documentation, Software Development, JSON Data Processing",
  targetAudience: {
    "@type": "Audience",
    audienceType:
      "Web Developers, Data Analysts, Software Engineers, API Developers, Database Administrators, Technical Writers, Data Scientists, Backend Developers, Frontend Developers, JSON Developers",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "JSON to Table Converter Tool",
    applicationCategory: "Productivity Software",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2150",
    },
  },
  potentialAction: [
    {
      "@type": "ConvertAction",
      name: "Convert JSON to Table",
      description:
        "Convert JSON data to HTML, ASCII, or Excel table formats with preserved structure",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://geekskai.com/tools/json-to-table/",
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
