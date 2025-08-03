import { TitleCardState } from "./types"
import { characterPresets, backgroundPresets } from "./constants"

// Download title card function
export const downloadTitleCard = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  state: TitleCardState,
  setState: React.Dispatch<React.SetStateAction<TitleCardState>>
) => {
  if (!canvasRef.current) return

  setState((prev) => ({ ...prev, generating: true }))

  try {
    const html2canvas = (await import("html2canvas")).default
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null,
      scale: 3, // Higher quality
      logging: false,
      width: 1920,
      height: 1080,
      useCORS: true,
    })

    const link = document.createElement("a")
    link.download = `${state.text.replace(/\s+/g, "-").toLowerCase()}-invincible-title-card.png`
    link.href = canvas.toDataURL("image/png", 1.0)
    link.click()
  } catch (error) {
    console.error("Download failed:", error)
    alert("Download failed. Please try again.")
  }

  setState((prev) => ({ ...prev, generating: false }))
}

// Copy title card settings
export const copySettings = async (state: TitleCardState) => {
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
    alert("Settings copied to clipboard! 🎬")
  } catch (err) {
    console.error("Copy failed:", err)
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
