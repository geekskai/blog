import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tip Screen Generator - Create iPhone/iPad POS Tip Screens Free | Meme Tool",
  description:
    "Free tip screen generator for iPhone, iPad, and Android. Create realistic POS tip screens, satirical tipping interfaces, and viral memes. No app download required - works in browser.",
  keywords: [
    "tip screen generator",
    "tip screen",
    "tip screen simulator",
    "tip screen app free",
    "tip screen image iphone",
    "tip screen for phone",
    "tip screen app android",
    "tip screen 100%",
    "leave a tip screen meme",
    "tipping screen meme",
    "pos tip screen",
    "fake tip screen",
    "tip screen parody",
    "pos interface mockup",
    "tip guilt simulator",
    "fake payment screen",
    "satirical tip screen",
    "dark pattern generator",
    "manipulative ux",
    "forced tipping simulator",
    "tip screen meme generator",
    "dark ux patterns",
    "satirical pos",
    "tip screen comedy",
    "ux design parody",
    "tipping culture meme",
  ],
  openGraph: {
    title: "Tip Screen Generator - Create Realistic POS Tip Screens for Memes",
    description:
      "Generate realistic tip screens for iPhone, iPad, and Android. Create viral memes and educational content about tipping culture. Free online tool - no app download required.",
    type: "website",
    images: [
      {
        url: "/static/images/tip-screen-generator.png",
        width: 1200,
        height: 630,
        alt: "Tip Screen Generator - Create POS Interface Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tip Screen Generator - Free Online Tool",
    description:
      "Create realistic tip screens for iPhone, iPad & Android. Free tool for memes and education.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/tip-screen-generator/",
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
  name: "Tip Screen Generator",
  description:
    "A free online tool to generate realistic tip screens for iPhone, iPad, and Android devices. Create satirical POS interfaces, viral memes, and educational content about tipping culture.",
  url: "https://geekskai.com/tools/tip-screen-generator",
  applicationCategory: "Entertainment",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate realistic tip screens",
    "Multiple device themes (iPhone, iPad, Android)",
    "Customizable amounts and percentages",
    "Dark pattern examples for education",
    "Screenshot and share functionality",
    "Meme creation tools",
    "No registration required",
    "Browser-based processing",
    "Mobile-friendly interface",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords: "tip screen generator, pos interface, tipping culture, viral memes, educational tool",
  educationalUse: "UX Design Education, Tipping Culture Awareness, Social Commentary",
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
