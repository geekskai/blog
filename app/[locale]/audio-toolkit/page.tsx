import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import siteMetadata from "@/data/siteMetadata"
import { getEntitlementSet } from "@/lib/billing/domain"
import { getAccountPlanStatus } from "@/lib/billing/repository"
import type { AccountPlanStatus } from "@/lib/billing/types"
import DjWorkspace from "../workspace/DjWorkspace"

export const metadata: Metadata = {
  title: "Geekskai Audio Toolkit | Local audio preparation",
  description: "Normalize and convert audio you own in your browser without uploading files.",
  alternates: {
    canonical: `${siteMetadata.siteUrl}/audio-toolkit/`,
    languages: {
      "x-default": `${siteMetadata.siteUrl}/audio-toolkit/`,
      en: `${siteMetadata.siteUrl}/audio-toolkit/`,
    },
  },
  robots: { index: true, follow: true },
}

const freeEntitlements = getEntitlementSet("free")
const publicFreeStatus: AccountPlanStatus = {
  packageTier: "free",
  billingInterval: null,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  cancellationScheduled: false,
  batchFileLimit: freeEntitlements.audioBatchFileLimit,
  zipExport: freeEntitlements.zipExport,
}

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
    <DjWorkspace
      userId={userId}
      locale={locale}
      initialBillingStatus={userId ? await getAccountPlanStatus(userId) : publicFreeStatus}
      checkoutSuccess={Boolean(userId) && query.checkout === "success"}
    />
  )
}
