import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Check, CreditCard, ShieldCheck } from "lucide-react"
import { getAccountPlanStatus } from "@/lib/billing/repository"
import BillingPortalButton from "./BillingPortalButton"

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ userId }, { locale }] = await Promise.all([auth(), params])
  const prefix = locale === "en" ? "" : `/${locale}`
  if (!userId) redirect(`${prefix}/sign-in/?redirect_url=${prefix}/account/billing/`)

  const billing = await getAccountPlanStatus(userId)
  const tierName = billing.packageTier[0].toUpperCase() + billing.packageTier.slice(1)
  const statusNeedsAttention =
    billing.subscriptionStatus === "past_due" || billing.subscriptionStatus === "expired"

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 text-white sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Account</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Billing and access</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-400">
        Review your effective package and manage recurring billing securely with Creem.
      </p>

      <section className="mt-8 grid gap-5 md:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          {statusNeedsAttention ? (
            <div
              role="status"
              className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100"
            >
              Creem is retrying a payment. Your current access is retained while the retry is in
              progress; use the billing portal to review your payment method.
            </div>
          ) : null}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Current package</p>
              <h2 className="mt-2 text-2xl font-bold">{tierName}</h2>
              {billing.billingInterval ? (
                <p className="mt-1 text-sm capitalize text-slate-400">
                  {billing.billingInterval} billing
                </p>
              ) : null}
            </div>
            <span className="rounded-full bg-violet-500/15 px-3 py-1 text-sm font-semibold capitalize text-violet-200">
              {billing.subscriptionStatus?.replaceAll("_", " ") ?? "Free"}
            </span>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <li className="flex gap-2">
              <Check className="h-5 w-5 text-violet-400" />
              Up to {billing.batchFileLimit} local audio files per batch
            </li>
            <li className="flex gap-2">
              <Check className="h-5 w-5 text-violet-400" />
              {billing.zipExport ? "ZIP export included" : "Single-file downloads"}
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="h-5 w-5 text-violet-400" />
              Audio never leaves your device
            </li>
            <li className="flex gap-2">
              <CreditCard className="h-5 w-5 text-violet-400" />
              Recurring billing managed securely by Creem
            </li>
          </ul>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
            Public third-party downloader tools remain a separate free product. Basic and Pro never
            increase downloader limits or concurrency.
          </div>

          {billing.currentPeriodEnd ? (
            <p className="mt-6 text-sm text-slate-400">
              {billing.cancellationScheduled
                ? "Cancellation takes effect"
                : "Current period renews or ends"}{" "}
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(billing.currentPeriodEnd)
              )}
              .
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {(billing.packageTier === "basic" || billing.packageTier === "pro") &&
            billing.subscriptionStatus ? (
              <BillingPortalButton />
            ) : (
              <Link
                href={`${prefix}/pricing/`}
                className="inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white"
              >
                Compare plans
              </Link>
            )}
            <Link
              href={`${prefix}/audio-toolkit/`}
              className="inline-flex rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200"
            >
              Open Audio Toolkit
            </Link>
          </div>
        </article>

        <aside className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="font-semibold">Need help?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Cancel, update payment details, and access invoices through Creem. First payments have
            one 14-day refund window per account.
          </p>
          <a
            href="mailto:support@geekskai.com"
            className="mt-5 inline-flex text-sm font-semibold text-violet-300 underline underline-offset-4"
          >
            support@geekskai.com
          </a>
        </aside>
      </section>
    </main>
  )
}
