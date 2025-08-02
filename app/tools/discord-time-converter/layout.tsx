import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discord Time Converter - Free Discord Timestamp Generator & Converter Tool",
  description:
    "Free Discord time converter tool with bidirectional conversion, timezone support, and batch processing. Convert Discord timestamps to time, generate Discord timestamp formats, and coordinate global communities. Perfect for Discord bot developers and server administrators.",
  keywords: [
    "discord time converter",
    "discord timestamp converter",
    "discord timestamp generator",
    "discord time zone converter",
    "discord time format converter",
    "discord timestamp to time",
    "time to discord timestamp",
    "discord time calculator",
    "discord scheduling tool",
    "discord bot timestamp",
    "discord timestamp formats",
    "unix timestamp to discord",
    "discord epoch time converter",
    "discord timezone conversion",
    "discord community tools",
    "discord server management",
    "discord event scheduling",
    "discord coordination tool",
  ],
  openGraph: {
    title: "Discord Time Converter - Free Discord Timestamp Generator & Converter",
    description:
      "Free Discord time converter with bidirectional conversion, timezone support, and batch processing. Perfect for Discord bot developers, server administrators, and global community coordination.",
    type: "website",
    images: [
      {
        url: "/static/images/discord-time-converter.png",
        width: 1200,
        height: 630,
        alt: "Discord Time Converter - Free Discord Timestamp Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Time Converter - Free Discord Timestamp Generator Tool",
    description:
      "Advanced Discord timestamp conversion with timezone support, batch processing, and bidirectional conversion. Perfect for Discord communities and bot development.",
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
  name: "Discord Time Converter - Free Discord Timestamp Generator",
  description:
    "Free Discord time converter and timestamp generator tool for bidirectional conversion between Discord timestamps and regular time formats. Features timezone support, batch processing, conversion history, and real-time preview for all Discord timestamp formats. Perfect for Discord bot developers, server administrators, and global community coordination.",
  url: "https://geekskai.com/tools/discord-time-converter",
  applicationCategory: "Productivity",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Bidirectional Discord timestamp conversion",
    "Discord timestamp generator for all formats",
    "Full timezone support with auto-detection",
    "Batch processing for multiple timestamps",
    "All Discord timestamp formats (:t, :T, :d, :D, :f, :F, :R)",
    "Real-time preview and validation",
    "Conversion history tracking",
    "One-click copy functionality",
    "Mobile-responsive design",
    "No registration required",
    "Discord bot development support",
    "Unix epoch time conversion",
    "Global community coordination tools",
    "Event scheduling assistance",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "discord time converter, discord timestamp generator, discord timestamp converter, unix timestamp discord, discord bot timestamp, discord timezone conversion, discord community tools, discord server management, discord event scheduling, discord coordination tool, discord timestamp formats",
  educationalUse:
    "Discord Community Management, Discord Bot Development, Event Planning, Global Coordination, Team Collaboration, Discord Server Administration",
  audience: {
    "@type": "Audience",
    audienceType:
      "Discord Community Managers, Discord Bot Developers, Event Organizers, Global Teams, Gaming Communities, Discord Server Administrators",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Discord Time Converter & Timestamp Generator",
    applicationCategory: "Communication Tool",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1580",
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
