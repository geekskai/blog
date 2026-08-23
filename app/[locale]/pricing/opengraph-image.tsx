import { createProductOgImage, PRODUCT_OG_SIZE } from "@/lib/seo-image"

export const alt = "Geekskai Audio Toolkit pricing plans"
export const size = PRODUCT_OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return createProductOgImage({
    eyebrow: "Audio Toolkit pricing",
    title: "Prepare more tracks. Keep every file private.",
    description: "Free, Basic, and Pro plans with secure PayPal subscription checkout.",
  })
}
