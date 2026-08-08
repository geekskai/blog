import "server-only"
import { Creem } from "creem"

let client: Creem | null = null

export function getCreemClient() {
  if (client) return client
  const apiKey = process.env.CREEM_API_KEY?.trim()
  if (!apiKey) throw new Error("CREEM_API_KEY is not configured.")
  const server = process.env.CREEM_ENVIRONMENT === "production" ? "prod" : "test"
  client = new Creem({ apiKey, server })
  return client
}
