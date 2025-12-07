import { TitleCardState } from "./types"
import { characterPresets, backgroundPresets } from "./constants"
import html2canvas from "html2canvas-pro"
// @ts-ignore - dom-to-image type definitions are incomplete
import domtoimage from "dom-to-image"

/**
 * Preload effect images used in CSS backgrounds
 * This ensures html2canvas/dom-to-image can properly capture the effects
 * CSS background images need to be preloaded for proper capture
 * Match reference implementation approach
 */
const preloadEffectImages = async (effectIds: string[]): Promise<void> => {
  if (!effectIds || effectIds.length === 0) {
    return Promise.resolve()
  }

  // Import effectPresets to get image paths
  const { effectPresets } = await import("./constants")

  // Get all effect image paths
  const effectImagePaths = effectIds
    .map((id) => {
      const effect = effectPresets.find((e) => e.id === id)
      return effect?.image
    })
    .filter((path): path is string => !!path)

  if (effectImagePaths.length === 0) {
    return Promise.resolve()
  }

  // Preload all effect images by creating Image objects
  const imageLoadPromises = effectImagePaths.map((imagePath) => {
    return new Promise<void>((resolve) => {
      // Check if image is already cached
      const img = new Image()

      const timeout = setTimeout(() => {
        console.warn(`Effect image preload timeout: ${imagePath}`)
        resolve() // Resolve anyway to not block download
      }, 5000)

      img.onload = () => {
        clearTimeout(timeout)
        resolve()
      }

      img.onerror = () => {
        clearTimeout(timeout)
        console.warn(`Effect image preload error: ${imagePath}`)
        resolve() // Resolve anyway to not block download
      }

      // Start loading the image
      img.src = imagePath
    })
  })

  await Promise.all(imageLoadPromises)

  // Additional wait to ensure CSS backgrounds are applied
  await new Promise((resolve) => setTimeout(resolve, 200))
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

    // Wait for font size reset to take effect
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Preload all effect images before capturing (CSS backgrounds need preloading)
    if (state.effects && state.effects.length > 0) {
      await preloadEffectImages(state.effects)
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
