import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Random SSN Generator - Valid Format Social Security Numbers | Free Tool",
  description:
    "Generate random Social Security Numbers in valid format for software testing and development. Educational tool with SSN structure guide, batch processing, and export capabilities. For testing purposes only.",
  keywords: [
    "random ssn number",
    "random ssn",
    "ssn generator",
    "fake ssn generator",
    "ssn for testing",
    "valid ssn format",
    "social security number generator",
    "test ssn numbers",
    "dummy ssn data",
  ],
  openGraph: {
    title: "Random SSN Generator - Professional Testing Tool",
    description:
      "Generate valid format Social Security Numbers for software testing and development. Educational tool with batch processing and export features.",
    type: "website",
    images: [
      {
        url: "/static/images/random-ssn-generator.png",
        width: 1200,
        height: 630,
        alt: "Random SSN Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Random SSN Generator - Testing Tool",
    description:
      "Generate valid format SSN numbers for software testing. Educational tool for developers.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/random-ssn-generator/",
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
  name: "Random SSN Generator",
  description:
    "Professional random Social Security Number generator for software testing and development. Educational tool with valid format generation, structure explanations, and batch processing capabilities.",
  url: "https://geekskai.com/tools/random-ssn-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Valid SSN format generation",
    "Educational content about SSN structure",
    "Batch processing capabilities",
    "Export in multiple formats (TXT, CSV, JSON)",
    "Real-time validation feedback",
    "Testing and development focused",
    "No registration required",
    "Browser-based processing",
    "Mobile-friendly interface",
    "Compliance with format standards",
    "Educational structure breakdown",
    "Professional testing tool",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "random ssn number, ssn generator, social security number, software testing, development tools",
  educationalUse:
    "Software Development Education, Testing Methodology, Data Structure Learning, Privacy Awareness",
  audience: {
    "@type": "Audience",
    audienceType: "Software Developers",
  },
  isAccessibleForFree: true,
  accessMode: ["textual", "visual"],
  accessibilityFeature: ["alternativeText", "readingOrder", "structuralNavigation"],
  usageInfo:
    "For testing and development purposes only. Generated numbers do not correspond to real individuals.",
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
