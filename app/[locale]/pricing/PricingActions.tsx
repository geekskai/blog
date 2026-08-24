"use client"

import { useAuth } from "@clerk/nextjs"
import {
  INSTANCE_LOADING_STATE,
  PayPalOneTimePaymentButton,
  PayPalProvider,
  PayPalSubscriptionButton,
  usePayPal,
} from "@paypal/react-paypal-js/sdk-v6"
import { ArrowRight, Check, Clock3, Layers, LoaderCircle, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { CREDIT_CATALOG } from "@/lib/billing/catalog"
import { readBillingJson } from "@/lib/billing/client-response"
import type { AudioCreditBalance } from "@/lib/billing/types"

type CheckoutKind = "payg" | "regular"

const plans = [
  {
    key: "free" as const,
    name: "Free",
    eyebrow: "Try it every day",
    credits: CREDIT_CATALOG.freeDaily.credits,
    price: "$0",
    suffix: "/day",
    description: "Daily Credits refresh at 00:00 UTC.",
    features: ["1 local file per batch", "No card required", "Credits expire daily"],
  },
  {
    key: "payg" as const,
    name: "Pay As You Go",
    eyebrow: "Occasional projects",
    credits: CREDIT_CATALOG.payg480.credits,
    price: `$${CREDIT_CATALOG.payg480.price}`,
    suffix: "one time",
    description: "Buy once and use the Credits for up to one year.",
    features: ["Up to 50 files per batch", "ZIP export", "No recurring charge"],
  },
  {
    key: "regular" as const,
    name: "Regular",
    eyebrow: "Best value",
    credits: CREDIT_CATALOG.regularMonthly.credits,
    price: `$${CREDIT_CATALOG.regularMonthly.price}`,
    suffix: "/month",
    description: "Credits refresh after each successful monthly payment.",
    features: ["Up to 50 files per batch", "ZIP export", "Cancel anytime"],
  },
]

function messageFromUnknown(value: unknown) {
  if (value instanceof Error) return value.message
  if (value && typeof value === "object" && "message" in value) return String(value.message)
  return "PayPal checkout failed."
}

function CheckoutButtons({
  kind,
  onSuccess,
  onCancel,
  onError,
}: {
  kind: CheckoutKind
  onSuccess: () => void
  onCancel: () => void
  onError: (message: string) => void
}) {
  const { loadingStatus, error } = usePayPal()

  if (loadingStatus === INSTANCE_LOADING_STATE.PENDING) {
    return (
      <div className="flex min-h-16 items-center justify-center gap-2 text-sm text-slate-400">
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Loading PayPal…
      </div>
    )
  }
  if (loadingStatus === INSTANCE_LOADING_STATE.REJECTED) {
    return <p className="text-sm text-rose-200">{error?.message ?? "PayPal failed to load."}</p>
  }

  if (kind === "payg") {
    return (
      <PayPalOneTimePaymentButton
        type="buynow"
        presentationMode="redirect"
        createOrder={async () => {
          const response = await fetch("/api/billing/orders/", { method: "POST" })
          const result = await readBillingJson<{ orderId?: string; error?: string }>(response)
          if (!response.ok || !result?.orderId) {
            throw new Error(result?.error ?? "PayPal order could not be created.")
          }
          return { orderId: result.orderId }
        }}
        onApprove={async ({ orderId }) => {
          const response = await fetch(
            `/api/billing/orders/${encodeURIComponent(orderId)}/capture/`,
            {
              method: "POST",
            }
          )
          const result = await readBillingJson<{ ok?: boolean; error?: string }>(response)
          if (!response.ok || !result?.ok) {
            throw new Error(result?.error ?? "PayPal payment could not be captured.")
          }
          onSuccess()
        }}
        onCancel={onCancel}
        onError={(value) => onError(messageFromUnknown(value))}
      />
    )
  }

  return (
    <PayPalSubscriptionButton
      type="subscribe"
      presentationMode="auto"
      createSubscription={async () => {
        const response = await fetch("/api/billing/checkout/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ tier: "regular", interval: "monthly" }),
        })
        const result = await readBillingJson<{ subscriptionId?: string; error?: string }>(response)
        if (!response.ok || !result?.subscriptionId) {
          throw new Error(result?.error ?? "PayPal subscription could not be created.")
        }
        return { subscriptionId: result.subscriptionId }
      }}
      onApprove={async ({ subscriptionId }) => {
        const response = await fetch("/api/billing/subscription/confirm/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ subscriptionId }),
        })
        const result = await readBillingJson<{ ok?: boolean; error?: string }>(response)
        if (!response.ok || !result?.ok) {
          throw new Error(result?.error ?? "Subscription confirmation failed.")
        }
        onSuccess()
      }}
      onCancel={onCancel}
      onError={(value) => onError(messageFromUnknown(value))}
    />
  )
}

