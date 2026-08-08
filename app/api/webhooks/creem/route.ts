import { NextRequest, NextResponse } from "next/server"
import { verifyCreemSignature } from "@/lib/billing/domain"
import { parseCreemWebhookPayload, processCreemWebhook } from "@/lib/billing/repository"

export async function POST(request: NextRequest) {
  const signature = request.headers.get("creem-signature") ?? ""
  const secret = process.env.CREEM_WEBHOOK_SECRET?.trim()
  const rawPayload = await request.text()
  if (!secret || !verifyCreemSignature(rawPayload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 })
  }

  try {
    const result = await processCreemWebhook(parseCreemWebhookPayload(JSON.parse(rawPayload)), rawPayload)
    return NextResponse.json({ ok: true, duplicate: result.duplicate })
  } catch (error) {
    console.error("Creem webhook processing failed", error)
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 })
  }
}
