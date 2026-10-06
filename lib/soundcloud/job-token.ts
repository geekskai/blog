import { createHmac, timingSafeEqual } from "node:crypto"
import { z } from "zod"
import { serviceConfiguration, SoundCloudServiceError } from "./service"

const tokenSchema = z.object({
  id: z.uuid(),
  owner: z.string(),
  operationId: z.uuid().optional(),
  tool: z.enum(["soundcloud-track", "soundcloud-playlist", "soundcloud-artwork"]),
  expires: z.number(),
})
export function signJobToken({
  id,
  owner,
  operationId,
  tool,
}: {
  id: string
  owner: string
  operationId?: string
  tool: "soundcloud-track" | "soundcloud-playlist" | "soundcloud-artwork"
}) {
  const payload = Buffer.from(
    JSON.stringify({ id, owner, operationId, tool, expires: Date.now() + 14 * 60_000 })
  ).toString("base64url")
  const signature = createHmac("sha256", serviceConfiguration().key)
    .update(`geekskai-job:${payload}`)
    .digest("base64url")
  return `${payload}.${signature}`
}
export function verifyJobToken(token: string, owner: string) {
  const [payload, signature, extra] = token.split(".")
  const expected = createHmac("sha256", serviceConfiguration().key)
    .update(`geekskai-job:${payload}`)
    .digest()
  const received = Buffer.from(signature || "", "base64url")
  if (extra || received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new SoundCloudServiceError("invalid_job", 403, "Invalid download task.")
  }
  const parsed = tokenSchema.safeParse(JSON.parse(Buffer.from(payload, "base64url").toString()))
  if (!parsed.success || parsed.data.owner !== owner || parsed.data.expires <= Date.now()) {
    throw new SoundCloudServiceError(
      "invalid_job",
      403,
      "Download task expired or belongs to another session."
    )
  }
  return parsed.data
}
