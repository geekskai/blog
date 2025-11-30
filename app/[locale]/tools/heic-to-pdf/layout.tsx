import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HEIC to PDF Converter | Free Online Tool - Convert HEIC to PDF & JPEG Instantly",
  description:
    "Convert HEIC images to PDF or JPEG format instantly in your browser. 100% free, no uploads required, privacy-first, batch processing supported. Works on iPhone, iPad, Mac, Windows, Android. No software installation needed.",
  keywords:
    "HEIC to PDF, convert HEIC to PDF, HEIC converter, HEIC to JPEG, online HEIC converter, free HEIC converter, batch HEIC conversion, HEIC to PDF online, iPhone HEIC converter, iPad HEIC converter, Mac HEIC converter, HEIC file converter, privacy safe HEIC conversion, local HEIC converter, HEIC to PDF free, secure HEIC conversion, HEIC image converter, HEIC photo converter, HEIC to PDF tool, convert HEIC files, HEIC format converter",
  alternates: {
    canonical: "https://geekskai.com/tools/heic-to-pdf/",
  },
  openGraph: {
    title: "HEIC to PDF Converter - Free Online Tool | Convert HEIC Images Instantly",
    description:
      "Convert HEIC images to PDF or JPEG format instantly. 100% free, no uploads, privacy-first, batch processing. Works on all devices.",
    type: "website",
    url: "https://geekskai.com/tools/heic-to-pdf/",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEIC to PDF Converter - Free Online Tool",
    description: "Convert HEIC images to PDF or JPEG instantly. Free, secure, and privacy-first.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
