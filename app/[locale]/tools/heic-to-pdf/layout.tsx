import { supportedLocales } from "app/i18n/routing"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "HeicToPdf" })

  const isDefaultLocale = locale === "en"

  const languages = {
    "x-default": "https://geekskai.com/tools/heic-to-pdf/",
  }

  supportedLocales.forEach((loc: string) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/heic-to-pdf/`
  })

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      images: [
        {
          url: "/static/images/heic-to-pdf.png",
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
    alternates: {
      canonical: isDefaultLocale
        ? "https://geekskai.com/tools/heic-to-pdf/"
        : `https://geekskai.com/${locale}/tools/heic-to-pdf/`,
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
  }
}

// JSON-LD Structured Data for SEO
async function generateJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: "HeicToPdf" })

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("seo_title"),
    description: t("seo_description"),
    url: `https://geekskai.com/${locale === "en" ? "" : `${locale}/`}tools/heic-to-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "HEIC to PDF conversion",
      "HEIC to JPEG conversion",
      "Batch processing support",
      "PDF merging capability",
      "Privacy-first local processing",
      "No file size limits",
      "Advanced customization options",
      "Mobile device support",
      "No software installation required",
      "Browser-based processing",
      "Metadata handling options",
      "Page size customization (A4, Letter, Image Size)",
      "Image dimension adjustment",
      "Fit mode selection (Max Fit, Crop, Scale)",
      "Quality preservation",
      "Instant conversion",
      "Multiple file format support",
      "Cross-platform compatibility",
      "Free forever",
      "No registration required",
    ].join(", "),
    softwareRequirements: "Modern web browser with JavaScript enabled",
    author: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    keywords: t("seo_keywords"),
    educationalUse:
      "Document Conversion, Image Processing, File Format Conversion, Digital Photography, Professional Printing, Document Preparation, Image Archiving, Cross-Platform File Compatibility",
    audience: {
      "@type": "Audience",
      audienceType:
        "Students, Professionals, Designers, Photographers, Content Creators, Apple Device Users, Windows Users, Android Users, Web Developers, Graphic Designers",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "HEIC to PDF Converter",
      applicationCategory: "UtilityApplication",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1250",
      },
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
  const jsonLd = await generateJsonLd(locale)

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
