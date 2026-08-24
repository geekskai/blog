import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getAudioCreditBalance } from "@/lib/audio-credits/repository"
import {
  completePaygOrder,
  getPaygOrderForCapture,
  parseCompletedPayPalCapture,
} from "@/lib/billing/orders"
import { getPayPalClient } from "@/lib/billing/paypal"
import { billingCheckoutEnabled, billingSchemaV2Enabled } from "@/lib/billing/policy"

export const runtime = "nodejs"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const [{ userId }, { orderId }] = await Promise.all([auth(), params])
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  if (!billingCheckoutEnabled(userId) || !billingSchemaV2Enabled()) {
    return NextResponse.json({ error: "Checkout is currently unavailable." }, { status: 503 })
  }
  if (!/^[A-Z0-9-]{3,64}$/i.test(orderId)) {
    return NextResponse.json({ error: "Invalid PayPal order." }, { status: 400 })
  }
  try {
    const localOrder = await getPaygOrderForCapture(userId, orderId)
    if (!localOrder)
      return NextResponse.json({ error: "PayPal order was not found." }, { status: 404 })
    if (localOrder.provider_capture_id) {
      const balance =
        localOrder.status === "COMPLETED"
          ? await completePaygOrder({
              clerkUserId: userId,
              localOrderId: String(localOrder.id),
              providerOrderId: orderId,
              captureId: String(localOrder.provider_capture_id),
              capturedAt: new Date(),
            })
          : await getAudioCreditBalance(userId)
      return NextResponse.json({ ok: true, duplicate: true, balance })
    }
    const localOrderId = String(localOrder.id)
    const resource = await getPayPalClient().captureOrder(orderId, `${localOrderId}-capture`)
    const capture = parseCompletedPayPalCapture(resource, {
      localOrderId,
      providerOrderId: orderId,
    })
    const balance = await completePaygOrder({
      clerkUserId: userId,
      localOrderId,
      providerOrderId: orderId,
      captureId: capture.captureId,
      capturedAt: capture.capturedAt,
    })
    return NextResponse.json({ ok: true, duplicate: false, balance })
  } catch (error) {
    console.error("PayPal PAYG capture failed", error)
    return NextResponse.json({ error: "Payment capture could not be confirmed." }, { status: 502 })
  }
}
