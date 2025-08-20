import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Random VIN Generator - Vehicle Identification Numbers | ISO 3779 Compliant",
  description:
    "Generate random Vehicle Identification Numbers for automotive software testing. ISO 3779 compliant with valid check digits, manufacturer codes, and educational content about VIN structure.",
  keywords: [
    "random vin number",
    "random vin generator",
    "random car vin",
    "vin generator tool",
    "fake vin number",
    "vehicle identification generator",
    "vin number generator",
    "automotive testing",
    "iso 3779 compliant",
  ],
  openGraph: {
    title: "Random VIN Generator - Automotive Testing Tool",
    description:
      "Generate ISO 3779 compliant VIN numbers for automotive software testing. Professional tool with valid check digits and manufacturer codes.",
    type: "website",
    images: [
      {
        url: "/static/images/random-vin-generator.png",
        width: 1200,
        height: 630,
        alt: "Random VIN Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Random VIN Generator - Testing Tool",
    description:
      "Generate ISO 3779 compliant VIN numbers for automotive testing. Educational tool for developers.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/random-vin-generator/",
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
  name: "Random VIN Generator",
  description:
    "Professional random Vehicle Identification Number generator for automotive software testing and development. ISO 3779 compliant tool with valid check digits, manufacturer codes, and educational content.",
  url: "https://geekskai.com/tools/random-vin-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "ISO 3779 compliant VIN generation",
    "Valid check digit calculation",
    "Manufacturer code database",
    "Educational content about VIN structure",
    "Batch processing capabilities",
    "Export in multiple formats (TXT, CSV, JSON)",
    "Real-time validation feedback",
    "Automotive testing focused",
    "No registration required",
    "Browser-based processing",
    "Mobile-friendly interface",
    "Professional testing tool",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "random vin number, vin generator, vehicle identification number, automotive testing, development tools",
  educationalUse:
    "Automotive Software Development, VIN Validation Learning, Testing Methodology, Data Structure Education",
  audience: {
    "@type": "Audience",
    audienceType: "Software Developers",
  },
  isAccessibleForFree: true,
  accessMode: ["textual", "visual"],
  accessibilityFeature: ["alternativeText", "readingOrder", "structuralNavigation"],
  usageInfo:
    "For testing and development purposes only. Generated VINs do not correspond to real vehicles.",
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
