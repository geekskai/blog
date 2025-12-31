// URL validation
export const isValidSoundCloudPlaylistUrl = (url: string): boolean => {
  const playlistRegex = /^https?:\/\/(www\.)?soundcloud\.com\/.+\/sets\/.+/
  return playlistRegex.test(url.trim())
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
