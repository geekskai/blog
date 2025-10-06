import { Metadata } from "next"

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
    "converting pdf to markdown",
    "pdf markdown converter",
    "free pdf to markdown",
    "online pdf to markdown converter",
    "pdf to md online",
    "pdf to readme md",
    "pdf text to markdown",
    "pdf markdown conversion tool",
    "extract text from pdf to markdown",
    "pdf document to markdown",
    "convert pdf document to md",
    "pdf file to markdown converter",
    "transform pdf to markdown",
    "pdf to markdown online free",
    "best pdf to markdown converter",
    "accurate pdf to md conversion",
    "pdf markdown extraction",
    "pdf to markdown generator",
    "convert pdf files to markdown",
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
}

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF to Markdown Converter",
  description:
    "Professional free online PDF to Markdown converter tool. Convert PDF documents to MD format with formatting preserved. Best PDF to markdown conversion solution.",
  url: "https://geekskai.com/tools/pdf-to-markdown",
  applicationCategory: "Utility",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
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
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords: "pdf to markdown converter, pdf to md, convert pdf to markdown, pdf markdown converter",
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
