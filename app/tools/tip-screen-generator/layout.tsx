import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tip Screen - Create & Understand POS Tip Screens | Free Generator Tool",
  description:
    "Everything about tip screens - what they are, how they work, and why they matter. Create realistic tip screens for iPhone, iPad, and Android. Free online tip screen generator and educational resource.",
  keywords: ["tip screen", "tip screen generator", "pos tip screen", "tip screen image"],
  openGraph: {
    title: "Tip Screen - Complete Guide & Free Generator Tool",
    description:
      "Learn everything about tip screens - from understanding their psychology to creating your own. Free tip screen generator for educational and satirical purposes.",
    type: "website",
    images: [
      {
        url: "/static/images/tip-screen-generator.png",
        width: 1200,
        height: 630,
        alt: "Tip Screen Guide and Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tip Screen - Guide & Free Generator",
    description: "Complete resource for understanding tip screens + free tool to create your own.",
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
  name: "Tip Screen Guide & Generator",
  description:
    "Comprehensive resource about tip screens including their psychology, design patterns, and cultural impact. Features a free tool to create realistic tip screens for educational and satirical purposes.",
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
    "Understand tip screen psychology",
    "Learn about tip screen design patterns",
    "Generate realistic tip screens",
    "Multiple device themes (iPhone, iPad, Android)",
    "Educational content about tipping culture",
    "Dark pattern examples and analysis",
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
  keywords: "tip screen, pos interface, tipping culture, digital payments, user experience",
  educationalUse:
    "UX Design Education, Tipping Culture Awareness, Social Commentary, Digital Psychology",
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
