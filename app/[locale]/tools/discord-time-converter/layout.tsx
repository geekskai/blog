import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discord Timezone Converter - Free Discord Time & Timestamp Generator Tool",
  description:
    "Free Discord timezone converter with bidirectional timestamp conversion, global timezone support, and batch processing. Convert Discord timestamps to time, generate Discord timestamp formats across all timezones, and coordinate global Discord communities. Perfect for Discord bot developers, server administrators, and international event scheduling.",
  keywords: [
    // 核心关键词 - Discord Timezone Converter
    "discord timezone converter",
    "discord time zone converter",
    "discord timezone conversion",
    "discord timezone calculator",
    "discord timezone tool",

    // 主要关键词 - Discord Time Converter
    "discord time converter",
    "discord timestamp converter",
    "discord timestamp generator",
    "discord time format converter",
    "discord timestamp to time",
    "time to discord timestamp",
    "discord time calculator",

    // 长尾关键词 - 功能特定
    "discord scheduling tool",
    "discord bot timestamp",
    "discord timestamp formats",
    "unix timestamp to discord",
    "discord epoch time converter",
    "discord community tools",
    "discord server management",
    "discord event scheduling",
    "discord coordination tool",

    // 新增长尾关键词 - Timezone相关
    "discord global timezone converter",
    "discord international time converter",
    "discord multi timezone tool",
    "discord world time converter",
    "discord timezone synchronization",
    "discord cross timezone scheduling",
    "discord timezone coordination",
    "discord timezone management",

    // Bot & Development相关
    "discord bot timezone converter",
    "discord api timezone tool",
    "discord webhook timezone",
    "discord embed timezone",

    // 用户意图关键词
    "convert discord timestamp timezone",
    "discord time in different timezone",
    "discord event timezone converter",
    "discord meeting timezone tool",
  ],
  openGraph: {
    title: "Discord Timezone Converter - Free Discord Time & Timestamp Generator",
    description:
      "Free Discord timezone converter with global timezone support, bidirectional timestamp conversion, and batch processing. Perfect for Discord bot developers, server administrators, and international community coordination across all timezones.",
    type: "website",
    images: [
      {
        url: "/static/images/discord-time-converter.png",
        width: 1200,
        height: 630,
        alt: "Discord Timezone Converter - Free Discord Timestamp Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Timezone Converter - Free Discord Timestamp Generator Tool",
    description:
      "Advanced Discord timezone converter with global timezone support, timestamp conversion, batch processing, and bidirectional conversion. Perfect for Discord communities, bot development, and international event scheduling.",
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
  name: "Discord Timezone Converter - Free Discord Time & Timestamp Generator",
  description:
    "Free Discord timezone converter and timestamp generator tool for bidirectional conversion between Discord timestamps and regular time formats across all global timezones. Features comprehensive timezone support, batch processing, conversion history, and real-time preview for all Discord timestamp formats. Perfect for Discord bot developers, server administrators, international event scheduling, and global community coordination.",
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
    "Discord timezone converter for all global timezones",
    "Bidirectional Discord timestamp conversion",
    "Discord timestamp generator for all formats",
    "Full timezone support with auto-detection",
    "Global timezone synchronization",
    "International event scheduling",
    "Cross-timezone coordination tools",
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
    "Multi-timezone event planning",
    "Discord webhook timezone integration",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "discord timezone converter, discord time zone converter, discord timezone conversion, discord time converter, discord timestamp generator, discord timestamp converter, unix timestamp discord, discord bot timestamp, discord timezone tool, discord global timezone, discord international time, discord community tools, discord server management, discord event scheduling, discord coordination tool, discord timestamp formats, discord timezone synchronization, discord cross timezone scheduling",
  educationalUse:
    "Discord Community Management, Discord Bot Development, International Event Planning, Global Coordination, Cross-Timezone Team Collaboration, Discord Server Administration, Multi-Timezone Event Scheduling",
  audience: {
    "@type": "Audience",
    audienceType:
      "Discord Community Managers, Discord Bot Developers, International Event Organizers, Global Teams, Gaming Communities, Discord Server Administrators, Cross-Timezone Coordinators, International Discord Communities",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Discord Timezone Converter & Timestamp Generator",
    applicationCategory: "Communication Tool",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1650",
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
