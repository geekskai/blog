import { Metadata } from "next"
import { notFound } from "next/navigation"
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
    return {
      title: "Brand Not Found",
    }
  }

  return {
    title: `${brand.name} VIN Decoder - Free ${brand.name} Vehicle Identification Number Lookup | GeeksKai`,
    description: `${brand.description} Get instant ${brand.name} vehicle specifications including engine, transmission, and safety features. 100% free, no signup required.`,
    keywords: [
      `${brand.name} VIN decoder`,
      `${brand.name} VIN lookup`,
      `${brand.name} VIN check`,
      `${brand.name} vehicle identification`,
      `decode ${brand.name} VIN`,
      `${brand.name} car specs`,
      `${brand.name} vehicle specs`,
    ],
    openGraph: {
      title: `${brand.name} VIN Decoder - Instant ${brand.name} Vehicle Specs`,
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
