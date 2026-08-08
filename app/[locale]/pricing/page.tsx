import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Geekskai DJ Workspace Pro Pricing",
  description: "Compare free single-file audio preparation with Pro batch processing and ZIP export.",
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const prefix = locale === "en" ? "" : `/${locale}`
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 text-white">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">Local-first DJ audio preparation</p>
        <h1 className="mt-3 text-4xl font-bold">Geekskai DJ Workspace Pro</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Process audio you own directly in your browser. No audio uploads, no paid downloader access, and no card-required trial.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold">Free</h2><p className="mt-3 text-3xl font-bold">$0</p><ul className="mt-6 space-y-3 text-sm text-slate-300"><li>1 file per batch</li><li>MP3, WAV, FLAC, M4A input</li><li>MP3 320kbps or WAV output</li><li>Two-pass LUFS normalization</li></ul></article>
        <article className="rounded-2xl border border-purple-500/50 bg-purple-500/10 p-6"><h2 className="text-xl font-semibold">Pro monthly</h2><p className="mt-3 text-3xl font-bold">$7.99<span className="text-base font-normal text-slate-400">/month</span></p><ul className="mt-6 space-y-3 text-sm text-slate-200"><li>Up to 20 files per batch</li><li>Sequential error-isolated queue</li><li>ZIP export</li><li>Cancel at period end</li></ul></article>
        <article className="rounded-2xl border border-blue-500/50 bg-blue-500/10 p-6"><h2 className="text-xl font-semibold">Pro annual</h2><p className="mt-3 text-3xl font-bold">$59<span className="text-base font-normal text-slate-400">/year</span></p><p className="mt-2 text-sm text-blue-200">First 50 customers: use FOUNDING49 for a $49 first year.</p><ul className="mt-6 space-y-3 text-sm text-slate-200"><li>Everything in Pro monthly</li><li>Lower effective monthly price</li><li>14-day first-payment refund</li></ul></article>
      </div>
      <div className="mt-10 text-center"><Link href={`${prefix}/workspace/`} className="inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500">Open workspace and choose a plan</Link><p className="mt-4 text-xs text-slate-500">Prices include applicable indirect tax where supported by Creem. Files remain on your device.</p></div>
    </main>
  )
}
