import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free PDF to Markdown Converter Online | Convert PDF to MD Fast & Secure",
  description:
    "Convert PDF files to Markdown (MD) format instantly with our free online tool. Preserve formatting, extract text accurately, and download clean MD files. No registration required, 100% browser-based processing for maximum privacy.",
  keywords: [
    "pdf to markdown",
    "pdf to md converter",
    "convert pdf to markdown",
    "pdf markdown converter",
    "free pdf converter",
    "online pdf to markdown",
    "pdf to md online",
    "markdown converter tool",
    "pdf text extraction",
    "document converter",
    "pdf parser online",
    "markdown generator",
    "pdf to text markdown",
  ],
  openGraph: {
    title: "Free PDF to Markdown Converter - Convert PDF to MD Online",
    description:
      "Transform PDF documents into clean Markdown format instantly. Free, secure, and no registration required. Perfect for developers, writers, and content creators.",
    type: "website",
    images: [
      {
        url: "/static/images/pdf-to-markdown-converter.png",
        width: 1200,
        height: 630,
        alt: "PDF to Markdown Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to Markdown Converter Online",
    description: "Convert PDF to MD format instantly. Free, secure, browser-based tool.",
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
    "Free online tool to convert PDF documents to Markdown format with formatting preserved",
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
    "Convert PDF to Markdown format",
    "Preserve document formatting",
    "Browser-based processing",
    "No file upload to servers",
    "Free unlimited usage",
    "Support for large PDF files up to 50MB",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
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
