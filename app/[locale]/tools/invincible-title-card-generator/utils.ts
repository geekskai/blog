import { TitleCardState } from "./types"
import { characterPresets, backgroundPresets, effectPresets } from "./constants"
import html2canvas from "html2canvas"

// 绘制圆角矩形路径
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// 解析CSS渐变并创建Canvas渐变
const parseGradientToCanvas = (
  ctx: CanvasRenderingContext2D,
  gradientString: string,
  width: number,
  height: number
) => {
  // 创建线性渐变
  const gradient = ctx.createLinearGradient(0, 0, width, height)

  // 根据预设的渐变进行匹配
  if (gradientString.includes("#169ee7") && gradientString.includes("#1e40af")) {
    gradient.addColorStop(0, "#169ee7")
    gradient.addColorStop(1, "#1e40af")
  } else if (gradientString.includes("#dc2626") && gradientString.includes("#991b1b")) {
    gradient.addColorStop(0, "#dc2626")
    gradient.addColorStop(1, "#991b1b")
  } else if (gradientString.includes("#eb607a") && gradientString.includes("#be185d")) {
    gradient.addColorStop(0, "#eb607a")
    gradient.addColorStop(1, "#be185d")
  } else if (gradientString.includes("#1f2937") && gradientString.includes("#000000")) {
    gradient.addColorStop(0, "#1f2937")
    gradient.addColorStop(1, "#000000")
  } else if (gradientString.includes("#7c3aed") && gradientString.includes("#3730a3")) {
    gradient.addColorStop(0, "#7c3aed")
    gradient.addColorStop(1, "#3730a3")
  } else if (gradientString.includes("#ea580c") && gradientString.includes("#dc2626")) {
    gradient.addColorStop(0, "#ea580c")
    gradient.addColorStop(1, "#dc2626")
  } else if (gradientString.includes("#059669") && gradientString.includes("#047857")) {
    gradient.addColorStop(0, "#059669")
    gradient.addColorStop(1, "#047857")
  } else {
    // 默认蓝色渐变
    gradient.addColorStop(0, "#169ee7")
    gradient.addColorStop(1, "#1e40af")
  }

  return gradient
}

// Load image helper function
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Test function to verify download matches preview (for debugging)
export const testDownloadMatch = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  state: TitleCardState
): Promise<{
  success: boolean
  previewDimensions: { width: number; height: number }
  canvasDimensions: { width: number; height: number }
  hasContent: boolean
  matches: boolean
}> => {
  if (!canvasRef.current) {
    return {
      success: false,
      previewDimensions: { width: 0, height: 0 },
      canvasDimensions: { width: 0, height: 0 },
      hasContent: false,
      matches: false,
    }
  }

  const element = canvasRef.current
  const previewWidth = element.clientWidth || element.scrollWidth
  const previewHeight = element.clientHeight || element.scrollHeight

  try {
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: window.getComputedStyle(element).backgroundColor || "#000000",
      height: previewHeight,
      width: previewWidth,
      scale: 1,
      logging: false,
    })

    const ctx = canvas.getContext("2d")
    let hasContent = false
    if (ctx) {
      const imageData = ctx.getImageData(
        0,
        0,
        Math.min(100, canvas.width),
        Math.min(100, canvas.height)
      )
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3]
        if (a > 0) {
          hasContent = true
          break
        }
      }
    }

    const matches =
      Math.abs(canvas.width - previewWidth) < 10 &&
      Math.abs(canvas.height - previewHeight) < 10 &&
      hasContent

    console.log("🧪 Test Download Match Results:")
    console.log(`  Preview: ${previewWidth}x${previewHeight}`)
    console.log(`  Canvas: ${canvas.width}x${canvas.height}`)
    console.log(`  Has content: ${hasContent ? "✅" : "❌"}`)
    console.log(`  Matches: ${matches ? "✅" : "❌"}`)

    return {
      success: true,
      previewDimensions: { width: previewWidth, height: previewHeight },
      canvasDimensions: { width: canvas.width, height: canvas.height },
      hasContent,
      matches,
    }
  } catch (error) {
    console.error("Test failed:", error)
    return {
      success: false,
      previewDimensions: { width: previewWidth, height: previewHeight },
      canvasDimensions: { width: 0, height: 0 },
      hasContent: false,
      matches: false,
    }
  }
}

