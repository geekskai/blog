import type { Metadata } from "next"

// SEO optimized metadata - 针对"pund til nok"关键词优化
export const metadata: Metadata = {
  title: "Pund til NOK Kalkulator | GBP til NOK Valutakalkulator - Live Kurser",
  description:
    "Gratis pund til NOK kalkulator med live valutakurser. Konverter britiske pund (GBP) til norske kroner (NOK) øyeblikkelig.",
  keywords: [
    "pund til NOK",
    "pund til nok kalkulator",
    "GBP til NOK",
    "britiske pund til norske kroner",
    "valutakalkulator pund nok",
    "pund nok kurs",
    "GBP NOK valutakurs",
    "pund til kroner",
    "britisk pund norsk krone",
    "valutaomregner pund",
    "live valutakurser",
    "pund krone kalkulator",
    "GBP to NOK converter",
    "pound to norwegian krone",
    "currency exchange calculator",
    "real-time exchange rates",
    "travel money converter",
    "forex calculator",
    "international money transfer",
    "currency conversion tool",
  ],
  authors: [{ name: "GeeksKai" }],
  creator: "GeeksKai",
  publisher: "GeeksKai",

  // Open Graph - 挪威语优化
  openGraph: {
    title: "Pund til NOK Kalkulator | Live Valutakurser GBP til NOK",
    description:
      "Gratis pund til NOK kalkulator med live valutakurser. Konverter britiske pund til norske kroner øyeblikkelig. Perfekt for reise, handel og internasjonale transaksjoner.",
    url: "https://geekskai.com/tools/pund-til-nok-kalkulator/",
    siteName: "GeeksKai Tools",
    images: [
      {
        url: "/static/tools/pund-til-nok-kalkulator-og.jpg",
        width: 1200,
        height: 630,
        alt: "Pund til NOK Kalkulator - Live Valutakurser Britiske Pund til Norske Kroner",
      },
    ],
    locale: "nb_NO",
    type: "website",
  },

  // Twitter Card - 挪威语优化
  twitter: {
    card: "summary_large_image",
    title: "Pund til NOK Kalkulator | Live Valutakurser",
    description:
      "Gratis pund til NOK kalkulator med live valutakurser. Konverter britiske pund til norske kroner øyeblikkelig.",
    images: ["/static/tools/pund-til-nok-kalkulator-twitter.jpg"],
    creator: "@geekskai",
  },

  // Additional SEO
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

  // Canonical URL
  alternates: {
    canonical: "https://geekskai.com/tools/pund-til-nok-kalkulator/",
  },

  // Additional metadata
  category: "Tools",
  classification: "Currency Converter",

  // Verification and other meta tags
  other: {
    "application-name": "Pund til NOK Kalkulator",
    "apple-mobile-web-app-title": "Pund til NOK",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "geo.region": "NO",
    "geo.country": "Norway",
    language: "nb-NO,en-US",
  },
}

// Structured data (JSON-LD) - 挪威语优化
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pund til NOK Kalkulator",
  alternateName: "GBP til NOK Valutakalkulator",
  description:
    "Gratis pund til NOK kalkulator med live valutakurser. Konverter britiske pund (GBP) til norske kroner (NOK) øyeblikkelig med nøyaktige kurser.",
  url: "https://geekskai.com/tools/pund-til-nok-kalkulator/",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  permissions: "none",
  isAccessibleForFree: true,
  inLanguage: ["nb-NO", "en-US"],
  availableLanguage: ["Norwegian", "English"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NOK",
  },
  provider: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
    logo: {
      "@type": "ImageObject",
      url: "https://geekskai.com/static/logo.png",
    },
  },
  featureList: [
    "Live pund til NOK valutakurser",
    "Toveis valutakonvertering (GBP ↔ NOK)",
    "Sanntids valutakurs oppdateringer",
    "Hurtig referanse konverteringstabell",
    "Kopier konverteringsresultater",
    "Mobilvennlig grensesnitt",
    "Ingen registrering påkrevd",
    "Gratis ubegrensede konverteringer",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://geekskai.com/static/tools/pund-til-nok-kalkulator-screenshot.jpg",
    caption: "Pund til NOK Kalkulator med live valutakurser",
  },
  softwareVersion: "1.0",
  datePublished: "2024-01-24",
  dateModified: "2024-01-24",
  audience: {
    "@type": "Audience",
    audienceType: [
      "Travelers",
      "Business professionals",
      "International traders",
      "Students studying abroad",
      "Forex investors",
      "Online shoppers",
    ],
  },
  usageInfo: {
    "@type": "CreativeWork",
    name: "How to use GBP to NOK Currency Converter",
    description:
      "Enter amount in GBP or NOK, view real-time conversion, and copy results for your transactions",
  },
}

// FAQ structured data - 挪威语和英语双语优化
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hva er dagens pund til NOK valutakurs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pund til NOK valutakursen endres konstant gjennom dagen. Vår kalkulator viser sanntidskurser oppdatert hver time fra pålitelige finansielle datakilder.",
      },
    },
    {
      "@type": "Question",
      name: "Hvordan konverterer jeg britiske pund til norske kroner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bare skriv inn beløpet i GBP i vår kalkulator, så vil den automatisk beregne tilsvarende beløp i NOK ved å bruke gjeldende valutakurs. Du kan også konvertere NOK til GBP ved å bytte valutaer.",
      },
    },
    {
      "@type": "Question",
      name: "Er denne pund til NOK kalkulatoren gratis å bruke?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, vår pund til NOK valutakalkulator er helt gratis uten registrering. Du kan utføre ubegrensede konverteringer og få tilgang til alle funksjoner uten kostnad.",
      },
    },
    {
      "@type": "Question",
      name: "Hvor nøyaktige er valutakursene?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Våre valutakurser kommer fra pålitelige finansielle dataleverandører og oppdateres regelmessig. Faktiske kurser kan variere litt avhengig av din bank eller vekslingstjeneste.",
      },
    },
    {
      "@type": "Question",
      name: "What is the current GBP to NOK exchange rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The GBP to NOK exchange rate changes constantly throughout the day. Our converter shows real-time rates updated hourly from reliable financial data sources.",
      },
    },
    {
      "@type": "Question",
      name: "How do I convert British Pounds to Norwegian Krone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply enter the amount in GBP in our converter, and it will automatically calculate the equivalent amount in NOK using the current exchange rate. You can also convert NOK to GBP by switching the currencies.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for business transactions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our converter is suitable for business use, travel planning, and personal transactions. For large business transactions, we recommend checking with your bank for the most current commercial rates.",
      },
    },
  ],
}

// Currency pair structured data
const currencyPairData = {
  "@context": "https://schema.org",
  "@type": "ExchangeRateSpecification",
  currency: "GBP",
  currentExchangeRate: {
    "@type": "UnitPriceSpecification",
    price: "13.45", // This would be dynamically updated
    priceCurrency: "NOK",
  },
  validFrom: new Date().toISOString(),
  validThrough: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
}

export default function GbpNokConverterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(currencyPairData),
        }}
      />

      {/* Page content */}
      {children}
    </>
  )
}
