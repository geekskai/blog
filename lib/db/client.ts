import { neon } from "@neondatabase/serverless"

let sqlClient: ReturnType<typeof neon> | null = null

export function getSqlClient() {
  if (sqlClient) return sqlClient

  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when server download quotas are enabled")
  }

  sqlClient = neon(databaseUrl)
  return sqlClient
}
