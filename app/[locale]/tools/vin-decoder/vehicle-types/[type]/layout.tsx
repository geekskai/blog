import React from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  generateVehicleTypePageMetadata,
  getVinOrganizationSchema,
  getVinWebApplicationSchema,
  safeTranslate as sharedSafeTranslate,
  VIN_SEO_SHARED,
} from "../../vin-decoder-vs-vin-check/layout"

type VehicleTypeSlug = "motorcycle" | "rv" | "trailer" | "classic-car"

export interface VehicleTypeConfig {
  slug: VehicleTypeSlug
  name: string
  title: string
  description: string
  h1: string
  useCases: string[]
  faq: Array<{ q: string; a: string }>
  keywords: string[]
  primaryKeyword: string
  secondaryKeywords: string[]
}

export const VEHICLE_TYPE_CONFIG: Record<VehicleTypeSlug, VehicleTypeConfig> = {
  motorcycle: {
    slug: "motorcycle",
    name: "Motorcycle",
    title: "Motorcycle VIN Decoder - Free VIN Lookup for Bikes | GeeksKai",
    description:
      "Free motorcycle VIN decoder for instant VIN lookup. Decode bike VIN numbers to view model year, manufacturer, engine details, and key specifications.",
    h1: "Motorcycle VIN Decoder",
    useCases: [
      "Check used motorcycle specs before buying",
      "Verify VIN year and make for insurance",
      "Confirm manufacturer information from WMI",
      "Export decoded details for maintenance records",
    ],
    faq: [
      {
        q: "Can I decode any 17-character motorcycle VIN?",
        a: "Yes. Most modern motorcycles use a 17-character VIN format and can be decoded with this tool.",
      },
      {
        q: "What details can I get from a motorcycle VIN?",
        a: "You can retrieve key data such as model year, make, manufacturer information, and available technical attributes.",
      },
    ],
    keywords: [
      "motorcycle vin decoder",
      "motorcycle vin number decoder",
      "bike vin lookup",
      "motorcycle vin check",
      "decode bike vin",
      "harley vin decoder",
      "yamaha vin decoder",
      "atv vin decoder",
    ],
    primaryKeyword: "motorcycle vin decoder",
    secondaryKeywords: [
      "harley davidson vin decoder",
      "motorcycle vin number decoder",
      "free vin decoder",
    ],
  },
  rv: {
    slug: "rv",
    name: "RV",
    title: "RV VIN Decoder - Free Motorhome VIN Lookup | GeeksKai",
    description:
      "Free RV VIN decoder for motorhomes and recreational vehicles. Decode RV VINs to check year, manufacturer details, and core vehicle specs.",
    h1: "RV VIN Decoder",
    useCases: [
      "Validate RV identity before purchase",
      "Check model year for registration and insurance",
      "Verify manufacturer and plant data",
      "Store decoded data for fleet operations",
    ],
    faq: [
      {
        q: "Does this work for motorhomes and campers?",
        a: "Yes. RV VIN decoding supports many motorhomes and recreational vehicles with standard VIN formats.",
      },
      {
        q: "Is the RV VIN decoder free?",
        a: "Yes. This tool is free to use with no signup requirement.",
      },
    ],
    keywords: [
      "rv vin decoder",
      "rv vin number decoder",
      "motorhome vin lookup",
      "camper vin check",
      "free rv vin decoder",
    ],
    primaryKeyword: "rv vin decoder",
    secondaryKeywords: ["rv vin number decoder", "free vin decoder", "vin number decoder"],
  },
  trailer: {
    slug: "trailer",
    name: "Trailer",
    title: "Trailer VIN Decoder - Free Trailer VIN Check | GeeksKai",
    description:
      "Free trailer VIN decoder for quick VIN lookup. Decode trailer VINs to verify manufacturer details, model year, and identification attributes.",
    h1: "Trailer VIN Decoder",
    useCases: [
      "Verify trailer VIN before transfer",
      "Confirm year and plant details",
      "Cross-check records for compliance",
      "Export trailer VIN reports in seconds",
    ],
    faq: [
      {
        q: "Can this decode utility and cargo trailer VINs?",
        a: "Yes. Many trailer types using a standard VIN format can be decoded for key identification fields.",
      },
      {
        q: "What if some trailer fields are missing?",
        a: "Data availability varies by manufacturer and model year. Some records may have partial details.",
      },
    ],
    keywords: [
      "trailer vin decoder",
      "trailer vin number decoder",
      "travel trailer vin decoder",
      "trailer vin lookup",
      "trailer vin check",
      "decode trailer vin",
    ],
    primaryKeyword: "trailer vin decoder",
    secondaryKeywords: [
      "trailer vin number decoder",
      "travel trailer vin decoder",
      "free vin decoder",
      "vehicle vin decoder",
    ],
  },
  "classic-car": {
    slug: "classic-car",
    name: "Classic Car",
    title: "Classic Car VIN Decoder - Vintage Vehicle VIN Guide | GeeksKai",
    description:
      "Classic car VIN decoder guide with lookup support for many legacy and modern VIN formats. Decode vintage vehicle identifiers and verify key details.",
    h1: "Classic Car VIN Decoder",
    useCases: [
      "Research vintage vehicle identity",
      "Validate year and manufacturer clues",
      "Prepare documentation for restoration projects",
      "Capture decoded specs for archival records",
    ],
    faq: [
      {
        q: "Do all classic cars use 17-character VINs?",
        a: "No. Many older vehicles use shorter legacy identifiers. Modernized records may still map useful data where available.",
      },
      {
        q: "Can I still use this for classic vehicle research?",
        a: "Yes. It is useful for checking available VIN data and understanding what fields can be validated for older cars.",
      },
    ],
    keywords: [
      "classic car vin decoder",
      "classic vin number decoder",
      "vintage vin lookup",
      "old car vin check",
      "classic vehicle identification",
    ],
    primaryKeyword: "classic car vin decoder",
    secondaryKeywords: ["classic vin number decoder", "decode vin number", "free vin decoder"],
  },
}

