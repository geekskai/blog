// URL validation
export const isValidSoundCloudPlaylistUrl = (url: string): boolean => {
  // placeholder="https://soundcloud.com/username/sets/playlist-name"
  //  https://soundcloud.com/dsprecords/dspromomix19?in=user-401308472/sets/copy-of-hardtek-tribecore/s-UdbdUBNOv6h&si=c74f4c5451604f82ac5bd2fc2b4ae94f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing
  // const playlistRegex = /^https?:\/\/(www\.)?soundcloud\.com\/.+\/sets\/.+/
  // return playlistRegex.test(url.trim())

  return new URL(url.trim()).pathname.includes("/sets/")
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
