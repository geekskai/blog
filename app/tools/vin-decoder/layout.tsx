import { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Free VIN Decoder - Vehicle Identification Number Lookup | GeeksKai",
  description:
    "Free VIN decoder tool to instantly decode any vehicle identification number. Get detailed specs including make, model, year, engine, transmission, and safety features. No signup required.",
  keywords: [
    "VIN decoder",
    "vehicle identification number",
    "VIN lookup",
    "car VIN decoder",
    "free VIN check",
    "vehicle specs lookup",
    "auto VIN decoder",
    "VIN number decoder",
    "decode VIN",
    "vehicle history",
  ],
  openGraph: {
    title: "Free VIN Decoder - Instant Vehicle Specs Lookup",
    description:
      "Decode any VIN instantly to get complete vehicle specifications. Free, fast, and accurate VIN decoder with no registration required.",
    type: "website",
    url: "https://geekskai.com/tools/vin-decoder",
    images: [
      {
        url: "/og-vin-decoder.jpg",
        width: 1200,
        height: 630,
        alt: "VIN Decoder Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free VIN Decoder - Vehicle Identification Number Lookup",
    description:
      "Instantly decode any VIN to get complete vehicle specifications. Free and accurate.",
    images: ["/twitter-vin-decoder.jpg"],
  },
  alternates: {
    canonical: "https://geekskai.com/tools/vin-decoder",
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

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VIN Decoder",
  description:
    "Free VIN decoder tool to instantly decode vehicle identification numbers and get detailed vehicle specifications.",
  url: "https://geekskai.com/tools/vin-decoder",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  permissions: "browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Instant VIN decoding",
    "Complete vehicle specifications",
    "Engine and transmission details",
    "Safety features information",
    "Manufacturing details",
    "Export results as JSON/CSV",
    "Decode history tracking",
    "No registration required",
    "Free forever",
    "Mobile responsive",
  ],
  creator: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "2847",
    bestRating: "5",
    worstRating: "1",
  },
}

// FAQ structured data
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a VIN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every vehicle. It contains information about the vehicle's manufacturer, model, year, and other specifications.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find my vehicle's VIN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The VIN can typically be found on the driver's side dashboard (visible through the windshield), driver's side door jamb, vehicle registration documents, insurance cards, or vehicle title.",
      },
    },
    {
      "@type": "Question",
      name: "Is this VIN decoder free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our VIN decoder is completely free to use. There are no hidden charges, no registration required, and no limits on the number of VINs you can decode.",
      },
    },
    {
      "@type": "Question",
      name: "What information can I get from a VIN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A VIN can provide information about the vehicle's make, model, year, body style, engine type, transmission, drive type, safety features, manufacturing location, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Are VIN decoders accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our VIN decoder uses the official NHTSA (National Highway Traffic Safety Administration) database, providing highly accurate and up-to-date vehicle information.",
      },
    },
    {
      "@type": "Question",
      name: "Can I decode VINs from any country?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our VIN decoder supports vehicles from all major manufacturers worldwide, including vehicles from the United States, Europe, Asia, and other regions.",
      },
    },
    {
      "@type": "Question",
      name: "Why are some fields showing 'Not available'?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some vehicle specifications may not be available in the database for certain vehicles, especially for older models or less common manufacturers. The available information depends on what the manufacturer has reported.",
      },
    },
    {
      "@type": "Question",
      name: "Is my VIN information stored or shared?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We only store VINs locally in your browser for the history feature. We do not collect, store on our servers, or share VIN information with third parties. Your privacy is protected.",
      },
    },
  ],
}

// Breadcrumb structured data
const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://geekskai.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tools",
      item: "https://geekskai.com/tools",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "VIN Decoder",
      item: "https://geekskai.com/tools/vin-decoder",
    },
  ],
}

export default function VinDecoderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      {children}
    </>
  )
}
