import type { Metadata } from "next"
import Link from "next/link"
import { permanentRedirect } from "next/navigation"
import { Check, ChevronDown, CircleHelp, LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react"
import siteMetadata from "@/data/siteMetadata"
import { PACKAGE_CATALOG } from "@/lib/billing/catalog"
import PricingActions from "./PricingActions"

const pricingDescription =
  "Compare Geekskai Free, Basic, and Pro plans for private, local-first audio preparation."
const checkoutEnabled =
  process.env.BILLING_CHECKOUT_ENABLED === "true" &&
  process.env.NEXT_PUBLIC_BILLING_CHECKOUT_ENABLED === "true"

export function generateMetadata(): Metadata {
  const canonical = `${siteMetadata.siteUrl}/pricing/`
  return {
    title: "Geekskai Audio Toolkit Pricing",
    description: pricingDescription,
    alternates: { canonical, languages: { "x-default": canonical, en: canonical } },
    openGraph: {
      title: "Geekskai Audio Toolkit Pricing",
      description: pricingDescription,
      url: canonical,
      type: "website",
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
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Geekskai Audio Toolkit",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Modern desktop web browsers",
  url: `${siteMetadata.siteUrl}/pricing/`,
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
      className="relative -mx-4 overflow-hidden px-4 pb-16 sm:-mx-6 sm:px-6 xl:mx-0 xl:px-4 2xl:px-0"
      style={{ paddingTop: "clamp(1.25rem, 2vw, 2.5rem)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerStructuredData) }}
      />
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[34rem] w-[70rem] -translate-x-1/2 rounded-full bg-violet-950/20 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <PricingActions locale={locale} />

        <section className="mt-16 sm:mt-20" aria-labelledby="comparison-title">
          <p className="text-xs font-bold uppercase tracking-[0.23em] text-violet-300">
            Decision ledger
          </p>
          <h2 id="comparison-title" className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Compare every capability
          </h2>

          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-800/80 lg:block">
            <table className="w-full table-fixed border-collapse text-sm">
              <caption className="sr-only">Geekskai package feature comparison</caption>
              <thead className="bg-slate-950/70 text-white">
                <tr>
                  <th scope="col" className="w-[28%] px-5 py-4 text-left">
                    Capability
                  </th>
                  {tiers.map((tier) => (
                    <th
                      key={tier}
                      scope="col"
                      className="border-l border-slate-800 px-4 py-4 text-center"
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
                        className="border-l border-slate-800/80 px-4 py-4 text-center align-middle"
                      >
                        <Value value={row[tier]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 lg:hidden">
            {comparisonGroups.map((group, groupIndex) => (
              <details
                key={group.title}
                open={groupIndex === 0}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40"
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
                      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
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

        <section
          className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-3"
          aria-label="Pricing assurances"
        >
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
            <div key={title} className="flex gap-4 bg-slate-950 p-6">
              <Icon className="h-8 w-8 shrink-0 text-violet-400" aria-hidden />
              <div>
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-2xl font-bold text-white">
            Frequently asked questions
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group border-b border-slate-800 bg-slate-950/40 last:border-b-0"
              >
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

        <section className="mt-12 rounded-2xl border border-violet-400/30 bg-violet-500/10 px-5 py-8 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-white">Prepare your next set locally.</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-300">
            Start with one file for free, then upgrade when you need larger batches and ZIP export.
          </p>
          <Link
            href="/audio-toolkit/"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-700 px-6 text-base font-bold text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Open Audio Toolkit
          </Link>
        </section>

        <div className="mt-8 text-center text-sm leading-6 text-slate-400">
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
