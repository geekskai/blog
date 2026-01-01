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
    <section className="mb-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <h2 className="mb-8 text-3xl font-bold text-white">Core Facts</h2>
        <dl className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-emerald-300">Pricing</dt>
            <dd className="text-lg text-white">100% Free Forever</dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-purple-300">Supported Formats</dt>
            <dd className="text-lg text-white">MP3 & WAV</dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-blue-300">Processing Speed</dt>
            <dd className="text-lg text-white">Fast Batch Downloads</dd>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <dt className="mb-3 text-sm font-semibold text-cyan-300">Target Users</dt>
            <dd className="text-lg text-white">
              <strong className="text-cyan-400">DJs</strong>,{" "}
              <strong className="text-purple-400">Music Producers</strong>,{" "}
              <strong className="text-pink-400">Content Creators</strong>,{" "}
              <strong className="text-blue-400">Music Enthusiasts</strong>
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
      question: "How do I download a SoundCloud playlist?",
      answer:
        "Simply paste the SoundCloud playlist URL into the input field, click 'Fetch Playlist' to load all tracks, then click 'Download All' to batch download the entire playlist in your preferred format (MP3 or WAV).",
    },
    {
      question: "Is the SoundCloud playlist downloader free?",
      answer:
        "Yes, our SoundCloud playlist downloader is completely free with no registration required. You can download unlimited playlists without any cost.",
    },
    {
      question: "What formats can I download SoundCloud playlists in?",
      answer:
        "You can download SoundCloud playlists in both MP3 and WAV formats. MP3 is ideal for smaller file sizes, while WAV provides uncompressed audio quality.",
    },
    {
      question: "Can I download individual tracks from a playlist?",
      answer:
        "Yes, you can download individual tracks from a playlist. After fetching the playlist, each track will have its own download button, allowing you to download tracks one at a time if preferred.",
    },
    {
      question: "How fast is the SoundCloud playlist downloader?",
      answer:
        "The download speed depends on your internet connection and the playlist size. Our tool processes tracks sequentially to ensure stability, with progress tracking for each download.",
    },
    {
      question: "Is it legal to download SoundCloud playlists?",
      answer:
        "Downloading is only legal if you have permission from the copyright holder or if the tracks are available for free download. Always respect copyright laws and only download content you have rights to use.",
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">Frequently Asked Questions</h2>
      <div className="mx-auto max-w-4xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            <h3 className="mb-3 text-xl font-semibold text-white">{faq.question}</h3>
            <p className="prose prose-sm max-w-none text-slate-300 prose-strong:text-purple-300">
              {faq.answer}
            </p>
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
      <h2 className="mb-8 text-3xl font-bold text-white">How to Download SoundCloud Playlists</h2>
      <div className="mx-auto max-w-4xl">
        <ol className="list-inside list-decimal space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <li className="text-lg text-slate-300">
            <strong className="text-purple-300">Copy the playlist URL</strong> from SoundCloud. Make
            sure it's a public playlist URL (format: soundcloud.com/username/sets/playlist-name).
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-pink-300">Paste the URL</strong> into the input field on our
            SoundCloud playlist downloader tool.
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-blue-300">Click 'Fetch Playlist'</strong> to load all tracks
            from the playlist. The tool will display all available tracks with their artwork and
            details.
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-cyan-300">Choose your format</strong> - Select MP3 for smaller
            file sizes or WAV for uncompressed audio quality.
          </li>
          <li className="text-lg text-slate-300">
            <strong className="text-emerald-300">Download all tracks</strong> by clicking 'Download
            All' for batch download, or download individual tracks using each track's download
            button.
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
      <h2 className="mb-8 text-3xl font-bold text-white">MP3 vs WAV Format Comparison</h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-2xl font-bold text-white">WAV Format</h3>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>
                <strong className="text-blue-300">Uncompressed audio quality</strong> - Perfect for
                professional use
              </li>
              <li>
                <strong className="text-blue-300">Larger file sizes</strong> - Typically 10x larger
                than MP3
              </li>
              <li>
                <strong className="text-blue-300">Best for editing</strong> - Ideal for music
                production and remixing
              </li>
              <li>
                <strong className="text-blue-300">CD-quality audio</strong> - 44.1kHz sample rate
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-2xl font-bold text-white">MP3 Format</h3>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>
                <strong className="text-purple-300">Compressed audio</strong> - Smaller file sizes
                for storage
              </li>
              <li>
                <strong className="text-purple-300">Universal compatibility</strong> - Works on all
                devices and players
              </li>
              <li>
                <strong className="text-purple-300">Faster downloads</strong> - Quick transfer times
              </li>
              <li>
                <strong className="text-purple-300">Good quality</strong> - 320kbps bitrate
                available
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
        "Download entire <strong>SoundCloud playlists</strong> for DJ sets and music production. Batch download multiple tracks at once to build your music library quickly.",
    },
    {
      title: "Content Creators",
      description:
        "Download <strong>SoundCloud playlists</strong> for background music in videos, podcasts, and other content. Choose MP3 for smaller file sizes or WAV for high-quality audio.",
    },
    {
      title: "Music Enthusiasts",
      description:
        "Save your favorite <strong>SoundCloud playlists</strong> offline. Download entire playlists in your preferred format to enjoy music without internet connection.",
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="mb-8 text-3xl font-bold text-white">
        Who Uses SoundCloud Playlist Downloader?
      </h2>
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
      title: "Batch Download Entire Playlists",
      description:
        "Download <strong>entire SoundCloud playlists</strong> with one click. No need to download tracks individually - our tool handles batch downloads efficiently.",
    },
    {
      title: "Individual Track Downloads",
      description:
        "Choose to download <strong>individual tracks</strong> from playlists. Each track has its own download button for selective downloading.",
    },
    {
      title: "Multiple Format Support",
      description:
        "Download playlists in <strong>MP3 or WAV format</strong>. Choose the format that best suits your needs - MP3 for smaller files or WAV for uncompressed quality.",
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
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
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