export const safeTranslate = sharedSafeTranslate

export function getTypeConfig(type: string): VehicleTypeConfig | undefined {
  return VEHICLE_TYPE_CONFIG[type as VehicleTypeSlug]
}

export function getLocalizedTypeData(
  t: (key: string, values?: Record<string, string | number>) => string,
  config: VehicleTypeConfig
) {
  const prefix = `types.${config.slug}`
  return {
    name: safeTranslate(t, `${prefix}.name`, config.name),
    title: safeTranslate(t, `${prefix}.title`, config.title),
    description: safeTranslate(t, `${prefix}.description`, config.description),
    h1: safeTranslate(t, `${prefix}.h1`, config.h1),
    useCases: config.useCases.map((item, index) =>
      safeTranslate(t, `${prefix}.use_cases.${index + 1}`, item)
    ),
    faq: config.faq.map((item, index) => ({
      q: safeTranslate(t, `${prefix}.faq.${index + 1}.q`, item.q),
      a: safeTranslate(t, `${prefix}.faq.${index + 1}.a`, item.a),
    })),
    keywords: config.keywords.map((item, index) =>
      safeTranslate(t, `${prefix}.keywords.${index + 1}`, item)
    ),
  }
}

interface VehicleTypePageProps {
  params: {
    locale: string
    type: string
  }
}

export async function generateMetadata({ params }: VehicleTypePageProps): Promise<Metadata> {
  const config = getTypeConfig(params.type)
  const t = await getTranslations({
    locale: params.locale,
    namespace: "VinDecoder.vehicleTypePage",
  })

  if (!config) {
    return {
      title: "Vehicle Type Not Found",
    }
  }

  const localized = getLocalizedTypeData(t, config)
  const metadataKeywords = Array.from(
    new Set([...localized.keywords, config.primaryKeyword, ...config.secondaryKeywords])
  )

  return generateVehicleTypePageMetadata({
    locale: params.locale,
    typeSlug: config.slug,
    title: localized.title,
    description: localized.description,
    keywords: metadataKeywords,
    ogImageAlt: localized.h1,
  })
}

