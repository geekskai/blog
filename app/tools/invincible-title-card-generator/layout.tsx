import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Invincible Title Card Generator - Create Custom TV Show Title Cards | Free Tool",
  description:
    "Generate custom title cards inspired by the Invincible animated series. Create professional title cards with customizable text, colors, backgrounds, and effects. Perfect for fan content and creative projects.",
  keywords: [
    "invincible",
    "title card generator",
    "animated series",
    "tv show",
    "title cards",
    "custom graphics",
    "fan content",
    "invincible generator",
  ],
  openGraph: {
    title: "Invincible Title Card Generator - Create Custom Title Cards",
    description:
      "Create stunning title cards inspired by the Invincible animated series. Customize text, colors, backgrounds and effects to make your own professional-looking title cards.",
    type: "website",
    images: [
      {
        url: "/static/images/invincible-title-card-generator.png",
        width: 1200,
        height: 630,
        alt: "Invincible Title Card Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invincible Title Card Generator - Free Creative Tool",
    description: "Generate custom Invincible-style title cards with text, colors, and effects.",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/invincible-title-card-generator/",
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
  name: "Invincible Title Card Generator",
  description:
    "Create custom title cards inspired by the Invincible animated series. Generate professional-looking title cards with customizable text, colors, backgrounds, and special effects for fan content and creative projects.",
  url: "https://geekskai.com/tools/invincible-title-card-generator",
  applicationCategory: "Entertainment",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Custom text input",
    "Color customization",
    "Background selection",
    "Character presets",
    "Font size control",
    "Text outline effects",
    "Subtitle support",
    "High-quality download",
    "Mobile-friendly interface",
    "No registration required",
  ],
  softwareRequirements: "Modern web browser with JavaScript enabled",
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  keywords:
    "invincible, title card, generator, animated series, tv show, custom graphics, fan content",
  educationalUse: "Fan Content Creation, Graphic Design, Video Production, Creative Projects",
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
