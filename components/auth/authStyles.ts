import type { CSSProperties } from "react"

export const authPrimaryCtaClassName =
  "relative overflow-hidden border text-white transition-[filter,transform] duration-200 before:pointer-events-none before:absolute before:inset-x-3 before:top-px before:h-px before:bg-white/60 hover:-translate-y-px hover:brightness-110 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"

export const authPrimaryCtaStyle: CSSProperties = {
  color: "#ffffff",
  backgroundColor: "#ec4899",
  backgroundImage: "linear-gradient(90deg, #ec4899 0%, #d946ef 48%, #7c3aed 100%)",
  borderColor: "rgba(244, 114, 182, 0.4)",
  boxShadow: "0 12px 28px -16px rgba(236, 72, 153, 0.94)",
}
