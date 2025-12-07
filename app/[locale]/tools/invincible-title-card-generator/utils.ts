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
  if (!canvasRef.current) {
    setState((prev) => ({ ...prev, generating: false }))
    return
  }

  setState((prev) => ({ ...prev, generating: true }))

  try {
    // Get the source element
    const sourceElement = canvasRef.current
    if (!sourceElement) {
      setState((prev) => ({ ...prev, generating: false }))
      return
    }

    // Create a hidden clone container for capturing
    // This prevents visual flickering in the preview
    const cloneContainer = document.createElement("div")
    cloneContainer.style.position = "fixed"
    cloneContainer.style.left = "-9999px"
    cloneContainer.style.top = "0"
    cloneContainer.style.width = "1920px"
    cloneContainer.style.height = "1080px"
    cloneContainer.style.overflow = "visible"
    cloneContainer.style.zIndex = "-1"
    document.body.appendChild(cloneContainer)

    // Clone the element and set exact dimensions
    const clonedElement = sourceElement.cloneNode(true) as HTMLElement
    clonedElement.style.width = "1920px"
    clonedElement.style.height = "1080px"
    clonedElement.style.position = "relative"
    clonedElement.style.display = "flex"
    clonedElement.style.flexDirection = "column"
    clonedElement.style.alignItems = "center"
    clonedElement.style.justifyContent = "center"
    clonedElement.style.gap = "5%"

    // Ensure background is preserved
    if (state.backgroundImage) {
      clonedElement.style.backgroundImage = `url(${state.backgroundImage})`
      clonedElement.style.backgroundSize = "cover"
      clonedElement.style.backgroundPosition = "center"
      clonedElement.style.backgroundRepeat = "no-repeat"
    } else {
      clonedElement.style.background = state.background
    }

    cloneContainer.appendChild(clonedElement)

    // Wait for clone to render
    await new Promise((resolve) => setTimeout(resolve, 100))
    void clonedElement.offsetHeight // Force reflow

    // Get actual dimensions
    const actualWidth = 1920
    const actualHeight = 1080

    // Fix title element styles in the clone
    const titleElement = clonedElement.querySelector(".curved-text") as HTMLElement
    if (titleElement) {
      // Calculate font size for 1920px width (same calculation as preview)
      const fontSize = (1920 / 200) * state.fontSize
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

      if (state.outline > 0) {
        // Scale outline proportionally with font size
        // Font size scales by: (1920 / 200) * state.fontSize
        // Outline should scale by the same ratio: (1920 / 200) * state.outline
        // But outline is typically smaller, so we use a more conservative scaling
        // Assuming preview container is ~800px wide, scale outline accordingly
        const previewWidth = 800 // Approximate preview width
        const scaleRatio = 1920 / previewWidth
        const scaledOutline = state.outline * scaleRatio
        titleElement.style.webkitTextStroke = `${scaledOutline}px ${state.outlineColor}`
        titleElement.style.textShadow = "none"
      } else {
        titleElement.style.webkitTextStroke = "none"
        titleElement.style.textShadow =
          "0 0 10px rgba(255, 255, 255, 0.2), 2px 2px 4px rgba(0,0,0,0.5)"
      }
    }

    // Fix subtitle elements in the clone
    // Find all div elements that might be subtitles
    const allDivs = clonedElement.querySelectorAll("div")
    let creditsContainer: HTMLElement | null = null

    // Find the credits container by checking if it contains subtitle text
    allDivs.forEach((div) => {
      const text = div.textContent || ""
      if (
        (state.smallSubtitle && text.includes(state.smallSubtitle)) ||
        (state.subtitle && text.includes(state.subtitle))
      ) {
        creditsContainer = div as HTMLElement
      }
    })

    if (creditsContainer && state.showCredits) {
      creditsContainer.style.color = state.color
      creditsContainer.style.marginTop = `${state.subtitleOffset * 1}%`
      creditsContainer.style.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.7))"
      creditsContainer.style.textAlign = "center"

      // Find and fix small subtitle (first child div)
      const smallSubtitle = Array.from(creditsContainer.children).find(
        (child) => (child as HTMLElement).textContent === state.smallSubtitle
      ) as HTMLElement | undefined
      if (smallSubtitle && state.smallSubtitle) {
        smallSubtitle.style.fontSize = `${(1920 / 100) * 1.9}px`
        smallSubtitle.style.fontWeight = "300"
        smallSubtitle.style.fontFamily = '"Inter", Arial, sans-serif'
      }

      // Find and fix large subtitle (contains the main subtitle text)
      const largeSubtitle = Array.from(creditsContainer.children).find(
        (child) => (child as HTMLElement).textContent === state.subtitle
      ) as HTMLElement | undefined
      if (largeSubtitle && state.subtitle) {
        largeSubtitle.style.fontSize = `${(1920 / 100) * 3}px`
        largeSubtitle.style.fontWeight = "300"
        largeSubtitle.style.fontFamily = '"Inter", Arial, sans-serif'
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

    // Use html2canvas with higher scale for better quality
    const canvas = await html2canvas(clonedElement, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: bgColor,
      height: actualHeight,
      width: actualWidth,
      scale: 2, // Higher scale for better quality
      logging: false,
      foreignObjectRendering: false,
      imageTimeout: 15000,
      removeContainer: false,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: () => false,
      proxy: undefined,
    })

    // Clean up clone container
    document.body.removeChild(cloneContainer)

    // Create final canvas with exact dimensions (1920x1080)
    const outputWidth = 1920
    const outputHeight = 1080
    const finalCanvas = document.createElement("canvas")
    finalCanvas.width = outputWidth
    finalCanvas.height = outputHeight
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
    // Draw the captured canvas onto the final canvas
    // Since we used scale: 2, the canvas is 3840x2160, so we need to scale it down
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, outputWidth, outputHeight)

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
