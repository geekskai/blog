import { createProductOgImage, PRODUCT_OG_SIZE } from "@/lib/seo-image"

export const alt = "Geekskai local-first Audio Toolkit"
export const size = PRODUCT_OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return createProductOgImage({
    eyebrow: "Private audio preparation",
    title: "Normalize and convert audio in your browser.",
    description:
      "Two-pass LUFS normalization, local processing, larger paid batches, and ZIP export.",
  })
}
