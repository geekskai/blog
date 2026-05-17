import { ArrowLeft, BookOpen, Home, Wrench } from "lucide-react"

export type NotFoundLabels = {
  badge: string
  title: string
  description: string
  hint: string
  ctaHome: string
  ctaTools: string
  ctaBlog: string
  terminalPrompt: string
  terminalCommand: string
  terminalOutput: string
  errorCode: string
  navLabel: string
}

type NotFoundPageProps = {
  labels: NotFoundLabels
  links: {
    home: string
    tools: string
    blog: string
  }
}

const quickLinks = [
  { key: "home" as const, icon: Home },
  { key: "tools" as const, icon: Wrench },
  { key: "blog" as const, icon: BookOpen },
] as const

export default function NotFoundPage({ labels, links }: NotFoundPageProps) {
  const linkMap = { home: links.home, tools: links.tools, blog: links.blog }
  const labelMap = {
    home: labels.ctaHome,
    tools: labels.ctaTools,
    blog: labels.ctaBlog,
  }

  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative isolate flex min-h-[min(68vh,720px)] flex-col items-center justify-center py-8 sm:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-48 w-[min(100%,28rem)] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl sm:h-64" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-2xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1 text-xs font-medium tracking-wide text-slate-300 sm:text-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
          {labels.badge}
        </p>

        <p
          className="select-none bg-gradient-to-br from-blue-300 via-violet-300 to-cyan-200 bg-clip-text text-[4.5rem] font-extrabold leading-none tracking-tighter text-transparent sm:text-[6.5rem]"
          aria-hidden
        >
          404
        </p>

        <h1
          id="not-found-heading"
          className="mt-3 text-balance text-xl font-semibold text-white sm:text-2xl"
        >
          {labels.title}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
          {labels.description}
        </p>
        <p className="mx-auto mt-2 max-w-md text-pretty text-xs text-slate-500 sm:text-sm">
          {labels.hint}
        </p>
      </div>

      <div className="relative mt-8 w-full max-w-lg overflow-hidden rounded-lg border border-[#1b2c68a0] bg-gradient-to-r from-[#0d1224] to-[#0a0d37] shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 border-b border-[#1b2c68a0] px-3 py-2" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          <span className="ml-2 font-mono text-[10px] text-slate-500 sm:text-xs">
            {labels.errorCode}
          </span>
        </div>
        <pre className="overflow-x-auto p-4 text-left font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs">
          <code>
            <span className="text-emerald-400">{labels.terminalPrompt}</span>
            <span className="text-slate-500"> ~ </span>
            <span className="text-violet-300">{labels.terminalCommand}</span>
            {"\n"}
            <span className="text-amber-300/90">{labels.terminalOutput}</span>
          </code>
        </pre>
      </div>

      <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={links.home}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/30 transition-[transform,opacity] duration-150 hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {labels.ctaHome}
        </a>
        <a
          href={links.tools}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600/80 bg-slate-800/50 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors duration-150 hover:border-slate-500 hover:bg-slate-700/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        >
          <Wrench className="h-4 w-4 shrink-0" aria-hidden />
          {labels.ctaTools}
        </a>
      </div>

      <nav
        className="mt-10 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3"
        aria-label={labels.navLabel}
      >
        {quickLinks.map(({ key, icon: Icon }) => (
          <a
            key={key}
            href={linkMap[key]}
            className="group flex min-h-[4.5rem] flex-col items-center justify-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/25 px-3 py-4 text-center transition-[border-color,background-color] duration-150 hover:border-slate-600/80 hover:bg-slate-800/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            <Icon
              className="h-5 w-5 text-slate-400 transition-colors duration-150 group-hover:text-blue-300"
              aria-hidden
            />
            <span className="text-xs font-medium text-slate-300 group-hover:text-white sm:text-sm">
              {labelMap[key]}
            </span>
          </a>
        ))}
      </nav>
    </section>
  )
}
