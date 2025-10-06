import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "../../../i18n/routing"

// 动态生成多语言 metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "BoardFootCalculator" })

  // 语言映射
  const localeMap: Record<string, string> = {
    en: "en_US",
    ja: "ja_JP",
    ko: "ko_KR",
    no: "no_NO",
    "zh-cn": "zh_CN",
    da: "da_DK",
  }

  const ogLocale = localeMap[locale] || "en_US"
  const baseUrl = "https://geekskai.com"
  const path = `/tools/board-foot-calculator/`
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  const isDefaultLocale = locale === "en"
  const languages = {
    "x-default": "https://geekskai.com/tools/board-foot-calculator/",
  }

  supportedLocales.forEach((locale) => {
    languages[locale] = `https://geekskai.com/${locale}/tools/board-foot-calculator/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    authors: [{ name: "GeeksKai" }],
    creator: "GeeksKai",
    publisher: "GeeksKai",

    // Open Graph
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      url,
      siteName: "GeeksKai Tools",
      images: [
        {
          url: "/static/tools/board-foot-calculator-og.jpg",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
        },
      ],
      locale: ogLocale,
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/static/tools/board-foot-calculator-twitter.jpg"],
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

    // Canonical URL and alternates
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/board-foot-calculator/"
        : `https://geekskai.com/${locale}/tools/board-foot-calculator/`,
      languages: {
        ...languages,
      },
    },

    // Additional metadata
    category: "Tools",
    classification: "Construction Calculator",

    // Verification and other meta tags
    other: {
      "application-name": t("page_title"),
      "apple-mobile-web-app-title": t("page_title"),
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
    },
  }
}

// 结构化数据 (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Board Foot Calculator",
  description:
    "Professional online tool to calculate lumber board feet and estimate wood project costs with high precision",
  url: "https://geekskai.com/tools/board-foot-calculator/",
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
    "Board foot calculation (Length × Width × Thickness ÷ 144)",
    "Imperial and metric unit support",
    "Lumber cost estimation",
    "Multi-piece project management",
    "Precision control (0-3 decimal places)",
    "Wood species pricing database",
    "Waste factor calculations",
    "Project export (CSV, PDF)",
    "Copy results to clipboard",
    "Common lumber dimensions reference",
    "Educational content and tutorials",
    "Mobile-friendly interface",
    "No registration required",
    "Professional-grade accuracy",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://geekskai.com/static/tools/board-foot-calculator-screenshot.jpg",
    caption: "Board Foot Calculator interface showing lumber calculation and cost estimation",
  },
  softwareVersion: "1.0",
  datePublished: "2024-01-24",
  dateModified: "2024-01-24",
  inLanguage: "en-US",
  audience: {
    "@type": "Audience",
    audienceType: [
      "Woodworkers",
      "Construction contractors",
      "Furniture makers",
      "Cabinet makers",
      "Architects",
      "Engineers",
      "Lumber dealers",
      "DIY enthusiasts",
      "Construction students",
      "Home builders",
      "Carpenters",
      "Project managers",
    ],
  },
  usageInfo: {
    "@type": "CreativeWork",
    name: "How to use Board Foot Calculator",
    description:
      "Enter lumber dimensions (length, width, thickness), select units, add price per board foot for cost estimation, and get instant board foot calculations with project management features",
  },
}

