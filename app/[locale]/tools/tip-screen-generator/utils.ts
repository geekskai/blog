/**
 * Utility functions for tip screen generator
 * Handles screenshot capture and image processing
 */

/**
 * Find the actual tip screen element to capture
 * tipScreenRef points to a wrapper, we need to find the actual tip screen component
 */
export const findTipScreenElement = (wrapper: HTMLElement): HTMLElement | null => {
  // The tip screen is inside: wrapper > div (transform) > div (tip screen component)
  // Look for the element with aspect-[3/4] or bg-slate-900 (tip screen characteristics)
  const tipScreen = wrapper.querySelector(
    '[class*="aspect-[3/4]"], [class*="bg-slate-900"]'
  ) as HTMLElement

  if (tipScreen) {
    return tipScreen
  }

  // Fallback: get the first child's first child (the actual tip screen)
  const transformWrapper = wrapper.firstElementChild as HTMLElement
  if (transformWrapper?.firstElementChild) {
    return transformWrapper.firstElementChild as HTMLElement
  }

  // Last resort: return wrapper itself
  return wrapper
}

/**
 * Preload all images and CSS backgrounds in the tip screen
 * This ensures html2canvas/dom-to-image can properly capture everything
 */
export const preloadTipScreenImages = async (element: HTMLElement): Promise<void> => {
  // Find all images
  const images = Array.from(element.querySelectorAll("img")) as HTMLImageElement[]

  // Find all elements with CSS background images
  const allElements = Array.from(element.querySelectorAll("*")) as HTMLElement[]
  const backgroundImages: string[] = []

  allElements.forEach((el) => {
    const bg = window.getComputedStyle(el).backgroundImage
    if (bg && bg !== "none" && bg.includes("url(")) {
      const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/)
      if (match && match[1]) {
        backgroundImages.push(match[1])
      }
    }
  })

  // Preload all images
  const imagePromises = images.map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn(`Image preload timeout: ${img.src}`)
        resolve()
      }, 5000)

      img.onload = () => {
        clearTimeout(timeout)
        resolve()
      }
      img.onerror = () => {
        clearTimeout(timeout)
        resolve()
      }
    })
  })

  // Preload CSS background images
  const bgPromises = backgroundImages.map((bgUrl) => {
    return new Promise<void>((resolve) => {
      const img = new Image()
      const timeout = setTimeout(() => {
        console.warn(`Background image preload timeout: ${bgUrl}`)
        resolve()
      }, 5000)

      img.onload = () => {
        clearTimeout(timeout)
        resolve()
      }
      img.onerror = () => {
        clearTimeout(timeout)
        resolve()
      }
      img.src = bgUrl
    })
  })

  await Promise.all([...imagePromises, ...bgPromises])
  // Additional wait to ensure everything is rendered
  await new Promise((resolve) => setTimeout(resolve, 300))
}

/**
 * Detect device info for choosing the right library
 */
export const getDeviceInfo = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  return {
    os: /iphone|ipad|ipod/i.test(userAgent) ? "ios" : "unknown",
    browser: /safari/i.test(userAgent) && !/chrome/i.test(userAgent) ? "safari" : "unknown",
  }
}

/**
 * Capture element as image using html2canvas or dom-to-image
 * Automatically selects the best library based on device
 */
export const captureElementAsImage = async (
  element: HTMLElement,
  options: {
    backgroundColor?: string | null
    scale?: number
  } = {}
): Promise<string> => {
  const device = getDeviceInfo()
  const height = element.scrollHeight || element.clientHeight
  const width = element.scrollWidth || element.clientWidth

  const { backgroundColor = "#ffffff", scale = 2 } = options

  if (device.os === "ios" || device.browser === "safari") {
    // Use html2canvas-pro for iOS/Safari
    const html2canvas = (await import("html2canvas-pro")).default
    const canvas = await html2canvas(element, {
      backgroundColor: backgroundColor || undefined,
      scale: scale,
      logging: false,
      useCORS: true,
      allowTaint: true,
      height: height,
      width: width,
      imageTimeout: 15000,
      removeContainer: false,
    })
    return canvas.toDataURL("image/png", 1.0)
  } else {
    // Use dom-to-image for other browsers
    const domtoimage = (await import("dom-to-image")).default
    return await domtoimage.toPng(element, {
      height: height,
      width: width,
      quality: 1.0,
      cacheBust: true,
    })
  }
}

/**
 * Capture element as blob for clipboard operations
 */
export const captureElementAsBlob = async (
  element: HTMLElement,
  options: {
    backgroundColor?: string | null
    scale?: number
  } = {}
): Promise<Blob | null> => {
  const device = getDeviceInfo()
  const height = element.scrollHeight || element.clientHeight
  const width = element.scrollWidth || element.clientWidth

  const { backgroundColor = null, scale = 2 } = options

  if (device.os === "ios" || device.browser === "safari") {
    // Use html2canvas-pro for iOS/Safari
    const html2canvas = (await import("html2canvas-pro")).default
    const canvas = await html2canvas(element, {
      backgroundColor: backgroundColor || undefined,
      scale: scale,
      logging: false,
      useCORS: true,
      allowTaint: true,
      height: height,
      width: width,
      imageTimeout: 15000,
      removeContainer: false,
    })

    // Convert canvas to blob
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((canvasBlob) => {
        resolve(canvasBlob)
      }, "image/png")
    })
  } else {
    // Use dom-to-image for other browsers
    const domtoimage = (await import("dom-to-image")).default
    const dataUrl = await domtoimage.toPng(element, {
      height: height,
      width: width,
      quality: 1.0,
      cacheBust: true,
    })

    // Convert data URL to blob
    const response = await fetch(dataUrl)
    return await response.blob()
  }
}

/**
 * Download image from data URL
 */
export const downloadImage = (dataURL: string, filename: string): void => {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
