// Utility functions

export function removeExtension(imgName: string) {
  if (imgName.toLowerCase().endsWith(".heic")) {
    return imgName.substring(0, imgName.length - 5)
  }
  return imgName
}

export function downloadURI(uri: string, name: string) {
  const link = document.createElement("a")
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
