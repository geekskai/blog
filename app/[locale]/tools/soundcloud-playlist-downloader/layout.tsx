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
    "x-default": "https://geekskai.com/tools/soundcloud-playlist-downloader/",
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/soundcloud-playlist-downloader/`
  })

  // Update this monthly
  const lastModified = new Date("2025-01-15")

  const metadata = {
    title: "SoundCloud Playlist Downloader - Free Online Tool | Download Entire Playlists",
    description:
      "Free SoundCloud playlist downloader. Download entire SoundCloud playlists in MP3 or WAV format. Fast, unlimited, and no registration required. Batch download all tracks from any SoundCloud playlist.",
    keywords: [
      "soundcloud playlist downloader",
      "download soundcloud playlist",
      "soundcloud playlist to mp3",
      "soundcloud playlist to wav",
      "batch download soundcloud",
      "soundcloud playlist converter",
      "free soundcloud playlist downloader",
      "download entire soundcloud playlist",
      "soundcloud playlist download tool",
    ],
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
      url: isDefaultLocale
        ? "https://geekskai.com/tools/soundcloud-playlist-downloader/"
        : `https://geekskai.com/${locale}/tools/soundcloud-playlist-downloader/`,
      siteName: "GeeksKai",
      images: [
        {
          url: "/static/images/soundcloud-playlist-downloader.png",
          width: 1200,
          height: 630,
          alt: "SoundCloud Playlist Downloader - Free Online Tool",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/soundcloud-playlist-downloader/"
        : `https://geekskai.com/${locale}/tools/soundcloud-playlist-downloader/`,
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
    ? "https://geekskai.com/tools/soundcloud-playlist-downloader"
    : `https://geekskai.com/${locale}/tools/soundcloud-playlist-downloader`

  // WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SoundCloud Playlist Downloader",
    description:
      "Free online tool to download entire SoundCloud playlists in MP3 or WAV format. Batch download all tracks from any SoundCloud playlist quickly and easily.",
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
      "Download entire SoundCloud playlists",
      "Batch download multiple tracks at once",
      "Support for MP3 and WAV formats",
      "Free and unlimited downloads",
      "Fast processing speed",
      "No registration required",
      "Individual track download option",
      "Progress tracking for batch downloads",
    ],
    browserRequirements: "Modern web browser with JavaScript enabled",
    softwareVersion: "1.0.0",
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I download a SoundCloud playlist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply paste the SoundCloud playlist URL into the input field, click 'Fetch Playlist' to load all tracks, then click 'Download All' to batch download the entire playlist in your preferred format (MP3 or WAV).",
        },
      },
      {
        "@type": "Question",
        name: "Is the SoundCloud playlist downloader free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our SoundCloud playlist downloader is completely free with no registration required. You can download unlimited playlists without any cost.",
        },
      },
      {
        "@type": "Question",
        name: "What formats can I download SoundCloud playlists in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can download SoundCloud playlists in both MP3 and WAV formats. MP3 is ideal for smaller file sizes, while WAV provides uncompressed audio quality.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download individual tracks from a playlist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can download individual tracks from a playlist. After fetching the playlist, each track will have its own download button, allowing you to download tracks one at a time if preferred.",
        },
      },
      {
        "@type": "Question",
        name: "How fast is the SoundCloud playlist downloader?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The download speed depends on your internet connection and the playlist size. Our tool processes tracks sequentially to ensure stability, with progress tracking for each download.",
        },
      },
      {
        "@type": "Question",
        name: "Is it legal to download SoundCloud playlists?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Downloading is only legal if you have permission from the copyright holder or if the tracks are available for free download. Always respect copyright laws and only download content you have rights to use.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account to use the playlist downloader?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No account or registration is required. You can use our SoundCloud playlist downloader immediately without signing up.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download private SoundCloud playlists?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, you can only download public SoundCloud playlists. Private playlists require authentication and cannot be accessed through our tool.",
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
        name: "SoundCloud Playlist Downloader",
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
