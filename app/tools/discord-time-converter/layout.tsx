import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discord Time Converter - Convert Timestamps & Times | Free Tool",
  description:
    "Professional Discord time converter with bidirectional conversion, timezone support, and batch processing. Convert between Discord timestamps and regular time formats instantly.",
  keywords: [
    "discord time converter",
    "discord timestamp converter",
    "discord time zone converter",
    "discord time format converter",
    "discord timestamp to time",
    "time to discord timestamp",
    "discord time calculator",
    "discord scheduling tool",
    "timezone converter",
    "batch timestamp converter",
  ],
  openGraph: {
    title: "Discord Time Converter - Professional Timestamp Conversion Tool",
    description:
      "Convert between Discord timestamps and regular time formats with full timezone support, batch processing, and bidirectional conversion capabilities.",
    type: "website",
    images: [
      {
        url: "/static/images/discord-time-converter.png",
        width: 1200,
        height: 630,
        alt: "Discord Time Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Time Converter - Free Professional Tool",
    description:
      "Advanced Discord time conversion with timezone support, batch processing, and bidirectional conversion.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/discord-time-converter/",
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
  name: "Discord Time Converter",
  description:
    "Professional Discord time converter tool for bidirectional conversion between Discord timestamps and regular time formats. Features timezone support, batch processing, conversion history, and real-time preview for all Discord timestamp formats.",
  url: "https://geekskai.com/tools/discord-time-converter",
  applicationCategory: "Productivity",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Bidirectional timestamp conversion",
    "Full timezone support",
    "Batch processing capabilities",
    "All Discord timestamp formats",
    "Real-time preview",
    "Conversion history tracking",
    "One-click copy functionality",
    "Mobile-responsive design",
    "No registration required",
    "Offline capable",
    "URL sharing support",
    "Multiple input formats",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "discord, time converter, timestamp, timezone, conversion, scheduling, coordination, community management, global teams",
  educationalUse: "Community Management, Event Planning, Global Coordination, Team Collaboration",
  targetAudience: {
    "@type": "Audience",
    audienceType: "Discord Community Managers, Event Organizers, Global Teams, Gaming Communities",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Discord Time Converter",
    applicationCategory: "Communication Tool",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1250",
    },
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