// FAQ 结构化数据
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a board foot and how is it calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'A board foot is a unit of measurement for lumber volume. One board foot equals 144 cubic inches (12" × 12" × 1"). The formula is: Board Feet = (Length × Width × Thickness) ÷ 144, where all dimensions are in inches.',
      },
    },
    {
      "@type": "Question",
      name: "How do I calculate the cost of lumber using board feet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To calculate lumber cost: Total Cost = Board Feet × Price per Board Foot. For example, if you need 10 board feet of lumber priced at $3.50 per board foot, the cost would be 10 × $3.50 = $35.00.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use nominal or actual lumber dimensions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Always use actual dimensions for board foot calculations. Nominal dimensions (like 2×4) are traditional names, but actual dimensions (1.5" × 3.5" for a 2×4) are the true measurements after planing and drying.',
      },
    },
    {
      "@type": "Question",
      name: "What waste factor should I include in my lumber calculations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Typically include 5-15% waste factor depending on project complexity. Simple projects may need 5-10% waste, while complex projects with many cuts might require 10-15% to account for mistakes, defects, and cutting waste.",
      },
    },
    {
      "@type": "Question",
      name: "Can this calculator handle both imperial and metric measurements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our board foot calculator supports both imperial (inches, feet) and metric (centimeters, meters) units. The calculator automatically converts measurements to ensure accurate board foot calculations regardless of input units.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is this board foot calculator for professional use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our calculator provides professional-grade accuracy with precision control up to 3 decimal places. It uses the standard industry formula and is suitable for construction, woodworking, and commercial lumber applications.",
      },
    },
    {
      "@type": "Question",
      name: "What types of wood projects can I calculate with this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This calculator works for all lumber projects including construction framing, furniture making, cabinet building, decking, flooring, trim work, and any project requiring accurate board foot measurements and cost estimation.",
      },
    },
    {
      "@type": "Question",
      name: "Does the calculator include lumber pricing information?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we include reference pricing for common wood species, but prices vary by region and market conditions. Always get current quotes from local suppliers for accurate project budgeting.",
      },
    },
    {
      "@type": "Question",
      name: "Can I save and export my lumber calculations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the calculator includes project management features allowing you to save multiple lumber pieces, calculate project totals, and export results to CSV format for use in other applications.",
      },
    },
    {
      "@type": "Question",
      name: "Is this board foot calculator free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our board foot calculator is completely free with no registration required. All features including calculations, project management, and exports are available at no cost.",
      },
    },
  ],
}

// 工具特定的结构化数据
const toolStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Professional Board Foot Calculator",
  description: "Calculate lumber board feet and estimate wood project costs",
  applicationCategory: "CalculatorApplication",
  operatingSystem: "Web Browser",
  url: "https://geekskai.com/tools/board-foot-calculator/",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Board foot calculation",
    "Lumber cost estimation",
    "Project management",
    "Multiple unit support",
    "Export capabilities",
  ],
  screenshot: "https://geekskai.com/static/tools/board-foot-calculator-screenshot.jpg",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
}

// 教育内容结构化数据
const educationalStructuredData = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Board Foot Calculation Guide",
  description: "Comprehensive guide to understanding and calculating lumber board feet",
  educationalLevel: "Beginner to Professional",
  learningResourceType: "Tutorial",
  teaches: [
    "Board foot calculation formula",
    "Lumber measurement techniques",
    "Cost estimation methods",
    "Wood species selection",
    "Project planning strategies",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: [
      "Construction workers",
      "Woodworkers",
      "Students",
      "DIY enthusiasts",
      "Professional contractors",
    ],
  },
}

export default async function BoardFootCalculatorLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "BoardFootCalculator" })

  const baseUrl = "https://geekskai.com"
  const path = `/tools/board-foot-calculator/`
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  // 动态生成结构化数据
  const dynamicStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("page_title"),
    description: t("seo_description"),
    url,
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
      "Board foot calculation (Length × Width × Thickness ÷ 144)",
      "Imperial and metric unit support",
      "Lumber cost estimation",
      "Multi-piece project management",
      "Precision control (0-3 decimal places)",
      "Wood species pricing database",
      "Waste factor calculations",
      "Project export (CSV, PDF)",
      "Copy results to clipboard",
      "Common lumber dimensions reference",
      "Educational content and tutorials",
      "Mobile-friendly interface",
      "No registration required",
      "Professional-grade accuracy",
    ],
    screenshot: {
      "@type": "ImageObject",
      url: "https://geekskai.com/static/tools/board-foot-calculator-screenshot.jpg",
      caption: "Board Foot Calculator interface showing lumber calculation and cost estimation",
    },
    softwareVersion: "1.0",
    datePublished: "2024-01-24",
    dateModified: "2024-01-24",
    inLanguage: locale,
    audience: {
      "@type": "Audience",
      audienceType: [
        "Woodworkers",
        "Construction contractors",
        "Furniture makers",
        "Cabinet makers",
        "Architects",
        "Engineers",
        "Lumber dealers",
        "DIY enthusiasts",
        "Construction students",
        "Home builders",
        "Carpenters",
        "Project managers",
      ],
    },
  }

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dynamicStructuredData),
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
          __html: JSON.stringify(toolStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalStructuredData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
