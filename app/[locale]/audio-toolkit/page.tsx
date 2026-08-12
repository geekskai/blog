import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAccountPlanStatus } from "@/lib/billing/repository"
import DjWorkspace from "../workspace/DjWorkspace"

export const metadata: Metadata = {
  title: "Geekskai Audio Toolkit | Local audio preparation",
  description: "Normalize and convert audio you own in your browser without uploading files.",
  robots: { index: false, follow: false },
}

export default async function AudioToolkitPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ checkout?: string }>
}) {
  const [{ userId }, { locale }, query] = await Promise.all([auth(), params, searchParams])
  const localePrefix = locale === "en" ? "" : `/${locale}`
  if (!userId) {
    redirect(`${localePrefix}/sign-in/?redirect_url=${localePrefix}/audio-toolkit/`)
  }

  return (
    <DjWorkspace
      userId={userId}
      locale={locale}
      initialBillingStatus={await getAccountPlanStatus(userId)}
      checkoutSuccess={query.checkout === "success"}
    />
  )
}
