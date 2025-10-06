import type { Metadata } from "next"

// SEO optimized metadata
export const metadata: Metadata = {
  title: "CCM to HP Converter – Engine Displacement to Horsepower Calculator | Free & Accurate",
  description:
    "Free online CCM to HP converter. Convert engine displacement (ccm) to horsepower (hp) instantly for 2-stroke, 4-stroke, turbocharged, and naturally aspirated engines. Perfect for motorcycles, cars, boats, and racing applications.",
  keywords: [
    "ccm to hp",
    "ccm to hp converter",
    "hp to ccm",
    "engine displacement to horsepower",
    "horsepower calculator",
    "ccm hp conversion",
    "engine power calculator",
  ],
  authors: [{ name: "GeeksKai" }],
  creator: "GeeksKai",
  publisher: "GeeksKai",
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
  openGraph: {
    title: "CCM to HP Converter – Engine Power Calculator | Free Tool",
    description:
      "Convert engine displacement (CCM) to horsepower (HP) instantly. Supports 2-stroke, 4-stroke, turbocharged engines. Perfect for motorcycles, cars, boats & racing.",
    url: "https://geekskai.com/tools/ccm-to-hp-converter",
    siteName: "GeeksKai Tools",
    images: [
      {
        url: "/og-images/ccm-to-hp-converter.jpg",
        width: 1200,
        height: 630,
        alt: "CCM to HP Converter - Engine Displacement to Horsepower Calculator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CCM to HP Converter – Engine Power Calculator",
    description:
      "Free CCM to HP converter for motorcycles, cars, boats & racing engines. Convert engine displacement to horsepower instantly.",
    images: ["/og-images/ccm-to-hp-converter.jpg"],
    creator: "@geekskai",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/ccm-to-hp-converter",
  },
  other: {
    "application-name": "CCM to HP Converter",
    "apple-mobile-web-app-title": "CCM to HP Converter",
    "format-detection": "telephone=no",
  },
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geekskai.com/tools/ccm-to-hp-converter#webapp",
      name: "CCM to HP Converter",
      description:
        "Free online tool to convert engine displacement (CCM) to horsepower (HP) for motorcycles, cars, boats, and racing engines.",
      url: "https://geekskai.com/tools/ccm-to-hp-converter",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      permissions: "browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "CCM to HP conversion",
        "HP to CCM reverse conversion",
        "2-stroke and 4-stroke engine support",
        "Turbocharged and naturally aspirated options",
        "Real-time calculation",
        "Power range estimation",
        "Copy and share results",
        "Mobile responsive design",
      ],
    },
    {
      "@type": "HowTo",
      "@id": "https://geekskai.com/tools/ccm-to-hp-converter#howto",
      name: "How to Convert CCM to HP",
      description:
        "Step-by-step guide to convert engine displacement (CCM) to horsepower (HP) using our free calculator.",
      image: "https://geekskai.com/og-images/ccm-to-hp-converter.jpg",
      totalTime: "PT2M",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "0",
      },
      supply: [
        {
          "@type": "HowToSupply",
          name: "Engine displacement in CCM",
        },
        {
          "@type": "HowToSupply",
          name: "Engine type (2-stroke or 4-stroke)",
        },
        {
          "@type": "HowToSupply",
          name: "Fuel system type (naturally aspirated or turbocharged)",
        },
      ],
      step: [
        {
          "@type": "HowToStep",
          name: "Enter Engine Displacement",
          text: "Input your engine's displacement in CCM (cubic centimeters) in the calculator field.",
          image: "https://geekskai.com/images/ccm-input-step.jpg",
        },
        {
          "@type": "HowToStep",
          name: "Select Engine Type",
          text: "Choose between 2-stroke (dirt bikes, chainsaws) or 4-stroke (cars, modern motorcycles) engines.",
          image: "https://geekskai.com/images/engine-type-step.jpg",
        },
        {
          "@type": "HowToStep",
          name: "Choose Fuel System",
          text: "Select naturally aspirated or turbocharged to get accurate power estimates.",
          image: "https://geekskai.com/images/fuel-system-step.jpg",
        },
        {
          "@type": "HowToStep",
          name: "Get Results",
          text: "View the estimated horsepower with power range, copy results, or share calculations.",
          image: "https://geekskai.com/images/results-step.jpg",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://geekskai.com/tools/ccm-to-hp-converter#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "How accurate is CCM to HP conversion?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CCM to HP conversion provides estimates based on empirical data and industry averages. Actual horsepower can vary ±15-25% depending on engine tuning, compression ratio, fuel system, and other factors. Our calculator uses proven formulas with different coefficients for 2-stroke vs 4-stroke and naturally aspirated vs turbocharged engines.",
          },
        },
        {
          "@type": "Question",
          name: "What's the difference between 2-stroke and 4-stroke power output?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2-stroke engines typically produce more power per cc than 4-stroke engines because they have a power stroke every revolution instead of every two revolutions. Our calculator applies a 1.2-1.4x coefficient for 2-stroke engines and 0.8-1.0x for 4-stroke engines, reflecting real-world power differences.",
          },
        },
        {
          "@type": "Question",
          name: "How does turbocharging affect CCM to HP conversion?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Turbocharged engines produce significantly more power from the same displacement. Our calculator applies higher coefficients (1.0-1.4x) for turbocharged engines compared to naturally aspirated engines (0.8-1.2x), typically resulting in 25-40% more estimated horsepower.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use this for motorcycle, car, and marine engines?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Our CCM to HP converter works for all internal combustion engines including motorcycles, cars, boats, ATVs, and racing engines. The calculator accounts for different engine types and configurations commonly found across these applications.",
          },
        },
        {
          "@type": "Question",
          name: "Why do manufacturers' HP ratings sometimes differ from calculations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Manufacturer ratings are measured under specific conditions (SAE, DIN, etc.) and may include factors like altitude, temperature, and measurement standards. Our calculator provides estimates based on displacement and engine type, while actual ratings depend on complete engine design, tuning, and testing conditions.",
          },
        },
        {
          "@type": "Question",
          name: "What CCM range works best with this calculator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our calculator works accurately for engines from 50cc to 8000cc. For very small engines (under 50cc) or extremely large engines (over 8000cc), results may be less accurate due to different design principles and efficiency factors.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://geekskai.com/tools/ccm-to-hp-converter#breadcrumb",
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
          name: "CCM to HP Converter",
          item: "https://geekskai.com/tools/ccm-to-hp-converter",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://geekskai.com#organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://geekskai.com/logo.png",
      },
      sameAs: ["https://twitter.com/geekskai", "https://github.com/geekskai"],
    },
    {
      "@type": "WebSite",
      "@id": "https://geekskai.com#website",
      url: "https://geekskai.com",
      name: "GeeksKai",
      description:
        "Free online tools and calculators for developers, designers, and digital professionals.",
      publisher: {
        "@id": "https://geekskai.com#organization",
      },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://geekskai.com/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      ],
    },
  ],
}

export default function CcmToHpConverterLayout({ children }: { children: React.ReactNode }) {
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
