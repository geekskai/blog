import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import React from "react"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const isDefaultLocale = locale === "en"

  const languages: Record<string, string> = {
    "x-default": "https://geekskai.com/tools/soundcloud-to-wav/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/soundcloud-to-wav/`
  })

  // Update this monthly
  const lastModified = new Date("2025-12-21") // Update current date

  return {
    title: "SoundCloud to WAV Converter - Free Online Tool | Download SoundCloud Tracks",
    description:
      "Free SoundCloud to WAV converter. Download SoundCloud tracks as WAV or MP3 files instantly. No registration required. High-quality audio conversion in under 30 seconds.",
    keywords: [
      "soundcloud to wav",
      "soundcloud downloader",
      "soundcloud to wav converter",
      "download soundcloud wav",
      "soundcloud wav converter",
      "soundcloud to mp3",
      "free soundcloud downloader",
      "convert soundcloud to wav",
      "soundcloud audio downloader",
    ],
    openGraph: {
      title: "SoundCloud to WAV Converter - Free Online Tool",
      description:
        "Download SoundCloud tracks as WAV or MP3 files instantly. Free, fast, and no registration required.",
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/soundcloud-to-wav/"
        : `https://geekskai.com/${locale}/tools/soundcloud-to-wav/`,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/soundcloud-to-wav.png",
          width: 1200,
          height: 630,
          alt: "SoundCloud to WAV Converter",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "SoundCloud to WAV Converter - Free Online Tool",
      description: "Download SoundCloud tracks as WAV or MP3 files instantly. Free and fast.",
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/soundcloud-to-wav/"
        : `https://geekskai.com/${locale}/tools/soundcloud-to-wav/`,
      languages: {
        ...languages,
      },
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
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale
    ? "https://geekskai.com/tools/soundcloud-to-wav"
    : `https://geekskai.com/${locale}/tools/soundcloud-to-wav`

  // WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SoundCloud to WAV Converter",
    description:
      "Free online tool to convert SoundCloud tracks to WAV or MP3 format. Download SoundCloud audio files instantly without registration.",
    url: baseUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    featureList: [
      "SoundCloud to WAV conversion",
      "SoundCloud to MP3 conversion",
      "Track information extraction",
      "High-quality audio download",
      "No registration required",
      "Free unlimited use",
      "Fast processing under 30 seconds",
      "Support for public SoundCloud tracks",
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is the SoundCloud to WAV converter free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our SoundCloud to WAV converter is 100% free to use. No registration, no payment, and unlimited conversions.",
        },
      },
      {
        "@type": "Question",
        name: "What audio formats are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our converter supports WAV (lossless) and MP3 (compressed) output formats. You can choose either format before downloading.",
        },
      },
      {
        "@type": "Question",
        name: "How long does conversion take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most SoundCloud tracks convert and download in under 30 seconds. The time depends on track length and your internet connection speed.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download any SoundCloud track?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can download tracks that are publicly available on SoundCloud. Private tracks or tracks with download restrictions may not be accessible.",
        },
      },
      {
        "@type": "Question",
        name: "Is it legal to download SoundCloud tracks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Downloading tracks depends on the artist's terms and copyright. Always respect copyright laws and use downloaded tracks responsibly. Our tool is for personal use and educational purposes.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between WAV and MP3 format?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WAV is a lossless audio format that preserves original quality but creates larger files (10-50MB per track). MP3 is a compressed format with smaller file sizes (3-8MB per track) while maintaining good quality at 320kbps. Choose WAV for professional editing and MP3 for casual listening.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, you don't need to create an account or register. Our SoundCloud to WAV converter works instantly without any sign-up process.",
        },
      },
      {
        "@type": "Question",
        name: "What is the maximum file size I can download?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There is no specific file size limit. However, longer tracks will take more time to process. Most standard tracks (3-5 minutes) download successfully.",
        },
      },
    ],
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "SoundCloud to WAV Converter",
        item: baseUrl,
      },
    ],
  }

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
    logo: "https://geekskai.com/static/images/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "geeks.kai@gmail.com",
    },
    sameAs: [
      "https://twitter.com/GeeksKai",
      "https://github.com/geekskai",
      "https://www.facebook.com/geekskai",
      "https://www.linkedin.com/in/geekskai",
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </div>
  )
}
