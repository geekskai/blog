import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discord Timestamp Generator - Create Dynamic Timestamps | Free Tool",
  description:
    "Generate dynamic Discord timestamps that automatically update across timezones. Create perfect countdowns, event reminders, and relative time displays with professional precision.",
  keywords: [
    "discord",
    "timestamp generator",
    "time converter",
    "countdown",
    "timezone",
    "relative time",
    "discord bot",
    "event scheduling",
  ],
  openGraph: {
    title: "Discord Timestamp Generator - Dynamic Time Displays",
    description:
      "Create professional Discord timestamps that automatically update across all timezones. Perfect for events, deadlines, and countdowns.",
    type: "website",
    images: [
      {
        url: "/static/images/discord-timestamp-generator.png",
        width: 1200,
        height: 630,
        alt: "Discord Timestamp Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Timestamp Generator - Free Professional Tool",
    description:
      "Generate timezone-aware Discord timestamps with multiple formats and real-time preview.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/discord-timestamp-generator/",
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
  name: "Discord Timestamp Generator",
  description:
    "Create dynamic Discord timestamps that automatically update across timezones. Generate professional countdowns, event reminders, and relative time displays with multiple format options and real-time preview.",
  url: "https://geekskai.com/tools/discord-timestamp-generator",
  applicationCategory: "Communication",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time timestamp generation",
    "Multiple display formats",
    "Timezone awareness",
    "Relative time calculations",
    "Absolute date input",
    "Live preview",
    "One-click copy",
    "Save configurations",
    "Mobile-friendly interface",
    "No registration required",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "discord, timestamp, generator, timezone, countdown, relative time, event scheduling, communication",
  educationalUse: "Event Planning, Community Management, Bot Development, Time Coordination",
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