export default function PricingActions({
  locale,
  checkoutEnabled,
  clientId,
  environment,
}: {
  locale: string
  checkoutEnabled: boolean
  clientId: string | null
  environment: "sandbox" | "production"
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const [checkout, setCheckout] = useState<CheckoutKind | null>(null)
  const [balance, setBalance] = useState<AudioCreditBalance | null>(null)
  const [error, setError] = useState<string | null>(null)
  const prefix = locale === "en" ? "" : `/${locale}`

  useEffect(() => {
    trackClarityEvent("pricing_viewed")
  }, [])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    void fetch("/api/audio-credits/", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => value && setBalance(value as AudioCreditBalance))
  }, [isLoaded, isSignedIn])

  const chooseCheckout = (kind: CheckoutKind) => {
    setError(null)
    trackClarityEvent(`pricing_cta_clicked_${kind}`)
    if (!isLoaded) return
    if (!isSignedIn) {
      window.location.assign(
        `${prefix}/sign-in/?redirect_url=${encodeURIComponent(`${prefix}/pricing/`)}`
      )
      return
    }
    setCheckout(kind)
  }

  const completeCheckout = () => {
    trackClarityEvent(`paypal_${checkout}_approved`)
    window.location.assign(`${prefix}/audio-toolkit/?checkout=processing`)
  }

  return (
    <>
      <header className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Audio Credits
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-white">
          Pay for the audio time you process.
        </h1>
        <p className="mx-auto mt-4 max-w-6xl text-sm leading-7 text-slate-400 sm:text-base">
          1 Credit covers 1 minute of input audio. See the exact batch cost before processing;
          failed or cancelled work does not consume Credits.
        </p>
        {balance ? (
          <p className="mx-auto mt-4 inline-flex rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-100">
            Your balance: {balance.total.toLocaleString()} Credits
          </p>
        ) : null}
      </header>

      {!checkoutEnabled ? (
        <div className="mx-auto mt-7 flex max-w-2xl gap-3 rounded-xl border border-amber-400/25 bg-amber-950/30 p-4 text-sm text-amber-50">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          Live checkout is currently closed. Daily Free Credits remain available after sign-in.
        </div>
      ) : null}

      <section
        className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3"
        aria-label="Audio Credit plans"
      >
        {plans.map((plan) => {
          const selected = checkout === plan.key
          const highlighted = plan.key === "regular"
          return (
            <article
              key={plan.key}
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 ${
                selected
                  ? "border-violet-300 ring-2 ring-violet-400/30"
                  : highlighted
                    ? "border-violet-500/45 bg-violet-950/25"
                    : "border-slate-800 bg-slate-950/55"
              }`}
            >
              {highlighted ? (
                <span className="absolute right-4 top-4 rounded-full bg-violet-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-100">
                  Best value
                </span>
              ) : null}
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-200">
                {plan.key === "free" ? <Layers className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {plan.eyebrow}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">{plan.name}</h2>
              <p className="mt-4 text-4xl font-bold tabular-nums text-white">
                {plan.price}{" "}
                <span className="text-sm font-medium text-slate-500">{plan.suffix}</span>
              </p>
              <p className="mt-3 text-xl font-semibold text-violet-200">
                {plan.credits.toLocaleString()} Credits
              </p>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{plan.description}</p>
              <ul className="mt-5 space-y-2 border-t border-slate-800 pt-5 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                {plan.key === "free" ? (
                  <Link
                    href={`${prefix}/audio-toolkit/`}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Start free <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={!checkoutEnabled || !clientId || !isLoaded}
                    onClick={() => chooseCheckout(plan.key)}
                    className="min-h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {plan.key === "payg" ? "Buy Credits" : "Subscribe monthly"}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </section>

      {checkout && checkoutEnabled && clientId ? (
        <section className="mx-auto mt-8 max-w-xl rounded-2xl border border-violet-400/30 bg-white p-5 text-slate-900 shadow-2xl shadow-violet-950/30">
          <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="font-semibold">
                {checkout === "payg" ? "480 Credits · $14 once" : "2,800 Credits · $29/month"}
              </p>
              <p className="mt-1 text-xs text-slate-500">Secure checkout powered by PayPal</p>
            </div>
            <button
              type="button"
              onClick={() => setCheckout(null)}
              className="text-sm text-slate-500 underline"
            >
              Close
            </button>
          </div>
          <PayPalProvider
            clientId={clientId}
            environment={environment}
            components={["paypal-payments", "paypal-subscriptions"]}
            pageType="checkout"
          >
            <CheckoutButtons
              kind={checkout}
              onSuccess={completeCheckout}
              onCancel={() => setCheckout(null)}
              onError={(message) => {
                setError(message)
                setCheckout(null)
              }}
            />
          </PayPalProvider>
        </section>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mx-auto mt-5 max-w-xl rounded-xl border border-rose-400/30 bg-rose-950/40 p-4 text-sm text-rose-100"
        >
          {error}
        </p>
      ) : null}

      <div className="mx-auto mt-8 flex max-w-5xl items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-950/20 p-4 text-sm leading-6 text-slate-300">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
        Audio and filenames stay in your browser. PayPal handles payment details; Geekskai receives
        payment status and maintains your Credit balance.
      </div>
    </>
  )
}
