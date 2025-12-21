"use client"

import { formatDistanceToNow } from "date-fns"
import React from "react"

// Content Freshness Badge Component
export function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24))
  const isFresh = daysSinceUpdate < 90

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm ${
        isFresh ? "text-emerald-300" : "text-orange-300"
      }`}
    >
      <span className="text-lg">{isFresh ? "✓" : "⚠"}</span>
      <span className="text-sm font-semibold">
        {isFresh
          ? `Updated ${formatDistanceToNow(lastModified, { addSuffix: true })}`
          : `Last updated ${formatDistanceToNow(lastModified, { addSuffix: true })}`}
      </span>
    </div>
  )
}

// Core Facts Section Component
export function CoreFactsSection() {
  return (
    <section className="mb-12" itemScope itemType="https://schema.org/Product">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <h2 className="mb-8 text-3xl font-bold text-white">Core Information</h2>
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <dt className="mb-3 text-sm font-semibold text-emerald-300">Pricing</dt>
            <dd className="text-lg text-white">
              <strong className="text-emerald-400">100% Free</strong> - No registration required
            </dd>
            <meta itemProp="price" content="0" />
            <meta itemProp="priceCurrency" content="USD" />
          </div>

          <div
            itemProp="featureList"
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <dt className="mb-3 text-sm font-semibold text-purple-300">Supported Formats</dt>
            <dd className="text-lg text-white">
              <strong className="text-purple-400">WAV</strong> and{" "}
              <strong className="text-pink-400">MP3</strong> output formats
            </dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-blue-300">Processing Speed</dt>
            <dd className="text-lg text-white">
              <strong className="text-blue-400">Less than 30 seconds</strong> for most tracks
            </dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-cyan-300">Target Users</dt>
            <dd className="text-lg text-white">
              <strong className="text-cyan-400">Musicians</strong>,{" "}
              <strong className="text-purple-400">DJs</strong>,{" "}
              <strong className="text-pink-400">Content Creators</strong>, and{" "}
              <strong className="text-blue-400">Audio Enthusiasts</strong>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

// FAQ Section Component
export function FAQSection() {
  const faqs = [
    {
      question: "Is the SoundCloud to WAV converter free?",
      answer:
        "Yes, our <strong>SoundCloud to WAV converter</strong> is <strong>100% free</strong> to use. No registration, no payment, and <strong>unlimited conversions</strong>.",
    },
    {
      question: "What audio formats are supported?",
      answer:
        "Our converter supports <strong>WAV (lossless)</strong> and <strong>MP3 (compressed)</strong> output formats. You can choose either format before downloading.",
    },
    {
      question: "How long does conversion take?",
      answer:
        "Most SoundCloud tracks convert and download in <strong>under 30 seconds</strong>. The time depends on track length and your internet connection speed.",
    },
    {
      question: "Can I download any SoundCloud track?",
      answer:
        "You can download tracks that are <strong>publicly available</strong> on SoundCloud. Private tracks or tracks with download restrictions may not be accessible.",
    },
    {
      question: "What is the difference between WAV and MP3 format?",
      answer:
        "<strong>WAV</strong> is a <strong>lossless audio format</strong> that preserves original quality but creates larger files (10-50MB per track). <strong>MP3</strong> is a compressed format with smaller file sizes (3-8MB per track) while maintaining good quality at 320kbps. Choose WAV for professional editing and MP3 for casual listening.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No, you don't need to create an account or register. Our <strong>SoundCloud to WAV converter</strong> works instantly without any sign-up process.",
    },
  ]

  return (
    <section className="mb-12" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">Frequently Asked Questions</h2>
      <div className="mx-auto max-w-4xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            itemProp="mainEntity"
            itemScope
            itemType="https://schema.org/Question"
          >
            <h3 className="mb-3 text-xl font-semibold text-white" itemProp="name">
              {faq.question}
            </h3>
            <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
              <p
                className="prose prose-sm max-w-none text-slate-300 prose-strong:text-purple-300"
                itemProp="text"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// How-to Guide Section
export function HowToSection() {
  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">How to Convert SoundCloud to WAV</h2>
      <div className="mx-auto max-w-4xl">
        <ol className="list-inside list-decimal space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <li className="text-lg text-slate-300">
            <strong className="text-purple-300">Copy the SoundCloud URL</strong> from the track you
            want to download
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-pink-300">Paste the URL</strong> into our converter tool above
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-blue-300">Click "Get Info"</strong> to preview track information
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-cyan-300">Select format</strong> (WAV or MP3) from the dropdown
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-emerald-300">Click "Download"</strong> to start the conversion
            and download
          </li>
        </ol>
      </div>
    </section>
  )
}

// Format Comparison Section
export function FormatComparisonSection() {
  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">WAV vs MP3 Format Comparison</h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-2xl font-bold text-white">WAV Format</h3>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>
                <strong className="text-blue-300">Lossless audio quality</strong> - No compression
              </li>
              <li>
                <strong className="text-blue-300">Larger file sizes</strong> - Typically 10-50MB per
                track
              </li>
              <li>
                <strong className="text-blue-300">Best for</strong> - Professional audio editing and
                production
              </li>
              <li>
                <strong className="text-blue-300">Sample rate</strong> - Preserves original quality
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-2xl font-bold text-white">MP3 Format</h3>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>
                <strong className="text-purple-300">Compressed audio</strong> - Smaller file sizes
              </li>
              <li>
                <strong className="text-purple-300">File size</strong> - Typically 3-8MB per track
              </li>
              <li>
                <strong className="text-purple-300">Best for</strong> - Mobile devices and casual
                listening
              </li>
              <li>
                <strong className="text-purple-300">Bitrate</strong> - High quality at 320kbps
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Use Cases Section
export function UseCasesSection() {
  const useCases = [
    {
      title: "DJs and Music Producers",
      description:
        "Download tracks for <strong>mixing, remixing, and creating mashups</strong>. Perfect for DJ sets and music production workflows.",
      keywords: ["DJ", "music production", "remixing"],
    },
    {
      title: "Content Creators",
      description:
        "Extract audio for <strong>YouTube videos, podcasts, and social media content</strong>. Use SoundCloud tracks as background music or sound effects.",
      keywords: ["content creation", "YouTube", "podcasts"],
    },
    {
      title: "Audio Enthusiasts",
      description:
        "Build <strong>offline music libraries</strong> in high-quality formats. Download your favorite SoundCloud tracks for personal listening.",
      keywords: ["offline listening", "music library", "audio quality"],
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">Who Uses SoundCloud to WAV Converter?</h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <h3 className="mb-3 text-xl font-bold text-white">{useCase.title}</h3>
              <p
                className="prose prose-sm max-w-none text-slate-300 prose-strong:text-purple-300"
                dangerouslySetInnerHTML={{ __html: useCase.description }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Key Features Section
export function KeyFeaturesSection() {
  const features = [
    {
      title: "Free & Unlimited",
      description: "No cost, no registration, <strong>unlimited conversions</strong>",
      keyword: "free SoundCloud downloader",
    },
    {
      title: "High Quality Output",
      description: "Download tracks in <strong>WAV or MP3 format</strong> with original quality",
      keyword: "high quality audio download",
    },
    {
      title: "Fast Processing",
      description: "Convert and download tracks in <strong>under 30 seconds</strong>",
      keyword: "fast SoundCloud converter",
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">Key Features</h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <h3 className="mb-3 text-xl font-bold text-white">
                <strong>{feature.title}</strong>
              </h3>
              <p
                className="prose prose-sm max-w-none text-slate-300 prose-strong:text-purple-300"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
