import type { Metadata } from "next"
import Link from "next/link"
import { Fragment } from "react"
import { permanentRedirect } from "next/navigation"
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Crown,
  Layers,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
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
const tierThemes = {
  free: {
    icon: Layers,
    header: "bg-slate-950/80 text-slate-400",
    stickyHeader: "bg-slate-950/95 text-slate-400",
    cell: "bg-slate-950/20",
    mobile: "border-slate-700/70 bg-slate-900/40 opacity-90",
    check: "bg-slate-500/15 text-slate-400",
    columnBorder: "",
  },
  basic: {
    icon: Zap,
    header: "bg-sky-950/40 text-sky-100",
    stickyHeader: "bg-sky-950/95 text-sky-100",
    cell: "bg-sky-500/[0.03]",
    mobile: "border-sky-500/30 bg-sky-950/25",
    check: "bg-sky-500/15 text-sky-300",
    columnBorder: "",
  },
  pro: {
    icon: Crown,
    header:
      "relative bg-gradient-to-b from-violet-600/30 via-violet-950/50 to-violet-950/60 text-violet-50",
    stickyHeader:
      "bg-gradient-to-b from-violet-900/95 via-violet-950/95 to-violet-950/95 text-violet-50",
    cell: "bg-violet-500/[0.08]",
    mobile:
      "relative border-violet-400/50 bg-violet-950/45 shadow-md shadow-violet-950/40 ring-1 ring-violet-400/30",
    check: "bg-violet-400/20 text-violet-200",
    columnBorder: "border-x border-violet-400/25",
  },
} as const

const comparisonStickyHead =
  "sticky top-20 z-40 backdrop-blur-md shadow-[0_10px_28px_-18px_rgba(0,0,0,0.85)]"

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

const trustCards = [
  {
    icon: ShieldCheck,
    title: "Private by design",
    copy: "Audio processing stays in your browser. Files and filenames are not uploaded.",
    accent: "from-emerald-500/10 via-transparent to-transparent",
    iconWrap: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    border: "border-emerald-500/20",
  },
  {
    icon: LockKeyhole,
    title: "Secure payments",
    copy: "PayPal processes checkout and payment details; manage renewal from Geekskai.",
    accent: "from-sky-500/10 via-transparent to-transparent",
    iconWrap: "border-sky-400/25 bg-sky-500/10 text-sky-300",
    border: "border-sky-500/20",
  },
  {
    icon: ReceiptText,
    title: "Transparent pricing",
    copy: "Displayed USD prices are the final amount charged at checkout.",
    accent: "from-amber-500/10 via-transparent to-transparent",
    iconWrap: "border-amber-400/25 bg-amber-500/10 text-amber-300",
    border: "border-amber-500/20",
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

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400 sm:text-xs">
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      {children}
    </p>
  )
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-2 text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-tight text-white"
    >
      {children}
    </h2>
  )
}

