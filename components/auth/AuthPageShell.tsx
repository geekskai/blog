import type { ReactNode } from "react"
import { AudioLines, Check, ShieldCheck, Sparkles, Wrench } from "lucide-react"

const accentGradient =
  "bg-gradient-to-r from-sky-300 via-sky-400 to-violet-400 bg-clip-text text-transparent"

const benefits = [
  {
    icon: Wrench,
    title: "Public tools",
    copy: "Open without an account",
  },
  {
    icon: AudioLines,
    title: "30 daily Credits",
    copy: "Refresh every day",
  },
  {
    icon: ShieldCheck,
    title: "On-device audio",
    copy: "Files stay in your browser",
  },
] as const

type AuthPageShellProps = {
  eyebrow: string
  title: string
  titleAccent?: string
  description: string
  children: ReactNode
}

export default function AuthPageShell({
  eyebrow,
  title,
  titleAccent,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <section className="relative -mx-4 flex min-h-[calc(100dvh-3.5rem)] items-start overflow-x-clip px-3 py-5 sm:-mx-6 sm:px-5 sm:py-7 md:items-center md:px-8 md:py-9 lg:px-10 lg:py-12 xl:mx-0">
      <div className="relative mx-auto grid w-full max-w-lg overflow-hidden rounded-[1.25rem] border border-slate-800/80 bg-slate-950/70 shadow-[0_24px_70px_-44px_rgba(14,165,233,0.38)] md:max-w-3xl md:rounded-3xl md:shadow-[0_30px_90px_-48px_rgba(14,165,233,0.4)] lg:max-w-6xl lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <aside className="relative hidden overflow-hidden border-r border-slate-800/70 bg-slate-900/25 lg:flex lg:flex-col lg:justify-center lg:p-10">
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              Your browser, your workspace
            </p>
            <h2 className="mt-3 max-w-[12ch] text-3xl font-bold leading-[1.12] tracking-[-0.035em] text-white">
              Work faster without giving up privacy.
            </h2>
            <p className="mt-4 max-w-[34ch] text-sm leading-7 text-slate-300">
              One lightweight account unlocks daily Audio Credits, billing, and saved settings.
            </p>

            <div className="mt-6 rounded-xl border border-sky-400/20 bg-sky-950/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-sky-200">Daily Audio Credits</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-white">30</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  <Check className="h-3 w-3" aria-hidden />
                  Free daily
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-sky-400 to-violet-400" />
              </div>
            </div>

            <ul className="mt-5 divide-y divide-slate-800/70">
              {benefits.map(({ icon: Icon, title: benefitTitle, copy }) => (
                <li
                  key={benefitTitle}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900/80 text-sky-300 ring-1 ring-inset ring-slate-800">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-100">
                      {benefitTitle}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">{copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-9 lg:px-10 lg:py-10">
          <div className="w-full max-w-md md:max-w-[30rem] lg:max-w-[28rem]">
            <div className="text-left">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200 sm:text-[11px]">
                <Sparkles className="h-3 w-3 text-violet-300" aria-hidden />
                {eyebrow}
              </p>
              <h1 className="mt-3 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.035em] md:mt-4 md:text-3xl md:leading-[1.1] lg:text-[2.125rem]">
                {titleAccent ? (
                  <>
                    <span className="text-white">{title} </span>
                    <span className={accentGradient}>{titleAccent}</span>
                  </>
                ) : (
                  <span className="text-white">{title}</span>
                )}
              </h1>
              <p className="mt-2.5 max-w-[42ch] text-sm leading-6 text-slate-300 md:mt-3 md:text-[0.9375rem] md:leading-7">
                {description}
              </p>

              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 md:hidden">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Audio stays on your device
              </p>

              <ul className="mt-4 hidden grid-cols-3 gap-2.5 md:grid lg:hidden">
                {benefits.map(({ icon: Icon, title: benefitTitle }) => (
                  <li
                    key={benefitTitle}
                    className="flex min-h-16 flex-col justify-center rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2.5"
                  >
                    <Icon className="h-4 w-4 text-sky-300" aria-hidden />
                    <span className="mt-1.5 text-xs font-semibold leading-4 text-slate-200">
                      {benefitTitle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 md:mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
