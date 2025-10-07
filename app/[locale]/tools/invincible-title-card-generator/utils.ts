import { TitleCardState } from "./types"
import { characterPresets, backgroundPresets } from "./constants"

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

// Download title card function
export const downloadTitleCard = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  state: TitleCardState,
  setState: React.Dispatch<React.SetStateAction<TitleCardState>>
) => {
  if (!canvasRef.current) return

  setState((prev) => ({ ...prev, generating: true }))

  try {
    // 直接使用Canvas API绘制，确保文字正确显示
    const outputWidth = 1920
    const outputHeight = 1080

    // 创建最终的canvas，确保是1920x1080
    const finalCanvas = document.createElement("canvas")
    finalCanvas.width = outputWidth
    finalCanvas.height = outputHeight
    const ctx = finalCanvas.getContext("2d")

    if (ctx) {
      // 创建圆角裁剪路径
      const borderRadius = 24 // 对应 rounded-xl 的圆角大小，按比例放大
      drawRoundedRect(ctx, 0, 0, outputWidth, outputHeight, borderRadius)
      ctx.clip()

      // 绘制背景
      if (state.background.includes("gradient")) {
        // 使用渐变解析函数
        const gradient = parseGradientToCanvas(ctx, state.background, outputWidth, outputHeight)
        ctx.fillStyle = gradient
      } else {
        // 纯色背景
        ctx.fillStyle = state.background
      }
      ctx.fillRect(0, 0, outputWidth, outputHeight)

      // 直接在Canvas上绘制文字，确保文字一定显示
      // 设置文字样式
      const fontSize = Math.floor(state.fontSize * 4) // 放大字体以适应高分辨率
      ctx.font = `900 ${fontSize}px "Inter", "Arial Black", Arial, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // 绘制文字轮廓（如果启用）
      if (state.outline > 0) {
        ctx.strokeStyle = state.outlineColor
        ctx.lineWidth = state.outline * 4
        ctx.lineJoin = "round"
        ctx.miterLimit = 2
        ctx.strokeText(state.text || "Enter Your Title", outputWidth / 2, outputHeight / 2)
      }

      // 绘制主文字
      ctx.fillStyle = state.color
      ctx.fillText(state.text || "Enter Your Title", outputWidth / 2, outputHeight / 2)

      // 绘制副标题（如果启用）
      if (state.showCredits && (state.smallSubtitle || state.subtitle)) {
        const subtitleY =
          outputHeight / 2 + fontSize / 2 + (state.subtitleOffset * outputHeight) / 100 + 60

        if (state.smallSubtitle) {
          const smallSubtitleSize = Math.floor(fontSize * 0.4)
          ctx.font = `700 ${smallSubtitleSize}px "Inter", Arial, sans-serif`
          ctx.fillStyle = state.color
          ctx.fillText(state.smallSubtitle.toUpperCase(), outputWidth / 2, subtitleY)
        }

        if (state.subtitle) {
          const subtitleSize = Math.floor(fontSize * 0.6)
          const subtitleYPos = subtitleY + (state.smallSubtitle ? 50 : 0)
          ctx.font = `600 ${subtitleSize}px "Inter", Arial, sans-serif`
          ctx.fillStyle = state.color
          ctx.fillText(state.subtitle, outputWidth / 2, subtitleYPos)
        }
      }

      // 绘制水印（如果启用）
      if (state.showWatermark) {
        ctx.font = "400 24px Inter, Arial, sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"
        ctx.fillText("Made with geekskai.com", outputWidth - 40, outputHeight - 40)
      }
    }

    const link = document.createElement("a")
    link.download = `${state.text.replace(/\s+/g, "-").toLowerCase()}-invincible-title-card.png`
    link.href = finalCanvas.toDataURL("image/png", 1.0)
    link.click()
  } catch (error) {
    console.error("Download failed:", error)
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