function Value({ value, tier }: { value: ComparisonValue; tier: (typeof tiers)[number] }) {
  const theme = tierThemes[tier]
  if (typeof value === "string") {
    return (
      <span
        className={`text-sm ${tier === "pro" ? "font-semibold text-violet-100" : "text-slate-300"}`}
      >
        {value}
      </span>
    )
  }
  return value ? (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${theme.check}`}>
      <Check className="h-3.5 w-3.5" aria-label="Included" />
    </span>
  ) : (
    <span className="text-sm text-slate-600" aria-label="Not included">
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
      className="relative -mx-4 px-4 pb-16 sm:-mx-6 sm:px-6 sm:pb-20 xl:mx-0 xl:px-4 2xl:px-0"
      style={{ paddingTop: "clamp(1rem, 2vw, 2rem)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pricingStructuredData) }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.12),transparent)]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl">
        <PricingActions locale={locale} checkoutEnabled={checkoutEnabled} />

        <section className="mt-16 sm:mt-20" aria-labelledby="comparison-title">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Plan details</SectionEyebrow>
            <SectionTitle id="comparison-title">Compare every capability</SectionTitle>
            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Every plan keeps processing local. Upgrade only for larger batches, ZIP export, and
              faster support.
            </p>
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" aria-hidden />
              Pro is recommended for frequent set preparation
            </p>
          </div>

          <div className="relative mx-auto mt-6 hidden max-w-6xl lg:block">
            <div
              className="pointer-events-none absolute inset-y-3 right-0 -z-10 w-[26%] rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.14),transparent_70%)]"
              aria-hidden
            />
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 shadow-[0_20px_60px_-40px_rgba(124,58,237,0.45)]">
              <table className="w-full table-fixed border-collapse text-sm">
                <caption className="sr-only">Geekskai package feature comparison</caption>
                <colgroup>
                  <col className="w-[28%]" />
                  <col className="w-[24%]" />
                  <col className="w-[24%]" />
                  <col className="w-[24%]" />
                </colgroup>
                <thead className="[&_th]:border-b [&_th]:border-slate-800/80">
                  <tr>
                    <th
                      scope="col"
                      className={`${comparisonStickyHead} bg-slate-950/95 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500`}
                    >
                      Capability
                    </th>
                    {tiers.map((tier) => {
                      const TierIcon = tierThemes[tier].icon
                      const isPro = tier === "pro"
                      return (
                        <th
                          key={tier}
                          scope="col"
                          className={`${comparisonStickyHead} px-4 py-4 text-center ${tierThemes[tier].stickyHeader} ${tierThemes[tier].columnBorder} ${isPro ? "shadow-[inset_0_1px_0_rgba(167,139,250,0.35)]" : "border-l border-slate-800/80"}`}
                        >
                          <span className="flex flex-col items-center justify-center gap-1.5">
                            {isPro ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-100">
                                <Sparkles className="h-3 w-3" aria-hidden />
                                Recommended
                              </span>
                            ) : null}
                            <span className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold">
                              <TierIcon
                                className={`h-4 w-4 ${isPro ? "text-violet-200" : "opacity-80"}`}
                                aria-hidden
                              />
                              {tierLabels[tier]}
                            </span>
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {comparisonGroups.map((group) => (
                    <Fragment key={group.title}>
                      <tr className="border-t border-slate-800/60">
                        <th
                          colSpan={4}
                          scope="colgroup"
                          className="bg-slate-900/30 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                        >
                          {group.title}
                        </th>
                      </tr>
                      {group.rows.map((row) => (
                        <tr
                          key={row.label}
                          className="group/row border-t border-slate-800/50 transition-colors hover:bg-slate-900/20"
                        >
                          <th
                            scope="row"
                            className="px-5 py-3.5 text-left text-sm font-medium text-slate-200"
                          >
                            {row.label}
                          </th>
                          {tiers.map((tier) => {
                            const isPro = tier === "pro"
                            return (
                              <td
                                key={tier}
                                className={`px-4 py-3.5 text-center align-middle ${tierThemes[tier].cell} ${tierThemes[tier].columnBorder} ${isPro ? "border-l border-slate-800/50 group-hover/row:bg-violet-500/[0.11]" : "border-l border-slate-800/50"}`}
                              >
                                <Value value={row[tier]} tier={tier} />
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-3xl space-y-2.5 lg:hidden">
            {comparisonGroups.map((group, groupIndex) => (
              <details
                key={group.title}
                open={groupIndex === 0}
                className="group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/50"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-white marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/15 text-[10px] font-bold text-violet-300">
                      {groupIndex + 1}
                    </span>
                    {group.title}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-violet-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transform-none motion-reduce:transition-none" />
                </summary>
                <div className="border-t border-slate-800/80 px-4 pb-4 pt-3">
                  {group.rows.map((row, rowIndex) => (
                    <div
                      key={row.label}
                      className={`pt-3 ${rowIndex > 0 ? "mt-3 border-t border-slate-800/60" : ""}`}
                    >
                      <p className="text-sm font-medium text-slate-200">{row.label}</p>
                      <dl className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
                        {tiers.map((tier) => {
                          const isPro = tier === "pro"
                          return (
                            <div
                              key={tier}
                              className={`rounded-lg border px-2 py-2.5 ${tierThemes[tier].mobile}`}
                            >
                              <dt className="flex flex-col items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                {isPro ? (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-500/20 px-1.5 py-px text-[9px] text-violet-200">
                                    <Sparkles className="h-2.5 w-2.5" aria-hidden />
                                    Top pick
                                  </span>
                                ) : null}
                                {tierLabels[tier]}
                              </dt>
                              <dd className="mt-1 flex justify-center text-slate-200">
                                <Value value={row[tier]} tier={tier} />
                              </dd>
                            </div>
                          )
                        })}
                      </dl>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-20" aria-labelledby="assurances-title">
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>Built for trust</SectionEyebrow>
            <SectionTitle id="assurances-title">Clear terms, private processing</SectionTitle>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {trustCards.map(({ icon: Icon, title, copy, accent, iconWrap, border }) => (
              <div
                key={title}
                className={`relative overflow-hidden rounded-xl border ${border} bg-slate-950/50 p-4 sm:p-5`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`}
                  aria-hidden
                />
                <span
                  className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border ${iconWrap} sm:h-11 sm:w-11`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="relative mt-4">
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-3xl sm:mt-20" aria-labelledby="faq-title">
          <div className="text-center">
            <SectionEyebrow>Common questions</SectionEyebrow>
            <SectionTitle id="faq-title">Everything before you upgrade</SectionTitle>
          </div>
          <div className="mt-6 space-y-2">
            {faqs.map(({ question, answer }, index) => (
              <details
                key={question}
                className="group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/50 transition-[border-color] duration-200 open:border-violet-500/30"
              >
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 text-left marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold tabular-nums text-violet-300">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-white">{question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transform-none motion-reduce:transition-none" />
                </summary>
                <div className="border-l-2 border-t border-slate-800/80 border-l-violet-500/40 px-4 pb-4 pl-[3.25rem] pt-3 sm:px-5 sm:pl-[3.75rem]">
                  <p className="text-sm leading-6 text-slate-400">{answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="relative isolate mt-16 overflow-hidden rounded-2xl border border-violet-500/25 bg-slate-950/80 sm:mt-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.08),transparent_50%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent"
            aria-hidden
          />
          <div className="relative px-5 py-8 text-center sm:px-8 sm:py-12">
            <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-tight text-white">
              Prepare your next set locally.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Start with one file for free, then upgrade when you need larger batches and ZIP
              export.
            </p>
            <Link
              href="/audio-toolkit/"
              className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 text-sm font-semibold text-white transition-[opacity] duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none sm:min-h-12 sm:px-7 sm:text-base"
            >
              Open Audio Toolkit
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-slate-800/60 bg-slate-950/40 px-4 py-4 text-center text-xs leading-6 text-slate-500 sm:text-sm">
          <p>
            Displayed USD prices are final; no tax is added at checkout. No free trial or usage
            overages.
          </p>
          <p className="mt-1">
            By continuing, you agree to our{" "}
            <Link
              href="/terms/"
              className="inline-flex min-h-11 items-center text-violet-300 underline underline-offset-2 transition-colors hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy/"
              className="inline-flex min-h-11 items-center text-violet-300 underline underline-offset-2 transition-colors hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
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
