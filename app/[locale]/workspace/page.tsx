import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getWorkspaceBillingStatus } from "@/lib/billing/repository"
import DjWorkspace from "./DjWorkspace"

export const metadata: Metadata = {
  title: "Geekskai DJ Workspace Pro | Local audio preparation",
  description: "Normalize and convert audio you own in your browser without uploading files.",
  robots: { index: false, follow: false },
}

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ checkout?: string }>
}) {
  const [{ userId }, { locale }, query] = await Promise.all([auth(), params, searchParams])

  if (!userId) {
    const localePrefix = locale === "en" ? "" : `/${locale}`
    redirect(`${localePrefix}/sign-in/?redirect_url=${localePrefix}/workspace/`)
  }

  const billingStatus = await getWorkspaceBillingStatus(userId)
  return (
    <DjWorkspace
      userId={userId}
      locale={locale}
      initialBillingStatus={billingStatus}
      checkoutSuccess={query.checkout === "success"}
    />
  )
}
