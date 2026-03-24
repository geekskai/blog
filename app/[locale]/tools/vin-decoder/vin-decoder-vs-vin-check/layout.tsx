import React from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generateComparePageData, generateComparePageMetadata, safeTranslate } from "./compare-seo"

interface VinCompareLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "VinDecoder.comparePage" })

  return generateComparePageMetadata({
    locale: params.locale,
    title: safeTranslate(
      t,
      "seo_title",
      "VIN Decoder vs VIN Check - What's the Difference? | GeeksKai"
    ),
    description: safeTranslate(
      t,
      "seo_description",
      "Learn the difference between a VIN decoder and a VIN check report. Understand what data is included, what each tool is best for, and when to use both."
    ),
    keywords: [
      safeTranslate(t, "keywords.0", "vin decoder"),
      safeTranslate(t, "keywords.1", "vin decoder vs vin check"),
      safeTranslate(t, "keywords.2", "what is vin check"),
      safeTranslate(t, "keywords.3", "vin decoder meaning"),
      safeTranslate(t, "keywords.4", "vin lookup vs vin report"),
      safeTranslate(t, "keywords.5", "vehicle history report vs vin decode"),
      safeTranslate(t, "keywords.6", "free vin decoder"),
      safeTranslate(t, "keywords.7", "vin number decoder"),
      safeTranslate(t, "keywords.8", "nhtsa vin decoder"),
      safeTranslate(t, "keywords.9", "vin decoder free"),
      safeTranslate(t, "keywords.10", "best free vin decoder"),
      safeTranslate(t, "keywords.11", "vin decoder tool"),
    ],
    ogTitle: safeTranslate(t, "og_title", "VIN Decoder vs VIN Check - Which One Do You Need?"),
    ogDescription: safeTranslate(
      t,
      "og_description",
      "Compare VIN decode data and full VIN check reports to choose the right workflow before buying a used vehicle."
    ),
    ogImageAlt: safeTranslate(t, "og_image_alt", "VIN Decoder vs VIN Check"),
    twitterTitle: safeTranslate(t, "twitter_title", "VIN Decoder vs VIN Check"),
    twitterDescription: safeTranslate(
      t,
      "twitter_description",
      "Understand the difference between decoding a VIN and checking vehicle history."
    ),
  })
}

export default async function VinCompareLayout({ children, params }: VinCompareLayoutProps) {
  const pageData = await generateComparePageData(params.locale)

  return (
    <>
      {pageData.structuredDataSchemas.map((schema, index) => (
        <script
          key={`compare-ld-json-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  )
}
