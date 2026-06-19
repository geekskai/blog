import type { ElementType } from "react"
import { Monitor, Music, Search } from "lucide-react"

export const TOOL_COUNT = 51

export type FooterToolLink = {
  id: string
  title: string
  href: string
  icon: ElementType
}

export const footerPopularTools: FooterToolLink[] = [
  {
    id: "youtube-shorts-downloader",
    title: "YouTube Shorts Downloader",
    href: "/tools/youtube-shorts-downloader/",
    icon: Monitor,
  },
  {
    id: "youtube-video-downloader",
    title: "YouTube Video Downloader",
    href: "/tools/youtube-video-downloader/",
    icon: Monitor,
  },
  {
    id: "youtube-audio-downloader",
    title: "YouTube Audio Downloader",
    href: "/tools/youtube-audio-downloader/",
    icon: Music,
  },
  {
    id: "vin-decoder",
    title: "VIN Decoder & Lookup",
    href: "/tools/vin-decoder/",
    icon: Search,
  },
]
