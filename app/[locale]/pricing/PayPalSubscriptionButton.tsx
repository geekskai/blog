"use client"

import Script from "next/script"
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
    <div className="mt-4 rounded-xl border border-slate-700 bg-white p-3">
      <Script
        id="paypal-subscriptions-sdk"
        src={sdkUrl}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
        onReady={() => setSdkReady(true)}
        onError={() => onError("PayPal checkout failed to load.")}
      />
      {!sdkReady ? (
        <p className="py-3 text-center text-sm text-slate-700">Loading PayPal…</p>
      ) : null}
      <div ref={containerRef} aria-label="PayPal subscription checkout" />
    </div>
  )
}
