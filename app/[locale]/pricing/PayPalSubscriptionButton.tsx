"use client"

import Script from "next/script"
import { LockKeyhole } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { readBillingJson } from "@/lib/billing/client-response"

type PayPalActions = {
  subscription: {
    create(input: {
      plan_id: string
      custom_id: string
      application_context: { shipping_preference: "NO_SHIPPING" }
    }): Promise<string>
  }
}

type PayPalButtons = {
  render(element: HTMLElement): Promise<void>
  close?: () => Promise<void>
}

declare global {
  interface Window {
    paypal?: {
      Buttons(options: {
        style: { layout: "vertical"; shape: "rect"; label: "subscribe" }
        createSubscription(data: unknown, actions: PayPalActions): Promise<string>
        onApprove(data: { subscriptionID?: string }): Promise<void>
        onCancel(): void
        onError(error: unknown): void
      }): PayPalButtons
    }
  }
}

type Props = {
  clientId: string
  planId: string
  customId: string
  onApproved: () => void
  onCancel: () => void
  onError: (message: string) => void
}

export default function PayPalSubscriptionButton({
  clientId,
  planId,
  customId,
  onApproved,
  onCancel,
  onError,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sdkReady, setSdkReady] = useState(Boolean(globalThis.window?.paypal))

  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current) return
    const container = containerRef.current
    container.replaceChildren()
    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", shape: "rect", label: "subscribe" },
      createSubscription: (_data, actions) =>
        actions.subscription.create({
          plan_id: planId,
          custom_id: customId,
          application_context: { shipping_preference: "NO_SHIPPING" },
        }),
      async onApprove(data) {
        if (!data.subscriptionID) {
          onError("PayPal did not return a subscription identifier.")
          return
        }
        const response = await fetch("/api/billing/subscription/confirm/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ subscriptionId: data.subscriptionID }),
        })
        const result = await readBillingJson<{ error?: string }>(response)
        if (!response.ok || !result) {
          throw new Error(result?.error ?? "Subscription confirmation is temporarily unavailable.")
        }
        onApproved()
      },
      onCancel,
      onError(error) {
        onError(error instanceof Error ? error.message : "PayPal checkout failed.")
      },
    })
    void buttons.render(container).catch((error) => {
      onError(error instanceof Error ? error.message : "PayPal checkout failed to load.")
    })
    return () => {
      container.replaceChildren()
      void buttons.close?.()
    }
  }, [customId, onApproved, onCancel, onError, planId, sdkReady])

  const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&components=buttons&currency=USD&intent=subscription&vault=true`

  return (
    <div className="flex min-h-60 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_-12px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0070ba]/10 text-[#0070ba]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.774L4.983 3.097a.77.77 0 0 1 .757-.637h6.494c2.46 0 4.217 1.045 5.043 2.957.413.98.536 2.065.368 3.222-.17 1.172-.62 2.188-1.338 3.02-.88 1.016-2.09 1.765-3.6 2.227-1.3.4-2.82.602-4.52.602h-1.09l-.82 5.244a.641.641 0 0 1-.633.545zm.883-3.337h1.09c1.45 0 2.58-.28 3.36-.83.78-.55 1.28-1.35 1.5-2.39.22-1.04.05-1.89-.51-2.55-.56-.66-1.48-1-2.75-1H9.05l-.99 6.77h.9z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-800">PayPal Checkout</p>
            <p className="text-[10px] text-slate-500">Secure subscription approval</p>
          </div>
        </div>
        <LockKeyhole className="h-4 w-4 text-slate-400" aria-hidden />
      </div>
      <div className="flex-1 p-3">
        <Script
          id="paypal-subscriptions-sdk"
          src={sdkUrl}
          strategy="afterInteractive"
          onLoad={() => setSdkReady(true)}
          onReady={() => setSdkReady(true)}
          onError={() => onError("PayPal checkout failed to load.")}
        />
        {!sdkReady ? (
          <div className="space-y-2 py-4" aria-hidden>
            <div className="mx-auto h-10 w-full max-w-[16rem] animate-pulse rounded-md bg-slate-100 motion-reduce:animate-none" />
            <p className="text-center text-xs text-slate-500">Loading PayPal…</p>
          </div>
        ) : null}
        <div ref={containerRef} aria-label="PayPal subscription checkout" />
      </div>
    </div>
  )
}
