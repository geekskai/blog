"use client"

import { useState } from "react"
import { AlertCircle, ExternalLink, LoaderCircle } from "lucide-react"
import { readBillingJson } from "@/lib/billing/client-response"

export default function SubscriptionActions() {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const cancelSubscription = async () => {
    if (
      !window.confirm(
        "Cancel future renewal? Your paid access will remain available through the current paid period."
      )
    ) {
      return
    }
    setBusy(true)
    setError(null)
    try {
      const response = await fetch("/api/billing/subscription/cancel/", { method: "POST" })
      const result = await readBillingJson<{ error?: string }>(response)
      if (response.ok && result) window.location.reload()
      else setError(result?.error ?? "Cancellation is temporarily unavailable.")
    } catch {
      setError("Cancellation is temporarily unavailable.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-2.5 sm:w-auto">
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={cancelSubscription}
          disabled={busy}
          aria-busy={busy}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500/35 bg-rose-950/30 px-5 text-sm font-semibold text-rose-100 transition-colors duration-200 hover:border-rose-400/50 hover:bg-rose-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
        >
          {busy ? (
            <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : null}
          {busy ? "Cancelling…" : "Cancel future renewal"}
        </button>
        <a
          href="https://www.paypal.com/myaccount/autopay/"
          target="_blank"
          rel="external noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-5 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Manage payment in PayPal
          <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
        </a>
      </div>
      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-400/30 bg-rose-950/40 px-3 py-2.5 text-sm text-rose-100"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  )
}
