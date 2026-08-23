import type { Metadata } from "next"
import Link from "next/link"
import { permanentRedirect } from "next/navigation"
import { Check, ChevronDown, CircleHelp, LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react"
import siteMetadata from "@/data/siteMetadata"
import { PACKAGE_CATALOG } from "@/lib/billing/catalog"
import { isPayPalCheckoutConfigured } from "@/lib/billing/paypal"
import { buildPageSchema, SEO_ENTITY_IDS, serializeJsonLd } from "@/lib/seo"
import PricingActions from "./PricingActions"

const pricingDescription =
  "Compare Geekskai Free, Basic, and Pro plans for private, local-first audio preparation."
const checkoutEnabled =
  process.env.BILLING_CHECKOUT_ENABLED === "true" &&
  process.env.NEXT_PUBLIC_BILLING_CHECKOUT_ENABLED === "true" &&
  isPayPalCheckoutConfigured()

export function generateMetadata(): Metadata {
  const canonical = `${siteMetadata.siteUrl}/pricing/`
  const socialImage = `${siteMetadata.siteUrl}/pricing/opengraph-image`
  return {
    title: "Geekskai Audio Toolkit Pricing",
    description: pricingDescription,
    alternates: { canonical, languages: { "x-default": canonical, en: canonical } },
    openGraph: {
      title: "Geekskai Audio Toolkit Pricing",
      description: pricingDescription,
      url: canonical,
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "Geekskai Audio Toolkit pricing plans",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Geekskai Audio Toolkit Pricing",
      description: pricingDescription,
      images: [socialImage],
    },
  }
}

type ComparisonValue = string | boolean
type ComparisonRow = {
  label: string
  free: ComparisonValue
  basic: ComparisonValue
  pro: ComparisonValue
}

const comparisonRows: ComparisonRow[] = [
  {
    label: "Files per local batch",
    free: "1",
    basic: "Up to 20",
    pro: "Up to 50",
  },
  {
    label: "Supported input",
    free: "MP3, WAV, FLAC, M4A",
    basic: "MP3, WAV, FLAC, M4A",
    pro: "MP3, WAV, FLAC, M4A",
  },
  {
    label: "Output quality",
    free: "MP3 320kbps or WAV 16/24-bit",
    basic: "MP3 320kbps or WAV 16/24-bit",
    pro: "MP3 320kbps or WAV 16/24-bit",
  },
  { label: "Two-pass LUFS normalization", free: true, basic: true, pro: true },
  {
    label: "Sequential error-isolated queue",
    free: false,
    basic: true,
    pro: true,
  },
  { label: "ZIP export", free: false, basic: true, pro: true },
  {
    label: "Per-file size limit",
    free: "200MB",
    basic: "200MB",
    pro: "200MB",
  },
  {
    label: "Batch total size limit",
    free: "200MB",
    basic: "500MB",
    pro: "500MB",
  },
  {
    label: "Support",
    free: "Documentation / community",
    basic: "Email · within 2 business days",
    pro: "Priority · within 1 business day",
  },
]

const tiers = ["free", "basic", "pro"] as const
const tierLabels = { free: "Free", basic: "Basic", pro: "Pro" }
const comparisonGroups = [
  { title: "Audio processing", rows: comparisonRows.slice(0, 4) },
  { title: "Batch workflow", rows: comparisonRows.slice(4, 8) },
  { title: "Support", rows: comparisonRows.slice(8) },
]

const faqs = [
  {
    question: "Can I cancel my plan?",
    answer:
      "Yes. Cancel from your billing account at any time. Access remains active until the end of the current billing period.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "Each account's first successful subscription payment has one 14-day full-refund window. Renewals and upgrade charges do not start a new window.",
  },
  {
    question: "Are paid downloader limits included?",
    answer:
      "No. These subscriptions cover local Audio Toolkit features only. Public third-party downloader allowances are separate free-product rules and do not change with your plan.",
  },
  {
    question: "Which browsers and file sizes are supported?",
    answer:
      "Desktop Chrome and Edge are supported. Safari is Beta. Mobile is limited to single-file attempts and does not support batch processing. Files are limited to 200MB each and paid desktop batches to 500MB total.",
  },
]

const offerStructuredData = {
  "@type": "SoftwareApplication",
  "@id": `${siteMetadata.siteUrl}/audio-toolkit/#software`,
  name: "Geekskai Audio Toolkit",
  description: pricingDescription,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Modern desktop web browsers",
  url: `${siteMetadata.siteUrl}/pricing/`,
  image: `${siteMetadata.siteUrl}/pricing/opengraph-image`,
  provider: { "@id": SEO_ENTITY_IDS.organization },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: PACKAGE_CATALOG.free.monthlyPrice,
      priceCurrency: "USD",
      category: "free",
      availability: "https://schema.org/InStock",
      url: `${siteMetadata.siteUrl}/pricing/`,
    },
    ...(["basic", "pro"] as const).flatMap((tier) =>
      (["monthly", "annual"] as const).map((interval) => ({
        "@type": "Offer",
        name: `${tier === "basic" ? "Basic" : "Pro"} ${interval}`,
        price:
          interval === "monthly"
            ? PACKAGE_CATALOG[tier].monthlyPrice
            : PACKAGE_CATALOG[tier].annualPrice,
        priceCurrency: "USD",
        category: "subscription",
        availability: checkoutEnabled
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: `${siteMetadata.siteUrl}/pricing/`,
      }))
    ),
  ],
}

