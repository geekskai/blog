"use client"

import { useState } from "react"

export default function BillingPortalButton() {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const openPortal = async () => {
    setBusy(true)
    setError(null)
    const response = await fetch("/api/billing/portal/", { method: "POST" })
    const result = (await response.json()) as { url?: string; error?: string }
    if (response.ok && result.url) window.location.assign(result.url)
    else {
      setError(result.error ?? "Billing management is temporarily unavailable.")
      setBusy(false)
    }
  }
  return <div><button type="button" onClick={openPortal} disabled={busy} className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Opening…" : "Manage subscription with Creem"}</button>{error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}</div>
}
