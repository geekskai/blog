import type { Metadata } from "next"

// 增强的结构化数据 - WebApplication + Quiz Schema
const quizStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Inside Out 2 Glued to Phone Test",
  description:
    "Are you glued to your phone? Take our viral Inside Out 2 test to discover which emotion controls your phone addiction. Free interactive quiz featuring Joy, Anxiety, Sadness and all 9 Inside Out 2 characters.",
  url: "https://geekskai.com/tools/inside-out-2-glued-to-phone-test/",
  image: "https://geekskai.com/static/images/og/inside-out-2-glued-to-phone-test-og.png",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  permissions: "none",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Inside Out 2 glued to phone test",
    "9 Disney Pixar emotion analysis (Joy, Anxiety, Sadness, Anger, Fear, Disgust, Embarrassment, Envy, Ennui)",
    "Phone addiction assessment and dependency scoring",
    "Glued to phone detection algorithm",
    "Personalized digital wellness insights",
    "Emotion-based phone habit analysis",
    "Screen time addiction evaluation",
    "Viral shareable results with Disney characters",
    "Free phone addiction quiz - no registration",
    "Mobile-optimized glued to phone test",
    "Instant emotion and addiction level results",
    "Privacy-focused phone dependency analysis",
    "Social media sharing for Inside Out 2 results",
    "Comprehensive digital wellness recommendations",
    "Professional phone addiction screening tool",
  ],
  author: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  publisher: {
    "@type": "Organization",
    name: "GeeksKai",
    url: "https://geekskai.com",
  },
  about: [
    {
      "@type": "Thing",
      name: "Phone Addiction",
    },
    {
      "@type": "Thing",
      name: "Inside Out 2",
    },
    {
      "@type": "Thing",
      name: "Digital Wellness",
    },
    {
      "@type": "Thing",
      name: "Emotion Analysis",
    },
    {
      "@type": "Thing",
      name: "Disney Pixar Characters",
    },
  ],
  keywords:
    "inside out 2 glued to phone, inside out 2 emotion glued to phone, phone addiction test, glued to phone quiz, inside out 2 phone dependency, Disney Pixar phone addiction, Joy Anxiety Sadness phone habits, digital wellness test, screen time addiction assessment, Inside Out characters phone test, emotion phone addiction quiz, glued to phone detection, phone stickiness test, digital dependency analysis",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  educationalUse:
    "Digital Wellness, Self-Assessment, Emotional Awareness, Screen Time Management, Mental Health, Psychology Education",
  targetAudience: {
    "@type": "Audience",
    audienceType:
      "Smartphone Users Glued to Phone, Parents Concerned About Screen Time, Teenagers with Phone Addiction, Digital Wellness Enthusiasts, Inside Out 2 Disney Fans, Psychology Students, Mental Health Advocates, Social Media Users, Digital Detox Seekers",
  },
}

export const metadata: Metadata = {
  title: "Inside Out 2 Glued to Phone Test | Free Emotion Quiz",
  description:
    "Are you glued to your phone? Take our Inside Out 2 test to discover which emotion controls your phone addiction. Get instant results with Joy, Anxiety & Sadness!",
  keywords: [
    "inside out 2 glued to phone",
    "phone addiction test",
    "glued to phone quiz",
    "inside out 2 emotion test",
    "Disney phone addiction",
    "Joy Anxiety Sadness phone",
    "digital wellness quiz",
    "phone dependency test",
  ],
  openGraph: {
    title: "Inside Out 2 Glued to Phone Test | Free Emotion Quiz",
    description:
      "Are you glued to your phone? Take our Inside Out 2 test to discover which emotion controls your phone addiction. Get instant results with Joy, Anxiety & Sadness!",
    images: [
      {
        url: "/static/images/og/inside-out-2-glued-to-phone-test-og.png",
        width: 1200,
        height: 630,
        alt: "Inside Out 2 Glued to Phone Test | Free Emotion Quiz",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inside Out 2 Glued to Phone Test | Free Emotion Quiz",
    description:
      "Are you glued to your phone? Take our Inside Out 2 test to discover which emotion controls your phone addiction. Get instant results with Joy, Anxiety & Sadness!",
    images: ["/static/images/og/inside-out-2-glued-to-phone-test-og.png"],
  },
  icons: {
    icon: "/static/images/favicon.ico",
  },
  alternates: {
    canonical: "https://geekskai.com/tools/inside-out-2-glued-to-phone-test/",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 结构化数据注入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quizStructuredData),
        }}
      />
      {children}
    </>
  )
}
