import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  CalendarDays,
  Check,
  Coins,
  CreditCard,
  ExternalLink,
  Layers,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { getBillingDisplayName } from "@/lib/billing/domain"
import { billingSchemaV2Enabled } from "@/lib/billing/policy"
import { getAccountPlanStatus } from "@/lib/billing/repository"
import SubscriptionActions from "./SubscriptionActions"

const tierThemes = {
  free: {
    icon: Layers,
    label: "Starter",
    badge: "border-slate-600/60 bg-slate-800/80 text-slate-300",
    accent: "from-slate-500/10 via-transparent to-transparent",
    topLine: "via-slate-500/40",
    border: "border-slate-800/80",
  },
  regular: {
    icon: Coins,
    label: "Paid Audio Credits",
    badge: "border-violet-500/40 bg-violet-500/15 text-violet-200",
    accent: "from-violet-500/12 via-fuchsia-500/6 to-transparent",
    topLine: "via-violet-400/60",
    border: "border-violet-500/30",
  },
} as const

function statusTone(status: string | null) {
  if (!status || status === "FREE") {
    return "border-slate-600/50 bg-slate-800/60 text-slate-300"
  }
  if (status === "ACTIVE" || status === "APPROVED") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
  }
  if (status === "SUSPENDED") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200"
  }
  return "border-violet-500/30 bg-violet-500/10 text-violet-200"
}

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ userId }, { locale }] = await Promise.all([auth(), params])
  const prefix = locale === "en" ? "" : `/${locale}`
  if (!userId) redirect(`${prefix}/sign-in/?redirect_url=${prefix}/account/billing/`)

  if (!billingSchemaV2Enabled()) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-bold text-white">Billing is temporarily unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Audio Credit balances and PayPal management are not enabled in this deployment.
        </p>
      </main>
    )
  }

  const billing = await getAccountPlanStatus(userId)
  const credits = billing.credits
  const tierName = getBillingDisplayName(credits)
  const theme = tierThemes[billing.packageTier]
  const TierIcon = theme.icon
  const statusNeedsAttention = billing.subscriptionStatus === "SUSPENDED"
  const statusLabel =
    billing.subscriptionStatus?.replaceAll("_", " ") ??
    (credits.paidAccess ? "Credit balance" : "Free")

  return (
    <main className="relative mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div
        className="pointer-events-none absolute inset-x-4 top-0 -z-10 h-48 rounded-3xl bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(124,58,237,0.14),transparent)] sm:inset-x-6"
        aria-hidden
      />

      <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400 sm:text-xs">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Account
      </p>
      <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-white">
        Billing and access
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
        Review your Audio Credit balance and manage recurring billing securely with PayPal.
      </p>

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] lg:gap-5">
        <article
          className={`relative overflow-hidden rounded-2xl border bg-slate-950/60 ${theme.border}`}
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.accent}`}
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${theme.topLine} to-transparent`}
            aria-hidden
          />

          <div className="relative p-5 sm:p-6">
            {statusNeedsAttention ? (
              <div
                role="status"
                className="mb-5 rounded-xl border border-amber-400/30 bg-amber-950/40 p-4 text-sm leading-6 text-amber-100"
              >
                PayPal has suspended this subscription after repeated payment failures. Update your
                payment method in PayPal or contact support before starting a new subscription.
              </div>
            ) : null}

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-violet-200">
                  <TierIcon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {theme.label}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{tierName}</h2>
                  {billing.billingInterval ? (
                    <p className="mt-1 text-sm capitalize text-slate-400">
                      {billing.billingInterval} billing
                    </p>
                  ) : null}
                </div>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize sm:text-sm ${statusTone(billing.subscriptionStatus)}`}
              >
                {statusLabel}
              </span>
            </div>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  icon: Coins,
                  text: `${credits.total.toLocaleString()} available Audio Credits`,
                },
                {
                  icon: Check,
                  text: `Up to ${billing.batchFileLimit} local audio files per batch`,
                },
                {
                  icon: Check,
                  text: billing.zipExport ? "ZIP export included" : "Single-file downloads",
                },
                { icon: ShieldCheck, text: "Audio never leaves your device" },
                {
                  icon: CreditCard,
                  text: "One-time and recurring payments processed securely by PayPal",
                },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex gap-2.5 rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2.5 text-sm text-slate-300"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-slate-400">
              Balance: {credits.free} daily · {credits.subscription} subscription · {credits.payg}{" "}
              Pay As You Go. Public downloader limits remain a separate free-product rule.
            </div>

            {billing.currentPeriodEnd ? (
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-slate-400">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                {billing.cancellationScheduled
                  ? "Cancellation takes effect"
                  : "Current period renews or ends"}{" "}
                {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                  new Date(billing.currentPeriodEnd)
                )}
                .
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2.5">
              {billing.subscriptionStatus &&
              ["APPROVAL_PENDING", "APPROVED", "ACTIVE", "SUSPENDED"].includes(
                billing.subscriptionStatus
              ) &&
              !billing.cancellationScheduled ? (
                <SubscriptionActions />
              ) : (
                <Link
                  href={`${prefix}/pricing/`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Compare plans
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              <Link
                href={`${prefix}/audio-toolkit/`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/50 px-5 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Open Audio Toolkit
              </Link>
            </div>
          </div>
        </article>

        <aside className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/50 p-5 sm:p-6">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10 text-violet-300">
              <LifeBuoy className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 font-semibold text-white">Need help?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Cancel future renewal here and manage payment details in PayPal. A payment can be
              refunded within 14 days only when none of its Credits have been consumed.
            </p>
            <a
              href="mailto:support@geekskai.com"
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-violet-300 underline underline-offset-4 transition-colors hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              support@geekskai.com
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </a>
          </div>
        </aside>
      </section>
    </main>
  )
}
