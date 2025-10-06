import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Snow Day Calculator - Predict School Closures with Weather Data",
  description:
    "Free snow day calculator predicts school closure probability using real-time weather data. Check if your school will be closed due to snow conditions with accurate forecasting.",
  keywords: [
    "snow day calculator",
    "snow day predictor",
    "school closure predictor",
    "will school be closed",
    "snow day probability",
    "weather school closures",
    "snow forecast school",
    "winter weather calculator",
    "school delay predictor",
    "snow day forecast",
  ].join(", "),
  authors: [{ name: "GeeksKai" }],
  creator: "GeeksKai",
  publisher: "GeeksKai",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.geekskai.com/tools/snow-day-calculator",
    title: "Snow Day Calculator - Predict School Closures",
    description:
      "Free snow day calculator predicts school closure probability using real-time weather data. Get instant predictions for your location.",
    siteName: "GeeksKai Tools",
    images: [
      {
        url: "/tools/snow-day-calculator-og.jpg",
        width: 1200,
        height: 630,
        alt: "Snow Day Calculator - Predict School Closures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snow Day Calculator - Predict School Closures",
    description:
      "Free snow day calculator predicts school closure probability using real-time weather data.",
    images: ["/tools/snow-day-calculator-og.jpg"],
    creator: "@geekskai",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/snow-day-calculator/",
  },
  other: {
    "application-name": "Snow Day Calculator",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Snow Day Calculator",
    "format-detection": "telephone=no",
  },
}

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Snow Day Calculator",
  description:
    "Free snow day calculator predicts school closure probability using real-time weather data",
  url: "https://www.geekskai.com/tools/snow-day-calculator",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  permissions: "location",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  provider: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://www.geekskai.com",
  },
  featureList: [
    "Real-time weather data integration",
    "School closure probability calculation",
    "Location-based predictions",
    "Multiple weather factors analysis",
    "Mobile-responsive design",
    "Instant results",
  ],
  screenshot: "https://www.geekskai.com/tools/snow-day-calculator-screenshot.jpg",
  softwareVersion: "1.0",
  datePublished: "2024-01-20",
  dateModified: "2024-01-20",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
}

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate are snow day predictions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our snow day calculator uses real-time weather data and proven meteorological factors to provide reliable predictions. While generally accurate, final school closure decisions depend on local district policies and road conditions.",
      },
    },
    {
      "@type": "Question",
      name: "What factors influence school closures?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Schools consider snow accumulation, temperature, wind conditions, visibility, road safety, bus route conditions, and timing of weather events. Each district has specific thresholds and policies.",
      },
    },
    {
      "@type": "Question",
      name: "When are snow day decisions usually made?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most school districts make closure decisions between 4-6 AM on the day of potential closure, though some decide the evening before for severe weather predictions.",
      },
    },
    {
      "@type": "Question",
      name: "Is the snow day calculator free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our snow day calculator is completely free to use. Simply enter your location to get instant snow day probability predictions based on current weather conditions.",
      },
    },
  ],
}

export default function SnowDayCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {children}
    </>
  )
}
