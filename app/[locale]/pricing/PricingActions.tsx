"use client"

import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import {
  ArrowRight,
  BadgePercent,
  Check,
  Clock3,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ANNUAL_SAVINGS, PACKAGE_CATALOG } from "@/lib/billing/catalog"
import type { PackageTier } from "@/lib/billing/domain"
import type { AccountPlanStatus } from "@/lib/billing/types"

type BillingInterval = "monthly" | "annual"
type CheckoutTier = "basic" | "pro"
type AccountStatus = "loading" | "ready" | "error"
type BusyAction = { kind: "checkout" | "portal"; tier: CheckoutTier } | null
type ActionError = { tier: CheckoutTier; message: string } | null

const checkoutEnabled = process.env.NEXT_PUBLIC_BILLING_CHECKOUT_ENABLED === "true"

const paidPlans = {
  basic: {
    name: "Basic",
    audience: "For regular set preparation",
    monthly: {
      price: `$${PACKAGE_CATALOG.basic.monthlyPrice}`,
      suffix: "/month",
      note: "Billed monthly",
    },
    annual: {
      price: `$${PACKAGE_CATALOG.basic.annualPrice / 12}`,
      suffix: "/month",
      note: `$${PACKAGE_CATALOG.basic.annualPrice} billed annually · Save $${ANNUAL_SAVINGS.basic}`,
    },
    features: ["Everything in Free", "Up to 20 files per local batch", "ZIP export"],
  },
  pro: {
    name: "Pro",
    audience: "For larger libraries and frequent sets",
    monthly: {
      price: `$${PACKAGE_CATALOG.pro.monthlyPrice}`,
      suffix: "/month",
      note: "Billed monthly",
    },
    annual: {
      price: `$${PACKAGE_CATALOG.pro.annualPrice / 12}`,
      suffix: "/month",
      note: `$${PACKAGE_CATALOG.pro.annualPrice} billed annually · Save $${ANNUAL_SAVINGS.pro}`,
    },
    features: ["Everything in Basic", "Up to 50 files per local batch", "Priority support"],
  },
} as const

