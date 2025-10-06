import type { Metadata } from "next"

// SEO 优化的 metadata - 丹麦语/挪威语优化
export const metadata: Metadata = {
  title: "CM til Tommer Konverter – Centimeter til Tommer Online Værktøj | Gratis & Nøjagtig",
  description:
    "Gratis online CM til Tommer konverter. Konverter centimeter til tommer (danske/norske tommer) øjeblikkeligt med præcision op til 3 decimaler. Perfekt til møbler, byggeri og international handel.",
  keywords: [
    "cm til tommer",
    "centimeter til tommer",
    "tommer til cm",
    "dansk tommer konverter",
    "norsk tommer konverter",
    "nordisk målekonverter",
    "møbelstørrelse konverter",
    "byggemåling værktøj",
    "metrisk til tommer",
    "skandinaviske enheder",
    "cm til inch konverter",
    "målekonvertering værktøj",
    "gratis konverter online",
    "præcis målekonverter",
    "dansk måling",
    "norsk måling",
    "nordiske standarder",
    "IKEA dimensioner",
    "byggeprojekt måling",
    "international handel måling",
  ],
  authors: [{ name: "GeeksKai" }],
  creator: "GeeksKai",
  publisher: "GeeksKai",

  // Open Graph
  openGraph: {
    title: "CM til Tommer Konverter – Gratis Online Værktøj",
    description:
      "Konverter centimeter til tommer (danske/norske tommer) øjeblikkeligt. Gratis, nøjagtig, og perfekt til møbelindkøb og byggeprojekter.",
    url: "https://geekskai.com/tools/cm-til-tommer/",
    siteName: "GeeksKai Værktøjer",
    images: [
      {
        url: "/static/tools/cm-til-tommer-og.jpg",
        width: 1200,
        height: 630,
        alt: "CM til Tommer Konverter Værktøj - Konverter centimeter til tommer øjeblikkeligt",
      },
    ],
    locale: "da_DK",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "CM til Tommer Konverter – Gratis Online Værktøj",
    description:
      "Konverter centimeter til tommer (danske/norske tommer) øjeblikkeligt. Gratis, nøjagtig, og perfekt til møbelindkøb.",
    images: ["/static/tools/cm-til-tommer-twitter.jpg"],
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
    canonical: "https://geekskai.com/tools/cm-til-tommer/",
    languages: {
      "da-DK": "https://geekskai.com/tools/cm-til-tommer/",
      "nb-NO": "https://geekskai.com/tools/cm-til-tommer/",
      "en-US": "https://geekskai.com/tools/cm-to-tommer-converter/",
    },
  },

  // Additional metadata
  category: "Værktøjer",
  classification: "Målekonverter",

  // Verification and other meta tags
  other: {
    "application-name": "CM til Tommer Konverter",
    "apple-mobile-web-app-title": "CM til Tommer",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "geo.region": "DK-NO",
    "geo.placename": "Denmark, Norway",
    "DC.language": "da-DK",
  },
}

// 结构化数据 (JSON-LD) - 丹麦语/挪威语优化
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CM til Tommer Konverter",
  alternateName: [
    "Centimeter til Tommer Konverter",
    "Dansk Tommer Konverter",
    "Norsk Tommer Konverter",
  ],
  description:
    "Gratis online værktøj til at konvertere centimeter til tommer (danske/norske tommer) med høj præcision",
  url: "https://geekskai.com/tools/cm-til-tommer/",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  permissions: "none",
  isAccessibleForFree: true,
  inLanguage: ["da-DK", "nb-NO", "en-US"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "DKK",
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
    "Tovejs konvertering (CM ↔ Tommer)",
    "Præcisionskontrol (0-3 decimaler)",
    "Realtids konvertering",
    "Kopier resultater til udklipsholder",
    "Hurtig referencetabel",
    "Uddannelsesindhold om tommer",
    "Mobilvenlig interface",
    "Ingen registrering påkrævet",
    "Nordiske målestandard support",
    "IKEA møbeldimension hjælp",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://geekskai.com/static/tools/cm-til-tommer-screenshot.jpg",
    caption: "CM til Tommer Konverter interface der viser konvertering fra centimeter til tommer",
  },
  softwareVersion: "1.0",
  datePublished: "2024-01-24",
  dateModified: "2024-01-24",
  audience: {
    "@type": "Audience",
    audienceType: [
      "Møbelindkøbere",
      "Byggeprofessionelle",
      "Arkitekter",
      "Ingeniører",
      "Internationale handlende",
      "Gør-det-selv entusiaster",
      "Danske forbrugere",
      "Norske forbrugere",
      "IKEA kunder",
    ],
    geographicArea: [
      {
        "@type": "Country",
        name: "Denmark",
      },
      {
        "@type": "Country",
        name: "Norway",
      },
    ],
  },
  usageInfo: {
    "@type": "CreativeWork",
    name: "Sådan bruger du CM til Tommer Konverter",
    description:
      "Indtast en værdi i centimeter eller tommer, vælg præcision, og få øjeblikkelige konverteringsresultater",
  },
}

// FAQ 结构化数据 - 丹麦语
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hvad er en tommer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Tommer er det danske og norske ord for "inch". En tommer er lig med præcis 2,54 centimeter, det samme som en international inch.',
      },
    },
    {
      "@type": "Question",
      name: "Hvordan konverterer jeg centimeter til tommer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For at konvertere centimeter til tommer, gang centimeter værdien med 0,3937. For eksempel, 10 cm = 10 × 0,3937 = 3,937 tommer.",
      },
    },
    {
      "@type": "Question",
      name: "Er tommer det samme som inch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, moderne tommer er identisk med den internationale inch. Begge er lig med præcis 2,54 centimeter.",
      },
    },
    {
      "@type": "Question",
      name: "Hvorfor skal jeg konvertere cm til tommer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Almindelige anvendelser inkluderer møbelindkøb fra nordiske lande, byggeprojekter, arkitekttegninger, og forståelse af produktdimensioner i international handel.",
      },
    },
    {
      "@type": "Question",
      name: "Hvor nøjagtig er denne konverter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vores konverter giver præcision op til 3 decimaler og bruger den nøjagtige konverteringsfaktor (1 tommer = 2,54 cm) for maksimal nøjagtighed.",
      },
    },
    {
      "@type": "Question",
      name: "Kan jeg bruge dette til IKEA møbler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja! Vores konverter er perfekt til at forstå IKEA møbeldimensioner og andre skandinaviske møbelspecifikationer der bruger tommer målinger.",
      },
    },
    {
      "@type": "Question",
      name: "Understøtter værktøjet danske og norske standarder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, vores CM til Tommer konverter følger officielle danske og norske målestandard og er optimeret til nordiske brugere og anvendelser.",
      },
    },
    {
      "@type": "Question",
      name: "Er dette værktøj gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja! Vores CM til Tommer konverter er helt gratis uden registrering påkrævet. Alle funktioner er tilgængelige uden begrænsninger.",
      },
    },
  ],
}

// BreadcrumbList 结构化数据
const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Hjem",
      item: "https://geekskai.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Værktøjer",
      item: "https://geekskai.com/tools",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "CM til Tommer Konverter",
      item: "https://geekskai.com/tools/cm-til-tommer",
    },
  ],
}

export default function CmTilTommerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 结构化数据 */}
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
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* 页面内容 */}
      {children}
    </>
  )
}
