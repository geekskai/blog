import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import siteMetadata from "@/data/siteMetadata"
import { getAudioCreditBalance } from "@/lib/audio-credits/repository"
import { audioCreditsEnabled, billingSchemaV2Enabled } from "@/lib/billing/policy"
import { buildPageSchema, serializeJsonLd } from "@/lib/seo"
import DjWorkspace from "../workspace/DjWorkspace"

const canonical = `${siteMetadata.siteUrl}/audio-toolkit/`
const audioToolkitDescription =
  "Normalize and convert audio you own in your browser without uploading files."
const socialImage = `${siteMetadata.siteUrl}/audio-toolkit/opengraph-image`

export const metadata: Metadata = {
  title: "Geekskai Audio Toolkit | Local audio preparation",
  description: audioToolkitDescription,
  alternates: {
    canonical,
    languages: {
      "x-default": canonical,
      en: canonical,
    },
  },
  openGraph: {
    title: "Geekskai Audio Toolkit | Local audio preparation",
    description: audioToolkitDescription,
    url: canonical,
    type: "website",
    images: [
      { url: socialImage, width: 1200, height: 630, alt: "Geekskai local-first Audio Toolkit" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geekskai Audio Toolkit | Local audio preparation",
    description: audioToolkitDescription,
    images: [socialImage],
  },
  robots: { index: true, follow: true },
}

const audioToolkitSchema = buildPageSchema({
  url: canonical,
  name: "Geekskai Audio Toolkit",
  description: audioToolkitDescription,
  breadcrumbs: [
    { name: "Home", url: `${siteMetadata.siteUrl}/` },
    { name: "Audio Toolkit", url: canonical },
  ],
})

export default async function AudioToolkitPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ checkout?: string }>
}) {
  const [{ userId }, { locale }, query] = await Promise.all([auth(), params, searchParams])
  if (locale !== "en") permanentRedirect("/audio-toolkit/")

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(audioToolkitSchema) }}
      />
      <DjWorkspace
        userId={userId}
        locale={locale}
        initialCredits={
          userId &&
          audioCreditsEnabled() &&
          billingSchemaV2Enabled()
            ? await getAudioCreditBalance(userId)
            : null
        }
        checkoutSuccess={
          Boolean(userId) && (query.checkout === "success" || query.checkout === "processing")
        }
      />
    </>
  )
}
