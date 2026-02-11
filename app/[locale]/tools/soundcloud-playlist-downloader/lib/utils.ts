const SOUNDCLOUD_TRACK_URL_REGEX =
  /^https?:\/\/(www\.)?soundcloud\.com\/[^/?#]+\/[^/?#]+(?:\/s-[A-Za-z0-9]+)?\/?(?:[?#].*)?$/
// 短链接格式: https://on.soundcloud.com/xxxx
const SOUNDCLOUD_SHORT_URL_REGEX = /^https?:\/\/on\.soundcloud\.com\/[A-Za-z0-9]+(?:[?#].*)?$/

// Utility functions
const normalizeSoundCloudUrl = (inputUrl: string): string => {
  try {
    const parsedUrl = new URL(inputUrl)
    if (parsedUrl.hostname === "m.soundcloud.com") {
      parsedUrl.hostname = "soundcloud.com"
    }
    return parsedUrl.toString()
  } catch {
    return inputUrl
  }
}

const isShortSoundCloudUrl = (url: string): boolean => {
  return SOUNDCLOUD_SHORT_URL_REGEX.test(url.trim())
}

// 验证单个歌曲URL
export const isValidSoundCloudTrackUrl = (url: string): boolean => {
  const trimmedUrl = url.trim()
  // 排除播放列表URL
  if (isValidSoundCloudPlaylistUrl(trimmedUrl)) {
    return false
  }
  // 允许短链接，由服务端解析后再校验
  const normalizedUrl = normalizeSoundCloudUrl(trimmedUrl)
  if (isShortSoundCloudUrl(normalizedUrl)) {
    return true
  }
  return SOUNDCLOUD_TRACK_URL_REGEX.test(normalizedUrl)
}

// URL validation
export const isValidSoundCloudPlaylistUrl = (url: string): boolean => {
  // placeholder="https://soundcloud.com/username/sets/playlist-name"
  //  https://soundcloud.com/dsprecords/dspromomix19?in=user-401308472/sets/copy-of-hardtek-tribecore/s-UdbdUBNOv6h&si=c74f4c5451604f82ac5bd2fc2b4ae94f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing
  // const playlistRegex = /^https?:\/\/(www\.)?soundcloud\.com\/.+\/sets\/.+/
  // return playlistRegex.test(url.trim())

  try {
    return new URL(url.trim()).pathname.includes("/sets/")
  } catch {
    return false
  }
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2)
}

// Create download link
export const createDownloadLink = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

// Get safe file name
export const getSafeFileName = (title: string, extension: string): string => {
  // Remove invalid characters and limit length
  const safeTitle = title.substring(0, 100)
  return `${safeTitle}.${extension}`
}
