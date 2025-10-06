import { Metadata } from "next"

export const metadata: Metadata = {
  title: "BPM to MS Converter | Free Online Beat Timing Calculator",
  description:
    "Professional BPM to milliseconds converter for music producers, DJs, and audio engineers. Convert beats per minute to delay times, LFO rates, and sync parameters instantly. Supports quarter notes, eighth notes, sixteenth notes, dotted notes, and triplets.",
  keywords: [
    "BPM to ms converter",
    "ms to BPM",
    "delay time calculator",
    "LFO sync calculator",
    "beat timing converter",
  ],
  openGraph: {
    title: "BPM ↔︎ MS Converter - Professional Music Timing Calculator",
    description:
      "Convert BPM to milliseconds and vice versa. Perfect for setting delay times, LFO rates, and sync parameters in your DAW. Supports all note values including dotted notes and triplets.",
    type: "website",
    url: "https://geekskai.com/tools/bpm-ms-converter",
    images: [
      {
        url: "/static/images/tools/bpm-ms-converter-og.png",
        width: 1200,
        height: 630,
        alt: "BPM to MS Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BPM ↔︎ MS Converter - Professional Music Timing Calculator",
    description:
      "Convert BPM to milliseconds and vice versa. Perfect for setting delay times, LFO rates, and sync parameters in your DAW.",
    images: ["/static/images/tools/bpm-ms-converter-twitter.png"],
  },
  alternates: {
    canonical: "https://geekskai.com/tools/bpm-ms-converter",
  },
  other: {
    "application-name": "GeeksKai BPM MS Converter",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BPM to MS Converter",
  description:
    "Professional BPM to milliseconds converter for music producers, DJs, and audio engineers. Convert beats per minute to delay times and sync parameters.",
  url: "https://geekskai.com/tools/bpm-ms-converter",
  applicationCategory: "MusicApplication",
  operatingSystem: "Any",
  permissions: "browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "BPM to milliseconds conversion",
    "Milliseconds to BPM conversion",
    "Quarter note timing",
    "Eighth note timing",
    "Sixteenth note timing",
    "Dotted note timing",
    "Triplet timing",
    "One-click copy results",
    "Real-time conversion",
    "Mobile responsive design",
  ],
  creator: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}