const pricingPageStructuredData = buildPageSchema({
  url: `${siteMetadata.siteUrl}/pricing/`,
  name: "Geekskai Audio Toolkit Pricing",
  description: pricingDescription,
  breadcrumbs: [
    { name: "Home", url: `${siteMetadata.siteUrl}/` },
    { name: "Pricing", url: `${siteMetadata.siteUrl}/pricing/` },
  ],
})

const pricingStructuredData = {
  "@context": "https://schema.org",
  "@graph": [...pricingPageStructuredData["@graph"], offerStructuredData],
}

function Value({ value }: { value: ComparisonValue }) {
  if (typeof value === "string") return <span>{value}</span>
  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
      <Check className="h-4 w-4" aria-label="Included" />
    </span>
  ) : (
    <span className="text-slate-400" aria-label="Not included">
      —
    </span>
  )
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "en") permanentRedirect("/pricing/")

  return (
    <div
      lang="en"
      className="relative -mx-4 overflow-hidden px-4 pb-20 sm:-mx-6 sm:px-6 sm:pb-24 xl:mx-0 xl:px-4 2xl:px-0"
      style={{ paddingTop: "clamp(1.25rem, 2vw, 2.5rem)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pricingStructuredData) }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[72rem] -translate-x-1/2 rounded-full bg-violet-900/15 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <PricingActions locale={locale} checkoutEnabled={checkoutEnabled} />

        <section className="mt-20 sm:mt-24" aria-labelledby="comparison-title">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.23em] text-violet-300">
              Plan details
            </p>
            <h2
              id="comparison-title"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Compare every capability
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Every plan keeps processing local. Upgrade only for larger batches, ZIP export, and
              faster support.
            </p>
          </div>

          <div className="mx-auto mt-8 hidden max-w-6xl overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/45 shadow-[0_24px_70px_-52px_rgba(124,58,237,0.9)] lg:block">
            <table className="w-full table-fixed border-collapse text-sm">
              <caption className="sr-only">Geekskai package feature comparison</caption>
              <thead className="bg-slate-950/90 text-white">
                <tr>
                  <th scope="col" className="w-[28%] px-5 py-4 text-left">
                    Capability
                  </th>
                  {tiers.map((tier) => (
                    <th
                      key={tier}
                      scope="col"
                      className={`border-l border-slate-800 px-4 py-4 text-center ${tier === "pro" ? "bg-violet-500/10 text-violet-100" : ""}`}
                    >
                      {tierLabels[tier]}
                      {tier === "pro" ? <span className="ml-2 text-violet-400">✓</span> : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-slate-950/35 text-slate-300">
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-800/80">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-slate-200">
                      {row.label}
                    </th>
                    {tiers.map((tier) => (
                      <td
                        key={tier}
                        className={`border-l border-slate-800/80 px-4 py-4 text-center align-middle ${tier === "pro" ? "bg-violet-500/[0.04]" : ""}`}
                      >
                        <Value value={row[tier]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3 lg:hidden">
            {comparisonGroups.map((group, groupIndex) => (
              <details
                key={group.title}
                open={groupIndex === 0}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60"
              >
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-semibold text-white marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-300 [&::-webkit-details-marker]:hidden">
                  <span>{group.title}</span>
                  <ChevronDown className="h-5 w-5 text-violet-300 transition-transform duration-200 group-open:rotate-180 motion-reduce:transform-none motion-reduce:transition-none" />
                </summary>
                <div className="border-t border-slate-800 px-5 pb-5">
                  {group.rows.map((row, rowIndex) => (
                    <div
                      key={row.label}
                      className="border-t border-slate-800/70 pt-4 first:border-0"
                    >
                      <p className="text-sm font-semibold text-slate-200">{row.label}</p>
                      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                        {tiers.map((tier) => (
                          <div
                            key={tier}
                            className={`rounded-xl border p-3 ${tier === "pro" ? "border-violet-400/50 bg-violet-500/10" : "border-slate-800 bg-slate-950/55"}`}
                          >
                            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              {tierLabels[tier]}
                            </dt>
                            <dd className="mt-1 text-slate-200">
                              <Value value={row[tier]} />
                            </dd>
                          </div>
                        ))}
                      </dl>
                      {rowIndex < group.rows.length - 1 ? <div className="h-4" /> : null}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 sm:mt-24" aria-labelledby="assurances-title">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.23em] text-violet-300">
              Built for trust
            </p>
            <h2
              id="assurances-title"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Clear terms, private processing
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Private by design",
                copy: "Audio processing stays in your browser. Files and filenames are not uploaded.",
              },
              {
                icon: LockKeyhole,
                title: "Secure payments",
                copy: "PayPal processes checkout and payment details; manage renewal from Geekskai.",
              },
              {
                icon: ReceiptText,
                title: "Transparent pricing",
                copy: "Displayed USD prices are the final amount charged at checkout.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                  <Icon className="h-5 w-5 text-violet-300" aria-hidden />
                </span>
                <div>
                  <h3 className="mt-5 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-4xl sm:mt-24" aria-labelledby="faq-title">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.23em] text-violet-300">
              Common questions
            </p>
            <h2
              id="faq-title"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Everything before you upgrade
            </h2>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="group border-b border-slate-800 last:border-b-0">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 text-left marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-300 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <CircleHelp className="h-5 w-5 shrink-0 text-violet-400" aria-hidden />
                  <span className="flex-1 text-sm font-semibold text-white">{question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transform-none motion-reduce:transition-none" />
                </summary>
                <p className="px-12 pb-5 text-sm leading-6 text-slate-400">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="relative isolate mt-20 overflow-hidden rounded-3xl border border-violet-400/30 bg-[linear-gradient(135deg,rgba(76,29,149,0.3),rgba(88,28,135,0.16),rgba(15,23,42,0.8))] px-5 py-10 text-center shadow-[0_30px_90px_-55px_rgba(168,85,247,0.95)] sm:mt-24 sm:px-8 sm:py-14">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Prepare your next set locally.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-300">
            Start with one file for free, then upgrade when you need larger batches and ZIP export.
          </p>
          <Link
            href="/audio-toolkit/"
            className="mt-7 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-violet-600 px-7 text-base font-bold text-white shadow-[0_18px_40px_-20px_rgba(167,139,250,0.95)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Open Audio Toolkit
          </Link>
        </section>

        <div className="mt-8 text-center text-sm leading-6 text-slate-500">
          <p>
            Displayed USD prices are final; no tax is added at checkout. No free trial or usage
            overages.
          </p>
          <p>
            By continuing, you agree to our{" "}
            <Link
              href="/terms/"
              className="inline-flex min-h-11 items-center text-violet-200 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy/"
              className="inline-flex min-h-11 items-center text-violet-200 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
