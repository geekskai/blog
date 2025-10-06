import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chromakopia Name Generator - Create Your St. Chroma Persona | Free Tool",
  description:
    "Generate unique Chromakopia-inspired names and personas with our free online tool. Create colorful alter egos inspired by Tyler, the Creator's Chromakopia album. Perfect for creative projects and self-expression.",
  keywords: [
    "chromakopia",
    "name generator",
    "tyler the creator",
    "st chroma",
    "persona generator",
    "chromakopia names",
  ],
  openGraph: {
    title: "Chromakopia Name Generator - Create Your Colorful Persona",
    description:
      "Unleash your creativity with our Chromakopia name generator. Create unique personas inspired by Tyler, the Creator's artistic vision of bringing color back to life.",
    type: "website",
    images: [
      {
        url: "/static/images/chromakopia-name-generator.png",
        width: 1200,
        height: 630,
        alt: "Chromakopia Name Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chromakopia Name Generator - Free Creative Tool",
    description: "Generate unique Chromakopia-inspired names and colorful personas instantly.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/chromakopia-name-generator/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Chromakopia Name Generator",
  description:
    "Creative name generator inspired by Tyler, the Creator's Chromakopia album. Generate unique personas, colorful alter egos, and artistic names that embody the spirit of bringing color back to life.",
  url: "https://geekskai.com/tools/chromakopia-name-generator",
  applicationCategory: "Entertainment",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate Chromakopia-inspired names",
    "Create colorful persona descriptions",
    "Multiple name generation styles",
    "Color-themed character traits",
    "St. Chroma alter ego inspiration",
    "Creative writing prompts",
    "Share generated names",
    "No registration required",
    "Mobile-friendly interface",
    "Instant name generation",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "chromakopia, name generator, tyler the creator, st chroma, persona, creativity, music inspiration",
  educationalUse:
    "Creative Writing, Character Development, Artistic Expression, Music-Inspired Creativity",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  )
}
