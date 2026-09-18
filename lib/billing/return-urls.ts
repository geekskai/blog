import { defaultLocale, locales } from "@/app/i18n/routing"
import { getLocalizedPath } from "@/app/i18n/urls"

const PRODUCTION_ORIGIN = "https://geekskai.com"

function normalizeOrigin(value: string, allowHttp: boolean) {
  const url = new URL(value.includes("://") ? value : `https://${value}`)
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Billing return origin must contain only a trusted origin.")
  }
  if (url.protocol !== "https:" && !(allowHttp && url.protocol === "http:")) {
    throw new Error("Billing return origin must use HTTPS.")
  }
  return url.origin
}

export function getBillingReturnOrigin(env: Record<string, string | undefined> = process.env) {
  const allowHttp = env.NODE_ENV === "development"
  const configured = env.BILLING_RETURN_ORIGIN?.trim()
  if (configured) return normalizeOrigin(configured, allowHttp)

  if (env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "development") {
    const vercelUrl = env.VERCEL_BRANCH_URL?.trim() || env.VERCEL_URL?.trim()
    if (!vercelUrl) throw new Error("A trusted preview return origin is not configured.")
    return normalizeOrigin(vercelUrl, false)
  }

  if (allowHttp) return "http://localhost:3000"
  return PRODUCTION_ORIGIN
}

export function getPayPalOrderReturnUrls(
  locale: unknown,
  env: Record<string, string | undefined> = process.env
) {
  const safeLocale = typeof locale === "string" && locales.includes(locale) ? locale : defaultLocale
  const origin = getBillingReturnOrigin(env)
  const pricingPath = getLocalizedPath(safeLocale, "/pricing/")
  return {
    returnUrl: `${origin}${pricingPath}?checkout=payg&paypal_return=1`,
    cancelUrl: `${origin}${pricingPath}?checkout=payg&paypal_cancel=1`,
  }
}
