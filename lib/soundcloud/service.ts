import { NextResponse } from "next/server"
import { z } from "zod"
import { DEFAULT_RETRY_AFTER_SECONDS, isSoundCloudRateLimit, parseRetryAfter } from "./retry-after"

const REQUEST_TIMEOUT_MS = 25_000
export class SoundCloudServiceError extends Error {
  retryAfterSeconds?: number
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message)
  }
}
export function serviceConfiguration() {
  const key = process.env.SOUNDCLOUD_SERVICE_KEY?.trim()
  const origin = new URL(process.env.SOUNDCLOUD_SERVICE_URL || "https://soundcloud.geekskai.com")
  if (
    !key ||
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/"
  ) {
    throw new SoundCloudServiceError(
      "service_unavailable",
      503,
      "Download service is not configured."
    )
  }
  return { key, origin: origin.origin }
}
export async function serviceRequest<T>({
  path,
  schema,
  method = "POST",
  body,
  idempotencyKey,
}: {
  path: string
  schema: z.ZodType<T>
  method?: string
  body?: unknown
  idempotencyKey?: string
}): Promise<T> {
  const { key, origin } = serviceConfiguration()
  const headers: Record<string, string> = { Authorization: `Bearer ${key}` }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
  }
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey
  }
  try {
    const response = await fetch(origin + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const payload: unknown = await response.json()
    if (!response.ok) {
      const failure = z.object({ code: z.string(), error: z.string() }).safeParse(payload)
      const status = response.status === 401 ? 502 : response.status
      const serviceFailure = new SoundCloudServiceError(
        failure.success ? failure.data.code : "upstream_error",
        status,
        "The download service could not complete this request. Please try again."
      )
      if (isSoundCloudRateLimit(serviceFailure.code)) {
        serviceFailure.retryAfterSeconds =
          parseRetryAfter(response.headers.get("Retry-After")) ?? DEFAULT_RETRY_AFTER_SECONDS
      }
      throw serviceFailure
    }
    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      throw new SoundCloudServiceError(
        "invalid_service_response",
        502,
        "Invalid download service response."
      )
    }
    return parsed.data
  } catch (error: unknown) {
    if (error instanceof SoundCloudServiceError) {
      throw error
    }
    console.error("SoundCloud service request failed", {
      path,
      timeout: error instanceof Error && error.name === "TimeoutError",
    })
    throw new SoundCloudServiceError(
      "service_unavailable",
      503,
      "Download service temporarily unavailable."
    )
  }
}
export function serviceErrorResponse(error: unknown) {
  let failure = new SoundCloudServiceError("internal_error", 500, "Download request failed.")
  if (error instanceof SoundCloudServiceError) {
    failure = error
  } else if (error instanceof z.ZodError || error instanceof SyntaxError) {
    failure = new SoundCloudServiceError("invalid_request", 400, "Invalid request.")
  }
  console.warn("SoundCloud request rejected", { code: failure.code, status: failure.status })
  const headers: Record<string, string> = { "Cache-Control": "no-store" }
  if (failure.retryAfterSeconds !== undefined) {
    headers["Retry-After"] = String(failure.retryAfterSeconds)
  }
  return NextResponse.json(
    { success: false, code: failure.code, error: failure.message },
    { status: failure.status, headers }
  )
}
export function serviceJson(payload: unknown, status = 200) {
  return NextResponse.json(payload, { status, headers: { "Cache-Control": "no-store" } })
}
