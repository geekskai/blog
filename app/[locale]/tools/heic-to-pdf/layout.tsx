import type { Metadata } from "next"
// import "./globals.css";
// import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "HEIC to PDF Converter | Free, Secure & Local Batch Conversion Online",
  description:
    "Easily convert HEIC images to PDF in your browser. 100% free, no uploads, privacy protected, batch processing, and high-quality output. Works on all devices.",
  keywords:
    "HEIC to PDF, batch HEIC converter, online HEIC to PDF, privacy safe HEIC conversion, local HEIC to PDF, free HEIC converter, secure image conversion",
  alternates: {
    canonical: "https://heictopdf.tech/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
