"use client"

import { useState } from "react"
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
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={cancelSubscription}
        disabled={busy}
        className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Cancelling…" : "Cancel future renewal"}
      </button>
      <a
        href="https://www.paypal.com/myaccount/autopay/"
        target="_blank"
        rel="external noopener noreferrer"
        className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200"
      >
        Manage payment method in PayPal
      </a>
      {error ? (
        <p role="alert" className="w-full text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
