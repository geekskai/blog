import type { Metadata } from "next"

// SEO 优化的 metadata
export const metadata: Metadata = {
  title: "CM to Tommer Converter – Centimeter to Inch Online Tool | Free & Accurate",
  description:
    "Free online CM to Tommer converter. Convert centimeters to tommer (Danish/Norwegian inches) instantly with precision up to 3 decimal places. Perfect for furniture, construction, and international commerce.",
  keywords: [
    "cm to tommer",
    "centimeter to tommer",
    "tommer to cm",
    "danish inch converter",
    "norwegian inch converter",
    "nordic measurement converter",
    "furniture size converter",
    "construction measurement tool",
    "metric to tommer",
    "scandinavian units",
    "cm to inch converter",
    "measurement conversion tool",
    "free converter online",
    "precise measurement converter",
  ],
  authors: [{ name: "GeeksKai" }],
  creator: "GeeksKai",
  publisher: "GeeksKai",

  // Open Graph
  openGraph: {
    title: "CM to Tommer Converter – Free Online Tool",
    description:
      "Convert centimeters to tommer (Danish/Norwegian inches) instantly. Free, accurate, and perfect for furniture shopping and construction projects.",
    url: "https://geekskai.com/tools/cm-to-tommer-converter/",
    siteName: "GeeksKai Tools",
    images: [
      {
        url: "/static/tools/cm-to-tommer-converter-og.jpg",
        width: 1200,
        height: 630,
        alt: "CM to Tommer Converter Tool - Convert centimeters to tommer instantly",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "CM to Tommer Converter – Free Online Tool",
    description:
      "Convert centimeters to tommer (Danish/Norwegian inches) instantly. Free, accurate, and perfect for furniture shopping.",
    images: ["/static/tools/cm-to-tommer-converter-twitter.jpg"],
    creator: "@geekskai",
  },

  // Additional SEO
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

  // Canonical URL
  alternates: {
    canonical: "https://geekskai.com/tools/cm-to-tommer-converter/",
  },

  // Additional metadata
  category: "Tools",
  classification: "Measurement Converter",

  // Verification and other meta tags
  other: {
    "application-name": "CM to Tommer Converter",
    "apple-mobile-web-app-title": "CM to Tommer",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

// 结构化数据 (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CM to Tommer Converter",
  description:
    "Free online tool to convert centimeters to tommer (Danish/Norwegian inches) with high precision",
  url: "https://geekskai.com/tools/cm-to-tommer-converter/",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  permissions: "none",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  provider: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
    logo: {
      "@type": "ImageObject",
      url: "https://geekskai.com/static/logo.png",
    },
  },
  featureList: [
    "Bidirectional conversion (CM ↔ Tommer)",
    "Precision control (0-3 decimal places)",
    "Real-time conversion",
    "Copy results to clipboard",
    "Quick reference table",
    "Educational content about tommer",
    "Mobile-friendly interface",
    "No registration required",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://geekskai.com/static/tools/cm-to-tommer-converter-screenshot.jpg",
    caption: "CM to Tommer Converter interface showing conversion from centimeters to tommer",
  },
  softwareVersion: "1.0",
  datePublished: "2024-01-24",
  dateModified: "2024-01-24",
  inLanguage: "en-US",
  audience: {
    "@type": "Audience",
    audienceType: [
      "Furniture shoppers",
      "Construction professionals",
      "Architects",
      "Engineers",
      "International traders",
      "DIY enthusiasts",
    ],
  },
  usageInfo: {
    "@type": "CreativeWork",
    name: "How to use CM to Tommer Converter",
    description:
      "Enter a value in centimeters or tommer, select precision, and get instant conversion results",
  },
}

// FAQ 结构化数据
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a tommer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Tommer is the Danish and Norwegian word for "inch". One tommer equals exactly 2.54 centimeters, the same as an international inch.',
      },
    },
    {
      "@type": "Question",
      name: "How do I convert centimeters to tommer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To convert centimeters to tommer, multiply the centimeter value by 0.3937. For example, 10 cm = 10 × 0.3937 = 3.937 tommer.",
      },
    },
    {
      "@type": "Question",
      name: "Is tommer the same as inch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, modern tommer is identical to the international inch. Both equal exactly 2.54 centimeters.",
      },
    },
    {
      "@type": "Question",
      name: "Why would I need to convert cm to tommer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common uses include furniture shopping from Nordic countries, construction projects, architectural drawings, and understanding product dimensions in international commerce.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is this converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our converter provides precision up to 3 decimal places and uses the exact conversion factor (1 tommer = 2.54 cm) for maximum accuracy.",
      },
    },
  ],
}

export default function CmToTommerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
