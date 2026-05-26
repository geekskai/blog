import React from "react"

type TldrVariant = "badge" | "heading" | "purple"

interface TldrBlockProps {
  title: React.ReactNode
  children: React.ReactNode
  variant?: TldrVariant
  className?: string
  id?: string
}

const containStyle: React.CSSProperties = { contain: "layout style" }

export function TldrBlock({
  title,
  children,
  variant = "badge",
  className = "",
  id,
}: TldrBlockProps) {
  if (variant === "badge") {
    return (
      <div
        id={id}
        className={`mx-auto mt-4 max-w-7xl rounded-xl border border-pink-500/15 bg-pink-500/[0.04] p-3 text-left md:mt-7 md:rounded-2xl md:border-pink-500/25 md:bg-gradient-to-r md:from-fuchsia-500/10 md:via-pink-500/5 md:to-orange-500/10 md:p-5 md:shadow-lg md:backdrop-blur-md ${className}`}
        style={containStyle}
      >
        <div className="flex items-start gap-2.5 md:gap-4">
          <div className="inline-flex shrink-0 items-center rounded-full border border-pink-400/15 bg-pink-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-pink-200 md:px-3 md:py-1 md:text-[11px] md:tracking-[0.2em]">
            {title}
          </div>
          <div className="min-w-0 flex-1 text-[13px] leading-5 text-slate-200 md:text-[15px] md:leading-7">
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "heading") {
    return (
      <section
        id={id}
        className={`rounded-xl border border-blue-500/15 bg-blue-500/[0.04] p-3 md:rounded-2xl md:border-blue-500/25 md:bg-gradient-to-br md:from-blue-500/10 md:via-purple-500/10 md:to-blue-500/10 md:p-6 md:shadow-lg md:backdrop-blur-sm ${className}`}
        style={containStyle}
      >
        <h2 className="mb-1.5 text-base font-bold text-white md:mb-3 md:text-xl lg:text-2xl">
          {title}
        </h2>
        <div className="text-[13px] leading-5 text-slate-200 md:text-base md:leading-7">{children}</div>
      </section>
    )
  }

  return (
    <div
      id={id}
      className={`mx-auto mt-5 max-w-6xl rounded-xl border border-purple-500/15 bg-purple-500/[0.04] p-3 md:mt-8 md:rounded-2xl md:border-purple-500/25 md:bg-gradient-to-br md:from-purple-500/15 md:via-pink-500/10 md:to-indigo-500/15 md:p-6 md:shadow-lg md:backdrop-blur-md lg:p-8 ${className}`}
      style={containStyle}
    >
      <h2 className="mb-1.5 text-base font-bold text-purple-200 md:mb-3 md:text-xl lg:text-2xl">
        {title}
      </h2>
      <div className="text-[13px] leading-5 text-slate-200 md:text-base md:leading-7">{children}</div>
    </div>
  )
}
