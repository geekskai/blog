import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getWorkspaceBillingStatus } from "@/lib/billing/repository"
import BillingPortalButton from "./BillingPortalButton"

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ userId }, { locale }] = await Promise.all([auth(), params])
  const prefix = locale === "en" ? "" : `/${locale}`
  if (!userId) redirect(`${prefix}/sign-in/?redirect_url=${prefix}/account/billing/`)
  const billing = await getWorkspaceBillingStatus(userId)
  return <main className="mx-auto max-w-3xl px-4 py-16 text-white"><h1 className="text-3xl font-bold">Billing</h1><div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><p className="text-sm text-slate-400">Current access</p><p className="mt-2 text-xl font-semibold">{billing.isPro ? "Geekskai DJ Workspace Pro" : "Free workspace"}</p>{billing.subscriptionStatus && <p className="mt-2 text-sm text-slate-300">Subscription status: {billing.subscriptionStatus.replaceAll("_", " ")}</p>}{billing.currentPeriodEnd && <p className="mt-1 text-sm text-slate-400">Current period ends {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(billing.currentPeriodEnd))}</p>}<div className="mt-6">{billing.subscriptionStatus ? <BillingPortalButton /> : <a href={`${prefix}/pricing/`} className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold">View Pro pricing</a>}</div><p className="mt-5 text-xs leading-5 text-slate-500">Cancel, update payment details, and access invoices in Creem’s secure customer portal. Support: support@geekskai.com</p></div></main>
}
