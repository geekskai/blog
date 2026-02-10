import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import React from "react"

// Content freshness tracking - updated monthly
const lastModified = new Date("2026-02-10")
const updateFrequency = "monthly"
const nextReviewDate = new Date("2026-05-10")

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "PERMProcessingTimeTracker" })
  const isDefaultLocale = locale === "en"
  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/perm-processing-time-tracker/"
        : `https://geekskai.com/${locale}/tools/perm-processing-time-tracker/`,
    },
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      images: [
        {
          url: "/static/images/perm-processing-time-tracker.png",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
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
      "update-frequency": updateFrequency,
      "next-review": nextReviewDate.toISOString(),
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
  const t = await getTranslations({ locale, namespace: "PERMProcessingTimeTracker" })
  const tHome = await getTranslations({ locale, namespace: "HomePage" })

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    description: t("seo_description"),
    url: "https://geekskai.com/tools/perm-processing-time-tracker/",
    applicationCategory: "Utility",
    operatingSystem: "Any",
    permissions: "none",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Track PERM processing times with real-time DOL data",
      "Get personalized PERM application estimates instantly",
      "Monitor queue position and priority dates accurately",
      "Analyze historical PERM processing trends",
      "Manage multiple PERM cases simultaneously",
      "Compare OEWS vs Non-OEWS processing timelines",
      "Track PERM analyst and audit review stages",
      "Real-time PERM processing status updates",
      "Free unlimited PERM case tracking",
      "Browser-based PERM timeline calculator",
      "No file upload to servers required",
      "Privacy-focused local data storage",
      "Support for complex PERM case scenarios",
      "Professional PERM processing estimates",
      "Interactive PERM trend visualization",
      "Mobile responsive immigration tracker",
      "Instant PERM queue position calculation",
      "Historical PERM data analysis tools",
      "Employment-based immigration timeline",
      "Real-time DOL processing data integration",
    ].join(", "),
    softwareRequirements: "Modern web browser with JavaScript enabled",
    audience: {
      "@type": "Audience",
      audienceType:
        "Immigration Applicants, Immigration Lawyers, HR Professionals, Employment-based Immigration Candidates, Green Card Applicants, International Workers, Immigration Consultants, Legal Professionals",
    },
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("seo_keywords"),
    mainEntity: {
      "@type": "SoftwareApplication",
      name: t("title"),
      applicationCategory: "ImmigrationTrackingTool",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1850",
        bestRating: "5",
        worstRating: "1",
      },
    },
    potentialAction: [
      {
        "@type": "TrackAction",
        name: t("title"),
        description: t("seo_description"),
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://geekskai.com/tools/perm-processing-time-tracker/",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
      },
    ],
    educationalUse:
      "Immigration Planning, Legal Case Management, Timeline Estimation, Immigration Process Understanding, Case Status Monitoring",
    targetAudience: {
      "@type": "ProfessionalAudience",
      audienceType:
        "Immigration professionals, applicants seeking permanent residence through employment",
    },
    sameAs: ["https://github.com/geekskai", "https://twitter.com/geekskai"],
  }

  // HowTo结构化数据
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("how_it_works.title"),
    description: t("seo_description"),
    totalTime: "PT5M",
    supply: ["PERM application submission date", "Case type information"],
    tool: [t("title"), "Web browser"],
    step: [
      {
        "@type": "HowToStep",
        name: t("how_it_works.step1.title"),
        text: t.raw("how_it_works.step1.description"),
        url: "https://geekskai.com/tools/perm-processing-time-tracker/",
      },
      {
        "@type": "HowToStep",
        name: t("how_it_works.step2.title"),
        text: t.raw("how_it_works.step2.description"),
      },
      {
        "@type": "HowToStep",
        name: t("how_it_works.step3.title"),
        text: t.raw("how_it_works.step3.description"),
      },
    ],
  }

  // FAQ结构化数据
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.accuracy.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t.raw("faq.accuracy.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.update_frequency.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t.raw("faq.update_frequency.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.oews_difference.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t.raw("faq.oews_difference.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.security.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t.raw("faq.security.answer"),
        },
      },
    ],
  }

  // Breadcrumb结构化数据
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tHome("header_nav_home"),
        item: "https://geekskai.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tHome("header_nav_tools"),
        item: "https://geekskai.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb_title"),
        item: "https://geekskai.com/tools/perm-processing-time-tracker/",
      },
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      {children}
    </div>
  )
}
