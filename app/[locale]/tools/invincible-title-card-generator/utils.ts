import { TitleCardState } from "./types"
import { characterPresets, backgroundPresets } from "./constants"
import html2canvas from "html2canvas-pro"
// @ts-ignore - dom-to-image type definitions are incomplete
import domtoimage from "dom-to-image"

/**
 * Wait for all effect images to load before downloading
 * This ensures html2canvas/dom-to-image can properly capture the effects
 * Handles both regular img tags and Next.js Image components
 */
const waitForEffectImagesToLoad = async (
  canvasElement: HTMLElement,
  effectIds: string[]
): Promise<void> => {
  if (!effectIds || effectIds.length === 0) {
    return Promise.resolve()
  }

  // Find all images in the canvas element (including Next.js Image components)
  // Next.js Image components render as img tags, but may have different src attributes
  const allImages = Array.from(canvasElement.querySelectorAll("img")) as HTMLImageElement[]

  // Filter to effect images - check if src contains 'effects' or if it's in the effects overlay container
  const effectImages = allImages.filter((img) => {
    const src = img.src || img.getAttribute("src") || ""
    const parent = img.closest('[class*="absolute"][class*="inset-0"]')
    // Check if image is in effects overlay or has effects in src
    return (
      src.includes("effects") || (parent && parent.querySelector('[class*="pointer-events-none"]'))
    )
  })

  if (effectImages.length === 0) {
    // If no images found, wait a bit for them to render
    // Next.js Image components might need more time
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Try again after waiting
    const retryImages = Array.from(canvasElement.querySelectorAll("img")) as HTMLImageElement[]
    if (retryImages.length > 0) {
      return Promise.resolve()
    }
    return
  }

  // Wait for all images to load
  const imageLoadPromises = effectImages.map((img) => {
    // Check if image is already loaded
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn(`Effect image load timeout: ${img.src || img.getAttribute("src")}`)
        resolve() // Resolve anyway to not block download
      }, 5000)

      // Use both onload and addEventListener for better compatibility
      const handleLoad = () => {
        clearTimeout(timeout)
        resolve()
      }

      const handleError = () => {
        clearTimeout(timeout)
        console.warn(`Effect image load error: ${img.src || img.getAttribute("src")}`)
        resolve() // Resolve anyway to not block download
      }

      if (img.complete) {
        handleLoad()
      } else {
        img.addEventListener("load", handleLoad, { once: true })
        img.addEventListener("error", handleError, { once: true })
      }
    })
  })

  await Promise.all(imageLoadPromises)

  // Additional wait to ensure images are fully rendered in the DOM
  await new Promise((resolve) => setTimeout(resolve, 100))
}

// Download title card function - Match reference implementation
// https://github.com/shivankacker/invincible-title-card-generator/blob/main/src/components/toolbar.tsx
// Uses device detection to choose between html2canvas (iOS/Safari) and dom-to-image (others)
export const downloadTitleCard = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  state: TitleCardState,
  setState: React.Dispatch<React.SetStateAction<TitleCardState>>,
  deviceInfo?: { os: string; browser: string }
) => {
  if (!canvasRef.current) {
    setState((prev) => ({ ...prev, generating: false }))
    return
  }

  setState((prev) => ({ ...prev, generating: true }))

  try {
    // Font size reset trick from reference implementation
    const initFontSize = state.fontSize
    setState((prev) => ({ ...prev, fontSize: 12 }))
    setState((prev) => ({ ...prev, fontSize: initFontSize }))

    // Get device info if not provided
    let device = deviceInfo
    if (!device) {
      // Fallback device detection
      const userAgent = window.navigator.userAgent.toLowerCase()
      device = {
        os: /iphone|ipad|ipod/i.test(userAgent) ? "ios" : "unknown",
        browser: /safari/i.test(userAgent) && !/chrome/i.test(userAgent) ? "safari" : "unknown",
      }
    }

    const sourceElement = canvasRef.current!

    // Wait for font size reset and ensure all images are loaded
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Wait for all effect images to load before capturing
    if (state.effects && state.effects.length > 0) {
      await waitForEffectImagesToLoad(sourceElement, state.effects)
      // Additional wait to ensure images are rendered
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    const height = sourceElement.clientHeight
    const width = sourceElement.clientWidth

    let dataURL: string

    if (device?.os === "ios" || device?.browser === "safari") {
      // Use html2canvas for iOS/Safari
      const canvas = await html2canvas(sourceElement, {
        allowTaint: true,
        useCORS: true,
        height: height,
        width: width,
        scale: 1,
        logging: false,
        // Ensure images are included
        imageTimeout: 15000,
        removeContainer: false,
      })
      dataURL = canvas.toDataURL("image/png")
    } else {
      // Use dom-to-image for other browsers
      dataURL = await domtoimage.toPng(sourceElement, {
        height: height,
        width: width,
        quality: 1.0,
        // Ensure images are included
        cacheBust: true,
      })
    }

    // Download the image
    const link = document.createElement("a")
    link.href = dataURL
    link.download = `geekskai-title-card-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("✅ Download completed successfully with effects")
  } catch (error) {
    console.error("❌ Download failed:", error)
    alert("Download failed. Please try again.")
  }

  setState((prev) => ({ ...prev, generating: false }))
}

// Copy title card settings
export const copySettings = async (state: TitleCardState, t?: any) => {
  const settings = {
    text: state.text,
    color: state.color,
    background: state.background,
    fontSize: state.fontSize,
    outline: state.outline,
    showCredits: state.showCredits,
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(settings, null, 2))
    const message = t ? t("messages.settings_copied") : "Settings copied to clipboard! 🎬"
    alert(message)
  } catch (err) {
    console.error("Copy failed:", err)
    const errorMessage = t ? t("messages.copy_failed") : "Copy failed"
    alert(errorMessage)
  }
}

// Randomize all settings
export const randomizeAll = (setState: React.Dispatch<React.SetStateAction<TitleCardState>>) => {
  const randomPreset = characterPresets[Math.floor(Math.random() * characterPresets.length)]
  const randomBg = backgroundPresets[Math.floor(Math.random() * backgroundPresets.length)]

  setState((prev) => ({
    ...prev,
    text: randomPreset.text.toUpperCase(),
    background: randomBg.value,
    color: randomPreset.color,
  }))
}

// Reset all settings to default
export const resetToDefault = (
  setState: React.Dispatch<React.SetStateAction<TitleCardState>>,
  setFavorites: React.Dispatch<React.SetStateAction<TitleCardState[]>>,
  defaultState: TitleCardState
) => {
  setState(defaultState)
  setFavorites([])
}

// Add to favorites
export const addToFavorites = (
  state: TitleCardState,
  favorites: TitleCardState[],
  setFavorites: React.Dispatch<React.SetStateAction<TitleCardState[]>>
) => {
  const isAlreadyFavorite = favorites.find(
    (f) => f.text === state.text && f.color === state.color && f.background === state.background
  )

  if (!isAlreadyFavorite) {
    setFavorites((prev) => [...prev, { ...state }])
  }
}
