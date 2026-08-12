import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import {
  isQuotaToolId,
  isServerQuotaEnabled,
  VISITOR_QUOTA_COOKIE,
} from "@/lib/download-quota/config"
import { mergeVisitorUsageCarryover } from "@/lib/download-quota/domain"
import {
  completeVisitorDownload,
  completeRegisteredDownload,
  getRegisteredUsage,
  getVisitorUsage,
  grantRegisteredShareUnlock,
  grantVisitorShareUnlock,
  initializeRegisteredUsage,
  initializeVisitorUsage,
  releaseRegisteredDownload,
  releaseVisitorDownload,
  reserveRegisteredDownload,
  reserveVisitorDownload,
} from "@/lib/download-quota/repository"
import { createShareAttribution, isGrowthEventName, recordGrowthEvent } from "@/lib/growth/events"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const JOURNEY_COOKIE = "geekskai_growth_journey"
const SHARE_ATTRIBUTION_COOKIE = "geekskai_share_attribution"
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value)
}

function quotaDisabled() {
  return NextResponse.json({ mode: "local" as const })
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function getJourneyId(request: NextRequest) {
  const existing = request.cookies.get(JOURNEY_COOKIE)?.value
  return isUuid(existing) ? existing : crypto.randomUUID()
}

function setJourneyCookie(response: NextResponse, journeyId: string) {
  response.cookies.set(JOURNEY_COOKIE, journeyId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 90 * 24 * 60 * 60,
  })
}

function getVisitorIdentity(request: NextRequest) {
  const existingId = request.cookies.get(VISITOR_QUOTA_COOKIE)?.value
  return {
    anonymousId: isUuid(existingId) ? existingId : crypto.randomUUID(),
    hasCookie: isUuid(existingId),
  }
}

function setVisitorCookie(response: NextResponse, anonymousId: string) {
  response.cookies.set(VISITOR_QUOTA_COOKIE, anonymousId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 90 * 24 * 60 * 60,
  })
}

