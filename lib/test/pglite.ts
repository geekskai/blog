import { readFileSync } from "node:fs"
import { join } from "node:path"
import { PGlite } from "@electric-sql/pglite"

const MIGRATIONS = [
  "0000_ambiguous_white_tiger.sql",
  "0001_wide_mandroid.sql",
  "0002_dear_betty_ross.sql",
  "0003_milky_misty_knight.sql",
  "0004_tense_hercules.sql",
  "0005_magical_maginty.sql",
  "0006_absent_nekra.sql",
  "0007_groovy_stone_men.sql",
  "0008_amazing_the_santerians.sql",
  "0009_nifty_proteus.sql",
] as const

export type TestSql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>

export async function createMigratedTestDatabase() {
  const database = new PGlite()
  for (const migration of MIGRATIONS) {
    const source = readFileSync(join(process.cwd(), "drizzle", migration), "utf8").replaceAll(
      "--> statement-breakpoint",
      ""
    )
    await database.exec(source)
  }

  const sql: TestSql = async (strings, ...values) => {
    const query = strings.reduce(
      (text, fragment, index) =>
        `${text}${fragment}${index < values.length ? `$${index + 1}` : ""}`,
      ""
    )
    const result = await database.query<Record<string, unknown>>(query, values)
    return result.rows
  }

  return { database, sql }
}
