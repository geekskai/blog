import { setRequestLocale } from "next-intl/server"
import AudioMain from "./AudioMain"
import React from "react"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function YouTubeAudioDownloaderPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AudioMain />
}