// Download title card function - Use html2canvas to capture DOM directly
// This ensures the exported image matches the preview exactly, including all CSS transforms
// Match original implementation: https://github.com/cnych/invincible-title-card-generator
export const downloadTitleCard = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  state: TitleCardState,
  setState: React.Dispatch<React.SetStateAction<TitleCardState>>
) => {
  if (!canvasRef.current) return

  setState((prev) => ({ ...prev, generating: true }))

  try {
    // Wait a bit to ensure DOM is fully rendered (match original: 500ms delay)
    // This allows the element to switch to 1920x1080 dimensions when generating=true
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get the element - it should now have 1920x1080 dimensions due to generating=true
    const element = canvasRef.current
    if (!element) return

    // Find parent container and temporarily remove overflow-hidden
    const parentContainer = element.parentElement
    const originalParentOverflow = parentContainer?.style.overflow || ""
    const originalParentPosition = parentContainer?.style.position || ""
    const originalParentWidth = parentContainer?.style.width || ""
    const originalParentHeight = parentContainer?.style.height || ""

    // Temporarily modify parent to allow full element visibility
    if (parentContainer) {
      parentContainer.style.overflow = "visible"
      parentContainer.style.position = "relative"
      parentContainer.style.width = "1920px"
      parentContainer.style.height = "1080px"
    }

    // Force browser to recalculate styles
    void element.offsetHeight

    // Wait a bit more for CSS transforms to be fully applied
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Get actual dimensions - element should be 1920x1080 when generating=true
    const actualWidth = 1920
    const actualHeight = 1080

    // Get computed background color from the element's style
    const computedStyle = window.getComputedStyle(element)
    let bgColor = computedStyle.backgroundColor

    // If background is transparent or gradient, extract from inline style
    if (!bgColor || bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      const inlineBg = element.style.background
      if (inlineBg && inlineBg.includes("gradient")) {
        // For gradients, use a fallback color (first color in gradient or black)
        bgColor = "#000000"
      } else if (inlineBg && inlineBg.startsWith("#")) {
        bgColor = inlineBg
      } else if (state.background && state.background.startsWith("#")) {
        bgColor = state.background
      } else {
        bgColor = "#000000" // Default to black
      }
    }

    // Use html2canvas to capture the DOM element directly
    // This preserves all CSS transforms, including perspective(400px) rotateX(10deg) scaleY(2)
    // Optimize configuration for better quality and CSS transform support
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: bgColor as string, // Use computed background color
      height: actualHeight,
      width: actualWidth,
      scale: 2, // Higher scale for better quality
      logging: false, // Disable logging for production
      foreignObjectRendering: true, // Better CSS transform support
      imageTimeout: 15000, // Longer timeout for images
      removeContainer: false, // Keep container for proper rendering
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        // Ensure cloned element maintains styles and is visible
        const clonedElement = clonedDoc.querySelector(
          '[data-canvas-ref="title-card"]'
        ) as HTMLElement
        if (clonedElement) {
          clonedElement.style.width = `${actualWidth}px`
          clonedElement.style.height = `${actualHeight}px`
          clonedElement.style.position = "relative"
          clonedElement.style.visibility = "visible"
          clonedElement.style.opacity = "1"
          clonedElement.style.display = "block"
          // Ensure background is preserved
          if (state.backgroundImage) {
            clonedElement.style.backgroundImage = `url(${state.backgroundImage})`
            clonedElement.style.backgroundSize = "cover"
            clonedElement.style.backgroundPosition = "center"
            clonedElement.style.backgroundRepeat = "no-repeat"
          } else if (state.background) {
            clonedElement.style.background = state.background
          }
          // Ensure CSS class is applied for transform
          clonedElement.classList.add("curved-text", "woodblock")
        }
        // Also fix parent container in cloned document
        const clonedParent = clonedElement?.parentElement
        if (clonedParent) {
          clonedParent.style.overflow = "visible"
          clonedParent.style.width = `${actualWidth}px`
          clonedParent.style.height = `${actualHeight}px`
        }
      },
    })

    // Restore parent container styles immediately after capture
    if (parentContainer) {
      parentContainer.style.overflow = originalParentOverflow || ""
      parentContainer.style.position = originalParentPosition || ""
      parentContainer.style.width = originalParentWidth || ""
      parentContainer.style.height = originalParentHeight || ""
    }

    // Create final canvas with exact dimensions (1920x1080)
    const outputWidth = 1920
    const outputHeight = 1080
    const finalCanvas = document.createElement("canvas")
    finalCanvas.width = outputWidth
    finalCanvas.height = outputHeight
    const ctx = finalCanvas.getContext("2d")

    if (ctx) {
      // Use high-quality image scaling
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      // Draw the captured canvas onto the final canvas, scaling to fit 1920x1080
      ctx.drawImage(canvas, 0, 0, outputWidth, outputHeight)

      // Verify canvas has content before downloading
      const imageData = ctx.getImageData(
        0,
        0,
        Math.min(100, outputWidth),
        Math.min(100, outputHeight)
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
        console.log("Final canvas dimensions:", outputWidth, "x", outputHeight)
        alert("Download failed: Canvas is empty. Please check console for details.")
        return
      }

      console.log("✅ Canvas verification passed - content detected")
    }

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
