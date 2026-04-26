import React from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generateVehicleTypePageMetadata } from "../../vin-decoder-vs-vin-check/compare-seo"
import {
  generateVehicleTypePageData,
  getLocalizedTypeData,
  getTypeConfig,
} from "./vehicle-type-seo"

interface VehicleTypePageProps {
  params: Promise<{
    locale: string
    type: string
  }>
}

export async function generateMetadata(props: VehicleTypePageProps): Promise<Metadata> {
  const params = await props.params
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

  const metadata = generateVehicleTypePageMetadata({
    locale: params.locale,
    typeSlug: config.slug,
    title: localized.title,
    description: localized.description,
    keywords: metadataKeywords,
    ogImageAlt: localized.h1,
  })

  // Vehicle type landing pages are intended as indexable SEO entry points across locales.
  metadata.robots = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }

  return metadata
}

export default async function VehicleTypeLayout(props: {
  children: React.ReactNode
  params: Promise<{
    locale: string
    type: string
  }>
}) {
  const params = await props.params

  const { children } = props

  const config = getTypeConfig(params.type)

  if (!config) {
    return <>{children}</>
  }

  const pageData = await generateVehicleTypePageData(params.locale, config)

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
