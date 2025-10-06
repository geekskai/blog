import type { Metadata } from "next"

// SEO 优化的 metadata (基于PRD文档的关键词策略)
export const metadata: Metadata = {
  title: "PM to CM & CM to PM Converter | Free Picometer to Centimeter Calculator Tool",
  description:
    "Professional PM to CM and CM to PM converter for scientists and researchers. Our picometer to centimeter tool converts PM to CM and CM to PM with scientific precision up to 6 decimal places. Perfect for nanotechnology, atomic physics, and materials science research.",
  keywords: [
    "pm to cm",
    "cm to pm",
    "picometer to centimeter",
    "pm to cm converter",
    "cm to pm converter",
    "PM to CM calculator",
    "CM to PM calculator",
    "picometer to centimeter converter",
    "picometer to centimeter calculator",
    "pm to cm tool",
    "cm to pm tool",
  ],
  authors: [{ name: "GeeksKai" }],
  creator: "GeeksKai",
  publisher: "GeeksKai",

  // Open Graph
  openGraph: {
    title: "PM to CM & CM to PM Converter | Picometer to Centimeter Scientific Tool",
    description:
      "Professional PM to CM and CM to PM converter with scientific precision. Our picometer to centimeter tool converts PM to CM and CM to PM instantly. Essential for nanotechnology, atomic physics, and materials science research.",
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
    title: "PM to CM & CM to PM Converter | Picometer to Centimeter Tool",
    description:
      "Professional PM to CM and CM to PM converter with scientific precision. Our picometer to centimeter tool converts PM to CM and CM to PM instantly. Perfect for nanotechnology and atomic physics research.",
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
  name: "PM to CM & CM to PM Scientific Converter | Picometer to Centimeter Tool",
  description:
    "Professional bidirectional tool for PM to CM conversion and CM to PM conversion with scientific precision up to 6 decimal places. Our picometer to centimeter converter handles PM to CM and CM to PM calculations instantly.",
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
    "PM to CM conversion with scientific precision",
    "CM to PM conversion with scientific precision",
    "Picometer to centimeter conversion (PM ↔ CM)",
    "Scientific precision control (0-6 decimal places)",
    "Scientific notation support",
    "Real-time PM to CM and CM to PM calculations",
    "Atomic scale visualization",
    "Educational content about PM to CM and CM to PM scale",
    "Copy results to clipboard",
    "Quick reference tables for PM to CM and CM to PM conversions",
    "Mobile-friendly interface",
    "No registration required",
    "Batch conversion capability",
    "Formula display and calculation steps",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://geekskai.com/static/tools/cm-to-pm-converter-screenshot.jpg",
    caption:
      "PM to CM & CM to PM Converter interface showing bidirectional scientific conversion. Our picometer to centimeter tool handles PM to CM and CM to PM calculations.",
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
    name: "How to use Picometer to Centimeter & CM to PM Converter",
    description:
      "Enter a value in picometers or centimeters, select precision level, and get instant bidirectional scientific conversion results with formula display for both picometer to centimeter and CM to PM conversions",
  },
}

// FAQ 结构化数据 - 基于PRD文档的目标用户问题
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I convert PM to CM and CM to PM accurately?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use our PM to CM and CM to PM converter by entering your value in either picometers or centimeters. For PM to CM conversion: divide by 10¹⁰. For CM to PM conversion: multiply by 10¹⁰. Our picometer to centimeter tool handles both PM to CM and CM to PM conversions automatically with scientific precision up to 6 decimal places.",
      },
    },
    {
      "@type": "Question",
      name: "What is a picometer and how does it relate to centimeters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A picometer (pm) is a unit of length equal to one trillionth of a meter (10⁻¹² m). One centimeter equals exactly 10,000,000,000 (10¹⁰) picometers. For PM to CM conversion: 1 pm = 1 × 10⁻¹⁰ cm. For CM to PM conversion: 1 cm = 1 × 10¹⁰ pm. Our picometer to centimeter tool handles this scale used in atomic physics, nanotechnology, and molecular measurements.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is this PM to CM and CM to PM converter for scientific research?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our PM to CM and CM to PM converter provides precision up to 6 decimal places and maintains accuracy for values up to 10¹⁵ picometers, making it suitable for professional scientific research, nanotechnology applications, and academic studies. Our picometer to centimeter tool ensures both PM to CM and CM to PM conversions are equally accurate.",
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
      name: "What scientific applications use PM to CM and CM to PM conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PM to CM and CM to PM conversions are essential in nanotechnology research, atomic physics calculations, molecular biology measurements, materials science analysis, and quantum mechanics studies where atomic-scale precision is required. Both PM to CM and CM to PM conversions are used for bridging macroscopic and atomic scale measurements.",
      },
    },
    {
      "@type": "Question",
      name: "Is this PM to CM and CM to PM converter free to use for research purposes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our PM to CM and CM to PM converter is completely free for all users, including researchers, students, and professionals. No registration or subscription is required for unlimited PM to CM and CM to PM conversions.",
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
  name: "How to Convert Picometer to Centimeter and CM to PM for Scientific Research",
  description:
    "Step-by-step guide for accurate picometer to centimeter and CM to PM bidirectional conversion in scientific applications",
  totalTime: "PT2M",
  supply: [
    {
      "@type": "HowToSupply",
      name: "Picometer to Centimeter & CM to PM Converter Tool",
    },
    {
      "@type": "HowToSupply",
      name: "Measurement value in picometers or centimeters",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Enter measurement value",
      text: "Input your measurement in picometers or centimeters using decimal or scientific notation for both picometer to centimeter and CM to PM conversions",
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
      text: "View picometer to centimeter and CM to PM results in standard or scientific notation with conversion formula",
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
