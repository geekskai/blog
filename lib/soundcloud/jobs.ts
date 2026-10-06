import { auth } from "@clerk/nextjs/server"
import { isServerQuotaEnabled, VISITOR_QUOTA_COOKIE } from "@/lib/download-quota/config"
import {
  getRegisteredDownloadOperation,
  getVisitorDownloadOperation,
  releaseRegisteredDownload,
  releaseVisitorDownload,
} from "@/lib/download-quota/repository"
import { randomUUID } from "node:crypto"
import { NextRequest } from "next/server"
import { z } from "zod"
import { jobSchema, outputFormat, ticketSchema } from "./contracts"
import {
  serviceRequest,
  serviceJson,
  serviceErrorResponse,
  serviceConfiguration,
  SoundCloudServiceError,
} from "./service"
import { signJobToken, verifyJobToken } from "./job-token"

const SESSION_COOKIE = "soundcloud_download_session"
async function jobOwner(request: NextRequest) {
  const { userId } = await auth()
  const session = request.cookies.get(SESSION_COOKIE)?.value
  return { owner: userId ? `user:${userId}` : `visitor:${session || ""}`, session }
}
export async function createDownloadJob({
  request,
  isArtwork = false,
}: {
  request: NextRequest
  isArtwork?: boolean
}) {
  try {
    const input = z
      .object({ url: z.string().min(1), format: outputFormat.default("mp3") })
      .parse(await request.json())
    if (!isArtwork && input.format === "artwork") {
      throw new SoundCloudServiceError("invalid_format", 400, "Use the artwork download endpoint.")
    }
    const identity = await jobOwner(request)
    const session = identity.session || randomUUID()
    const owner = identity.owner === "visitor:" ? `visitor:${session}` : identity.owner
    const requestedTool = request.headers.get("x-quota-tool-id")
    let tool: "soundcloud-track" | "soundcloud-playlist" | "soundcloud-artwork" = "soundcloud-track"
    if (requestedTool === "soundcloud-playlist") {
      tool = "soundcloud-playlist"
    }
    if (isArtwork) {
      tool = "soundcloud-artwork"
    }
    const operationId = request.headers.get("x-download-operation-id") || undefined
    const job = await serviceRequest({
      path: "/v1/downloads",
      schema: jobSchema,
      body: { url: input.url, format: isArtwork ? "artwork" : input.format },
      idempotencyKey: request.headers.get("x-download-operation-id") || randomUUID(),
    })
    const response = serviceJson(
      {
        token: signJobToken({ id: job.id, owner, operationId, tool }),
        status: job.status,
        progress: job.progress,
      },
      202
    )
    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    })
    return response
  } catch (error: unknown) {
    return serviceErrorResponse(error)
  }
}
export async function updateDownloadJob(request: NextRequest) {
  try {
    const input = z
      .object({ token: z.string().max(2048), action: z.enum(["status", "ticket", "cancel"]) })
      .parse(await request.json())
    const identity = await jobOwner(request)
    const claims = verifyJobToken(input.token, identity.owner)
    if (input.action !== "cancel") {
      await checkJobReservation(request, claims)
    }
    const path = `/v1/downloads/${claims.id}`
    if (input.action !== "ticket") {
      const job = await serviceRequest({
        path,
        schema: jobSchema,
        method: input.action === "cancel" ? "DELETE" : "GET",
      })
      if (["failed", "cancelled", "expired"].includes(job.status)) {
        await releaseJobReservation(request, claims)
      }
      return serviceJson({
        status: job.status,
        progress: job.progress,
        file: job.file,
        error: job.error,
      })
    }
    const ticket = await serviceRequest({ path: `${path}/ticket`, schema: ticketSchema })
    if (!/^\/downloads\/[A-Za-z0-9_.-]+$/.test(ticket.path)) {
      throw new SoundCloudServiceError("invalid_ticket", 502, "Invalid download link.")
    }
    return serviceJson({
      url: serviceConfiguration().origin + ticket.path,
      file: ticket.file,
      expiresAt: ticket.expiresAt,
    })
  } catch (error: unknown) {
    return serviceErrorResponse(error)
  }
}

type JobClaims = ReturnType<typeof verifyJobToken>
async function checkJobReservation(request: NextRequest, claims: JobClaims) {
  if (!isServerQuotaEnabled(claims.tool)) {
    return
  }
  const visitor = request.cookies.get(VISITOR_QUOTA_COOKIE)?.value
  if (!claims.operationId || (!claims.owner.startsWith("user:") && !visitor)) {
    throw new SoundCloudServiceError(
      "reservation_required",
      409,
      "Active download reservation required."
    )
  }
  const operation = claims.owner.startsWith("user:")
    ? await getRegisteredDownloadOperation(claims.owner.slice(5), claims.operationId)
    : await getVisitorDownloadOperation(visitor!, claims.operationId)
  if (
    !operation ||
    operation.status !== "processing" ||
    operation.toolId !== claims.tool ||
    operation.expiresAt <= new Date()
  ) {
    throw new SoundCloudServiceError(
      "reservation_expired",
      409,
      "Download reservation is no longer active."
    )
  }
}
async function releaseJobReservation(request: NextRequest, claims: JobClaims) {
  if (!claims.operationId || !isServerQuotaEnabled(claims.tool)) {
    return
  }
  if (claims.owner.startsWith("user:")) {
    await releaseRegisteredDownload(claims.owner.slice(5), claims.operationId)
    return
  }
  const visitor = request.cookies.get(VISITOR_QUOTA_COOKIE)?.value
  if (visitor) {
    await releaseVisitorDownload(visitor, claims.operationId)
  }
}
