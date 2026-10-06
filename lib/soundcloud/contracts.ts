import { z } from "zod"

export const outputFormat = z.enum(["mp3", "m4a", "wav", "artwork"])
export const progressSchema = z.object({
  phase: z.enum(["resolving", "downloading", "processing", "ready"]),
  percent: z.number().min(0).max(100).optional(),
})
export const fileSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string(),
  size: z.number().nonnegative(),
  format: outputFormat,
})
export const jobSchema = z.object({
  id: z.uuid(),
  status: z.enum(["queued", "preparing", "ready", "failed", "cancelled", "expired"]),
  progress: progressSchema.optional(),
  file: fileSchema.optional(),
  error: z.object({ code: z.string(), message: z.string() }).optional(),
})
export const ticketSchema = z.object({ path: z.string(), expiresAt: z.number(), file: fileSchema })
export const trackSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    duration: z.number().nonnegative(),
    permalink_url: z.string().optional(),
    artwork_url: z.string().nullable().optional(),
    user: z.object({ username: z.string().optional() }).passthrough().optional(),
  })
  .passthrough()
export const playlistSchema = z.object({
  totalTracks: z.number(),
  entries: z.array(
    z.object({ status: z.enum(["available", "unavailable"]), track: trackSchema.optional() })
  ),
})
export type DownloadProgress = z.infer<typeof progressSchema>
export type OutputFormat = z.infer<typeof outputFormat>
