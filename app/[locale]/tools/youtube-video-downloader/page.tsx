import { setRequestLocale } from "next-intl/server"
import VideoMain from "./VideoMain"
import React from "react"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function YouTubeVideoDownloaderPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <VideoMain />
}
