"use client"

import { useAuth } from "@clerk/nextjs"
import {
  INSTANCE_LOADING_STATE,
  PayPalOneTimePaymentButton,
  PayPalProvider,
  PayPalSubscriptionButton,
  usePayPal,
} from "@paypal/react-paypal-js/sdk-v6"
import {
  ArrowRight,
  Check,
  Clock3,
  Layers,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { trackClarityEvent } from "@/lib/analytics/clarity"
import { CREDIT_CATALOG } from "@/lib/billing/catalog"
import { readBillingJson } from "@/lib/billing/client-response"
import type { AudioCreditBalance } from "@/lib/billing/types"

type CheckoutKind = "payg" | "regular"
type PaygConfirmationState = "idle" | "confirming" | "retry"
type PendingOrderSource = "scoped" | "legacy"
type PendingPayPalOrder = { orderId: string; source: PendingOrderSource }

type PaygCaptureResponse = {
  ok?: boolean
  status?: string
  code?: string
  retryable?: boolean
  error?: string
}

const LEGACY_PENDING_PAYPAL_ORDER_KEY = "geekskai.paypal.pending-order.v1"
const PENDING_PAYPAL_ORDERS_KEY = "geekskai.paypal.pending-orders.v2"
const DISMISSED_LEGACY_PAYPAL_ORDERS_KEY = "geekskai.paypal.dismissed-legacy-orders.v1"
const PAYPAL_ORDER_ID_PATTERN = /^[A-Z0-9-]{3,64}$/i
const PAYG_CONFIRMATION_TIMEOUT_MS = 10_000

class PaygCaptureError extends Error {
  code: string | null

  constructor(message: string, code?: string | null) {
    super(message)
    this.name = "PaygCaptureError"
    this.code = code ?? null
  }
}

function readPendingPayPalOrders() {
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(PENDING_PAYPAL_ORDERS_KEY) ?? "{}")
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([userId, orderId]) =>
          Boolean(userId) && typeof orderId === "string" && PAYPAL_ORDER_ID_PATTERN.test(orderId)
      )
    ) as Record<string, string>
  } catch {
    return {}
  }
}

function readDismissedLegacyOrders() {
  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(DISMISSED_LEGACY_PAYPAL_ORDERS_KEY) ?? "{}"
    )
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([userId, orderId]) =>
          Boolean(userId) && typeof orderId === "string" && PAYPAL_ORDER_ID_PATTERN.test(orderId)
      )
    ) as Record<string, string>
  } catch {
    return {}
  }
}

function readPendingPayPalOrder(userId: string): PendingPayPalOrder | null {
  const scopedOrderId = readPendingPayPalOrders()[userId]
  if (scopedOrderId) return { orderId: scopedOrderId, source: "scoped" }
  const legacyOrderId = window.sessionStorage.getItem(LEGACY_PENDING_PAYPAL_ORDER_KEY)
  if (readDismissedLegacyOrders()[userId] === legacyOrderId) return null
  return legacyOrderId && PAYPAL_ORDER_ID_PATTERN.test(legacyOrderId)
    ? { orderId: legacyOrderId, source: "legacy" }
    : null
}

function storePendingPayPalOrder(userId: string, orderId: string) {
  if (!PAYPAL_ORDER_ID_PATTERN.test(orderId)) return
  const orders = readPendingPayPalOrders()
  orders[userId] = orderId
  window.sessionStorage.setItem(PENDING_PAYPAL_ORDERS_KEY, JSON.stringify(orders))
}

function clearPendingPayPalOrder(userId: string, orderId?: string) {
  const orders = readPendingPayPalOrders()
  if (!orderId || orders[userId] === orderId) delete orders[userId]
  if (Object.keys(orders).length) {
    window.sessionStorage.setItem(PENDING_PAYPAL_ORDERS_KEY, JSON.stringify(orders))
  } else {
    window.sessionStorage.removeItem(PENDING_PAYPAL_ORDERS_KEY)
  }
  const legacyOrderId = window.sessionStorage.getItem(LEGACY_PENDING_PAYPAL_ORDER_KEY)
  if (!orderId || legacyOrderId === orderId) {
    window.sessionStorage.removeItem(LEGACY_PENDING_PAYPAL_ORDER_KEY)
  }
}

