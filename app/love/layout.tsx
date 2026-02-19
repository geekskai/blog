import type { Metadata } from "next"
import React from "react"

import "css/tailwind.css"
import "pliny/search/algolia.css"
import "remark-github-blockquote-alert/alert.css"

export const metadata: Metadata = {
  title: "陈成连，我喜欢你 | Love Confession",
  description:
    "一个浪漫的表白页面，送给那个让我心动的人。A romantic confession page with beautiful fireworks and love effects.",
  keywords: ["love", "confession", "romantic", "表白", "浪漫"],
  openGraph: {
    title: "陈成连，我喜欢你 ❤️",
    description: "遇见你，是我这辈子最美好的事情之一。",
    type: "website",
    images: [
      {
        url: "/og-love.jpg",
        width: 1200,
        height: 630,
        alt: "Love Confession",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "陈成连，我喜欢你 ❤️",
    description: "遇见你，是我这辈子最美好的事情之一。",
  },
  robots: {
    index: false, // 私密页面，不需要被搜索引擎索引
    follow: false,
  },
}

export default function LoveLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ""
  // const { locale } = await params
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/logo.png`} />
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href={`${basePath}/static/favicons/favicon-180X80.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-100X45.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.png`}
        color="#FF6B6B"
      />
      <meta name="saashub-verification" content="e4h08bjpev5u" />
      <meta name="msvalidate.01" content="58567D271AD7C1B504E10F5DC587BD0B" />
      <meta name="google-adsense-account" content="ca-pub-2108246014001009"></meta>
      <meta name="google-site-verification" content="QBYZptmNADcvd2h8ZZVSZIJUlv5RnI8yYmHtEld1mKk" />
      <meta name="msapplication-TileColor" content="#000000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 pl-[calc(100vw-100%)] text-white antialiased">
        <main className="mx-auto min-h-[54vh] max-w-7xl px-4 sm:px-6 xl:px-0">{children}</main>
      </body>
    </html>
  )
}
