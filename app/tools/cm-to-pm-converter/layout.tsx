import type { Metadata } from "next"

// SEO 优化的 metadata (基于PRD文档的关键词策略)
export const metadata: Metadata = {
  title: "CM to PM Converter | Scientific Centimeter to Picometer Calculator | Free Tool",
  description:
    "Professional CM to PM converter for scientists and researchers. Convert centimeters to picometers with scientific precision up to 6 decimal places. Perfect for nanotechnology, atomic physics, and materials science research.",
  keywords: [
    "cm to pm converter",
    "centimeter to picometer",
    "picometer to centimeter",
    "scientific unit converter",
    "atomic scale measurements",
    "nanotechnology calculator",
    "molecular measurements",
    "scientific precision converter",
    "atomic physics tools",
    "materials science converter",
    "research measurement tool",
    "scientific notation converter",
    "precision measurement calculator",
    "laboratory conversion tool",
    "quantum scale converter",
    "molecular scale calculator",
    "free scientific converter",
    "accurate measurement tool",
  ],
  authors: [{ name: "GeeksKai" }],
  creator: "GeeksKai",
  publisher: "GeeksKai",

  // Open Graph
  openGraph: {
    title: "CM to PM Converter | Scientific Measurement Tool",
    description:
      "Professional centimeter to picometer converter with scientific precision. Essential for nanotechnology, atomic physics, and materials science research.",
    url: "https://geekskai.com/tools/cm-to-pm-converter/",
    siteName: "GeeksKai Scientific Tools",
    images: [
      {
        url: "/static/tools/cm-to-pm-converter-og.jpg",
        width: 1200,
        height: 630,
        alt: "CM to PM Converter Tool - Scientific centimeter to picometer conversion",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "CM to PM Converter | Scientific Measurement Tool",
    description:
      "Professional centimeter to picometer converter with scientific precision. Perfect for nanotechnology and atomic physics research.",
    images: ["/static/tools/cm-to-pm-converter-twitter.jpg"],
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
    canonical: "https://geekskai.com/tools/cm-to-pm-converter/",
  },

  // Additional metadata
  category: "Scientific Tools",
  classification: "Scientific Measurement Converter",

  // Verification and other meta tags
  other: {
    "application-name": "CM to PM Scientific Converter",
    "apple-mobile-web-app-title": "CM to PM Converter",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

// 结构化数据 (JSON-LD) - 基于PRD文档的WebApplication schema
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CM to PM Scientific Converter",
  description:
    "Professional tool for converting centimeters to picometers with scientific precision up to 6 decimal places",
  url: "https://geekskai.com/tools/cm-to-pm-converter/",
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
    "Bidirectional conversion (CM ↔ PM)",
    "Scientific precision control (0-6 decimal places)",
    "Scientific notation support",
    "Real-time conversion calculations",
    "Atomic scale visualization",
    "Educational content about picometer scale",
    "Copy results to clipboard",
    "Quick reference tables",
    "Mobile-friendly interface",
    "No registration required",
    "Batch conversion capability",
    "Formula display and calculation steps",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://geekskai.com/static/tools/cm-to-pm-converter-screenshot.jpg",
    caption:
      "CM to PM Converter interface showing scientific conversion from centimeters to picometers",
  },
  softwareVersion: "1.0",
  datePublished: "2024-01-24",
  dateModified: "2024-01-24",
  inLanguage: "en-US",
  audience: {
    "@type": "Audience",
    audienceType: [
      "Scientists",
      "Researchers",
      "PhD Students",
      "Nanotechnology Engineers",
      "Physics Students",
      "Materials Scientists",
      "Chemistry Researchers",
      "Academic Professionals",
    ],
  },
  usageInfo: {
    "@type": "CreativeWork",
    name: "How to use CM to PM Converter",
    description:
      "Enter a value in centimeters or picometers, select precision level, and get instant scientific conversion results with formula display",
  },
}

// FAQ 结构化数据 - 基于PRD文档的目标用户问题
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a picometer and how does it relate to centimeters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A picometer (pm) is a unit of length equal to one trillionth of a meter (10⁻¹² m). One centimeter equals exactly 10,000,000,000 (10¹⁰) picometers. This scale is used in atomic physics, nanotechnology, and molecular measurements.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is this CM to PM converter for scientific research?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our converter provides precision up to 6 decimal places and maintains accuracy for values up to 10¹⁵ picometers, making it suitable for professional scientific research, nanotechnology applications, and academic studies.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use scientific notation with this converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our converter supports both standard decimal input and scientific notation (e.g., 1.5e-8). Results can be displayed in both formats, with automatic scientific notation for very large numbers.",
      },
    },
    {
      "@type": "Question",
      name: "What scientific applications use CM to PM conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CM to PM conversion is essential in nanotechnology research, atomic physics calculations, molecular biology measurements, materials science analysis, and quantum mechanics studies where atomic-scale precision is required.",
      },
    },
    {
      "@type": "Question",
      name: "Is this converter free to use for research purposes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our CM to PM converter is completely free for all users, including researchers, students, and professionals. No registration or subscription is required.",
      },
    },
    {
      "@type": "Question",
      name: "How do I choose the right precision level for my calculations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use 0-1 decimals for general measurements, 2-3 decimals for standard research, and 4-6 decimals for high-precision scientific calculations. Our tool also provides automatic precision recommendations based on your input values.",
      },
    },
  ],
}

// 科学应用结构化数据
const scientificApplicationData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert Centimeters to Picometers for Scientific Research",
  description: "Step-by-step guide for accurate CM to PM conversion in scientific applications",
  totalTime: "PT2M",
  supply: [
    {
      "@type": "HowToSupply",
      name: "CM to PM Converter Tool",
    },
    {
      "@type": "HowToSupply",
      name: "Measurement value in centimeters or picometers",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Enter measurement value",
      text: "Input your measurement in centimeters or picometers using decimal or scientific notation",
      image: "https://geekskai.com/static/tools/cm-to-pm-step1.jpg",
    },
    {
      "@type": "HowToStep",
      name: "Select precision level",
      text: "Choose decimal precision from 0-6 places based on your research requirements",
      image: "https://geekskai.com/static/tools/cm-to-pm-step2.jpg",
    },
    {
      "@type": "HowToStep",
      name: "Get conversion results",
      text: "View results in standard or scientific notation with conversion formula",
      image: "https://geekskai.com/static/tools/cm-to-pm-step3.jpg",
    },
    {
      "@type": "HowToStep",
      name: "Copy results for research",
      text: "Copy formatted results to clipboard for use in research papers or calculations",
      image: "https://geekskai.com/static/tools/cm-to-pm-step4.jpg",
    },
  ],
}

export default function CmToPmLayout({ children }: { children: React.ReactNode }) {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(scientificApplicationData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
