import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discord Timestamp Generator - Create Dynamic Discord Timestamps | Free Tool",
  description:
    "Free Discord timestamp generator to create dynamic timestamps, event countdowns, and reminder systems. Generate all Discord timestamp formats with real-time preview, timezone support, and Discord bot integration. Perfect for event scheduling and community management.",
  keywords: [
    "discord timestamp generator",
    "create discord timestamp",
    "generate discord timestamp",
    "discord event generator",
    "discord countdown generator",
    "discord reminder timestamp",
    "discord bot timestamp creation",
    "dynamic discord timestamps",
    "discord event scheduling",
    "discord countdown timer",
    "discord timestamp maker",
    "discord time generator",
    "discord event timer",
    "discord reminder generator",
    "discord timestamp builder",
    "discord community tools",
    "discord server management",
    "discord timestamp creation",
    "discord event coordination",
    "discord timestamp formats",
  ],
  openGraph: {
    title: "Discord Timestamp Generator - Create Dynamic Discord Timestamps",
    description:
      "Free Discord timestamp generator for creating dynamic event countdowns, reminders, and timezone-aware timestamps. Generate all Discord timestamp formats with real-time preview and Discord bot integration.",
    type: "website",
    images: [
      {
        url: "/static/images/discord-timestamp-generator.png",
        width: 1200,
        height: 630,
        alt: "Discord Timestamp Generator - Create Dynamic Discord Timestamps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Timestamp Generator - Create Dynamic Discord Timestamps",
    description:
      "Generate dynamic Discord timestamps with real-time preview, multiple formats, and Discord bot integration. Perfect for events and countdowns.",
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
  name: "Discord Timestamp Generator - Create Dynamic Discord Timestamps",
  description:
    "Free Discord timestamp generator for creating dynamic Discord timestamps, event countdowns, and reminder systems. Generate all Discord timestamp formats with real-time preview, timezone support, and Discord bot integration. Perfect for Discord event scheduling, community management, and automated reminder systems.",
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
    "Dynamic Discord timestamp generation",
    "Real-time countdown creation",
    "Multiple Discord timestamp formats",
    "Event reminder generation",
    "Timezone-aware timestamp creation",
    "Live preview with Discord simulation",
    "Relative time calculations",
    "Absolute date input options",
    "Quick preset configurations",
    "One-click copy functionality",
    "Save favorite configurations",
    "Discord bot integration support",
    "Mobile-responsive interface",
    "No registration required",
    "Instant timestamp creation",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "discord timestamp generator, create discord timestamp, generate discord timestamp, discord event generator, discord countdown generator, discord reminder timestamp, discord bot timestamp creation, dynamic discord timestamps, discord event scheduling, discord timestamp maker, discord time generator, discord community tools",
  educationalUse:
    "Discord Event Planning, Discord Community Management, Discord Bot Development, Discord Event Coordination, Discord Reminder Systems, Discord Server Administration",
  targetAudience: {
    "@type": "Audience",
    audienceType:
      "Discord Community Managers, Discord Bot Developers, Event Organizers, Discord Server Administrators, Gaming Communities, Content Creators",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Discord Timestamp Generator",
    applicationCategory: "Communication Tool",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1420",
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