export async function generateVehicleTypePageData(
  locale: string,
  typeSlug: string,
  config: VehicleTypeConfig
) {
  const t = await getTranslations({
    locale,
    namespace: "VinDecoder.vehicleTypePage",
  })

  const localized = getLocalizedTypeData(t, config)
  const lastModified = new Date(VIN_SEO_SHARED.lastModifiedAt)
  const isDefaultLocale = locale === "en"
  const baseUrl = isDefaultLocale ? VIN_SEO_SHARED.siteUrl : `${VIN_SEO_SHARED.siteUrl}/${locale}`
  const pageUrl = `${baseUrl}/tools/vin-decoder/vehicle-types/${typeSlug}`

  const allFaqItems = [
    ...localized.faq,
    {
      q: safeTranslate(t, "common_faq.1.q", "Is this a free VIN decoder for this vehicle type?"),
      a: safeTranslate(
        t,
        "common_faq.1.a",
        "Yes. This page is designed to support free VIN decoder workflows and links directly to our free VIN lookup tool."
      ),
    },
    {
      q: safeTranslate(t, "common_faq.2.q", "Can I use this like a VIN number decoder?"),
      a: safeTranslate(
        t,
        "common_faq.2.a",
        "Yes. VIN decoder and VIN number decoder are commonly used as equivalent search intents. This page supports both terms."
      ),
    },
    {
      q: safeTranslate(t, "common_faq.3.q", "Does this use official NHTSA VIN decoder data?"),
      a: safeTranslate(
        t,
        "common_faq.3.a",
        "Our VIN decoding workflow references official NHTSA vPIC data for core vehicle specification matching."
      ),
    },
    {
      q: safeTranslate(t, "common_faq.4.q", "What if my VIN is not 17 characters?"),
      a: safeTranslate(
        t,
        "common_faq.4.a",
        "Most modern vehicles use 17-character VINs. Older or special vehicles may require legacy decoding guidance."
      ),
    },
    {
      q: safeTranslate(t, "common_faq.5.q", "Can this replace a full VIN check report?"),
      a: safeTranslate(
        t,
        "common_faq.5.a",
        "No. VIN decoding verifies vehicle identity/specs. A VIN check report is still needed for accident, title, and ownership history."
      ),
    },
    {
      q: safeTranslate(t, "common_faq.6.q", "Where should I start before buying a used vehicle?"),
      a: safeTranslate(
        t,
        "common_faq.6.a",
        "Start with decoding the VIN number to verify specs, then run a VIN check report for risk and historical events."
      ),
    },
  ].slice(0, 8)

  const breadcrumbItems = [
    { label: safeTranslate(t, "breadcrumb.home", "Home"), href: "/" },
    { label: safeTranslate(t, "breadcrumb.tools", "Tools"), href: "/tools" },
    {
      label: safeTranslate(t, "breadcrumb.vin_decoder", "VIN Decoder"),
      href: "/tools/vin-decoder",
    },
    { label: localized.name },
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: safeTranslate(t, "breadcrumb.home", "Home"),
        item: `${baseUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: safeTranslate(t, "breadcrumb.tools", "Tools"),
        item: `${baseUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: safeTranslate(t, "breadcrumb.vin_decoder", "VIN Decoder"),
        item: `${baseUrl}/tools/vin-decoder`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${localized.name} VIN Decoder`,
        item: pageUrl,
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: localized.h1,
    description: localized.description,
    url: pageUrl,
    inLanguage: locale,
    datePublished: VIN_SEO_SHARED.publishedAt,
    dateModified: lastModified.toISOString(),
    isPartOf: {
      "@type": "WebSite",
      name: VIN_SEO_SHARED.siteName,
      url: VIN_SEO_SHARED.siteUrl,
    },
  }

  const webApplicationSchema = getVinWebApplicationSchema({
    name: localized.h1,
    description: localized.description,
    url: pageUrl,
    dateModified: lastModified.toISOString(),
    featureList: [
      safeTranslate(t, "core_fact.primary_keyword", "Primary keyword"),
      safeTranslate(t, "core_fact.source_value", "NHTSA vPIC reference data"),
      safeTranslate(t, "core_fact.cost_value", "Free VIN decoder"),
      safeTranslate(t, "best_use_cases_title", "Best use cases"),
      safeTranslate(t, "faq_title", "FAQ"),
    ],
  })

  const organizationSchema = getVinOrganizationSchema()

  return {
    localized,
    lastModified,
    breadcrumbItems,
    allFaqItems,
    structuredDataSchemas: [
      breadcrumbSchema,
      faqSchema,
      webPageSchema,
      webApplicationSchema,
      organizationSchema,
    ],
  }
}

export default async function VehicleTypeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    locale: string
    type: string
  }
}) {
  const config = getTypeConfig(params.type)

  if (!config) {
    return <>{children}</>
  }

  const pageData = await generateVehicleTypePageData(params.locale, config.slug, config)

  return (
    <>
      {pageData.structuredDataSchemas.map((schema, index) => (
        <script
          key={`vehicle-type-ld-json-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  )
}
