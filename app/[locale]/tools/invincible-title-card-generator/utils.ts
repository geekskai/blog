import { TitleCardState } from "./types"
import { characterPresets, backgroundPresets } from "./constants"
import html2canvas from "html2canvas"

// Download title card function - Use html2canvas to capture DOM directly
// This ensures the exported image matches the preview exactly, including all CSS transforms
// Match original implementation: https://github.com/cnych/invincible-title-card-generator
export const downloadTitleCard = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  state: TitleCardState,
  setState: React.Dispatch<React.SetStateAction<TitleCardState>>
) => {
  if (!canvasRef.current) {
    setState((prev) => ({ ...prev, generating: false }))
    return
  }

  setState((prev) => ({ ...prev, generating: true }))

  try {
    const sourceElement = canvasRef.current
    if (!sourceElement) {
      setState((prev) => ({ ...prev, generating: false }))
      return
    }

    // Get preview container dimensions - use same logic as PreviewArea
    const previewRect = sourceElement.getBoundingClientRect()
    // Match PreviewArea's displayDimensions calculation
    const previewWidth = Math.max(previewRect.width || 800, 800)
    const previewHeight = Math.max(previewRect.height || 450, 450)

    // Target dimensions for download (16:9 aspect ratio)
    const targetWidth = 1920
    const targetHeight = 1080

    // Calculate scale ratio - this ensures proportional scaling
    const scaleRatio = targetWidth / previewWidth

    // Create hidden clone container
    const cloneContainer = document.createElement("div")
    cloneContainer.style.position = "fixed"
    cloneContainer.style.left = "-9999px"
    cloneContainer.style.top = "0"
    cloneContainer.style.width = `${targetWidth}px`
    cloneContainer.style.height = `${targetHeight}px`
    cloneContainer.style.overflow = "visible"
    cloneContainer.style.zIndex = "-1"
    document.body.appendChild(cloneContainer)

    // Clone the element
    const clonedElement = sourceElement.cloneNode(true) as HTMLElement
    clonedElement.style.width = `${targetWidth}px`
    clonedElement.style.height = `${targetHeight}px`
    clonedElement.style.position = "relative"
    clonedElement.style.overflow = "hidden"
    clonedElement.style.borderRadius = "12px"
    clonedElement.style.minHeight = ""

    // Set background
    if (state.backgroundImage) {
      clonedElement.style.backgroundImage = `url(${state.backgroundImage})`
      clonedElement.style.backgroundSize = "cover"
      clonedElement.style.backgroundPosition = "center"
      clonedElement.style.backgroundRepeat = "no-repeat"
    } else {
      clonedElement.style.background = state.background
    }

    cloneContainer.appendChild(clonedElement)
    await new Promise((resolve) => setTimeout(resolve, 100))
    void clonedElement.offsetHeight

    // Update inner content container - exact match with preview
    const contentContainer = clonedElement.querySelector('[class*="flex"]') as HTMLElement
    if (!contentContainer) {
      console.error("❌ Content container not found")
      setState((prev) => ({ ...prev, generating: false }))
      return
    }

    contentContainer.style.width = "100%"
    contentContainer.style.height = "100%"
    contentContainer.style.display = "flex"
    contentContainer.style.flexDirection = "column"
    contentContainer.style.alignItems = "center"
    contentContainer.style.justifyContent = "center"
    contentContainer.style.gap = "5%"
    contentContainer.style.position = "relative"

    // Update title element - exact match with preview
    const titleElement = clonedElement.querySelector(".curved-text") as HTMLElement
    if (!titleElement) {
      console.error("❌ Title element not found")
      setState((prev) => ({ ...prev, generating: false }))
      return
    }

    const fontSize = (targetWidth / 200) * state.fontSize
    titleElement.style.fontSize = `${fontSize}px`
    titleElement.style.color = state.color
    titleElement.style.transform = "perspective(400px) rotateX(10deg) scaleY(2)"
    titleElement.style.transformOrigin = "center center"
    titleElement.style.transformStyle = "preserve-3d"
    titleElement.style.backfaceVisibility = "visible"
    titleElement.style.fontFamily = '"Inter", "Arial Black", Arial, sans-serif'
    titleElement.style.fontWeight = "900"
    titleElement.style.letterSpacing = "2px"
    titleElement.style.textTransform = "uppercase"
    titleElement.style.lineHeight = "0.8"
    titleElement.style.width = "100%"
    titleElement.style.textAlign = "center"
    titleElement.style.maxWidth = "100%"
    titleElement.style.display = "block"
    titleElement.style.position = "relative"
    titleElement.style.marginTop = state.showCredits ? "5%" : "0"
    titleElement.style.marginBottom = "0"
    titleElement.style.padding = "0"
    titleElement.style.zIndex = "0"

    if (state.outline > 0) {
      const scaledOutline = state.outline * scaleRatio
      titleElement.style.webkitTextStroke = `${scaledOutline}px ${state.outlineColor}`
      titleElement.style.textShadow = "none"
    } else {
      titleElement.style.webkitTextStroke = "none"
      titleElement.style.textShadow =
        "0 0 10px rgba(255, 255, 255, 0.2), 2px 2px 4px rgba(0,0,0,0.5)"
    }

    // Find subtitle container - more reliable: check all direct children of contentContainer
    let creditsContainer: HTMLElement | null = null

    if (state.showCredits && (state.smallSubtitle || state.subtitle)) {
      const children = Array.from(contentContainer.children) as HTMLElement[]

      for (const child of children) {
        if (child === titleElement || child.classList.contains("curved-text")) continue

        const text = child.textContent?.trim() || ""
        const hasSmallSubtitle = state.smallSubtitle && text.includes(state.smallSubtitle)
        const hasSubtitle = state.subtitle && text.includes(state.subtitle)

        if (hasSmallSubtitle || hasSubtitle) {
          creditsContainer = child
          break
        }
      }
    }

    // Apply subtitle styles - exact match with preview
    if (creditsContainer && state.showCredits) {
      creditsContainer.style.color = state.color
      creditsContainer.style.marginTop = `${state.subtitleOffset * 1}%`
      creditsContainer.style.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.7))"
      creditsContainer.style.textAlign = "center"
      creditsContainer.style.position = "relative"
      creditsContainer.style.display = "block"
      creditsContainer.style.zIndex = "10"

      // Update small subtitle
      if (state.smallSubtitle) {
        const smallSubtitle = Array.from(creditsContainer.children).find((child) => {
          const text = (child as HTMLElement).textContent?.trim()
          return text === state.smallSubtitle
        }) as HTMLElement | undefined

        if (smallSubtitle) {
          smallSubtitle.style.fontSize = `${(targetWidth / 100) * 1.9}px`
          smallSubtitle.style.fontWeight = "300"
          smallSubtitle.style.fontFamily = '"Inter", Arial, sans-serif'
          smallSubtitle.style.margin = "0"
          smallSubtitle.style.padding = "0"
          smallSubtitle.style.display = "block"
        }
      }

      // Update large subtitle
      if (state.subtitle) {
        const largeSubtitle = Array.from(creditsContainer.children).find((child) => {
          const text = (child as HTMLElement).textContent?.trim()
          return text === state.subtitle
        }) as HTMLElement | undefined

        if (largeSubtitle) {
          largeSubtitle.style.fontSize = `${(targetWidth / 100) * 3}px`
          largeSubtitle.style.fontWeight = "300"
          largeSubtitle.style.fontFamily = '"Inter", Arial, sans-serif'
          largeSubtitle.style.margin = "0"
          largeSubtitle.style.padding = "0"
          largeSubtitle.style.display = "block"
        }
      }
    }

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 200))
    void clonedElement.offsetHeight

    // Get background color for html2canvas
    let bgColor = "#000000"
    if (state.backgroundImage) {
      bgColor = "#000000" // Use black for images
    } else if (state.background.startsWith("#")) {
      bgColor = state.background
    } else if (state.background.includes("gradient")) {
      // Extract first color from gradient
      const match = state.background.match(/#[0-9a-fA-F]{6}/)
      bgColor = match ? match[0] : "#000000"
    }

    // Use html2canvas to capture the cloned element
    // onclone ensures styles are preserved in html2canvas's internal clone
    const canvas = await html2canvas(clonedElement, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: bgColor,
      height: targetHeight,
      width: targetWidth,
      scale: 2,
      logging: false,
      foreignObjectRendering: false,
      imageTimeout: 15000,
      removeContainer: false,
      windowWidth: targetWidth,
      windowHeight: targetHeight,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: () => false,
      proxy: undefined,
      onclone: (clonedDoc) => {
        // Ensure styles are preserved in html2canvas's clone
        const cloned = clonedDoc.querySelector('[data-canvas-ref="title-card"]') as HTMLElement
        if (cloned) {
          cloned.style.width = `${targetWidth}px`
          cloned.style.height = `${targetHeight}px`
          cloned.style.borderRadius = "12px"

          const clonedContent = cloned.querySelector('[class*="flex"]') as HTMLElement
          if (clonedContent) {
            clonedContent.style.display = "flex"
            clonedContent.style.flexDirection = "column"
            clonedContent.style.alignItems = "center"
            clonedContent.style.justifyContent = "center"
            clonedContent.style.gap = "5%"
          }

          const clonedTitle = cloned.querySelector(".curved-text") as HTMLElement
          if (clonedTitle) {
            clonedTitle.style.zIndex = "0"
          }

          const clonedCredits = Array.from(cloned.querySelectorAll("div")).find((div) => {
            const text = (div as HTMLElement).textContent?.trim() || ""
            return (
              (state.smallSubtitle && text.includes(state.smallSubtitle)) ||
              (state.subtitle && text.includes(state.subtitle))
            )
          }) as HTMLElement | undefined

          if (clonedCredits && state.showCredits) {
            clonedCredits.style.zIndex = "10"
            clonedCredits.style.position = "relative"
          }
        }
      },
    })

    // Clean up clone container
    document.body.removeChild(cloneContainer)

    // Create final canvas with exact dimensions
    const finalCanvas = document.createElement("canvas")
    finalCanvas.width = targetWidth
    finalCanvas.height = targetHeight
    const ctx = finalCanvas.getContext("2d")

    if (!ctx) {
      console.error("❌ Failed to get 2D context")
      alert("Download failed: Could not initialize canvas context.")
      setState((prev) => ({ ...prev, generating: false }))
      return
    }

    // Use high-quality image scaling
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    // Draw the captured canvas (scale:2 = 3840x2160) onto final canvas (1920x1080)
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight)

    // Verify canvas has content before downloading
    const imageData = ctx.getImageData(
      0,
      0,
      Math.min(100, targetWidth),
      Math.min(100, targetHeight)
    )
    const data = imageData.data
    let hasContent = false
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      if (a > 0 && (r > 0 || g > 0 || b > 0)) {
        hasContent = true
        break
      }
    }

    if (!hasContent) {
      console.error("❌ Canvas appears to be empty!")
      console.log("Canvas dimensions:", canvas.width, "x", canvas.height)
      console.log("Final canvas dimensions:", targetWidth, "x", targetHeight)
      alert("Download failed: Canvas is empty. Please check console for details.")
      setState((prev) => ({ ...prev, generating: false }))
      return
    }

    console.log("✅ Canvas verification passed - content detected")

    // Download the image
    const link = document.createElement("a")
    link.download = `${state.text.replace(/\s+/g, "-").toLowerCase()}-invincible-title-card.png`
    link.href = finalCanvas.toDataURL("image/png", 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("✅ Download completed successfully")
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