export default function PricingActions({ locale }: { locale: string }) {
  const { isLoaded, isSignedIn } = useAuth()
  const [interval, setInterval] = useState<BillingInterval>("annual")
  const [busyAction, setBusyAction] = useState<BusyAction>(null)
  const [actionError, setActionError] = useState<ActionError>(null)
  const [currentTier, setCurrentTier] = useState<PackageTier | null>(null)
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("loading")
  const [statusError, setStatusError] = useState<string | null>(null)
  const [statusRequestKey, setStatusRequestKey] = useState(0)
  const billingButtonRefs = useRef<Record<BillingInterval, HTMLButtonElement | null>>({
    monthly: null,
    annual: null,
  })
  const prefix = locale === "en" ? "" : `/${locale}`
  const pricingPath = `${prefix}/pricing/`

  useEffect(() => {
    if (!isLoaded) {
      setAccountStatus("loading")
      return
    }
    if (!isSignedIn) {
      setCurrentTier(null)
      setStatusError(null)
      setAccountStatus("ready")
      return
    }

    const controller = new AbortController()
    setStatusError(null)
    setAccountStatus("loading")
    void fetch("/api/billing/status/", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as AccountPlanStatus & { error?: string }
        if (!response.ok) throw new Error(result.error ?? "Account plan is unavailable.")
        setCurrentTier(result.packageTier)
        setAccountStatus("ready")
      })
      .catch((statusError) => {
        if (statusError instanceof DOMException && statusError.name === "AbortError") return
        setStatusError(
          statusError instanceof Error ? statusError.message : "Account plan is unavailable."
        )
        setAccountStatus("error")
      })

    return () => controller.abort()
  }, [isLoaded, isSignedIn, statusRequestKey])

  const startCheckout = async (tier: CheckoutTier) => {
    setActionError(null)
    if (isLoaded && !isSignedIn) {
      window.location.assign(`${prefix}/sign-in/?redirect_url=${encodeURIComponent(pricingPath)}`)
      return
    }

    setBusyAction({ kind: "checkout", tier })
    try {
      const response = await fetch("/api/billing/checkout/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier, interval, locale, source: "pricing" }),
      })
      const result = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !result.url) throw new Error(result.error ?? "Checkout failed.")
      window.location.assign(result.url)
    } catch (checkoutError) {
      setActionError({
        tier,
        message: checkoutError instanceof Error ? checkoutError.message : "Checkout failed.",
      })
      setBusyAction(null)
    }
  }

  const openPortal = async (tier: CheckoutTier) => {
    setActionError(null)
    setBusyAction({ kind: "portal", tier })
    try {
      const response = await fetch("/api/billing/portal/", { method: "POST" })
      const result = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !result.url) throw new Error(result.error ?? "Billing portal failed.")
      window.location.assign(result.url)
    } catch (portalError) {
      setActionError({
        tier,
        message: portalError instanceof Error ? portalError.message : "Billing portal failed.",
      })
      setBusyAction(null)
    }
  }

  return (
    <>
      <div className="grid items-end gap-8 lg:grid-cols-2">
        <section className="text-left" aria-labelledby="pricing-heading">
          <p className="text-xs font-bold uppercase tracking-[0.23em] text-violet-300">
            Geekskai Audio Toolkit pricing
          </p>
          <h1
            id="pricing-heading"
            className="mt-3 max-w-3xl text-3xl font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
          >
            A plan for every stage of your audio workflow.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Prepare audio you own directly in your browser. Files and filenames never leave your
            device.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-5 w-5 text-violet-400" aria-hidden />
            Private by design · secure checkout by Creem
          </p>
        </section>

        <div className="flex flex-col items-center">
          <div
            className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950/70 p-2 shadow-[0_18px_55px_-35px_rgba(124,58,237,0.8)]"
            role="radiogroup"
            aria-label="Billing interval"
          >
            <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Billing cycle
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-200">
                <BadgePercent className="h-3.5 w-3.5" aria-hidden /> Save up to $60
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-black/20 p-1">
              {(["monthly", "annual"] as const).map((value) => {
                const selected = interval === value
                return (
                  <button
                    key={value}
                    ref={(button) => {
                      billingButtonRefs.current[value] = button
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setInterval(value)}
                    onKeyDown={(event) => {
                      const previousKeys = ["ArrowLeft", "ArrowUp", "Home"]
                      const nextKeys = ["ArrowRight", "ArrowDown", "End"]
                      if (!previousKeys.includes(event.key) && !nextKeys.includes(event.key)) return
                      event.preventDefault()
                      const nextInterval = previousKeys.includes(event.key) ? "monthly" : "annual"
                      setInterval(nextInterval)
                      billingButtonRefs.current[nextInterval]?.focus()
                    }}
                    className={`flex min-w-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition-[color,background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none sm:px-5 sm:text-base ${
                      selected
                        ? "text-white"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                    style={
                      selected
                        ? {
                            minHeight: "3rem",
                            borderRadius: "0.75rem",
                            background:
                              "linear-gradient(135deg, rgba(124, 58, 237, 0.98), rgba(162, 28, 175, 0.98))",
                            boxShadow: "0 14px 30px -16px rgba(168, 85, 247, 0.9)",
                          }
                        : { minHeight: "3rem", borderRadius: "0.75rem" }
                    }
                  >
                    {selected ? (
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    ) : null}
                    <span>{value === "monthly" ? "Monthly" : "Annual"}</span>
                    {value === "annual" ? (
                      <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-violet-100 sm:inline-flex">
                        Save 20%
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
          <p className="mt-2 text-center text-sm text-slate-400">
            Annual billing saves $24 on Basic or $60 on Pro. Cancel anytime.
          </p>
          <p className="text-center text-sm text-slate-400">
            Plans apply to the local Audio Toolkit; public downloader allowances remain separate.
          </p>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {interval === "annual"
              ? "Annual billing selected. Basic is 96 dollars per year and Pro is 240 dollars per year."
              : "Monthly billing selected. Basic is 10 dollars per month and Pro is 25 dollars per month."}
          </p>
        </div>
      </div>

      {statusError ? (
        <div
          role="alert"
          className="mx-auto mt-5 flex max-w-xl flex-col items-center gap-3 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-center text-sm text-rose-100 sm:flex-row sm:justify-between sm:text-left"
        >
          <span>{statusError} Your current plan could not be verified.</span>
          <button
            type="button"
            onClick={() => setStatusRequestKey((key) => key + 1)}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-rose-300/50 px-4 font-semibold text-white transition-colors duration-200 hover:bg-rose-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 motion-reduce:transition-none"
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Retry account status
          </button>
        </div>
      ) : null}

      {!checkoutEnabled ? (
        <div
          role="status"
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/[0.07] p-5 text-left text-amber-50 sm:flex-row sm:items-start"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
            <Clock3 className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-bold text-white">Paid plans are being tested</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Basic and Pro checkout are currently unavailable. You can continue using the Free
              Audio Toolkit while we complete testing.
            </p>
          </div>
        </div>
      ) : null}

      <section className="mt-2 grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Pricing plans">
        <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/45 p-6 xl:min-h-[30rem]">
          <div>
            <h2 className="text-xl font-bold text-white">Free</h2>
            <p className="mt-4 text-5xl font-black tabular-nums tracking-tight text-white">$0</p>
            <p className="mt-2 text-sm text-slate-400">For individual tracks</p>
          </div>
          <ul className="mt-7 space-y-3 text-sm leading-6 text-slate-300">
            {[
              "1 file per local batch",
              "MP3, WAV, FLAC, and M4A",
              "Two-pass LUFS normalization",
            ].map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <Check className="mt-1 h-4 w-4 shrink-0 text-violet-400" /> {feature}
              </li>
            ))}
          </ul>
          {isLoaded && !isSignedIn ? (
            <Link
              href={`${prefix}/sign-up/?redirect_url=${encodeURIComponent(`${prefix}/audio-toolkit/`)}`}
              className="mt-8 inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 text-sm font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-slate-400 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none xl:mt-auto"
              style={{ minHeight: "3rem" }}
            >
              Create free account
            </Link>
          ) : (
            <Link
              href={`${prefix}/audio-toolkit/`}
              className="mt-8 inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 text-sm font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-slate-400 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none xl:mt-auto"
              style={{ minHeight: "3rem" }}
            >
              {currentTier === "free" ? "Current plan · Open Toolkit" : "Open Audio Toolkit"}
            </Link>
          )}
        </article>

        {(["basic", "pro"] as const).map((tier) => {
          const plan = paidPlans[tier]
          const price = plan[interval]
          const highlighted = tier === "pro"
          const canManageSubscription = currentTier === "basic" || currentTier === "pro"
          return (
            <article
              key={tier}
              className={`relative flex flex-col rounded-2xl border p-6 xl:min-h-[30rem] ${
                highlighted
                  ? "border-violet-400/80 bg-[radial-gradient(circle_at_85%_8%,rgba(124,58,237,0.22),transparent_38%),rgba(15,23,42,0.72)] shadow-[0_26px_70px_-35px_rgba(124,58,237,0.9)] ring-1 ring-inset ring-violet-300/10"
                  : "border-slate-800 bg-slate-950/45"
              }`}
            >
              {highlighted ? (
                <span
                  className="absolute rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                  style={{ right: "1.25rem", top: "1.25rem" }}
                >
                  Recommended
                </span>
              ) : null}
              <div>
                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                <p className="mt-4 text-5xl font-black tabular-nums tracking-tight text-white">
                  {price.price}
                  <span className="ml-1 text-base font-medium text-slate-400">{price.suffix}</span>
                </p>
                <p className="mt-2 text-sm text-slate-400">{price.note}</p>
                <p className="mt-2 text-sm font-medium text-slate-300">{plan.audience}</p>
              </div>
              <ul className="mt-7 space-y-3 text-sm leading-6 text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-violet-400" /> {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  if (canManageSubscription) {
                    void openPortal(tier)
                  } else if (checkoutEnabled) {
                    void startCheckout(tier)
                  }
                }}
                aria-busy={busyAction?.tier === tier}
                aria-describedby={`pricing-${tier}-refund${actionError?.tier === tier ? ` pricing-${tier}-error` : ""}`}
                disabled={
                  !isLoaded ||
                  (Boolean(isSignedIn) && accountStatus !== "ready") ||
                  busyAction !== null ||
                  currentTier === "enterprise" ||
                  (!checkoutEnabled && !canManageSubscription)
                }
                className={`group mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-[background-color,border-color,box-shadow,transform,opacity] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none xl:mt-auto ${
                  highlighted
                    ? "text-base text-white"
                    : "border border-violet-400/60 bg-violet-500/[0.08] text-violet-100 hover:border-violet-300 hover:bg-violet-500/15"
                }`}
                style={
                  highlighted
                    ? {
                        minHeight: "3.5rem",
                        background:
                          "linear-gradient(135deg, rgba(124, 58, 237, 1), rgba(162, 28, 175, 0.98))",
                        boxShadow: "0 18px 36px -18px rgba(192, 38, 211, 0.95)",
                      }
                    : { minHeight: "3.25rem" }
                }
              >
                <span>
                  {busyAction?.tier === tier
                    ? busyAction.kind === "checkout"
                      ? "Opening secure checkout…"
                      : "Opening billing portal…"
                    : Boolean(isSignedIn) && accountStatus === "loading"
                      ? "Checking account…"
                      : Boolean(isSignedIn) && accountStatus === "error"
                        ? "Account check required"
                        : currentTier === tier
                          ? "Manage current plan"
                          : currentTier === "basic" || currentTier === "pro"
                            ? "Manage subscription"
                            : currentTier === "enterprise"
                              ? "Included in Enterprise"
                              : !checkoutEnabled
                                ? "Payments pending approval"
                                : `Choose ${plan.name}`}
                </span>
                {busyAction?.tier === tier ? (
                  <LoaderCircle
                    className="h-4 w-4 animate-spin motion-reduce:animate-none"
                    aria-hidden
                  />
                ) : (
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                    aria-hidden
                  />
                )}
              </button>
              {actionError?.tier === tier ? (
                <p
                  id={`pricing-${tier}-error`}
                  role="alert"
                  className="mt-3 rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-sm leading-5 text-rose-100"
                >
                  {actionError.message} Please try again or contact support@geekskai.com.
                </p>
              ) : null}
              <p
                id={`pricing-${tier}-refund`}
                className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400"
              >
                <LockKeyhole className="h-4 w-4" aria-hidden /> 14-day first-payment refund
              </p>
            </article>
          )
        })}

        <article className="flex flex-col rounded-2xl border border-slate-700 bg-slate-950/45 p-6 xl:min-h-[30rem]">
          <div>
            <h2 className="text-xl font-bold text-white">Enterprise</h2>
            <p className="mt-4 text-4xl font-black tracking-tight text-white">Custom</p>
            <p className="mt-2 text-sm text-slate-400">For tailored support</p>
          </div>
          <ul className="mt-7 space-y-3 text-sm leading-6 text-slate-300">
            {[
              "Everything in Pro",
              "Custom account configuration",
              "Priority onboarding and support",
            ].map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <Check className="mt-1 h-4 w-4 shrink-0 text-violet-400" /> {feature}
              </li>
            ))}
          </ul>
          <a
            href={
              currentTier === "enterprise"
                ? `${prefix}/account/billing/`
                : "mailto:support@geekskai.com?subject=Geekskai%20Enterprise"
            }
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-600 px-4 text-sm font-semibold text-white transition duration-200 hover:border-slate-400 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none xl:mt-auto"
            style={{ minHeight: "3rem" }}
          >
            {currentTier === "enterprise" ? "Current plan · View account" : "Contact sales"}
          </a>
        </article>
      </section>
    </>
  )
}
