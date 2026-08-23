import { ImageResponse } from "next/og"

export const PRODUCT_OG_SIZE = { width: 1200, height: 630 }

export function createProductOgImage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 82% 12%, rgba(139, 92, 246, 0.42), transparent 34%), linear-gradient(135deg, #020617, #111827 58%, #2e1065)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "1020px" }}>
          <div
            style={{
              color: "#c4b5fd",
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginTop: 26,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#cbd5e1",
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              marginTop: 28,
            }}
          >
            {description}
          </div>
          <div style={{ color: "#a78bfa", display: "flex", fontSize: 26, marginTop: 42 }}>
            geekskai.com
          </div>
        </div>
      </div>
    ),
    PRODUCT_OG_SIZE
  )
}
