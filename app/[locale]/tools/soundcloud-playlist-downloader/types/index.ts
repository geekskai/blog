export type DownloadFormat = "mp3" | "wav"

export type LoadingState = "idle" | "loading" | "success" | "error"

export interface PlaylistTrack {
  title: string
  url: string
  id?: number
  artworkUrl?: string
  artist: string
}

export interface PlaylistInfo {
  success: boolean
  message: string
  trackCount: number
  tracks: PlaylistTrack[]
}

export interface DownloadProgress {
  current: number
  total: number
  currentTrack: string
  status: "idle" | "downloading" | "completed" | "error"
}