export async function GET(request: NextRequest) {
  const toolId = request.nextUrl.searchParams.get("tool")
  if (!isQuotaToolId(toolId)) return errorResponse("Unknown quota tool", 400)

  const { userId } = await auth()
  if (!isServerQuotaEnabled(toolId)) return quotaDisabled()

  try {
    if (userId) {
      return NextResponse.json({ mode: "server", quota: await getRegisteredUsage(userId) })
    }
    const visitor = getVisitorIdentity(request)
    const response = NextResponse.json({
      mode: "server",
      quota: await getVisitorUsage(visitor.anonymousId),
    })
    if (!visitor.hasCookie) setVisitorCookie(response, visitor.anonymousId)
    return response
  } catch (error) {
    console.error("Failed to load registered download quota", error)
    return errorResponse("Download quota is temporarily unavailable", 503)
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") return errorResponse("Invalid request", 400)

  const action = (body as Record<string, unknown>).action
  const toolId = (body as Record<string, unknown>).toolId
  if (!isQuotaToolId(toolId)) return errorResponse("Unknown quota tool", 400)

  const { userId } = await auth()
  const serverQuotaEnabled = isServerQuotaEnabled(toolId)
  if (!serverQuotaEnabled) return quotaDisabled()

  try {
    if (action === "event") {
      const eventName = (body as Record<string, unknown>).eventName
      if (!isGrowthEventName(eventName)) return errorResponse("Unknown growth event", 400)

      const journeyId = getJourneyId(request)
      const firstShareId = request.cookies.get(SHARE_ATTRIBUTION_COOKIE)?.value
      await recordGrowthEvent({
        journeyId,
        clerkUserId: userId,
        eventName,
        toolId,
        firstShareId: isUuid(firstShareId) ? firstShareId : null,
      })
      const response = NextResponse.json({ ok: true })
      setJourneyCookie(response, journeyId)
      return response
    }

    if (action === "share_landing") {
      const shareId = (body as Record<string, unknown>).shareId
      if (!isUuid(shareId)) return errorResponse("Invalid share attribution", 400)

      const journeyId = getJourneyId(request)
      const existingFirstTouch = request.cookies.get(SHARE_ATTRIBUTION_COOKIE)?.value
      const firstShareId = isUuid(existingFirstTouch) ? existingFirstTouch : shareId
      await recordGrowthEvent({
        journeyId,
        clerkUserId: userId,
        eventName: "share_landing",
        toolId,
        firstShareId,
      })
      const response = NextResponse.json({ ok: true })
      setJourneyCookie(response, journeyId)
      if (!isUuid(existingFirstTouch)) {
        response.cookies.set(SHARE_ATTRIBUTION_COOKIE, shareId, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        })
      }
      return response
    }

    if (action === "create_share") {
      const requestedShareId = (body as Record<string, unknown>).shareId
      const shareId = isUuid(requestedShareId) ? requestedShareId : crypto.randomUUID()
      await createShareAttribution({ shareId, creatorClerkUserId: userId, toolId })
      return NextResponse.json({ shareId })
    }

    if (action === "share_unlock" && !userId) {
      const visitor = getVisitorIdentity(request)
      const result = await grantVisitorShareUnlock(visitor.anonymousId)
      const response = NextResponse.json({ mode: "server", ...result })
      if (!visitor.hasCookie) setVisitorCookie(response, visitor.anonymousId)
      return response
    }

    if (action === "initialize") {
      if (!userId) {
        const visitor = getVisitorIdentity(request)
        const response = NextResponse.json({
          mode: "server",
          quota: await initializeVisitorUsage(
            visitor.anonymousId,
            (body as Record<string, unknown>).visitorUsage
          ),
        })
        if (!visitor.hasCookie) setVisitorCookie(response, visitor.anonymousId)
        return response
      }
      const visitor = getVisitorIdentity(request)
      const visitorQuota = visitor.hasCookie ? await getVisitorUsage(visitor.anonymousId) : null
      const carryover = mergeVisitorUsageCarryover({
        clientUsage: (body as Record<string, unknown>).visitorUsage,
        clientShareUnlocked: (body as Record<string, unknown>).visitorShareUnlocked,
        clientShareUsage: (body as Record<string, unknown>).visitorShareUsage,
        serverSuccessfulDownloads: visitorQuota?.successfulDownloads,
        serverShareUnlocked: visitorQuota ? !visitorQuota.shareUnlockAvailable : false,
      })
      return NextResponse.json({
        mode: "server",
        quota: await initializeRegisteredUsage(
          userId,
          carryover.visitorUsage,
          carryover.visitorShareUnlocked,
          carryover.visitorShareUsage
        ),
      })
    }

    if (action === "share_unlock") {
      if (!userId) return errorResponse("Visitor share reward was not initialized.", 409)
      return NextResponse.json({ mode: "server", ...(await grantRegisteredShareUnlock(userId)) })
    }

    const operationId = (body as Record<string, unknown>).operationId
    if (!isUuid(operationId)) return errorResponse("Invalid operation ID", 400)

    if (!userId) {
      const visitor = getVisitorIdentity(request)
      if (!visitor.hasCookie) {
        return errorResponse("Visitor download identity is missing. Refresh and try again.", 409)
      }
      if (action === "reserve") {
        return NextResponse.json({
          mode: "server",
          ...(await reserveVisitorDownload(visitor.anonymousId, operationId, toolId)),
        })
      }
      if (action === "complete") {
        const status = await completeVisitorDownload(visitor.anonymousId, operationId)
        return NextResponse.json({
          mode: "server",
          status,
          quota: await getVisitorUsage(visitor.anonymousId),
        })
      }
      if (action === "release") {
        const status = await releaseVisitorDownload(visitor.anonymousId, operationId)
        return NextResponse.json({
          mode: "server",
          status,
          quota: await getVisitorUsage(visitor.anonymousId),
        })
      }
      return errorResponse("Unknown action", 400)
    }

    if (action === "reserve") {
      const result = await reserveRegisteredDownload(userId, operationId, toolId)
      return NextResponse.json({ mode: "server", ...result })
    }

    if (action === "complete") {
      const status = await completeRegisteredDownload(userId, operationId)
      return NextResponse.json({ mode: "server", status, quota: await getRegisteredUsage(userId) })
    }

    if (action === "release") {
      const status = await releaseRegisteredDownload(userId, operationId)
      return NextResponse.json({ mode: "server", status, quota: await getRegisteredUsage(userId) })
    }

    return errorResponse("Unknown action", 400)
  } catch (error) {
    console.error("Download quota request failed", { action, toolId, error })
    return errorResponse("Download quota is temporarily unavailable", 503)
  }
}
