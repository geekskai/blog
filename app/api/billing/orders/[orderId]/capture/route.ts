import { auth } from "@clerk/nextjs/server"
import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { getAudioCreditBalance } from "@/lib/audio-credits/repository"
import {
  completePaygOrder,
  isExpectedPayPalOrder,
  getPaygOrderForCapture,
  isExpectedPaygOrder,
  isPaygOrderCapturable,
  parseCompletedPayPalCapture,
  readPayPalOrderStatus,
} from "@/lib/billing/orders"
import { getPayPalClient, getPayPalErrorLogFields } from "@/lib/billing/paypal"
import { billingCheckoutEnabled, billingSchemaV2Enabled } from "@/lib/billing/policy"

export const runtime = "nodejs"

const unknownResult = () =>
  NextResponse.json(
    {
      ok: false,
      status: "UNKNOWN",
      code: "result_unknown",
      retryable: true,
      error:
        "Payment status is not yet confirmed. Retry confirmation; do not start a new purchase.",
    },
    { status: 502 }
  )

export async function POST(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const [{ userId }, { orderId }] = await Promise.all([auth(), params])
  const requestId = request.headers.get("x-request-id") ?? randomUUID()
  if (!userId) {
    return NextResponse.json(
      {
        ok: false,
        status: "AUTH_REQUIRED",
        code: "authentication_required",
        retryable: true,
        error: "Your session expired. Sign in to continue confirming this purchase.",
      },
      { status: 401 }
    )
  }
  if (!billingCheckoutEnabled(userId) || !billingSchemaV2Enabled()) {
    return NextResponse.json(
      {
        ok: false,
        status: "UNAVAILABLE",
        code: "checkout_unavailable",
        error: "Checkout is currently unavailable.",
      },
      { status: 503 }
    )
  }
  if (!/^[A-Z0-9-]{3,64}$/i.test(orderId)) {
    return NextResponse.json(
      { ok: false, status: "REJECTED", code: "invalid_order", error: "Invalid PayPal order." },
      { status: 400 }
    )
  }

  let localOrderId: string | null = null
  try {
    const localOrder = await getPaygOrderForCapture(userId, orderId)
    if (!localOrder) {
      return NextResponse.json(
        {
          ok: false,
          status: "NOT_FOUND",
          code: "order_not_found",
          error: "Sign in with the account that started this PayPal purchase.",
        },
        { status: 404 }
      )
    }
    localOrderId = String(localOrder.id)
    if (!isExpectedPaygOrder(localOrder)) {
      console.warn("PayPal PAYG capture rejected", {
        localOrderId,
        providerOrderId: orderId,
        requestId,
        errorCode: "order_mismatch",
      })
      return NextResponse.json(
        {
          ok: false,
          status: "REJECTED",
          code: "order_mismatch",
          error: "This PayPal order does not match the 480-Credit purchase.",
        },
        { status: 409 }
      )
    }

    if (localOrder.provider_capture_id) {
      const balance =
        localOrder.status === "COMPLETED"
          ? await completePaygOrder({
              clerkUserId: userId,
              localOrderId,
              providerOrderId: orderId,
              captureId: String(localOrder.provider_capture_id),
              capturedAt: new Date(),
            })
          : await getAudioCreditBalance(userId)
      console.info("PayPal PAYG capture already recorded", {
        localOrderId,
        providerOrderId: orderId,
        captureId: String(localOrder.provider_capture_id),
        requestId,
      })
      return NextResponse.json({ ok: true, status: "COMPLETED", duplicate: true, balance })
    }

    const paypal = getPayPalClient()
    const providerOrder = await paypal.getOrder(orderId)
    const providerStatus = readPayPalOrderStatus(providerOrder)
    console.info("PayPal PAYG order checked", {
      localOrderId,
      providerOrderId: orderId,
      requestId,
      providerStatus,
    })

    if (!isExpectedPayPalOrder(providerOrder, { localOrderId, providerOrderId: orderId })) {
      console.warn("PayPal PAYG provider order rejected", {
        localOrderId,
        providerOrderId: orderId,
        requestId,
        errorCode: "provider_order_mismatch",
      })
      return NextResponse.json(
        {
          ok: false,
          status: "REJECTED",
          code: "order_mismatch",
          error: "This PayPal order does not match the 480-Credit purchase.",
        },
        { status: 409 }
      )
    }

    if (providerStatus === "COMPLETED") {
      const capture = parseCompletedPayPalCapture(providerOrder, {
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
      console.info("PayPal PAYG completed capture recovered", {
        localOrderId,
        providerOrderId: orderId,
        captureId: capture.captureId,
        requestId,
      })
      return NextResponse.json({
        ok: true,
        status: "COMPLETED",
        duplicate: true,
        recovered: true,
        balance,
      })
    }

    if (providerStatus === "VOIDED") {
      return NextResponse.json(
        {
          ok: false,
          status: "EXPIRED",
          code: "order_expired",
          retryable: false,
          error: "This PayPal order expired. Start a new checkout.",
        },
        { status: 409 }
      )
    }
    if (providerStatus !== "APPROVED") {
      if (providerStatus === "CREATED" || providerStatus === "PAYER_ACTION_REQUIRED") {
        return NextResponse.json(
          {
            ok: false,
            status: "NOT_APPROVED",
            code: "not_approved",
            retryable: true,
            error: "PayPal has not approved this order yet.",
          },
          { status: 409 }
        )
      }
      return unknownResult()
    }
    if (!isPaygOrderCapturable(localOrder)) {
      return NextResponse.json(
        {
          ok: false,
          status: "EXPIRED",
          code: "order_expired",
          retryable: false,
          error: "This PayPal order expired. Start a new checkout.",
        },
        { status: 409 }
      )
    }

    console.info("PayPal PAYG capture started", {
      localOrderId,
      providerOrderId: orderId,
      requestId,
    })
    try {
      const resource = await paypal.captureOrder(orderId, `${localOrderId}-capture`)
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
      console.info("PayPal PAYG capture completed", {
        localOrderId,
        providerOrderId: orderId,
        captureId: capture.captureId,
        requestId,
      })
      return NextResponse.json({ ok: true, status: "COMPLETED", duplicate: false, balance })
    } catch (captureError) {
      console.warn("PayPal PAYG capture response was not confirmed", {
        localOrderId,
        providerOrderId: orderId,
        requestId,
        ...getPayPalErrorLogFields(captureError),
      })
      const recoveredOrder = await paypal.getOrder(orderId)
      if (readPayPalOrderStatus(recoveredOrder) !== "COMPLETED") return unknownResult()
      const capture = parseCompletedPayPalCapture(recoveredOrder, {
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
      console.info("PayPal PAYG capture recovered after uncertain response", {
        localOrderId,
        providerOrderId: orderId,
        captureId: capture.captureId,
        requestId,
      })
      return NextResponse.json({
        ok: true,
        status: "COMPLETED",
        duplicate: true,
        recovered: true,
        balance,
      })
    }
  } catch (error) {
    console.error("PayPal PAYG capture failed", {
      localOrderId,
      providerOrderId: orderId,
      requestId,
      ...getPayPalErrorLogFields(error),
      error,
    })
    return unknownResult()
  }
}
