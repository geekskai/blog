import type { ElementType } from "react"
import { Download, Image, ListMusic, Music } from "lucide-react"

export const TOOL_COUNT = 51

export type FooterToolLink = {
  id: string
  title: string
  href: string
  icon: ElementType
}

export const footerPopularTools: FooterToolLink[] = [
  {
    id: "soundcloud-downloader",
    title: "SoundCloud Downloader",
    href: "/tools/soundcloud-downloader/",
    icon: Download,
  },
  {
    id: "soundcloud-to-mp3",
    title: "SoundCloud to MP3",
    href: "/tools/soundcloud-to-mp3/",
    icon: Music,
  },
  {
    id: "soundcloud-to-wav",
    title: "SoundCloud to WAV",
    href: "/tools/soundcloud-to-wav/",
    icon: Music,
  },
  {
    id: "soundcloud-playlist-downloader",
    title: "SoundCloud Playlist",
    href: "/tools/soundcloud-playlist-downloader/",
    icon: ListMusic,
  },
  {
    id: "soundcloud-artwork-downloader",
    title: "SoundCloud Artwork",
    href: "/tools/soundcloud-artwork-downloader/",
    icon: Image,
  },
]
