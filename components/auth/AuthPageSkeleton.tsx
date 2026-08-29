import React from "react"

type AuthPageSkeletonProps = {
  showConsent?: boolean
}

const pulse = "animate-pulse rounded-md bg-slate-800/75 motion-reduce:animate-none"

export default function AuthPageSkeleton({ showConsent = false }: AuthPageSkeletonProps) {
  return (
    <section
      className="relative -mx-4 flex min-h-[calc(100dvh-3.5rem)] items-start overflow-x-clip px-3 py-5 sm:-mx-6 sm:px-5 sm:py-7 md:items-center md:px-8 md:py-9 lg:px-10 lg:py-12 xl:mx-0"
      aria-label="Loading authentication page"
      aria-busy="true"
    >
      <div className="relative mx-auto grid w-full max-w-lg overflow-hidden rounded-[1.25rem] border border-slate-800/80 bg-slate-950/70 md:max-w-3xl md:rounded-3xl lg:max-w-6xl lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <aside className="hidden border-r border-slate-800/70 bg-slate-900/25 lg:block lg:p-10">
          <div className="flex h-full flex-col justify-center">
            <div className={`${pulse} h-3 w-40`} />
            <div className={`${pulse} mt-4 h-8 w-64`} />
            <div className={`${pulse} mt-2 h-8 w-48`} />
            <div className={`${pulse} mt-5 h-4 w-72`} />
            <div className={`${pulse} mt-2 h-4 w-56`} />
            <div className="mt-7 rounded-2xl border border-slate-800/80 p-4">
              <div className={`${pulse} h-3 w-28`} />
              <div className={`${pulse} mt-3 h-7 w-12`} />
              <div className={`${pulse} mt-4 h-1.5 w-full rounded-full`} />
            </div>
            <div className="mt-5 space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-slate-800/70 pb-3 last:border-0 last:pb-0"
                >
                  <div className={`${pulse} h-8 w-8 shrink-0 rounded-lg`} />
                  <div className="flex-1">
                    <div className={`${pulse} h-3.5 w-28`} />
                    <div className={`${pulse} mt-2 h-3 w-36`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-9 lg:px-10 lg:py-10">
          <div className="w-full max-w-md md:max-w-[30rem] lg:max-w-[28rem]">
            <div className={`${pulse} h-7 w-36 rounded-full`} />
            <div className={`${pulse} mt-4 h-8 w-64 max-w-full`} />
            <div className={`${pulse} mt-3 h-4 w-full max-w-sm`} />
            <div className={`${pulse} mt-2 h-4 w-3/4`} />

            <div className="mt-5 md:mt-6">
              {showConsent ? (
                <div className="flex min-h-16 items-start gap-2.5 rounded-xl border border-slate-800/80 p-3 md:gap-3 md:p-3.5">
                  <div className={`${pulse} h-[18px] w-[18px] shrink-0`} />
                  <div className="flex-1">
                    <div className={`${pulse} h-3.5 w-full`} />
                    <div className={`${pulse} mt-2 h-3.5 w-3/4`} />
                  </div>
                </div>
              ) : null}

              <div className={showConsent ? "mt-4 md:mt-5" : ""}>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`${pulse} h-12 rounded-lg`} />
                  <div className={`${pulse} h-12 rounded-lg`} />
                </div>
                <div className="my-4 flex items-center gap-3">
                  <div className={`${pulse} h-px flex-1`} />
                  <div className={`${pulse} h-3 w-4`} />
                  <div className={`${pulse} h-px flex-1`} />
                </div>
                {[0, 1].map((item) => (
                  <div key={item} className={item === 0 ? "" : "mt-4"}>
                    <div className={`${pulse} h-3.5 w-24`} />
                    <div className={`${pulse} mt-2 h-12 w-full rounded-lg`} />
                  </div>
                ))}
                <div className={`${pulse} mt-5 h-12 w-full rounded-lg`} />
                <div className="mt-6 border-t border-slate-800/70 pt-4">
                  <div className={`${pulse} mx-auto h-3.5 w-48`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
