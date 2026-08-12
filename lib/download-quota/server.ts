import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { QuotaToolId } from "./config"
import { isServerQuotaEnabled, VISITOR_QUOTA_COOKIE } from "./config"
import {
  claimVisitorDownloadOperation,
  claimRegisteredDownloadOperation,
  getVisitorDownloadOperation,
  getRegisteredDownloadOperation,
  releaseRegisteredDownload,
  releaseVisitorDownload,
} from "./repository"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function operationIdFromRequest(request: Request) {
  const headerValue = request.headers.get("x-download-operation-id")
  if (headerValue) return headerValue
  return new URL(request.url).searchParams.get("operation_id")
}

function visitorIdFromRequest(request: Request) {
  const cookie = request.headers.get("cookie")
  const value = cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${VISITOR_QUOTA_COOKIE}=`))
    ?.slice(VISITOR_QUOTA_COOKIE.length + 1)
  return value && UUID_PATTERN.test(value) ? value : null
}

export async function withDownloadReservation(
  request: Request,
  allowedTools: readonly QuotaToolId[],
  handler: () => Promise<Response>
): Promise<Response> {
  const { userId } = await auth()
  if (!allowedTools.some(isServerQuotaEnabled)) return handler()

  const operationId = operationIdFromRequest(request)
  if (!operationId || !UUID_PATTERN.test(operationId)) {
    return NextResponse.json({ error: "A valid download reservation is required" }, { status: 409 })
  }

  const visitorId = userId ? null : visitorIdFromRequest(request)
  if (!userId && !visitorId) {
    return NextResponse.json(
      { error: "A valid visitor download identity is required" },
      { status: 409 }
    )
  }

  const operation = userId
    ? await claimRegisteredDownloadOperation(userId, operationId, allowedTools)
    : await claimVisitorDownloadOperation(visitorId!, operationId, allowedTools)
  if (!operation) {
    const existing = userId
      ? await getRegisteredDownloadOperation(userId, operationId)
      : await getVisitorDownloadOperation(visitorId!, operationId)
    if (
      (existing?.status === "reserved" || existing?.status === "processing") &&
      existing.expiresAt <= new Date()
    ) {
      if (userId) await releaseRegisteredDownload(userId, operationId)
      else await releaseVisitorDownload(visitorId!, operationId)
    }
    return NextResponse.json(
      { error: "Download reservation is missing or no longer active" },
      {
        status: 409,
      }
    )
  }

  try {
    const response = await handler()
    if (!response.ok && !(response.status >= 300 && response.status < 400)) {
      if (userId) await releaseRegisteredDownload(userId, operationId)
      else await releaseVisitorDownload(visitorId!, operationId)
    }
    return response
  } catch (error) {
    if (userId) await releaseRegisteredDownload(userId, operationId)
    else await releaseVisitorDownload(visitorId!, operationId)
    throw error
  }
}
