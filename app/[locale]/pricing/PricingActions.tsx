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
  Sparkles,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { ANNUAL_SAVINGS, PACKAGE_CATALOG } from "@/lib/billing/catalog"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { readBillingJson } from "@/lib/billing/client-response"
import type { PackageTier } from "@/lib/billing/domain"
import type { AccountPlanStatus } from "@/lib/billing/types"
import PayPalSubscriptionButton from "./PayPalSubscriptionButton"

type BillingInterval = "monthly" | "annual"
type CheckoutTier = "basic" | "pro"
type AccountStatus = "loading" | "ready" | "error"
type BusyAction = { tier: CheckoutTier } | null
type ActionError = { tier: CheckoutTier; message: string } | null
type PayPalCheckout = {
  tier: CheckoutTier
  clientId: string
  planId: string
  customId: string
}

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

const planCardBase =
  "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-slate-950/60 p-5 backdrop-blur-sm sm:p-6"

export default function PricingActions({
  locale,
  checkoutEnabled,
}: {
  locale: string
  checkoutEnabled: boolean
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const [interval, setInterval] = useState<BillingInterval>("annual")
  const [busyAction, setBusyAction] = useState<BusyAction>(null)
  const [actionError, setActionError] = useState<ActionError>(null)
  const [paypalCheckout, setPayPalCheckout] = useState<PayPalCheckout | null>(null)
  const [currentTier, setCurrentTier] = useState<PackageTier | null>(null)
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("loading")
  const [statusError, setStatusError] = useState<string | null>(null)
  const [statusRequestKey, setStatusRequestKey] = useState(0)
  const checkoutPanelRef = useRef<HTMLElement | null>(null)
  const billingButtonRefs = useRef<Record<BillingInterval, HTMLButtonElement | null>>({
    monthly: null,
    annual: null,
  })
  const prefix = locale === "en" ? "" : `/${locale}`
  const pricingPath = `${prefix}/pricing/`
  const selectedCheckoutPlan = paypalCheckout ? paidPlans[paypalCheckout.tier] : null
  const selectedCheckoutPrice = selectedCheckoutPlan?.[interval]

  useEffect(() => {
    trackClarityEvent("pricing_viewed")
  }, [])

  useEffect(() => {
    if (!paypalCheckout) return
    const panel = checkoutPanelRef.current
    if (!panel) return
    panel.focus({ preventScroll: true })
    panel.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    })
  }, [paypalCheckout])

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
        const result = await readBillingJson<AccountPlanStatus & { error?: string }>(response)
        if (!response.ok || !result) {
          throw new Error(result?.error ?? "Account plan is unavailable.")
        }
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
    trackClarityEvent(`pricing_cta_clicked_${tier}_${interval}`)
    if (isLoaded && !isSignedIn) {
      trackClarityEvent(`pricing_signin_required_${tier}`)
      window.location.assign(`${prefix}/sign-in/?redirect_url=${encodeURIComponent(pricingPath)}`)
      return
    }

    setBusyAction({ tier })
    try {
      const response = await fetch("/api/billing/checkout/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier, interval, locale, source: "pricing" }),
      })
      const result = await readBillingJson<{
        clientId?: string
        planId?: string
        customId?: string
        error?: string
      }>(response)
      if (!response.ok || !result?.clientId || !result.planId || !result.customId) {
        throw new Error(result?.error ?? "Checkout is temporarily unavailable.")
      }
      trackClarityEvent(`checkout_created_${tier}_${interval}`)
      setPayPalCheckout({
        tier,
        clientId: result.clientId,
        planId: result.planId,
        customId: result.customId,
      })
      setBusyAction(null)
    } catch (checkoutError) {
      trackClarityEvent(`checkout_failed_${tier}_${interval}`)
      setActionError({
        tier,
        message: checkoutError instanceof Error ? checkoutError.message : "Checkout failed.",
      })
      setBusyAction(null)
    }
  }

  const paypalApproved = useCallback(() => {
    trackClarityEvent("paypal_subscription_approved")
    window.location.assign(`${prefix}/audio-toolkit/?checkout=processing`)
  }, [prefix])

  const paypalCancelled = useCallback(() => {
    trackClarityEvent("paypal_checkout_cancelled")
    setPayPalCheckout(null)
  }, [])

  const paypalFailed = useCallback(
    (message: string) => {
      if (paypalCheckout) setActionError({ tier: paypalCheckout.tier, message })
      setPayPalCheckout(null)
    },
    [paypalCheckout]
  )

  return (
    <>
      <section className="mx-auto max-w-6xl text-center" aria-labelledby="pricing-heading">
        <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200 sm:px-3.5 sm:py-1.5 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" aria-hidden />
          Simple, transparent pricing
        </p>
        <h1
          id="pricing-heading"
          className="mt-4 text-[clamp(1.875rem,5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-white"
        >
          Prepare more tracks.
          <span className="mt-1 block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">
            Keep every file private.
          </span>
        </h1>
        <p className="mx-auto mt-4 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
          Start free, then upgrade when your audio workflow needs larger local batches and ZIP
          export. Processing stays in your browser.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-300 sm:text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 text-violet-400" aria-hidden />
            Files never uploaded
          </span>
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-300 sm:text-sm">
            <LockKeyhole className="h-4 w-4 shrink-0 text-violet-400" aria-hidden />
            Secure PayPal checkout
          </span>
        </div>
      </section>

      <div className="mx-auto mt-7 flex max-w-6xl flex-col items-stretch sm:mt-9">
        <div
          className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-1.5 shadow-sm"
          role="radiogroup"
          aria-label="Billing interval"
        >
          <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
              Billing cycle
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 sm:text-[11px]">
              <BadgePercent className="h-3 w-3" aria-hidden />
              Save 20% annually
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-900/80 p-1">
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
                  onClick={() => {
                    setInterval(value)
                    setPayPalCheckout(null)
                    trackClarityEvent(`pricing_interval_selected_${value}`)
                  }}
                  onKeyDown={(event) => {
                    const previousKeys = ["ArrowLeft", "ArrowUp", "Home"]
                    const nextKeys = ["ArrowRight", "ArrowDown", "End"]
                    if (!previousKeys.includes(event.key) && !nextKeys.includes(event.key)) return
                    event.preventDefault()
                    const nextInterval = previousKeys.includes(event.key) ? "monthly" : "annual"
                    setInterval(nextInterval)
                    setPayPalCheckout(null)
                    trackClarityEvent(`pricing_interval_selected_${nextInterval}`)
                    billingButtonRefs.current[nextInterval]?.focus()
                  }}
                  className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-semibold transition-[color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none sm:min-h-12 sm:gap-2 sm:px-4 sm:text-base ${
                    selected
                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white shadow-md shadow-violet-900/40"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  {selected ? (
                    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-5 sm:w-5">
                      <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
                    </span>
                  ) : null}
                  <span>{value === "monthly" ? "Monthly" : "Annual"}</span>
                  {value === "annual" ? (
                    <span className="hidden rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-violet-50 sm:inline-flex">
                      −20%
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
        <p className="mt-3 text-center text-xs leading-5 text-slate-400 sm:text-sm">
          Annual billing saves 20%: $24 on Basic or $60 on Pro. Cancel anytime.
        </p>
        <p className="mt-1 text-center text-xs leading-5 text-slate-500 sm:text-sm">
          Plans apply to the local Audio Toolkit; public downloader allowances remain separate.
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {interval === "annual"
            ? "Annual billing selected. Basic is 96 dollars per year and Pro is 240 dollars per year."
            : "Monthly billing selected. Basic is 10 dollars per month and Pro is 25 dollars per month."}
        </p>
      </div>

      {statusError ? (
        <div
          role="alert"
          className="mx-auto mt-5 flex max-w-3xl flex-col items-center gap-3 rounded-xl border border-rose-400/30 bg-rose-950/40 p-4 text-center text-sm text-rose-100 sm:flex-row sm:justify-between sm:text-left"
        >
          <span>{statusError} Your current plan could not be verified.</span>
          <button
            type="button"
            onClick={() => setStatusRequestKey((key) => key + 1)}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-rose-300/40 px-4 font-semibold text-white transition-colors duration-200 hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 motion-reduce:transition-none"
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Retry account status
          </button>
        </div>
      ) : null}

      {!checkoutEnabled ? (
        <div
          role="status"
          className="mx-auto mt-6 flex max-w-3xl gap-3 rounded-xl border border-amber-400/25 bg-amber-950/30 p-4 text-left text-amber-50 sm:items-start sm:p-5"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-200 sm:h-10 sm:w-10">
            <Clock3 className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-white">Paid plans are being tested</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Basic and Pro checkout are currently unavailable. You can continue using the Free
              Audio Toolkit while we complete testing.
            </p>
          </div>
        </div>
      ) : null}

      <section
        className="mx-auto mt-8 grid max-w-6xl gap-4 sm:mt-10 md:grid-cols-3 md:gap-5"
        aria-label="Pricing plans"
      >
        <article className={`${planCardBase} border-slate-800/80`}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Starter
            </p>
            <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">Free</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <p className="text-4xl font-bold tabular-nums tracking-tight text-white sm:text-[2.75rem]">
                $0
              </p>
            </div>
            <p className="mt-2 min-h-5 text-sm text-slate-400">For individual tracks</p>
          </div>
          <ul className="mt-6 space-y-2.5 border-t border-slate-800/80 pt-5 text-sm leading-6 text-slate-300">
            {[
              "1 file per local batch",
              "MP3, WAV, FLAC, and M4A",
              "Two-pass LUFS normalization",
            ].map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <Link
              href={`${prefix}/audio-toolkit/`}
              onClick={() => trackClarityEvent("pricing_free_toolkit_clicked")}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-sm font-semibold text-white transition-[background-color,border-color] duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
            >
              {currentTier === "free" ? "Current plan · Try one file" : "Try one file free"}
            </Link>
          </div>
        </article>

        {(["basic", "pro"] as const).map((tier) => {
          const plan = paidPlans[tier]
          const price = plan[interval]
          const highlighted = tier === "pro"
          const selectedForCheckout = paypalCheckout?.tier === tier
          const canManageSubscription = currentTier === "basic" || currentTier === "pro"
          return (
            <article
              key={tier}
              className={`${planCardBase} transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none ${
                selectedForCheckout
                  ? "border-violet-400/70 shadow-lg shadow-violet-900/30"
                  : highlighted
                    ? "border-violet-500/50 shadow-md shadow-violet-950/50"
                    : "border-slate-800/80"
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                  highlighted ? "via-violet-400/80" : "via-violet-500/40"
                } to-transparent`}
              />
              {highlighted ? (
                <div className="mb-3 flex">
                  <span className="inline-flex items-center rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">
                    Recommended
                  </span>
                </div>
              ) : null}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {tier === "basic" ? "For regular use" : "For power users"}
                </p>
                <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">{plan.name}</h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <p className="text-4xl font-bold tabular-nums tracking-tight text-white sm:text-[2.75rem]">
                    {price.price}
                  </p>
                  <span className="text-sm font-medium text-slate-400 sm:text-base">
                    {price.suffix}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">{price.note}</p>
                <p className="mt-2 min-h-5 text-sm font-medium text-slate-300">{plan.audience}</p>
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-slate-800/80 pt-5 text-sm leading-6 text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (canManageSubscription) {
                      window.location.assign(`${prefix}/account/billing/`)
                    } else if (checkoutEnabled) {
                      void startCheckout(tier)
                    }
                  }}
                  aria-busy={busyAction?.tier === tier}
                  aria-controls={selectedForCheckout ? "paypal-checkout-panel" : undefined}
                  aria-describedby={`pricing-${tier}-refund${actionError?.tier === tier ? ` pricing-${tier}-error` : ""}`}
                  disabled={
                    !isLoaded ||
                    (Boolean(isSignedIn) && accountStatus !== "ready") ||
                    busyAction !== null ||
                    paypalCheckout !== null ||
                    (!checkoutEnabled && !canManageSubscription)
                  }
                  className={`group inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-[background-color,border-color,box-shadow,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none sm:min-h-12 sm:px-5 ${
                    highlighted
                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white shadow-md shadow-violet-900/40 hover:from-violet-500 hover:to-fuchsia-600"
                      : "border border-violet-500/40 bg-violet-500/10 text-violet-100 hover:border-violet-400/60 hover:bg-violet-500/15"
                  }`}
                >
                  <span>
                    {busyAction?.tier === tier
                      ? "Preparing PayPal…"
                      : selectedForCheckout
                        ? "Checkout ready below"
                        : Boolean(isSignedIn) && accountStatus === "loading"
                          ? "Checking account…"
                          : Boolean(isSignedIn) && accountStatus === "error"
                            ? "Account check required"
                            : currentTier === tier
                              ? "Manage current plan"
                              : currentTier === "basic" || currentTier === "pro"
                                ? "Manage subscription"
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
                    className="mt-3 rounded-lg border border-rose-400/30 bg-rose-950/40 p-3 text-sm leading-5 text-rose-100"
                  >
                    {actionError.message} Please try again or contact support@geekskai.com.
                  </p>
                ) : null}
                <p
                  id={`pricing-${tier}-refund`}
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500 sm:text-sm"
                >
                  <LockKeyhole className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  14-day first-payment refund
                </p>
              </div>
            </article>
          )
        })}
      </section>

      {paypalCheckout && selectedCheckoutPlan && selectedCheckoutPrice ? (
        <section
          id="paypal-checkout-panel"
          ref={checkoutPanelRef}
          tabIndex={-1}
          aria-labelledby="paypal-checkout-heading"
          className="mx-auto mt-6 max-w-6xl scroll-mt-6 overflow-hidden rounded-2xl border border-violet-500/30 bg-slate-950/80 outline-none backdrop-blur-sm sm:mt-8"
        >
          <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:items-start lg:gap-8 lg:p-8">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300 sm:text-xs">
                Secure PayPal checkout
              </p>
              <h2
                id="paypal-checkout-heading"
                className="mt-2 text-xl font-bold text-white sm:text-2xl"
              >
                Complete your {selectedCheckoutPlan.name} subscription
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
                {selectedCheckoutPrice.note}. Review the subscription details in PayPal before you
                approve payment.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-slate-300">
                  <LockKeyhole className="h-3.5 w-3.5 text-violet-400" aria-hidden />
                  Secure payment
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-400" aria-hidden />
                  No audio uploaded
                </span>
              </div>
              <button
                type="button"
                onClick={paypalCancelled}
                className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none"
              >
                Choose another plan
              </button>
            </div>

            <PayPalSubscriptionButton
              clientId={paypalCheckout.clientId}
              planId={paypalCheckout.planId}
              customId={paypalCheckout.customId}
              onApproved={paypalApproved}
              onCancel={paypalCancelled}
              onError={paypalFailed}
            />
          </div>
        </section>
      ) : null}
    </>
  )
}
