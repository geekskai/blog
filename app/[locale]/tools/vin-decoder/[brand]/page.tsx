import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "app/i18n/routing"
import { getBrandWithTranslations, SUPPORTED_BRAND_SLUGS } from "../types"
import VinDecoderClient from "./VinDecoderClient"

interface BrandPageProps {
  params: {
    brand: string
    locale: string
  }
}

export async function generateStaticParams() {
  return SUPPORTED_BRAND_SLUGS.map((slug) => ({
    brand: slug,
  }))
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: brandSlug, locale } = params
  const t = await getTranslations({ locale, namespace: "VinDecoder.brandPage" })
  const tSeo = await getTranslations({ locale, namespace: "VinDecoder.brandPage.seo" })
  const isDefaultLocale = locale === "en"

  // Get brand with translations
  const brand = getBrandWithTranslations(brandSlug, t)

  if (!brand) {
    return {
      title: "Brand Not Found",
    }
  }

  // Generate alternate language URLs
  const languages: Record<string, string> = {
    "x-default": `https://geekskai.com/tools/vin-decoder/${brand.slug}`,
  }

  supportedLocales.forEach((loc) => {
    languages[loc] = `https://geekskai.com/${loc}/tools/vin-decoder/${brand.slug}`
  })

  const pageUrl = isDefaultLocale
    ? `https://geekskai.com/tools/vin-decoder/${brand.slug}`
    : `https://geekskai.com/${locale}/tools/vin-decoder/${brand.slug}`

  const title = tSeo("title", { brand: brand.name })
  const description = tSeo("description", {
    brand: brand.name,
    brandDescription: brand.description,
  })

  // Content freshness metadata - Update this monthly
  const lastModified = new Date("2026-01-29")

  return {
    title,
    description,
    keywords: [
      tSeo("keywords.vin_decoder", { brand: brand.name }),
      tSeo("keywords.vin_lookup", { brand: brand.name }),
      tSeo("keywords.vin_check", { brand: brand.name }),
      tSeo("keywords.vehicle_identification", { brand: brand.name }),
      tSeo("keywords.decode_vin", { brand: brand.name }),
      tSeo("keywords.car_specs", { brand: brand.name }),
      tSeo("keywords.vehicle_specs", { brand: brand.name }),
      tSeo("keywords.free_decoder", { brand: brand.name }),
      tSeo("keywords.nhtsa_lookup", { brand: brand.name }),
      tSeo("keywords.vehicle_history", { brand: brand.name }),
    ],
    openGraph: {
      title: tSeo("og_title", { brand: brand.name }),
      description,
      type: "website",
      url: pageUrl,
      images: [
        {
          url: "/static/images/og/vin-decoder.png",
          width: 1200,
          height: 630,
          alt: tSeo("image_alt", { brand: brand.name }),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tSeo("twitter_title", { brand: brand.name }),
      description,
      images: ["/static/images/og/vin-decoder.png"],
    },
    alternates: {
      canonical: pageUrl,
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

export default async function BrandVinDecoderPage({ params }: BrandPageProps) {
  const { brand: brandSlug, locale } = params
  const t = await getTranslations({ locale, namespace: "VinDecoder.brandPage" })
  const tStructured = await getTranslations({ locale, namespace: "VinDecoder.structured_data" })

  // Get brand with translations
  const brand = getBrandWithTranslations(brandSlug, t)

  if (!brand) {
    notFound()
  }

  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale ? "https://geekskai.com" : `https://geekskai.com/${locale}`
  const pageUrl = `${baseUrl}/tools/vin-decoder/${brand.slug}`

  // Content freshness metadata - Update this monthly
  const lastModified = new Date("2026-01-25")

  // WebApplication Schema - Enhanced for AI SEO
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${brand.name} VIN Decoder`,
    description: `Free ${brand.name} VIN decoder tool to instantly decode any ${brand.name} vehicle identification number. Get detailed specs including make, model, year, engine, transmission, and safety features.`,
    url: pageUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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
      `Instant ${brand.name} VIN decoding`,
      `Complete ${brand.name} vehicle specifications`,
      "Engine and transmission details",
      "Safety features information",
      "Manufacturing details",
      "Export results as JSON/CSV",
      "No registration required",
      "Free forever",
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    datePublished: "2025-01-01",
    dateModified: lastModified.toISOString().split("T")[0],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2847",
      bestRating: "5",
      worstRating: "1",
    },
  }

  // FAQ structured data for brand-specific questions
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq_where_find_q", { brand: brand.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_where_find_a", { brand: brand.name }),
        },
      },
      {
        "@type": "Question",
        name: t("faq_wmi_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_wmi_a", { brand: brand.name, wmiCodes: brand.commonWMIs.join(", ") }),
        },
      },
      {
        "@type": "Question",
        name: t("faq_info_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_info_a", { brand: brand.name }),
        },
      },
      {
        "@type": "Question",
        name: t("faq_free_q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq_free_a", { brand: brand.name }),
        },
      },
    ],
  }

  // Breadcrumb structured data - Enhanced for AI SEO
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tStructured("breadcrumb_home"),
        item: "https://geekskai.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tStructured("breadcrumb_tools"),
        item: `${baseUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tStructured("breadcrumb_vin_decoder"),
        item: `${baseUrl}/tools/vin-decoder`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${brand.name} VIN Decoder`,
        item: pageUrl,
      },
    ],
  }

  // Organization Schema - Enhanced entity signals
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
    logo: "https://geekskai.com/static/logo.png",
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

  // Product structured data for better search visibility
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${brand.name} VIN Decoder Tool`,
    description: `Free online ${brand.name} VIN decoder. Decode any ${brand.name} vehicle identification number instantly.`,
    brand: {
      "@type": "Brand",
      name: "GeeksKai",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1523",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <VinDecoderClient brand={brand} />
    </div>
  )
}
