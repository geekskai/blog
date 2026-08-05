import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { QuotaToolId } from "./config"
import { isServerQuotaEnabled } from "./config"
import {
  claimRegisteredDownloadOperation,
  getRegisteredDownloadOperation,
  releaseRegisteredDownload,
} from "./repository"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function operationIdFromRequest(request: Request) {
  const headerValue = request.headers.get("x-download-operation-id")
  if (headerValue) return headerValue
  return new URL(request.url).searchParams.get("operation_id")
}

export async function withRegisteredDownloadReservation(
  request: Request,
  allowedTools: readonly QuotaToolId[],
  handler: () => Promise<Response>
): Promise<Response> {
  const { userId } = await auth()
  if (!userId) return handler()

  if (!allowedTools.some(isServerQuotaEnabled)) return handler()

  const operationId = operationIdFromRequest(request)
  if (!operationId || !UUID_PATTERN.test(operationId)) {
    return NextResponse.json({ error: "A valid download reservation is required" }, { status: 409 })
  }

  const operation = await claimRegisteredDownloadOperation(userId, operationId, allowedTools)
  if (!operation) {
    const existing = await getRegisteredDownloadOperation(userId, operationId)
    if (
      (existing?.status === "reserved" || existing?.status === "processing") &&
      existing.expiresAt <= new Date()
    ) {
      await releaseRegisteredDownload(userId, operationId)
    }
    return NextResponse.json({ error: "Download reservation is missing or no longer active" }, {
      status: 409,
    })
  }

  try {
    const response = await handler()
    if (!response.ok && !(response.status >= 300 && response.status < 400)) {
      await releaseRegisteredDownload(userId, operationId)
    }
    return response
  } catch (error) {
    await releaseRegisteredDownload(userId, operationId)
    throw error
  }
}
