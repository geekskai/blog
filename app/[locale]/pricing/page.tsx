import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import Link from "next/link"
import { permanentRedirect } from "next/navigation"
import { ArrowRight, ChevronDown, LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react"
import siteMetadata from "@/data/siteMetadata"
import { CREDIT_CATALOG } from "@/lib/billing/catalog"
import { getPayPalConfig, isPayPalCheckoutConfigured } from "@/lib/billing/paypal"
import {
  audioCreditsEnabled,
  billingCheckoutEnabled,
  billingPublicCheckoutEnabled,
  billingSchemaV2Enabled,
} from "@/lib/billing/policy"
import { buildPageSchema, SEO_ENTITY_IDS, serializeJsonLd } from "@/lib/seo"
import PricingActions from "./PricingActions"

const pricingDescription =
  "Choose daily Free Credits, a one-time Credit pack, or a monthly Geekskai Audio Toolkit subscription."
const publicCheckoutEnabled =
  billingPublicCheckoutEnabled() && billingSchemaV2Enabled() && isPayPalCheckoutConfigured()

export function generateMetadata(): Metadata {
  const canonical = `${siteMetadata.siteUrl}/pricing/`
  const socialImage = `${siteMetadata.siteUrl}/pricing/opengraph-image`
  return {
    title: "Geekskai Audio Credits Pricing",
    description: pricingDescription,
    alternates: { canonical, languages: { "x-default": canonical, en: canonical } },
    openGraph: {
      title: "Geekskai Audio Credits Pricing",
      description: pricingDescription,
      url: canonical,
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Geekskai Audio Credits" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Geekskai Audio Credits Pricing",
      description: pricingDescription,
      images: [socialImage],
    },
  }
}

const offers = [
  {
    "@type": "Offer",
    name: "Free daily Audio Credits",
    price: 0,
    priceCurrency: "USD",
    category: "free",
  },
  {
    "@type": "Offer",
    name: "480 Audio Credits",
    price: CREDIT_CATALOG.payg480.price,
    priceCurrency: CREDIT_CATALOG.payg480.currency,
    category: "one-time purchase",
  },
  {
    "@type": "Offer",
    name: "Regular monthly Audio Credits",
    price: CREDIT_CATALOG.regularMonthly.price,
    priceCurrency: CREDIT_CATALOG.regularMonthly.currency,
    category: "subscription",
  },
].map((offer) => ({
  ...offer,
  availability:
    publicCheckoutEnabled || offer.price === 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
  url: `${siteMetadata.siteUrl}/pricing/`,
}))

const pricingPageSchema = buildPageSchema({
  url: `${siteMetadata.siteUrl}/pricing/`,
  name: "Geekskai Audio Credits Pricing",
  description: pricingDescription,
  breadcrumbs: [
    { name: "Home", url: `${siteMetadata.siteUrl}/` },
    { name: "Pricing", url: `${siteMetadata.siteUrl}/pricing/` },
  ],
})

const pricingStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...pricingPageSchema["@graph"],
    {
      "@type": "SoftwareApplication",
      "@id": `${siteMetadata.siteUrl}/audio-toolkit/#software`,
      name: "Geekskai Audio Toolkit",
      description: pricingDescription,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Modern desktop web browsers",
      url: `${siteMetadata.siteUrl}/pricing/`,
      provider: { "@id": SEO_ENTITY_IDS.organization },
      offers,
    },
  ],
}

const faqs = [
  {
    question: "How are Credits calculated?",
    answer:
      "Add the duration of every selected input file, then round the combined total up to the next minute. Two 30-second files cost 1 Credit.",
  },
  {
    question: "Which Credits are used first?",
    answer:
      "Daily Free Credits are used first, then monthly subscription Credits, then Pay As You Go Credits. The earliest-expiring grant is used first within each group.",
  },
  {
    question: "Do unused Credits roll over?",
    answer:
      "Daily Credits expire at the next 00:00 UTC. Subscription Credits expire at the end of their billing period and do not roll over. Pay As You Go Credits remain valid for 365 days.",
  },
  {
    question: "What happens when processing fails?",
    answer:
      "Failed or cancelled work consumes no Credits. If part of a batch succeeds, only the combined duration of successful files is charged.",
  },
  {
    question: "Can I request a refund?",
    answer:
      "A full refund may be requested within 14 days only when no Credits from that payment have been consumed. Contact support@geekskai.com.",
  },
]

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ userId }, { locale }] = await Promise.all([auth(), params])
  if (locale !== "en") permanentRedirect("/pricing/")
  const checkoutEnabled =
    billingCheckoutEnabled(userId) &&
    audioCreditsEnabled() &&
    billingSchemaV2Enabled() &&
    isPayPalCheckoutConfigured()
  const config = checkoutEnabled ? getPayPalConfig() : null

  return (
    <div className="relative -mx-4 px-4 pb-16 pt-5 sm:-mx-6 sm:px-6 sm:pb-20 xl:mx-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pricingStructuredData) }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_75%_55%_at_50%_-10%,rgba(124,58,237,0.16),transparent)]" />
      <PricingActions
        locale={locale}
        checkoutEnabled={checkoutEnabled}
        clientId={config?.clientId ?? null}
        environment={process.env.PAYPAL_ENVIRONMENT === "live" ? "production" : "sandbox"}
      />

      <section className="mx-auto mt-16 max-w-6xl" aria-labelledby="credit-rules-title">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            One balance
          </p>
          <h2 id="credit-rules-title" className="mt-2 text-3xl font-bold text-white">
            Simple rules, visible before processing
          </h2>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Private by design",
              copy: "Audio and filenames stay on your device. Only duration totals and Credit operations reach Geekskai.",
            },
            {
              icon: ReceiptText,
              title: "Predictable cost",
              copy: "The Audio Toolkit displays the exact reserved Credits before starting each local batch.",
            },
            {
              icon: LockKeyhole,
              title: "Verified payments",
              copy: "PayPal processes payment details. Credits are issued only after a verified capture or recurring payment.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-950/55 p-5"
            >
              <Icon className="h-6 w-6 text-violet-300" aria-hidden />
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-center text-3xl font-bold text-white">
          Audio Credit FAQ
        </h2>
        <div className="mt-6 space-y-3">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-xl border border-slate-800 bg-slate-950/55"
            >
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-5 py-3 text-sm font-semibold text-white">
                <span className="flex-1">{question}</span>
                <ChevronDown className="h-4 w-4 text-violet-300 transition-transform group-open:rotate-180" />
              </summary>
              <p className="border-t border-slate-800 px-5 py-4 text-sm leading-6 text-slate-400">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl rounded-2xl border border-violet-500/30 bg-violet-950/20 px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-white">See the cost before you process.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Sign in for 30 daily Credits. No payment details required.
        </p>
        <Link
          href="/audio-toolkit/"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Open Audio Toolkit <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </div>
  )
}
