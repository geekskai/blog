import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Convert Inches to Decimal - Free Fraction to Decimal Calculator Tool",
  description:
    "Convert inches to decimal instantly with our free calculator. Transform fractional inches (5 3/4) to decimal inches (5.75) for construction, woodworking & manufacturing. Mobile-optimized, works offline.",
  keywords: [
    "convert inches to decimal",
    "inches to decimal converter",
    "fraction to decimal inches",
    "fractional inches calculator",
    "decimal inches converter",
    "construction measurement converter",
    "woodworking decimal converter",
    "imperial to decimal converter",
    "fraction calculator tool",
    "decimal conversion calculator",
    "construction measurement tools",
    "job site calculator",
    "mobile fraction converter",
  ],
  openGraph: {
    title: "Convert Inches to Decimal - Free Calculator Tool for Professionals",
    description:
      "Convert inches to decimal instantly with our professional calculator. Perfect for construction, woodworking, and manufacturing. Free, mobile-optimized, works offline.",
    type: "website",
    images: [
      {
        url: "/static/images/inches-to-decimal-converter-og.jpg",
        width: 1200,
        height: 630,
        alt: "Inches to Decimal Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Inches to Decimal - Free Professional Calculator",
    description:
      "Convert inches to decimal instantly! Transform fractional inches (5 3/4) to decimal (5.75). Free tool for construction & woodworking professionals.",
    images: ["/static/images/inches-to-decimal-converter-twitter.jpg"],
  },
  alternates: {
    canonical: "https://geekskai.com/tools/convert-inches-to-decimal",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Inches to Decimal Calculator",
            description:
              "Professional calculator to convert inches to decimal instantly. Transform fractional inches to decimal inches for construction, woodworking, and manufacturing professionals.",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            audience: {
              "@type": "Audience",
              audienceType: ["Construction Workers", "Woodworkers", "Engineers", "Manufacturers"],
            },
            featureList: [
              "Convert inches to decimal instantly",
              "Fractional to decimal inch conversion",
              "Visual ruler display with measurements",
              "Mobile-optimized interface for job sites",
              "Offline functionality for construction sites",
              "Conversion history and export",
              "Professional-grade accuracy",
              "Free calculator tool",
            ],
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            provider: {
              "@type": "Organization",
              name: "GeeksKai",
              url: "https://geekskai.com",
            },
          }),
        }}
      />
      {children}
    </>
  )
}
