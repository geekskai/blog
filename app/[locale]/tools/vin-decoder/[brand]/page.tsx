import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { getBrandBySlug, SUPPORTED_BRANDS } from "../types"
import VinDecoderClient from "./VinDecoderClient"

interface BrandPageProps {
  params: {
    brand: string
  }
}

export async function generateStaticParams() {
  return SUPPORTED_BRANDS.map((brand) => ({
    brand: brand.slug,
  }))
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = getBrandBySlug(params.brand)

  if (!brand) {
    const t = await getTranslations({ locale: "en", namespace: "VinDecoder" })
    return {
      title: t("brand.not_found_title"),
    }
  }

  const t = await getTranslations({ locale: "en", namespace: "VinDecoder" })

  return {
    title: t("brand.seo_title", { brand: brand.name }),
    description: t("brand.seo_description", { brand: brand.name, description: brand.description }),
    keywords: [
      t("brand.seo_keyword_1", { brand: brand.name }),
      t("brand.seo_keyword_2", { brand: brand.name }),
      t("brand.seo_keyword_3", { brand: brand.name }),
      t("brand.seo_keyword_4", { brand: brand.name }),
      t("brand.seo_keyword_5", { brand: brand.name }),
      t("brand.seo_keyword_6", { brand: brand.name }),
      t("brand.seo_keyword_7", { brand: brand.name }),
    ],
    openGraph: {
      title: t("brand.og_title", { brand: brand.name }),
      description: brand.description,
      type: "website",
      url: `https://geekskai.com/tools/vin-decoder/${brand.slug}`,
    },
    alternates: {
      canonical: `https://geekskai.com/tools/vin-decoder/${brand.slug}`,
    },
  }
}

export default function BrandVinDecoderPage({ params }: BrandPageProps) {
  const brand = getBrandBySlug(params.brand)

  if (!brand) {
    notFound()
  }

  return <VinDecoderClient brand={brand} />
}