function dismissPendingPayPalOrder(userId: string, orderId: string) {
  const orders = readPendingPayPalOrders()
  if (orders[userId] === orderId) delete orders[userId]
  if (Object.keys(orders).length) {
    window.sessionStorage.setItem(PENDING_PAYPAL_ORDERS_KEY, JSON.stringify(orders))
  } else {
    window.sessionStorage.removeItem(PENDING_PAYPAL_ORDERS_KEY)
  }
  const legacyOrderId = window.sessionStorage.getItem(LEGACY_PENDING_PAYPAL_ORDER_KEY)
  if (legacyOrderId !== orderId) return
  const dismissed = readDismissedLegacyOrders()
  dismissed[userId] = orderId
  window.sessionStorage.setItem(DISMISSED_LEGACY_PAYPAL_ORDERS_KEY, JSON.stringify(dismissed))
}

function setCheckoutUrl(kind: CheckoutKind | null) {
  const url = new URL(window.location.href)
  if (kind) url.searchParams.set("checkout", kind)
  else url.searchParams.delete("checkout")
  url.searchParams.delete("paypal_return")
  url.searchParams.delete("paypal_cancel")
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)
}

async function capturePaygOrder(orderId: string) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), PAYG_CONFIRMATION_TIMEOUT_MS)
  try {
    const response = await fetch(`/api/billing/orders/${encodeURIComponent(orderId)}/capture/`, {
      method: "POST",
      signal: controller.signal,
    })
    const result = await readBillingJson<PaygCaptureResponse>(response)
    if (!response.ok || !result?.ok) {
      throw new PaygCaptureError(
        result?.error ?? "Payment confirmation is temporarily unavailable. Retry this order.",
        result?.code
      )
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new PaygCaptureError(
        "Payment confirmation timed out. Retry confirmation; do not start a new purchase.",
        "confirmation_timeout"
      )
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

const paygAudioHours = CREDIT_CATALOG.payg480.credits / 60
const paygCostPerAudioHour = (CREDIT_CATALOG.payg480.price * 60) / CREDIT_CATALOG.payg480.credits
const regularAudioHours = Math.floor(CREDIT_CATALOG.regularMonthly.credits / 60)
const regularAudioMinutes = CREDIT_CATALOG.regularMonthly.credits % 60
const regularCostPerAudioHour =
  (CREDIT_CATALOG.regularMonthly.price * 60) / CREDIT_CATALOG.regularMonthly.credits
const regularUnitSavings = Math.round((1 - regularCostPerAudioHour / paygCostPerAudioHour) * 100)

const plans = [
  {
    key: "free" as const,
    name: "Free",
    eyebrow: "Try it every day",
    credits: CREDIT_CATALOG.freeDaily.credits,
    price: "$0",
    suffix: "/day",
    audioTime: `${CREDIT_CATALOG.freeDaily.credits} audio minutes/day`,
    unitCost: "Free",
    comparison: "Trying one local file at a time",
    batchSize: `${CREDIT_CATALOG.freeDaily.batchFileLimit} file`,
    validity: "Resets daily",
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
    audioTime: `${paygAudioHours} audio hours total`,
    unitCost: `$${paygCostPerAudioHour.toFixed(2)} per audio hour`,
    comparison: "Up to 16 audio hours/month",
    batchSize: `Up to ${CREDIT_CATALOG.payg480.batchFileLimit} files`,
    validity: `Valid for ${CREDIT_CATALOG.payg480.validityDays} days`,
    description: "Buy once and use the Credits for up to one year.",
    features: ["Up to 50 files per batch", "ZIP export", "No recurring charge"],
  },
  {
    key: "regular" as const,
    name: "Regular",
    eyebrow: "Frequent projects",
    credits: CREDIT_CATALOG.regularMonthly.credits,
    price: `$${CREDIT_CATALOG.regularMonthly.price}`,
    suffix: "/month",
    audioTime: `${regularAudioHours}h ${regularAudioMinutes}m of audio/month`,
    unitCost: `$${regularCostPerAudioHour.toFixed(2)} per audio hour if fully used`,
    comparison: "More than 16 audio hours/month",
    batchSize: `Up to ${CREDIT_CATALOG.regularMonthly.batchFileLimit} files`,
    validity: "Resets monthly; no rollover",
    description: "Credits refresh after each successful monthly payment.",
    features: ["Up to 50 files per batch", "ZIP export", "Cancel anytime"],
  },
]

const comparisonRows = [
  { label: "Audio included", key: "audioTime" },
  { label: "Effective cost", key: "unitCost" },
  { label: "Best for", key: "comparison" },
  { label: "Batch size", key: "batchSize" },
  { label: "Credit validity", key: "validity" },
] as const

const paidPlanThemes = {
  payg: {
    icon: Zap,
    border: "border-violet-500/25 bg-slate-950/55",
    borderActive:
      "border-violet-400/55 ring-2 ring-violet-400/20 ring-offset-2 ring-offset-slate-950",
    iconWrap: "border-violet-400/25 bg-violet-500/10 text-violet-300",
    topLine: "via-violet-400/35",
    cta: "border border-violet-400/35 bg-violet-500/15 hover:bg-violet-500/25",
    summary: "border-violet-500/25 bg-violet-950/25",
  },
  regular: {
    icon: Sparkles,
    border: "border-violet-500/40 bg-violet-950/20",
    borderActive:
      "border-violet-300/70 ring-2 ring-violet-400/30 ring-offset-2 ring-offset-slate-950",
    iconWrap: "border-violet-400/30 bg-violet-500/15 text-violet-200",
    topLine: "via-violet-400/60",
    cta: "bg-violet-600 hover:bg-violet-500",
    summary: "border-violet-500/35 bg-violet-950/40",
  },
} as const

function messageFromUnknown(value: unknown) {
  if (value instanceof Error) return value.message
  if (value && typeof value === "object" && "message" in value) return String(value.message)
  return "PayPal checkout failed."
}

function CheckoutButtons({
  kind,
  locale,
  pendingOrderId,
  disabled,
  onPaygOrderCreated,
  onPaygApprove,
  onSuccess,
  onCancel,
  onError,
}: {
  kind: CheckoutKind
  locale: string
  pendingOrderId: string | null
  disabled: boolean
  onPaygOrderCreated: (orderId: string) => void
  onPaygApprove: (orderId: string) => Promise<void>
  onSuccess: () => void
  onCancel: () => void
  onError: (message: string) => void
}) {
  const { loadingStatus, error } = usePayPal()

  if (loadingStatus === INSTANCE_LOADING_STATE.PENDING) {
    return (
      <div className="space-y-2 py-4" aria-live="polite">
        <div className="mx-auto h-11 w-full max-w-[16rem] animate-pulse rounded-lg bg-slate-100 motion-reduce:animate-none" />
        <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
          Loading PayPal…
        </p>
      </div>
    )
  }
  if (loadingStatus === INSTANCE_LOADING_STATE.REJECTED) {
    return (
      <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        {error?.message ?? "PayPal failed to load."}
      </p>
    )
  }

  if (kind === "payg") {
    const callbacks = {
      type: "buynow" as const,
      presentationMode: "redirect" as const,
      disabled,
      onApprove: async ({ orderId }: { orderId: string }) => onPaygApprove(orderId),
      onCancel,
      onError: (value: unknown) => onError(messageFromUnknown(value)),
    }
    if (pendingOrderId) {
      return <PayPalOneTimePaymentButton {...callbacks} orderId={pendingOrderId} />
    }
    return (
      <PayPalOneTimePaymentButton
        {...callbacks}
        createOrder={async () => {
          const response = await fetch("/api/billing/orders/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ locale }),
          })
          const result = await readBillingJson<{ orderId?: string; error?: string }>(response)
          if (!response.ok || !result?.orderId) {
            throw new Error(result?.error ?? "PayPal order could not be created.")
          }
          onPaygOrderCreated(result.orderId)
          return { orderId: result.orderId }
        }}
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
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [checkout, setCheckout] = useState<CheckoutKind | null>(null)
  const [balance, setBalance] = useState<AudioCreditBalance | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
  const [pendingOrderSource, setPendingOrderSource] = useState<PendingOrderSource | null>(null)
  const [paygConfirmationState, setPaygConfirmationState] = useState<PaygConfirmationState>("idle")
  const [paygRecoveryBlocked, setPaygRecoveryBlocked] = useState(false)
  const checkoutPanelRef = useRef<HTMLElement>(null)
  const confirmationInFlightRef = useRef<{
    userId: string
    orderId: string
    token: symbol
    promise: Promise<void>
  } | null>(null)
  const confirmPaygOrderRef = useRef<
    | ((orderId: string, requestUserId: string, source: PendingOrderSource | null) => Promise<void>)
    | null
  >(null)
  const autoConfirmationOrderRef = useRef<string | null>(null)
  const currentUserIdRef = useRef<string | null>(null)
  currentUserIdRef.current = isLoaded && isSignedIn && userId ? userId : null
  const prefix = locale === "en" ? "" : `/${locale}`
  const selectedPlan = checkout ? plans.find((plan) => plan.key === checkout) : null
  const selectedTheme = checkout ? paidPlanThemes[checkout] : null

  useEffect(() => {
    trackClarityEvent("pricing_viewed")
  }, [])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return
    void fetch("/api/audio-credits/", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => value && setBalance(value as AudioCreditBalance))
  }, [isLoaded, isSignedIn, userId])

  useEffect(() => {
    if (!isLoaded) return
    const params = new URLSearchParams(window.location.search)
    const selected = params.get("checkout")
    const returnFromPayPal = params.get("paypal_return") === "1"
    const cancelledByPayPal = params.get("paypal_cancel") === "1"

    setPendingOrderId(null)
    setPendingOrderSource(null)
    setPaygConfirmationState("idle")
    setPaygRecoveryBlocked(false)
    setError(null)
    setNotice(null)

    if (selected !== "payg" && selected !== "regular") {
      setCheckout(null)
      return
    }

    const returnPath = `${prefix}/pricing/?checkout=${selected}${
      returnFromPayPal ? "&paypal_return=1" : ""
    }`
    if (!isSignedIn || !userId) {
      window.location.assign(`${prefix}/sign-in/?redirect_url=${encodeURIComponent(returnPath)}`)
      return
    }

    const pendingOrder = readPendingPayPalOrder(userId)
    setPendingOrderId(pendingOrder?.orderId ?? null)
    setPendingOrderSource(pendingOrder?.source ?? null)

    if (cancelledByPayPal) {
      clearPendingPayPalOrder(userId, pendingOrder?.orderId)
      setPendingOrderId(null)
      setPendingOrderSource(null)
      setCheckout(null)
      setPaygConfirmationState("idle")
      setPaygRecoveryBlocked(false)
      setError(null)
      setNotice("PayPal checkout was cancelled. No charge was made.")
      setCheckoutUrl(null)
      return
    }

    setCheckout(selected)
    if (selected === "payg" && returnFromPayPal) {
      if (!pendingOrder) {
        setPaygConfirmationState("idle")
        setPaygRecoveryBlocked(true)
        setError(
          "We could not restore the PayPal order for this return. Start a new purchase only if PayPal shows no completed payment."
        )
        return
      }
      setPaygRecoveryBlocked(false)
      const confirmationKey = `${userId}:${pendingOrder.orderId}`
      if (autoConfirmationOrderRef.current !== confirmationKey) {
        autoConfirmationOrderRef.current = confirmationKey
        trackClarityEvent("paypal_payg_session_resumed")
        void confirmPaygOrderRef.current
          ?.(pendingOrder.orderId, userId, pendingOrder.source)
          .catch(() => undefined)
      }
    } else if (selected === "payg" && pendingOrder) {
      setPaygConfirmationState(pendingOrder.source === "legacy" ? "confirming" : "retry")
      if (pendingOrder.source === "legacy") {
        const confirmationKey = `${userId}:${pendingOrder.orderId}`
        if (autoConfirmationOrderRef.current !== confirmationKey) {
          autoConfirmationOrderRef.current = confirmationKey
          void confirmPaygOrderRef.current
            ?.(pendingOrder.orderId, userId, pendingOrder.source)
            .catch(() => undefined)
        }
      }
    }
  }, [isLoaded, isSignedIn, prefix, userId])

  useEffect(() => {
    if (!checkout) return
    const panel = checkoutPanelRef.current
    if (!panel) return
    panel.focus({ preventScroll: true })
    panel.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    })
  }, [checkout])

  const chooseCheckout = (kind: CheckoutKind) => {
    setError(null)
    setNotice(null)
    setPaygRecoveryBlocked(false)
    trackClarityEvent(`pricing_cta_clicked_${kind}`)
    if (!isLoaded) return
    if (!isSignedIn || !userId) {
      const returnPath = `${prefix}/pricing/?checkout=${kind}`
      window.location.assign(`${prefix}/sign-in/?redirect_url=${encodeURIComponent(returnPath)}`)
      return
    }
    setCheckoutUrl(kind)
    if (kind === "payg") {
      const pendingOrder = readPendingPayPalOrder(userId)
      setPendingOrderId(pendingOrder?.orderId ?? null)
      setPendingOrderSource(pendingOrder?.source ?? null)
      setPaygConfirmationState(pendingOrder ? "retry" : "idle")
    }
    setCheckout(kind)
  }

  const closeCheckout = () => {
    setCheckout(null)
    setPaygConfirmationState("idle")
    setPaygRecoveryBlocked(false)
    setError(null)
    setCheckoutUrl(null)
  }

  const cancelCheckout = () => {
    if (userId) clearPendingPayPalOrder(userId, pendingOrderId ?? undefined)
    setPendingOrderId(null)
    setPendingOrderSource(null)
    setCheckout(null)
    setPaygConfirmationState("idle")
    setPaygRecoveryBlocked(false)
    setError(null)
    setNotice("PayPal checkout was cancelled. No charge was made.")
    setCheckoutUrl(null)
    trackClarityEvent("paypal_payg_cancelled")
  }

  const completeSubscriptionCheckout = () => {
    trackClarityEvent("paypal_regular_approved")
    window.location.assign(`${prefix}/audio-toolkit/?checkout=processing`)
  }

  const confirmPaygOrder = (
    orderId: string,
    requestUserId = currentUserIdRef.current,
    source: PendingOrderSource | null = pendingOrderSource
  ) => {
    if (!requestUserId) return Promise.resolve()
    const existing = confirmationInFlightRef.current
    if (existing?.userId === requestUserId && existing.orderId === orderId) {
      return existing.promise
    }

    const token = Symbol("payg-confirmation")
    const promise = (async () => {
      const isCurrentUser = () => currentUserIdRef.current === requestUserId
      if (isCurrentUser()) {
        setError(null)
        setNotice(null)
        setPaygRecoveryBlocked(false)
        setPaygConfirmationState("confirming")
        trackClarityEvent("paypal_payg_capture_started")
      }
      try {
        await capturePaygOrder(orderId)
        if (!isCurrentUser()) return
        trackClarityEvent("paypal_payg_capture_completed")
        clearPendingPayPalOrder(requestUserId, orderId)
        setPendingOrderId(null)
        setPendingOrderSource(null)
        setPaygConfirmationState("idle")
        window.location.assign(`${prefix}/audio-toolkit/?checkout=processing`)
      } catch (value) {
        if (!isCurrentUser()) throw value
        const captureError = value instanceof PaygCaptureError ? value : null
        const message = messageFromUnknown(value)
        if (captureError?.code === "order_expired") {
          clearPendingPayPalOrder(requestUserId, orderId)
          setPendingOrderId(null)
          setPendingOrderSource(null)
          setPaygConfirmationState("idle")
        } else if (captureError?.code === "order_not_found") {
          dismissPendingPayPalOrder(requestUserId, orderId)
          setPendingOrderId(null)
          setPendingOrderSource(null)
          setPaygConfirmationState("idle")
          setPaygRecoveryBlocked(true)
        } else {
          if (source !== "legacy") storePendingPayPalOrder(requestUserId, orderId)
          setPendingOrderId(orderId)
          setPendingOrderSource(source ?? "scoped")
          setPaygConfirmationState("retry")
        }
        setError(
          captureError?.code === "order_not_found"
            ? "Use the account that started this purchase, or dismiss this old order to start a new purchase for the current account."
            : message
        )
        trackClarityEvent(`paypal_payg_capture_failed_${captureError?.code ?? "unknown"}`)
        if (captureError?.code === "authentication_required") {
          const returnPath = `${prefix}/pricing/?checkout=payg&paypal_return=1`
          window.location.assign(
            `${prefix}/sign-in/?redirect_url=${encodeURIComponent(returnPath)}`
          )
        }
        throw value
      } finally {
        if (confirmationInFlightRef.current?.token === token) {
          confirmationInFlightRef.current = null
        }
      }
    })()
    confirmationInFlightRef.current = { userId: requestUserId, orderId, token, promise }
    return promise
  }
  confirmPaygOrderRef.current = confirmPaygOrder

  const startFreshPaygCheckout = () => {
    setError(null)
    setNotice(null)
    setPendingOrderId(null)
    setPendingOrderSource(null)
    setPaygRecoveryBlocked(false)
    setPaygConfirmationState("idle")
    setCheckoutUrl("payg")
  }

  return (
    <>
      <header className="relative mx-auto max-w-7xl text-center">
        <div
          className="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-40 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(124,58,237,0.2),transparent)]"
          aria-hidden
        />
        <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" aria-hidden />
          Audio Credits
        </p>
        <h1 className="mt-4 text-[clamp(1.875rem,5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.035em]">
          <span className="text-white">Pay for the </span>
          <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-violet-400 bg-clip-text text-transparent">
            audio time
          </span>
          <span className="text-white"> you process.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
          1 Credit covers 1 minute of input audio. See the exact batch cost before processing;
          failed or cancelled work does not consume Credits.
        </p>
        {balance ? (
          <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-500/15 to-sky-500/10 px-5 py-2.5 text-sm font-semibold text-violet-50 shadow-[0_8px_32px_-16px_rgba(139,92,246,0.55)]">
            <span className="text-violet-300">Your balance:</span>
            <span className="tabular-nums text-white">
              {balance.total.toLocaleString()} Credits
            </span>
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
        className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3 md:gap-5"
        aria-label="Audio Credit plans"
      >
        {plans.map((plan) => {
          const selected = checkout === plan.key
          const checkoutLocked = checkout !== null && plan.key !== "free" && !selected
          const highlighted = plan.key === "regular"
          const paidTheme = plan.key !== "free" ? paidPlanThemes[plan.key] : null
          const PlanIcon = plan.key === "free" ? Layers : (paidTheme?.icon ?? Zap)

          return (
            <article
              key={plan.key}
              aria-current={selected ? "step" : undefined}
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-[border-color,box-shadow,opacity] duration-300 motion-reduce:transition-none sm:p-6 ${
                plan.key === "free"
                  ? "border-slate-800/80 bg-slate-950/55"
                  : `${paidTheme?.border ?? ""} ${selected ? (paidTheme?.borderActive ?? "") : ""}`
              } ${checkoutLocked ? "saturate-75 opacity-45" : ""} ${
                highlighted && !checkout ? "md:-translate-y-0.5" : ""
              }`}
            >
              {plan.key !== "free" ? (
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${paidTheme?.topLine ?? ""} to-transparent`}
                  aria-hidden
                />
              ) : null}
              {selected ? (
                <div className="relative mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Checkout active
                  </span>
                </div>
              ) : highlighted ? (
                <span className="absolute right-4 top-4 rounded-full bg-violet-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-violet-100">
                  {regularUnitSavings}% lower*
                </span>
              ) : null}
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${
                  plan.key === "free"
                    ? "border-slate-700/80 bg-slate-900/70 text-slate-400"
                    : (paidTheme?.iconWrap ?? "")
                }`}
              >
                <PlanIcon className="h-5 w-5" aria-hidden />
              </span>
              <p
                className={`mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  plan.key === "regular" ? "text-violet-300" : "text-slate-400"
                }`}
              >
                {plan.eyebrow}
              </p>
              <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">{plan.name}</h2>
              <p className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tabular-nums leading-none text-white">
                {plan.price}{" "}
                <span
                  className={`text-sm font-medium ${
                    plan.key === "regular"
                      ? "text-violet-300"
                      : plan.key === "payg"
                        ? "text-violet-200/90"
                        : "text-slate-400"
                  }`}
                >
                  {plan.suffix}
                </span>
              </p>
              <p
                className={`mt-2 text-lg font-semibold sm:text-xl ${
                  plan.key === "free" ? "text-sky-300" : "text-violet-200"
                }`}
              >
                {plan.credits.toLocaleString()} Credits
              </p>
              <p
                className={`mt-1 text-sm font-medium ${
                  plan.key === "regular" ? "text-violet-100" : "text-slate-300"
                }`}
              >
                {plan.audioTime}
              </p>
              <ul
                className={`mt-5 space-y-2 border-t pt-5 text-sm ${
                  plan.key === "regular"
                    ? "border-violet-500/20 text-violet-100"
                    : "border-slate-800/80 text-slate-300"
                }`}
              >
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
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
                  >
                    Start free <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={!checkoutEnabled || !clientId || !isLoaded}
                    aria-controls={selected ? "paypal-checkout-panel" : undefined}
                    onClick={() => chooseCheckout(plan.key)}
                    className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-white transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none lg:px-4 ${paidTheme?.cta ?? ""}`}
                  >
                    {selected ? (
                      <>
                        Continue to payment
                        <Check className="h-4 w-4" aria-hidden />
                      </>
                    ) : (
                      <>
                        {plan.key === "payg" ? "Buy Credits" : "Subscribe monthly"}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </>
                    )}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </section>
      <p className="mx-auto mt-3 max-w-6xl text-center text-xs leading-5 text-slate-400">
        *Compared with Pay As You Go when all included Credits are used.
      </p>

      {checkout && checkoutEnabled && clientId && selectedPlan && selectedTheme ? (
        <section
          id="paypal-checkout-panel"
          ref={checkoutPanelRef}
          tabIndex={-1}
          aria-labelledby="checkout-panel-heading"
          className="animate-in fade-in slide-in-from-bottom-2 mx-auto mt-5 max-w-6xl scroll-mt-20 overflow-hidden rounded-2xl border border-violet-500/30 bg-slate-950/90 shadow-[0_24px_80px_-40px_rgba(139,92,246,0.55)] outline-none duration-300 motion-reduce:animate-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/50 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                <Check className="h-3 w-3" aria-hidden />
                Plan selected
              </span>
              <span className="hidden text-slate-600 sm:inline" aria-hidden>
                →
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-200">
                <LockKeyhole className="h-3 w-3" aria-hidden />
                Complete payment
              </span>
            </div>
            <button
              type="button"
              onClick={closeCheckout}
              className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700/80 px-2.5 text-xs font-semibold text-slate-300 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none sm:min-h-10 sm:px-3 sm:text-sm"
            >
              <X className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Change plan</span>
            </button>
          </div>

          <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,24rem)] lg:items-stretch">
            <div
              className={`border-b border-slate-800/80 p-5 sm:p-6 lg:border-b-0 lg:border-r ${selectedTheme.summary}`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300 sm:text-xs">
                Order summary
              </p>
              <h2
                id="checkout-panel-heading"
                className="mt-2 text-xl font-bold text-white sm:text-2xl"
              >
                {selectedPlan.name}
              </h2>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-3xl font-bold tabular-nums tracking-tight text-white sm:text-4xl">
                  {selectedPlan.price}
                </p>
                <span className="pb-1 text-sm font-medium text-slate-400">
                  {selectedPlan.suffix}
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-violet-200">
                {selectedPlan.credits.toLocaleString()} Credits
              </p>
              <p className="mt-2 text-sm leading-6 text-violet-100">{selectedPlan.description}</p>

              <ul className="mt-5 space-y-2 border-t border-violet-500/20 pt-5 text-sm text-violet-100">
                {selectedPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs leading-5 text-violet-200 sm:text-sm">
                {checkout === "payg"
                  ? "You will complete a one-time PayPal payment. Credits stay valid for up to one year."
                  : "You will approve a monthly PayPal subscription. Credits refresh after each successful payment."}
              </p>
            </div>

            <div className="flex flex-col bg-slate-950/60 p-5 sm:p-6 lg:p-7">
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                  Payment method
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {checkout === "payg" ? "PayPal one-time purchase" : "PayPal subscription"}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0070ba]/10 text-[#0070ba]">
                      <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">PayPal Checkout</p>
                      <p className="text-[11px] text-slate-500">Secure payment approval</p>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  {checkout === "payg" && paygConfirmationState === "confirming" ? (
                    <p
                      className="mb-3 flex items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm font-medium text-sky-800"
                      aria-live="polite"
                    >
                      <LoaderCircle
                        className="h-4 w-4 animate-spin motion-reduce:animate-none"
                        aria-hidden
                      />
                      Confirming your PayPal payment…
                    </p>
                  ) : null}
                  {checkout === "payg" && paygRecoveryBlocked ? null : (
                    <PayPalProvider
                      clientId={clientId}
                      environment={environment}
                      components={["paypal-payments", "paypal-subscriptions"]}
                      pageType="checkout"
                    >
                      <CheckoutButtons
                        kind={checkout}
                        locale={locale}
                        pendingOrderId={checkout === "payg" ? pendingOrderId : null}
                        disabled={paygConfirmationState === "confirming"}
                        onPaygOrderCreated={(orderId) => {
                          if (!userId) return
                          storePendingPayPalOrder(userId, orderId)
                          setPendingOrderId(orderId)
                          setPendingOrderSource("scoped")
                          trackClarityEvent("paypal_payg_order_created")
                        }}
                        onPaygApprove={(orderId) =>
                          confirmPaygOrder(orderId, userId ?? undefined, pendingOrderSource)
                        }
                        onSuccess={completeSubscriptionCheckout}
                        onCancel={checkout === "payg" ? cancelCheckout : closeCheckout}
                        onError={(message) => {
                          setError(message)
                          if (checkout === "payg" && userId) {
                            const storedOrder = readPendingPayPalOrder(userId)
                            setPendingOrderId(storedOrder?.orderId ?? null)
                            setPendingOrderSource(storedOrder?.source ?? null)
                            setPaygConfirmationState(storedOrder ? "retry" : "idle")
                          } else {
                            setCheckout(null)
                          }
                        }}
                      />
                    </PayPalProvider>
                  )}
                </div>
              </div>

              {checkout === "payg" && paygRecoveryBlocked ? (
                <button
                  type="button"
                  onClick={startFreshPaygCheckout}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 text-sm font-semibold text-violet-100 transition-colors duration-200 hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  Start a new purchase for this account
                </button>
              ) : null}

              {checkout === "payg" && paygConfirmationState === "retry" && pendingOrderId ? (
                <button
                  type="button"
                  onClick={() => {
                    void confirmPaygOrder(
                      pendingOrderId,
                      userId ?? undefined,
                      pendingOrderSource
                    ).catch(() => undefined)
                  }}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none"
                >
                  Retry payment confirmation
                </button>
              ) : null}

              <button
                type="button"
                onClick={closeCheckout}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-700/80 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none lg:hidden"
              >
                Choose another plan
              </button>
            </div>
          </div>
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

      {notice ? (
        <p
          role="status"
          className="mx-auto mt-5 max-w-xl rounded-xl border border-sky-400/30 bg-sky-950/40 p-4 text-sm text-sky-100"
        >
          {notice}
        </p>
      ) : null}

      <section className="mx-auto mt-12 max-w-6xl sm:mt-16" aria-labelledby="plan-comparison-title">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300 sm:text-xs">
            Side by side
          </p>
          <h2
            id="plan-comparison-title"
            className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.03em]"
          >
            <span className="bg-gradient-to-r from-sky-300 to-violet-400 bg-clip-text text-transparent">
              Compare plans
            </span>
            <span className="text-white"> side by side</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Choose by the audio time you expect to process each month.
          </p>
        </div>

        <div className="mt-4 divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/55 md:hidden">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`px-4 py-4 ${plan.key === "regular" ? "bg-violet-950/25" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  {plan.key === "regular" ? (
                    <span className="mt-1 inline-flex rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold text-violet-200">
                      Lowest unit cost
                    </span>
                  ) : null}
                </div>
                <p className="shrink-0 text-right font-semibold tabular-nums text-white">
                  {plan.price}{" "}
                  <span
                    className={`text-xs font-medium ${
                      plan.key === "regular" ? "text-violet-300" : "text-slate-400"
                    }`}
                  >
                    {plan.suffix}
                  </span>
                </p>
              </div>
              <dl className="mt-3 grid gap-2 text-sm">
                {comparisonRows.map((row) => (
                  <div key={row.key} className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-3">
                    <dt className={plan.key === "regular" ? "text-violet-300" : "text-slate-400"}>
                      {row.label}
                    </dt>
                    <dd
                      className={`font-medium ${
                        plan.key === "regular" ? "text-violet-100" : "text-slate-200"
                      }`}
                    >
                      {plan[row.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-xl border border-slate-800 bg-slate-950/55 md:block">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of Free, Pay As You Go, and Regular Audio Credit plans
            </caption>
            <thead>
              <tr className="border-b border-slate-800">
                <th scope="col" className="w-36 bg-slate-900/55 px-4 py-4 text-slate-400">
                  Compare
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.key}
                    scope="col"
                    className={`border-l border-slate-800 px-4 py-4 ${
                      plan.key === "regular" ? "bg-violet-950/25" : ""
                    }`}
                  >
                    <span className="block font-semibold text-white">{plan.name}</span>
                    <span className="mt-1 block text-lg font-bold tabular-nums text-white">
                      {plan.price}{" "}
                      <span
                        className={`text-xs font-medium ${
                          plan.key === "regular" ? "text-violet-300" : "text-slate-400"
                        }`}
                      >
                        {plan.suffix}
                      </span>
                    </span>
                    {plan.key === "regular" ? (
                      <span className="mt-2 inline-flex rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold text-violet-200">
                        Lowest unit cost
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.key} className="border-b border-slate-800 last:border-b-0">
                  <th scope="row" className="bg-slate-900/55 px-4 py-3 font-medium text-slate-400">
                    {row.label}
                  </th>
                  {plans.map((plan) => (
                    <td
                      key={plan.key}
                      className={`border-l border-slate-800 px-4 py-3 font-medium ${
                        plan.key === "regular"
                          ? "bg-violet-950/25 text-violet-100"
                          : "text-slate-200"
                      }`}
                    >
                      {plan[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-auto mt-8 flex max-w-5xl items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-950/20 p-4 text-sm leading-6 text-slate-300">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
        Audio and filenames stay in your browser. PayPal handles payment details; Geekskai receives
        payment status and maintains your Credit balance.
      </div>
    </>
  )
}
