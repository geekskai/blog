import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to Table Converter - Free Online Tool | Convert JSON to HTML/Excel Tables",
  description:
    "Free JSON to Table converter with multiple output formats (HTML, ASCII, Excel). Convert JSON data to beautiful tables with advanced customization options. No registration required.",
  keywords: [
    "json to table",
    "json to html table",
    "json to excel",
    "json converter",
    "table generator",
    "json parser",
    "data visualization",
    "json formatter",
    "table converter",
    "developer tools",
    "json tools",
    "json to table online",
    "free json converter",
    "data converter",
    "json to xlsx",
    "json to ascii table",
    "json data table",
    "table generator tool",
    "json visualization",
    "data table converter",
  ],
  openGraph: {
    title: "JSON to Table Converter - Free Online Tool",
    description:
      "Convert JSON data to beautiful tables in HTML, ASCII, or Excel format. Advanced customization options with instant preview and download.",
    type: "website",
    images: [
      {
        url: "/static/images/json-to-table-converter.png",
        width: 1200,
        height: 630,
        alt: "JSON to Table Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to Table Converter - Free Tool",
    description:
      "Convert JSON to tables with multiple output formats, advanced customization, and instant downloads.",
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
    "Free online JSON to Table converter tool with multiple output formats (HTML, ASCII, Excel). Convert JSON data to beautiful tables with advanced customization options, instant preview, and download capabilities.",
  url: "https://geekskai.com/tools/json-to-table",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "JSON to HTML table conversion",
    "JSON to ASCII table conversion",
    "JSON to Excel (XLSX) conversion",
    "Batch JSON processing",
    "Raw JSON code input",
    "JSON file upload",
    "JSON URL fetching",
    "Advanced table customization",
    "Table transformation options",
    "Real-time preview",
    "Download converted tables",
    "Copy to clipboard",
    "Conversion history",
    "Mobile responsive design",
    "No registration required",
    "Privacy focused processing",
    "Lightning fast conversion",
    "Developer-friendly features",
    "Multiple input methods",
    "Customizable output formats",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "json to table, json converter, table generator, json parser, data visualization, json formatter, developer tools, json to html, json to excel, json to xlsx, ascii table",
  educationalUse:
    "Data Analysis, Web Development, API Documentation, Database Design, Report Generation, Data Visualization, Technical Documentation, Software Development",
  targetAudience: {
    "@type": "Audience",
    audienceType:
      "Web Developers, Data Analysts, Software Engineers, API Developers, Database Administrators, Technical Writers, Data Scientists, Backend Developers, Frontend Developers",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "JSON to Table Converter Tool",
    applicationCategory: "Productivity Software",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1850",
    },
  },
  potentialAction: [
    {
      "@type": "ConvertAction",
      name: "Convert JSON to Table",
      description: "Convert JSON data to HTML, ASCII, or Excel table formats",
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
